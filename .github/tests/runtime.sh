#!/usr/bin/env bash
set -Eeuo pipefail
# bashio starts the services with the same strictness; a library that only works without it fails
# in Home Assistant, not here.
shopt -s inherit_errexit

# Runs inside the built image (release pipeline). Mocked Gitea servers answer the app's libraries; the real gitea-mcp binary is started and asked for its tools over MCP.
LIB="${LIB_DIR:-/usr/lib/gitea-mcp}"
RECHECK="${RECHECK_CGI:-/usr/share/gitea-mcp/web/cgi-bin/recheck}"
NGINX_CONF="${NGINX_CONF:-/etc/gitea-mcp/nginx.conf}"
read -r -a HTTPD <<<"${HTTPD_COMMAND:-busybox-extras httpd}"

fixture=$(mktemp -d)
pids=()
cleanup() {
  if ((${#pids[@]} > 0)); then kill "${pids[@]}" 2>/dev/null || true; fi
  rm -rf -- "$fixture"
}
trap cleanup EXIT

pass() { echo "PASS: $*"; }
fail() { echo "FAIL: $*" >&2; exit 1; }

expect_equal() { # expect_equal <what> <expected> <actual>
  [[ "$2" == "$3" ]] || fail "$1: expected '$2', got '$3'"
}

# serve <directory> <port> [config-file]: a static web server in the background.
serve() {
  "${HTTPD[@]}" -f -p "127.0.0.1:$2" -h "$1" ${3:+-c "$3"} >/dev/null 2>&1 &
  pids+=($!)
}

# mcp <url> <json-rpc-body>: one stateless MCP request; prints the JSON of the answer.
mcp() {
  curl -fsS -X POST "$1" -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
    -d "$2" | sed -n 's/^data: //p'
}

tool_names() { # tool_names <mcp-url>
  mcp "$1" '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq -r '.result.tools[].name' | sort
}

# wait_for <url>: until the server answers.
wait_for() {
  for _ in $(seq 1 50); do
    curl -fs -o /dev/null "$1" && return 0
    sleep 0.1
  done
  fail "$1 did not come up"
}

# ---- fixtures: Supervisor on 18080; Gitea on 3000 (any token), 3001 (needs a login),
# ---- 3002 (everything behind a gate) and 3003 (announces a wrong ROOT_URL) -----------------

mkdir -p "$fixture"/gitea/api/v1 "$fixture"/gitea-locked/api/v1
echo '{"version":"1.24.0"}' >"$fixture/gitea/api/v1/version"
echo '{"login":"tester"}' >"$fixture/gitea/api/v1/user"
echo '{"version":"1.24.0"}' >"$fixture/gitea-locked/api/v1/version"
echo '{"login":"nobody"}' >"$fixture/gitea-locked/api/v1/user"
printf '/api/v1/user:user:secret\n' >"$fixture/locked.conf" # answers 401 to a token header

# What Gitea publishes for the sign-in of Claude and ChatGPT; the token endpoint answers in JSON.
# openid_configuration <port> <host>
openid_configuration() {
  printf '{"issuer":"http://%s/","authorization_endpoint":"http://%s/login/oauth/authorize","token_endpoint":"http://%s/cgi-bin/token"}\n' "$2" "$2" "$2" >"$fixture/$1/.well-known/openid-configuration"
}
mkdir -p "$fixture"/gitea/{.well-known,cgi-bin} "$fixture"/gitea-gated/api/v1 "$fixture"/gitea-moved/{api/v1,.well-known,cgi-bin}
openid_configuration gitea 127.0.0.1:3000
printf '#!/bin/sh\nprintf "Status: 400 Bad Request\\r\\nContent-Type: application/json\\r\\n\\r\\n{\\"error\\":\\"unsupported_grant_type\\"}\\n"\n' >"$fixture/gitea/cgi-bin/token"
chmod +x "$fixture/gitea/cgi-bin/token"
echo '{"version":"1.24.0"}' >"$fixture/gitea-gated/api/v1/version"
printf '/:user:secret\n' >"$fixture/gated.conf" # a gate in front of everything: answers 401 with a web page
echo '{"version":"1.24.0"}' >"$fixture/gitea-moved/api/v1/version"
openid_configuration gitea-moved homeassistant.local:3000

serve "$fixture/gitea" 3000
serve "$fixture/gitea-locked" 3001 "$fixture/locked.conf"
serve "$fixture/gitea-gated" 3002 "$fixture/gated.conf"
serve "$fixture/gitea-moved" 3003
wait_for http://127.0.0.1:3000/api/v1/version

export RUNTIME_DIR="$fixture/run" OPTIONS_FILE="$fixture/options.json" VERSION_FILE="$fixture/version"
mkdir -p "$RUNTIME_DIR"
echo 1.0.0-alpha.99 >"$VERSION_FILE"

# options <json>: the app options as the Supervisor would store them (the default Gitea address
# is replaced by the mock).
options() {
  jq -n --argjson overrides "$1" '
    {gitea_url: "http://127.0.0.1:3000", access_token: "", read_only: true, toolsets: [],
     remote_access: {public_url: "", gitea_public_url: ""},
     advanced: {ignore_certificate_errors: false, debug_logging: false}}
    * $overrides' >"$OPTIONS_FILE"
}

# settings: loads the libraries and resolves the options in the current shell.
# The libraries log through these three functions; the test keeps quiet.
# shellcheck disable=SC2329  # called by the libraries
log_info() { :; }
# shellcheck disable=SC2329
log_warning() { :; }
# shellcheck disable=SC2329
log_error() { :; }

settings() {
  # shellcheck source=/dev/null
  source "$LIB/common.sh"
  # shellcheck source=/dev/null
  # shellcheck source=/dev/null
  source "$LIB/settings.sh"
  # shellcheck source=/dev/null
  source "$LIB/probe.sh"
  # shellcheck source=/dev/null
  source "$LIB/status.sh"
  resolve_settings
}

# ---- the binary -----------------------------------------------------------------------------

[[ "$(gitea-mcp --version)" =~ ^[0-9]+\.[0-9]+ ]] || fail 'gitea-mcp does not report a version'
pass 'gitea-mcp starts on this architecture'

for script in "$LIB"/*.sh "$RECHECK"; do bash -n "$script"; done
pass 'the shell libraries parse'

# The start script runs with "set -u". A setting it reads and the libraries never assign stops the
# app at the first line, which the unit tests below cannot see: check the names.
SERVICE_RUN="${SERVICE_RUN:-/etc/s6-overlay/s6-rc.d/gitea-mcp-server/run}"
while read -r name; do
  grep -qE "^[[:space:]]*${name}=" "$LIB/settings.sh" || fail "the start script reads ${name}, which nothing assigns"
done < <(grep -o 'GM_[A-Z_]*' "$SERVICE_RUN" | sort -u)
pass 'every setting the start script reads is assigned by the libraries'

# ---- option handling ------------------------------------------------------------------------

options '{"gitea_url": ""}'
(
  settings
  expect_equal 'default address' 'http://db21ed7f-gitea:3000' "$GM_LOCAL_URL"
  expect_equal 'default source' 'default' "$GM_LOCAL_SOURCE"
  expect_equal 'host name' "$(hostname)" "$GM_APP_HOSTNAME"
  expect_equal 'version of the image' '1.0.0-alpha.99' "$GM_APP_VERSION"
  expect_equal 'problems' 0 "${#GM_PROBLEMS[@]}"
)
pass 'without an address the Gitea app of alexbelgium is used'

options '{"gitea_url": " http://git.lan:3000/api/v1/ "}'
(
  settings
  expect_equal 'configured address' 'http://git.lan:3000' "$GM_LOCAL_URL"
  expect_equal 'source' 'url' "$GM_LOCAL_SOURCE"
)
pass 'a configured address wins and is cleaned up'

options '{"gitea_url": "git.lan"}'
(
  settings
  expect_equal 'no local address' '' "$GM_LOCAL_URL"
  expect_equal 'problem count' 1 "${#GM_PROBLEMS[@]}"
  expect_equal 'problem code' bad_gitea_url "$(jq -r '.problem_details[0].code' "$RUNTIME_DIR/resolved.json")"
  expect_equal 'problem argument' git.lan "$(jq -r '.problem_details[0].args.url' "$RUNTIME_DIR/resolved.json")"
)
pass 'an address without scheme is reported, not started'

options '{"remote_access": {"public_url": "http://mcp.example.com"}}'
(
  settings
  expect_equal 'remote stays off' '' "$GM_REMOTE_URL"
  expect_equal 'problem count' 1 "${#GM_PROBLEMS[@]}"
)
pass 'remote access needs an HTTPS address'

options '{"gitea_url": "https://git.example.com", "remote_access": {"public_url": "https://mcp.example.com/"}}'
(
  settings
  expect_equal 'public mcp address' 'https://mcp.example.com' "$GM_REMOTE_URL"
  expect_equal 'public Gitea address from the https address' 'https://git.example.com' "$GM_REMOTE_GITEA_URL"
)
pass 'a Gitea address with https doubles as the public Gitea address'

options '{"remote_access": {"public_url": "https://mcp.example.com"}}'
(
  settings
  expect_equal 'remote stays off' '' "$GM_REMOTE_URL"
  expect_equal 'problem count' 1 "${#GM_PROBLEMS[@]}"
  expect_equal 'local keeps working' 'http://127.0.0.1:3000' "$GM_LOCAL_URL"
)
pass 'incomplete remote access does not stop the local server'

# ---- connection checks ----------------------------------------------------------------------

(
  settings
  # shellcheck disable=SC2034
  result="$(probe_gitea http://127.0.0.1:3000 false token-1)"
  expect_equal 'reachable' true "$(jq -r .reachable <<<"$result")"
  expect_equal 'version' 1.24.0 "$(jq -r .version <<<"$result")"
  expect_equal 'token state' ok "$(jq -r .token.state <<<"$result")"
  expect_equal 'login' tester "$(jq -r .token.login <<<"$result")"

  result="$(probe_gitea http://127.0.0.1:3000 false "")"
  expect_equal 'no token' none "$(jq -r .token.state <<<"$result")"

  result="$(probe_gitea http://127.0.0.1:3001 false token-1)"
  expect_equal 'rejected token' rejected "$(jq -r .token.state <<<"$result")"

  result="$(probe_gitea http://127.0.0.1:9 false "")"
  expect_equal 'closed port' false "$(jq -r .reachable <<<"$result")"
  [[ "$(jq -r .error <<<"$result")" == *refused* ]] || fail "unhelpful message: $(jq -r .error <<<"$result")"
)
pass 'Gitea checks tell reachable, signed in, rejected and refused apart'

# ---- the servers ----------------------------------------------------------------------------

start_server() { # start_server <port> [-flag=value ...] [VARIABLE=value ...]
  local port="$1" argument flags=() variables=()
  shift
  for argument in "$@"; do
    if [[ "$argument" == -* ]]; then flags+=("$argument"); else variables+=("$argument"); fi
  done
  (
    declare -x GITEA_HOST=http://127.0.0.1:3000 "${variables[@]}"
    exec gitea-mcp -t http -p "$port" "${flags[@]}" >/dev/null 2>&1
  ) &
  pids+=($!)
  wait_for "http://127.0.0.1:$port/healthz"
}

start_server 18181 GITEA_READONLY=true
read_only_tools="$(tool_names http://127.0.0.1:18181/mcp)"
grep -qx list_issues <<<"$read_only_tools" || fail 'read-only server lacks list_issues'
if grep -qE '^(issue_write|create_repo|label_write)$' <<<"$read_only_tools"; then
  fail 'read-only server offers write tools'
fi
pass 'read-only hides every write tool'

start_server 18182
grep -qx issue_write <<<"$(tool_names http://127.0.0.1:18182/mcp)" || fail 'read-write server lacks issue_write'
pass 'read-write offers write tools'

start_server 18183 GITEA_SCOPES=label
expect_equal 'label toolset' $'label_read\nlabel_write' "$(tool_names http://127.0.0.1:18183/mcp)"
pass 'a toolset limits the tools'

start_server 18184 GITEA_MCP_OAUTH=true GITEA_MCP_PUBLIC_URL=http://127.0.0.1:18184
status="$(curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:18184/mcp -d '{}')"
expect_equal 'unauthenticated MCP request' 401 "$status"
(
  settings
  result="$(probe_remote http://127.0.0.1:18184 http://127.0.0.1:3000 false)"
  expect_equal 'public MCP check' true "$(jq -r .mcp.ok <<<"$result")"
  expect_equal 'public Gitea check' true "$(jq -r .gitea.ok <<<"$result")"
  expect_equal 'Gitea sign-in check' true "$(jq -r .oauth.ok <<<"$result")"
  expect_equal 'requests as AI agents' true "$(jq -r .agent.ok <<<"$result")"
  expect_equal 'every agent was tried' 4 "$(jq -r '.agent.agents | length' <<<"$result")"
  result="$(probe_remote http://127.0.0.1:18183 http://127.0.0.1:3000 false)"
  expect_equal 'wrong target' false "$(jq -r .mcp.ok <<<"$result")"
)
pass 'the remote server asks for OAuth and the remote checks recognise it'

(
  settings
  result="$(probe_remote http://127.0.0.1:18184 http://127.0.0.1:3002 false)"
  expect_equal 'gated Gitea' false "$(jq -r .gitea.ok <<<"$result")"
  [[ "$(jq -r .gitea.error <<<"$result")" == *'refuses the request (HTTP 401)'* ]] || fail 'a gate in front of Gitea is not named'
  expect_equal 'gated sign-in' false "$(jq -r .oauth.ok <<<"$result")"

  result="$(probe_remote http://127.0.0.1:18184 http://127.0.0.1:3003 false)"
  expect_equal 'moved Gitea sign-in' false "$(jq -r .oauth.ok <<<"$result")"
  [[ "$(jq -r .oauth.error <<<"$result")" == *ROOT_URL* ]] || fail 'a wrong ROOT_URL is not named'

  # Gitea itself answers a refusal in JSON; a gate in front of it sends a web page.
  # shellcheck disable=SC2034  # read by is_blocked and describe_block
  HTTP_CODE=403 HTTP_BODY='{"message":"Only signed in user is allowed to call APIs."}'
  if is_blocked; then fail 'a JSON refusal of Gitea counts as blocked'; fi
  # shellcheck disable=SC2034
  HTTP_CODE=403 HTTP_BODY='<html>Attention Required</html>' HTTP_HEADERS=$'HTTP/2 403\r\nserver: cloudflare'
  is_blocked || fail 'a web page refusal does not count as blocked'
  [[ "$(describe_block)" == Cloudflare* ]] || fail 'Cloudflare is not named'
)
pass 'checks tell a gate or firewall in front of Gitea from the sign-in requirement of Gitea itself'

(
  settings
  # Bot protection that stops only requests introducing themselves as one AI service, as
  # Cloudflare does: first with a web page (403), then by cutting the connection off (curl error 92).
  # The library reads these variables and calls this function; shellcheck cannot see that.
  # shellcheck disable=SC2034,SC2317,SC2329
  http_get() {
    CURL_RC=0 HTTP_CODE=401 HTTP_BODY='authorization required' HTTP_HEADERS=$'HTTP/2 401\r\nwww-authenticate: Bearer resource_metadata="x"'
    if [[ "${HTTP_USER_AGENT:-}" == "ChatGPT-User" && "$BLOCK_MODE" == "page" ]]; then
      CURL_RC=0 HTTP_CODE=403 HTTP_BODY='<html>Attention Required</html>' HTTP_HEADERS=$'HTTP/2 403\r\nserver: cloudflare'
    elif [[ "${HTTP_USER_AGENT:-}" == "ChatGPT-User" && "$BLOCK_MODE" == "reset" ]]; then
      CURL_RC=92 HTTP_CODE=000 HTTP_BODY="" HTTP_HEADERS=""
    fi
  }
  for BLOCK_MODE in page reset; do
    result="$(BLOCK_MODE=$BLOCK_MODE probe_agent_access https://mcp.example.com false)"
    expect_equal "one agent refused ($BLOCK_MODE)" false "$(jq -r .ok <<<"$result")"
    expect_equal "summary code ($BLOCK_MODE)" agents_blocked "$(jq -r .code <<<"$result")"
    expect_equal "only ChatGPT is named ($BLOCK_MODE)" chatgpt "$(jq -r '[.agents[] | select(.ok | not) | .id] | join(",")' <<<"$result")"
    expect_equal "Claude passes ($BLOCK_MODE)" true "$(jq -r '.agents[] | select(.id == "claude") | .ok' <<<"$result")"
    [[ "$(jq -r '.agents[] | select(.id == "chatgpt") | .error' <<<"$result")" == *'only claims to be ChatGPT'* ]] \
      || fail "the refusal is not explained ($BLOCK_MODE)"
  done
  expect_equal 'how the page refused' refused "$(BLOCK_MODE=page probe_agent_access https://mcp.example.com false | jq -r '.agents[] | select(.id == "chatgpt") | .args.how')"
  expect_equal 'how the reset cut off' cut_off "$(BLOCK_MODE=reset probe_agent_access https://mcp.example.com false | jq -r '.agents[] | select(.id == "chatgpt") | .args.how')"
  result="$(BLOCK_MODE=none probe_agent_access https://mcp.example.com false)"
  expect_equal 'nothing in the way' true "$(jq -r .ok <<<"$result")"
)

(
  settings
  # A real failing connection: curl ends with an error code and the probes must still answer in JSON.
  result="$(probe_agent_access http://127.0.0.1:9 false)"
  expect_equal 'no answer at all' false "$(jq -r .ok <<<"$result")"
  [[ "$(jq -r .error <<<"$result")" == *'does not answer'* ]] || fail 'a closed port is not reported'
  result="$(probe_remote http://127.0.0.1:9 http://127.0.0.1:9 false)"
  expect_equal 'remote checks without any answer' false "$(jq -r .mcp.ok <<<"$result")"
)
pass 'probes keep answering in JSON when a connection fails'

(
  settings
  # The page translates by code: a refused connection and a wrong sign-in address must carry one.
  result="$(probe_gitea http://127.0.0.1:9 false "")"
  expect_equal 'code of a closed port' no_answer "$(jq -r .code <<<"$result")"
  expect_equal 'reason of a closed port' refused "$(jq -r .args.reason <<<"$result")"
  result="$(probe_remote http://127.0.0.1:18184 http://127.0.0.1:3003 false)"
  expect_equal 'code of a wrong ROOT_URL' root_url "$(jq -r .oauth.code <<<"$result")"
  expect_equal 'argument of a wrong ROOT_URL' http://127.0.0.1:3003 "$(jq -r .oauth.args.public <<<"$result")"
)
pass 'problems carry a code and arguments for the translated page'
pass 'a block of one AI service is named, whether refused or cut off'

# ---- request log of the remote address (debug mode) ----------------------------------------

mkdir -p /run/gitea-mcp /tmp/gitea-mcp-nginx # the start script creates them as well
nginx_check="$(nginx -t -e stderr -c "$NGINX_CONF" 2>&1)" || fail "the nginx configuration of the request log is invalid: ${nginx_check}"
start_server 8082 -b=127.0.0.1
nginx -e stderr -c "$NGINX_CONF" 2>>"$fixture/nginx.log" &
pids+=($!)
wait_for http://127.0.0.1:8081/healthz
status="$(curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:8081/mcp -A Claude-User \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -H 'Authorization: Bearer s3cr3t-request-log' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}')"
expect_equal 'request through the request log' 200 "$status"
for _ in $(seq 1 20); do
  grep -q 'POST /mcp' "$fixture/nginx.log" && break
  sleep 0.1
done
grep -q 'request: POST /mcp -> 200 .* agent="Claude-User" auth=token-sent' "$fixture/nginx.log" || fail "the request is not logged: $(cat "$fixture/nginx.log")"
if grep -q 's3cr3t-request-log' "$fixture/nginx.log"; then fail 'the token leaked into the request log'; fi
pass 'the request log shows method, status, agent and whether a token was sent, never the token'

# ---- app page -------------------------------------------------------------------------------

options '{"access_token": "s3cr3t-token", "toolsets": ["issue"]}'
(
  settings
  grep -q 'http://localhost:3118/callback' <<<"$(jq -r '.remote.redirect_uris[]' "$RUNTIME_DIR/resolved.json")" || fail 'the Claude Code callback is not in the redirect URIs'
  expect_equal 'Claude Code port' 3118 "$(jq -r .claude_code_port "$RUNTIME_DIR/resolved.json")"
)
pass 'the redirect URIs include the Claude Code callback'
(
  settings
  refresh_status >/dev/null
  expect_equal 'status: login' tester "$(jq -r .local.gitea.token.login "$RUNTIME_DIR/status.json")"
  expect_equal 'status: toolsets' issue "$(jq -r '.toolsets | join(",")' "$RUNTIME_DIR/status.json")"
  expect_equal 'status: mcp address' "http://$(hostname):8080/mcp" "$(jq -r .local.mcp_url "$RUNTIME_DIR/status.json")"
  if grep -q s3cr3t-token "$RUNTIME_DIR/status.json"; then fail 'the token leaked into status.json'; fi
)
pass 'the status holds the facts for the app page and no secret'

answer="$(REQUEST_METHOD=POST "$RECHECK")"
[[ "$answer" == *'Content-Type: application/json'* ]] || fail 'the recheck answers without a JSON header'
jq -e '.local.gitea.reachable' <<<"$(sed -n '/^{/,$p' <<<"$answer")" >/dev/null \
  || fail 'the recheck does not return a status'
[[ "$(REQUEST_METHOD=GET "$RECHECK")" == *'405'* ]] || fail 'the recheck accepts GET'
pass 'the recheck endpoint answers POST with a fresh status and refuses GET'

for page in index.html app.js style.css; do
  test -s "${WEB_DIR:-/usr/share/gitea-mcp/web}/$page" || fail "$page is missing"
done
pass 'the app page files are in the image'

# ---- health check ---------------------------------------------------------------------------

printf '18181\n' >"$RUNTIME_DIR/ports"
RUNTIME_DIR="$RUNTIME_DIR" "$LIB/healthcheck.sh" || fail 'the health check fails for a running server'
printf '18181\n9\n' >"$RUNTIME_DIR/ports"
if RUNTIME_DIR="$RUNTIME_DIR" "$LIB/healthcheck.sh"; then fail 'the health check ignores a dead server'; fi
pass 'the health check follows the servers the app started'
