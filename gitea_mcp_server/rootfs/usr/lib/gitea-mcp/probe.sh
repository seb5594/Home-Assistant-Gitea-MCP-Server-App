#!/usr/bin/env bash
# shellcheck shell=bash
# Connection checks that turn "it does not work" into a sentence the user can act on.
# Every probe prints one JSON object and never fails.
#
# A problem is reported as English text (for the log) and as a code with arguments, which the
# app page translates into the language of the browser: {"error": "...", "code": "...", "args": {}}
# (see message and set_error in common.sh).

# http_get <url> <insecure> [token]
# Sets HTTP_CODE (000 when nothing answered), HTTP_BODY, HTTP_HEADERS and CURL_RC. HTTP_METHOD
# (default GET) picks the method, HTTP_USER_AGENT the way the request introduces itself. The
# token travels on stdin so that it never appears in the process list.
http_get() {
  local url="$1" insecure="$2" token="${3:-}"
  local body_file header_file args=(-sS --max-time 6 -K - -X "${HTTP_METHOD:-GET}")
  body_file="$(mktemp)"
  header_file="$(mktemp)"
  args+=(-o "$body_file" -D "$header_file" -w '%{http_code}')
  if [[ "$insecure" == "true" ]]; then
    args+=(-k)
  fi
  if [[ -n "${HTTP_USER_AGENT:-}" ]]; then
    args+=(-A "$HTTP_USER_AGENT")
  fi
  # A failing curl must not end the script (bashio runs services with errexit): keep its exit code.
  CURL_RC=0
  HTTP_CODE="$(
    if [[ -n "$token" ]]; then
      printf 'header = "Authorization: token %s"\n' "$token"
    fi | curl "${args[@]}" "$url" 2>/dev/null
  )" || CURL_RC=$?
  HTTP_BODY="$(cat "$body_file")"
  HTTP_HEADERS="$(cat "$header_file")"
  rm -f "$body_file" "$header_file"
  HTTP_CODE="${HTTP_CODE:-000}"
}

# failure_reason
# A code for the last http_get that got no usable answer: host_unknown, refused, timeout, tls
# or failed (then CURL_RC says more).
failure_reason() {
  case "$CURL_RC" in
    6) printf 'host_unknown' ;;
    7) printf 'refused' ;;
    28) printf 'timeout' ;;
    35 | 51 | 58 | 60 | 77 | 83) printf 'tls' ;;
    *) printf 'failed' ;;
  esac
}

# describe_failure
# A short English reason for the last http_get that got no usable answer.
describe_failure() {
  case "$(failure_reason)" in
    host_unknown) printf 'the host name is unknown' ;;
    refused) printf 'the connection was refused (is the app started?)' ;;
    timeout) printf 'the request timed out' ;;
    tls) printf 'the TLS certificate is not trusted (see the advanced options)' ;;
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

# blocker
# Who answered a blocked request: cloudflare or proxy.
blocker() {
  if grep -qi '^server: *cloudflare' <<<"$HTTP_HEADERS"; then
    printf 'cloudflare'
  else
    printf 'proxy'
  fi
}

# describe_block
# What to tell about the last answer when is_blocked is true.
describe_block() {
  local who="Something in front of it"
  if [[ "$(blocker)" == "cloudflare" ]]; then
    who="Cloudflare"
  fi
  printf '%s refuses the request (HTTP %s). Claude and ChatGPT would be refused the same way: check bot and AI-crawler protection, firewall rules and access policies for this host.' "$who" "$HTTP_CODE"
}

# no_answer_error <name>
# Sets the error of check <name> to "does not answer", with the reason of the last http_get.
no_answer_error() {
  set_error "$1" no_answer "The address does not answer: $(describe_failure)." reason "$(failure_reason)" rc "$CURL_RC"
}

# blocked_error <name>
blocked_error() {
  set_error "$1" blocked "$(describe_block)" who "$(blocker)" http "$HTTP_CODE"
}

