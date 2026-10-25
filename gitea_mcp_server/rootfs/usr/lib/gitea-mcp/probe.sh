#!/usr/bin/env bash
# shellcheck shell=bash
# Connection checks that turn "it does not work" into a sentence the user can act on.
# Every probe prints one JSON object and never fails.

# http_get <url> <insecure> <ca-file> [token]
# Sets HTTP_CODE (000 when nothing answered), HTTP_BODY and CURL_RC. The token travels on
# stdin so that it never appears in the process list.
http_get() {
  local url="$1" insecure="$2" ca_file="$3" token="${4:-}"
  local body_file args=(-sS --max-time 6 -K -)
  body_file="$(mktemp)"
  args+=(-o "$body_file" -w '%{http_code}')
  if [[ "$insecure" == "true" ]]; then
    args+=(-k)
  fi
  if [[ -n "$ca_file" ]]; then
    args+=(--cacert "$ca_file")
  fi
  HTTP_CODE="$(
    if [[ -n "$token" ]]; then
      printf 'header = "Authorization: token %s"\n' "$token"
    fi | curl "${args[@]}" "$url" 2>/dev/null
  )"
  CURL_RC=$?
  HTTP_BODY="$(cat "$body_file")"
  rm -f "$body_file"
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

# probe_remote <mcp-public-url> <gitea-public-url> <insecure> <ca-file>
# Looks at both public addresses the way Claude and ChatGPT will:
# {"mcp": {"ok", "error"}, "gitea": {"ok", "error"}}
probe_remote() {
  local mcp_url="$1" gitea_url="$2" insecure="$3" ca_file="$4"
  local mcp_ok=false mcp_error="" gitea_ok=false gitea_error=""

  http_get "${mcp_url}/.well-known/oauth-protected-resource/mcp" "$insecure" "$ca_file"
  if [[ "$HTTP_CODE" == "200" && "$(jq -r '.resource // ""' <<<"$HTTP_BODY" 2>/dev/null)" == "${mcp_url}/mcp" ]]; then
    mcp_ok=true
  elif [[ "$HTTP_CODE" == "000" ]]; then
    mcp_error="The public address does not answer: $(describe_failure)."
  else
    mcp_error="The public address answers, but not with this app (HTTP ${HTTP_CODE}). Point the tunnel or proxy at port ${GM_REMOTE_PORT:-8081} of this app."
  fi

  http_get "${gitea_url}/api/v1/version" "$insecure" "$ca_file"
  if [[ "$HTTP_CODE" == "200" ]]; then
    gitea_ok=true
  elif [[ "$HTTP_CODE" == "000" ]]; then
    gitea_error="The public Gitea address does not answer: $(describe_failure)."
  else
    gitea_error="The public Gitea address answers with HTTP ${HTTP_CODE}."
  fi

  jq -nc --argjson mcp_ok "$mcp_ok" --arg mcp_error "$mcp_error" \
    --argjson gitea_ok "$gitea_ok" --arg gitea_error "$gitea_error" '
    {mcp: {ok: $mcp_ok, error: $mcp_error}, gitea: {ok: $gitea_ok, error: $gitea_error}}'
}
