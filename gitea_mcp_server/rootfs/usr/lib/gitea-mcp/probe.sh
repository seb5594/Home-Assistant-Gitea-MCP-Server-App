#!/usr/bin/env bash
# shellcheck shell=bash
# Connection checks that turn "it does not work" into a sentence the user can act on.
# Every probe prints one JSON object and never fails.

# http_get <url> <insecure> <ca-file> [token]
# Sets HTTP_CODE (000 when nothing answered), HTTP_BODY, HTTP_HEADERS and CURL_RC. HTTP_METHOD
# (default GET) picks the method, HTTP_USER_AGENT the way the request introduces itself. The
# token travels on stdin so that it never appears in the process list.
http_get() {
  local url="$1" insecure="$2" ca_file="$3" token="${4:-}"
  local body_file header_file args=(-sS --max-time 6 -K - -X "${HTTP_METHOD:-GET}")
  body_file="$(mktemp)"
  header_file="$(mktemp)"
  args+=(-o "$body_file" -D "$header_file" -w '%{http_code}')
  if [[ "$insecure" == "true" ]]; then
    args+=(-k)
  fi
  if [[ -n "$ca_file" ]]; then
    args+=(--cacert "$ca_file")
  fi
  if [[ -n "${HTTP_USER_AGENT:-}" ]]; then
    args+=(-A "$HTTP_USER_AGENT")
  fi
  HTTP_CODE="$(
    if [[ -n "$token" ]]; then
      printf 'header = "Authorization: token %s"\n' "$token"
    fi | curl "${args[@]}" "$url" 2>/dev/null
  )"
  CURL_RC=$?
  HTTP_BODY="$(cat "$body_file")"
  HTTP_HEADERS="$(cat "$header_file")"
  rm -f "$body_file" "$header_file"
  HTTP_CODE="${HTTP_CODE:-000}"
}

# describe_failure
# A short reason for the last http_get that got no usable answer.
describe_failure() {
  case "$CURL_RC" in
    0) printf 'HTTP %s' "$HTTP_CODE" ;;
    6) printf 'the host name is unknown' ;;
    7) printf 'the connection was refused (is the app started?)' ;;
    28) printf 'the request timed out' ;;
    35 | 51 | 58 | 60 | 77 | 83) printf 'the TLS certificate is not trusted (see the advanced options)' ;;
    *) printf 'the connection failed (curl error %s)' "$CURL_RC" ;;
  esac
}

# is_json <text>
is_json() {
  jq -e . >/dev/null 2>&1 <<<"$1"
}

# is_blocked
# True when the last answer is a refusal that neither Gitea nor the MCP server wrote: both
# answer in JSON, while a firewall or access gate in front of them sends a web page.
is_blocked() {
  case "$HTTP_CODE" in
    401 | 403 | 429 | 503) ! is_json "$HTTP_BODY" ;;
    *) return 1 ;;
  esac
}

# describe_block
# What to tell about the last answer when is_blocked is true.
describe_block() {
  local who="Something in front of it"
  if grep -qi '^server: *cloudflare' <<<"$HTTP_HEADERS"; then
    who="Cloudflare"
  fi
  printf '%s refuses the request (HTTP %s). Claude and ChatGPT would be refused the same way: check bot and AI-crawler protection, firewall rules and access policies for this host.' "$who" "$HTTP_CODE"
}

# probe_gitea <url> <insecure> <ca-file> <token>
# {"reachable", "version", "error", "token": {"state": none|ok|rejected|error, "login", "error"}}
probe_gitea() {
  local url="$1" insecure="$2" ca_file="$3" token="$4"
  local version="" error="" reachable=false
  local token_state="none" login="" token_error=""

  http_get "${url}/api/v1/version" "$insecure" "$ca_file" "$token"
  if [[ "$HTTP_CODE" == "200" ]] && version="$(jq -er '.version' <<<"$HTTP_BODY" 2>/dev/null)"; then
    reachable=true
  elif [[ "$CURL_RC" != "0" || "$HTTP_CODE" == "000" ]]; then
    error="Gitea does not answer: $(describe_failure)."
  elif [[ "$HTTP_CODE" == "401" || "$HTTP_CODE" == "403" ]]; then
    reachable=true
    error="Gitea requires a login for everything; add an access token."
  else
    error="${url} answers, but it does not look like Gitea (HTTP ${HTTP_CODE}). Check the address."
  fi

  if [[ -n "$token" && "$reachable" == "true" ]]; then
    http_get "${url}/api/v1/user" "$insecure" "$ca_file" "$token"
    case "$HTTP_CODE" in
      200) token_state="ok"; login="$(jq -r '.login // ""' <<<"$HTTP_BODY" 2>/dev/null)" ;;
      401 | 403) token_state="rejected"; token_error="Gitea does not accept this access token." ;;
      *) token_state="error"; token_error="The token could not be checked (HTTP ${HTTP_CODE})." ;;
    esac
  elif [[ -n "$token" ]]; then
    token_state="error"
    token_error="The token could not be checked because Gitea is not reachable."
  fi

  jq -nc --argjson reachable "$reachable" --arg version "$version" --arg error "$error" \
    --arg state "$token_state" --arg login "$login" --arg token_error "$token_error" '
    {reachable: $reachable, version: $version, error: $error,
     token: {state: $state, login: $login, error: $token_error}}'
}