# probe_gitea <url> <insecure> <token>
# {"reachable", "version", "error", "code", "args",
#  "token": {"state": none|ok|rejected|error, "login", "error", "code", "args"}}
probe_gitea() {
  local url="$1" insecure="$2" token="$3"
  local version="" reachable=false error="" gitea_error="" gitea_msg='{}'
  local token_state="none" login="" token_error="" token_msg='{}'

  http_get "${url}/api/v1/version" "$insecure" "$token"
  if [[ "$HTTP_CODE" == "200" ]] && version="$(jq -er '.version' <<<"$HTTP_BODY" 2>/dev/null)"; then
    reachable=true
  elif [[ "$CURL_RC" != "0" || "$HTTP_CODE" == "000" ]]; then
    set_error gitea no_answer "Gitea does not answer: $(describe_failure)." reason "$(failure_reason)" rc "$CURL_RC"
    error="$gitea_error"
  elif [[ "$HTTP_CODE" == "401" || "$HTTP_CODE" == "403" ]]; then
    reachable=true
    set_error gitea login_required "Gitea requires a login for everything; add an access token."
    error="$gitea_error"
  else
    set_error gitea not_gitea "${url} answers, but it does not look like Gitea (HTTP ${HTTP_CODE}). Check the address." url "$url" http "$HTTP_CODE"
    error="$gitea_error"
  fi

  if [[ -n "$token" && "$reachable" == "true" ]]; then
    http_get "${url}/api/v1/user" "$insecure" "$token"
    case "$HTTP_CODE" in
      200)
        token_state="ok"
        login="$(jq -r '.login // ""' <<<"$HTTP_BODY" 2>/dev/null)" || login=""
        ;;
      401 | 403)
        token_state="rejected"
        set_error token token_rejected "Gitea does not accept this access token."
        ;;
      *)
        token_state="error"
        set_error token token_http "The token could not be checked (HTTP ${HTTP_CODE})." http "$HTTP_CODE"
        ;;
    esac
  elif [[ -n "$token" ]]; then
    token_state="error"
    set_error token token_unreachable "The token could not be checked because Gitea is not reachable."
  fi

  jq -nc --argjson reachable "$reachable" --arg version "$version" --arg error "$error" \
    --argjson gitea_msg "$gitea_msg" --arg state "$token_state" --arg login "$login" \
    --arg token_error "$token_error" --argjson token_msg "$token_msg" '
    {reachable: $reachable, version: $version, error: $error,
     code: ($gitea_msg.code // ""), args: ($gitea_msg.args // {}),
     token: {state: $state, login: $login, error: $token_error,
             code: ($token_msg.code // ""), args: ($token_msg.args // {})}}'
}

# The AI services that call the public MCP address, as id|name|User-Agent. Bot protection in front
# of the app decides by the User-Agent, so each one is tried with the one it is known by. The
# strings are the ones seen in the wild; a service may change them.
AGENTS=(
  "claude|Claude (claude.ai)|Claude-User"
  "claude_signin|Claude (sign-in step)|python-httpx/0.28.1"
  "chatgpt|ChatGPT|ChatGPT-User/1.0"
  "openai|ChatGPT (connector API)|openai-mcp/1.0.0"
  "claude_code|Claude Code|claude-code/2.1.0 (cli)"
)

# challenge_reached
# True when the last answer is the sign-in challenge of the MCP server (401 with a bearer
# challenge). That proves the request got through to the app.
challenge_reached() {
  [[ "$HTTP_CODE" == "401" ]] && grep -qi '^www-authenticate: *bearer' <<<"$HTTP_HEADERS"
}

# probe_agent <id> <name> <user-agent> <mcp-public-url> <insecure>
# One agent: {"id", "name", "ok", "code", "args"}
probe_agent() {
  local id="$1" name="$2" agent="$3" mcp_url="$4" insecure="$5"
  local ok=false how="" agent_error="" agent_msg='{}'

  HTTP_METHOD=POST HTTP_USER_AGENT="$agent" http_get "${mcp_url}/mcp" "$insecure"
  if challenge_reached; then
    ok=true
  else
    if [[ "$HTTP_CODE" == "000" ]]; then
      how="cut_off"
    else
      how="refused"
    fi
    set_error agent agent_blocked "Requests that identify as ${name} (User-Agent ${agent}) do not reach the app: $([[ "$how" == cut_off ]] && printf 'the connection is cut off (%s)' "$(describe_failure)" || printf 'refused with HTTP %s' "$HTTP_CODE")." \
      name "$name" agent "$agent" how "$how" http "$HTTP_CODE" reason "$(failure_reason)" rc "$CURL_RC"
  fi
  jq -nc --arg id "$id" --arg name "$name" --argjson ok "$ok" --arg error "$agent_error" --argjson msg "$agent_msg" '
    {id: $id, name: $name, ok: $ok, error: $error, code: ($msg.code // ""), args: ($msg.args // {})}'
}

# probe_agent_access <mcp-public-url> <insecure>
# Claude signs in with one HTTP client and then calls the MCP address with another that
# introduces itself as "Claude-User"; ChatGPT and Claude Code have names of their own. Bot
# protection in front of the app often refuses or cuts off exactly one of them after the sign-in
# worked. Each is tried here with its name. An ordinary request first shows that the app can be
# reached at all; without it a blocked agent could not be told from an address that is down.
# The test comes from your own network, so it is a hint and not proof: a service may treat a
# request that only claims to be Claude differently from Claude's real servers.
# {"ok", "error", "code", "args", "agents": [{"id", "name", "ok", "error", "code", "args"}]}
probe_agent_access() {
  local mcp_url="$1" insecure="$2"
  local ok=false control_error="" control_msg='{}' entry id name agent results=() blocked=0

  HTTP_METHOD=POST HTTP_USER_AGENT="" http_get "${mcp_url}/mcp" "$insecure"
  if challenge_reached; then
    for entry in "${AGENTS[@]}"; do
      IFS='|' read -r id name agent <<<"$entry"
      results+=("$(probe_agent "$id" "$name" "$agent" "$mcp_url" "$insecure")")
    done
    blocked="$(printf '%s\n' "${results[@]}" | jq -s '[.[] | select(.ok | not)] | length')"
    if ((blocked == 0)); then
      ok=true
    else
      set_error control agents_blocked "${blocked} AI service(s) are refused or cut off while an ordinary request reaches the app. Bot protection in front of the app does this, for example Cloudflare's blocking of AI crawlers. The security log of your firewall shows what the real requests got." count "$blocked"
    fi
  elif [[ "$HTTP_CODE" == "000" ]]; then
    no_answer_error control
  elif is_blocked; then
    blocked_error control
  else
    set_error control agent_http "The MCP address does not answer with the sign-in challenge of this app (HTTP ${HTTP_CODE})." http "$HTTP_CODE"
  fi

  jq -nc --argjson ok "$ok" --arg error "$control_error" --argjson msg "$control_msg" \
    --argjson agents "$(printf '%s\n' "${results[@]}" | jq -sc '. // []')" '
    {ok: $ok, error: $error, code: ($msg.code // ""), args: ($msg.args // {}), agents: $agents}'
}

# probe_remote <mcp-public-url> <gitea-public-url> <insecure>
# Looks at the public addresses the way Claude and ChatGPT will; every check is
# {"ok", "error", "code", "args"}, the Gitea check also has "note" and "note_code":
# {"mcp", "agent", "gitea", "oauth"}
probe_remote() {
  local mcp_url="$1" gitea_url="$2" insecure="$3"
  local mcp_ok=false mcp_error="" mcp_msg='{}'
  local gitea_ok=false gitea_error="" gitea_msg='{}' gitea_note="" gitea_note_code=""
  local oauth_ok=false oauth_error="" oauth_msg='{}' authorize_endpoint token_endpoint

  http_get "${mcp_url}/.well-known/oauth-protected-resource/mcp" "$insecure"
  if [[ "$HTTP_CODE" == "200" && "$(jq -r '.resource // ""' <<<"$HTTP_BODY" 2>/dev/null)" == "${mcp_url}/mcp" ]]; then
    mcp_ok=true
  elif [[ "$HTTP_CODE" == "000" ]]; then
    no_answer_error mcp
  elif is_blocked; then
    blocked_error mcp
  else
    set_error mcp wrong_target "The public address answers, but not with this app (HTTP ${HTTP_CODE}). Point the tunnel or proxy at port ${GM_REMOTE_PORT:-8081} of this app." http "$HTTP_CODE" port "${GM_REMOTE_PORT:-8081}"
  fi

  http_get "${gitea_url}/api/v1/version" "$insecure"
  if [[ "$HTTP_CODE" == "200" ]]; then
    gitea_ok=true
  elif [[ "$HTTP_CODE" == "401" || "$HTTP_CODE" == "403" ]] && is_json "$HTTP_BODY"; then
    gitea_ok=true
    gitea_note="Gitea asks for a sign-in before it shows anything. That is fine for the sign-in of Claude and ChatGPT."
    gitea_note_code="login_required_note"
  elif [[ "$HTTP_CODE" == "000" ]]; then
    no_answer_error gitea
  elif is_blocked; then
    blocked_error gitea
  else
    set_error gitea http_status "The public Gitea address answers with HTTP ${HTTP_CODE}." http "$HTTP_CODE"
  fi

  # Claude and ChatGPT read the sign-in addresses from Gitea and call them from the internet.
  http_get "${gitea_url}/.well-known/openid-configuration" "$insecure"
  if [[ "$HTTP_CODE" == "200" ]] && is_json "$HTTP_BODY"; then
    authorize_endpoint="$(jq -r '.authorization_endpoint // ""' <<<"$HTTP_BODY")"
    token_endpoint="$(jq -r '.token_endpoint // ""' <<<"$HTTP_BODY")"
    if [[ "$authorize_endpoint" != "${gitea_url}/"* || "$token_endpoint" != "${gitea_url}/"* ]]; then
      set_error oauth root_url "Gitea announces its sign-in at ${token_endpoint:-nowhere}. Set ROOT_URL in Gitea to ${gitea_url}/ so that Claude and ChatGPT are sent to the public address." endpoint "${token_endpoint:-nowhere}" public "$gitea_url"
    else
      HTTP_METHOD=POST http_get "$token_endpoint" "$insecure"
      if [[ "$HTTP_CODE" == "400" || "$HTTP_CODE" == "401" ]] && is_json "$HTTP_BODY"; then
        oauth_ok=true
      elif [[ "$HTTP_CODE" == "000" ]]; then
        no_answer_error oauth
      elif is_blocked; then
        blocked_error oauth
      else
        set_error oauth oauth_http "The sign-in address of Gitea answers with HTTP ${HTTP_CODE}." http "$HTTP_CODE"
      fi
    fi
  elif [[ "$HTTP_CODE" == "000" ]]; then
    no_answer_error oauth
  elif is_blocked; then
    blocked_error oauth
  else
    set_error oauth oauth_no_discovery "Gitea does not publish its sign-in addresses (HTTP ${HTTP_CODE})." http "$HTTP_CODE"
  fi

  jq -nc --argjson mcp_ok "$mcp_ok" --arg mcp_error "$mcp_error" --argjson mcp_msg "$mcp_msg" \
    --argjson agent "$(probe_agent_access "$mcp_url" "$insecure")" \
    --argjson gitea_ok "$gitea_ok" --arg gitea_error "$gitea_error" --argjson gitea_msg "$gitea_msg" \
    --arg gitea_note "$gitea_note" --arg gitea_note_code "$gitea_note_code" \
    --argjson oauth_ok "$oauth_ok" --arg oauth_error "$oauth_error" --argjson oauth_msg "$oauth_msg" '
    def detail($msg): {code: ($msg.code // ""), args: ($msg.args // {})};
    {mcp: ({ok: $mcp_ok, error: $mcp_error} + detail($mcp_msg)),
     agent: $agent,
     gitea: ({ok: $gitea_ok, error: $gitea_error, note: $gitea_note, note_code: $gitea_note_code} + detail($gitea_msg)),
     oauth: ({ok: $oauth_ok, error: $oauth_error} + detail($oauth_msg))}'
}