# probe_agent_access <mcp-public-url> <insecure> <ca-file>
# Claude signs in with one service and then calls the MCP address with another that introduces
# itself as "Claude-User". Bot protection in front of the app often refuses exactly that one
# after the sign-in worked, so the request is made the same way. Without a token the app
# answers 401 with a WWW-Authenticate header, which proves the request reached it.
# {"ok", "error"}
probe_agent_access() {
  local ok=false error=""

  HTTP_METHOD=POST HTTP_USER_AGENT="Claude-User" http_get "${1}/mcp" "$2" "$3"
  if [[ "$HTTP_CODE" == "401" ]] && grep -qi '^www-authenticate: *bearer' <<<"$HTTP_HEADERS"; then
    ok=true
  elif [[ "$HTTP_CODE" == "000" ]]; then
    error="The public address does not answer: $(describe_failure)."
  elif is_blocked || [[ "$HTTP_CODE" == "403" ]]; then
    error="$(describe_block) This happens for requests that identify as Claude (User-Agent Claude-User), while a normal request gets through."
  else
    error="Requests from Claude get HTTP ${HTTP_CODE} instead of the sign-in challenge of this app."
  fi

  jq -nc --argjson ok "$ok" --arg error "$error" '{ok: $ok, error: $error}'
}

# probe_remote <mcp-public-url> <gitea-public-url> <insecure> <ca-file>
# Looks at the public addresses the way Claude and ChatGPT will:
# {"mcp": {"ok", "error"}, "agent": {"ok", "error"}, "gitea": {"ok", "error", "note"}, "oauth": {"ok", "error"}}
probe_remote() {
  local mcp_url="$1" gitea_url="$2" insecure="$3" ca_file="$4"
  local mcp_ok=false mcp_error="" gitea_ok=false gitea_error="" gitea_note=""
  local oauth_ok=false oauth_error="" authorize_endpoint token_endpoint

  http_get "${mcp_url}/.well-known/oauth-protected-resource/mcp" "$insecure" "$ca_file"
  if [[ "$HTTP_CODE" == "200" && "$(jq -r '.resource // ""' <<<"$HTTP_BODY" 2>/dev/null)" == "${mcp_url}/mcp" ]]; then
    mcp_ok=true
  elif [[ "$HTTP_CODE" == "000" ]]; then
    mcp_error="The public address does not answer: $(describe_failure)."
  elif is_blocked; then
    mcp_error="$(describe_block)"
  else
    mcp_error="The public address answers, but not with this app (HTTP ${HTTP_CODE}). Point the tunnel or proxy at port ${GM_REMOTE_PORT:-8081} of this app."
  fi

  http_get "${gitea_url}/api/v1/version" "$insecure" "$ca_file"
  if [[ "$HTTP_CODE" == "200" ]]; then
    gitea_ok=true
  elif [[ "$HTTP_CODE" == "401" || "$HTTP_CODE" == "403" ]] && is_json "$HTTP_BODY"; then
    gitea_ok=true
    gitea_note="Gitea asks for a sign-in before it shows anything. That is fine for the sign-in of Claude and ChatGPT."
  elif [[ "$HTTP_CODE" == "000" ]]; then
    gitea_error="The public Gitea address does not answer: $(describe_failure)."
  elif is_blocked; then
    gitea_error="$(describe_block)"
  else
    gitea_error="The public Gitea address answers with HTTP ${HTTP_CODE}."
  fi

  # Claude and ChatGPT read the sign-in addresses from Gitea and call them from the internet.
  http_get "${gitea_url}/.well-known/openid-configuration" "$insecure" "$ca_file"
  if [[ "$HTTP_CODE" == "200" ]] && is_json "$HTTP_BODY"; then
    authorize_endpoint="$(jq -r '.authorization_endpoint // ""' <<<"$HTTP_BODY")"
    token_endpoint="$(jq -r '.token_endpoint // ""' <<<"$HTTP_BODY")"
    if [[ "$authorize_endpoint" != "${gitea_url}/"* || "$token_endpoint" != "${gitea_url}/"* ]]; then
      oauth_error="Gitea announces its sign-in at ${token_endpoint:-nowhere}. Set ROOT_URL in Gitea to ${gitea_url}/ so that Claude and ChatGPT are sent to the public address."
    else
      HTTP_METHOD=POST http_get "$token_endpoint" "$insecure" "$ca_file"
      if [[ "$HTTP_CODE" == "400" || "$HTTP_CODE" == "401" ]] && is_json "$HTTP_BODY"; then
        oauth_ok=true
      elif [[ "$HTTP_CODE" == "000" ]]; then
        oauth_error="The sign-in address of Gitea does not answer: $(describe_failure)."
      elif is_blocked; then
        oauth_error="$(describe_block)"
      else
        oauth_error="The sign-in address of Gitea answers with HTTP ${HTTP_CODE}."
      fi
    fi
  elif [[ "$HTTP_CODE" == "000" ]]; then
    oauth_error="The public Gitea address does not answer: $(describe_failure)."
  elif is_blocked; then
    oauth_error="$(describe_block)"
  else
    oauth_error="Gitea does not publish its sign-in addresses (HTTP ${HTTP_CODE})."
  fi

  jq -nc --argjson mcp_ok "$mcp_ok" --arg mcp_error "$mcp_error" \
    --argjson agent "$(probe_agent_access "$mcp_url" "$insecure" "$ca_file")" \
    --argjson gitea_ok "$gitea_ok" --arg gitea_error "$gitea_error" --arg gitea_note "$gitea_note" \
    --argjson oauth_ok "$oauth_ok" --arg oauth_error "$oauth_error" '
    {mcp: {ok: $mcp_ok, error: $mcp_error}, agent: $agent,
     gitea: {ok: $gitea_ok, error: $gitea_error, note: $gitea_note},
     oauth: {ok: $oauth_ok, error: $oauth_error}}'
}
