#!/usr/bin/env bash
# shellcheck shell=bash
# shellcheck disable=SC2034  # the GM_* variables are read by the scripts that source this file
# Turns the app options into the values the MCP servers are started with.
#
# resolve_settings fills the GM_* variables and writes the non-secret part to
# $RUNTIME_DIR/resolved.json for the status page. Anything wrong with the options is
# collected in GM_PROBLEMS instead of aborting, so that the status page can explain it.

GM_LOCAL_PORT=8080
GM_REMOTE_PORT=8081
# Where the remote server listens while the request log (nginx) sits in front of it.
GM_REMOTE_UPSTREAM_PORT=8082

# The Gitea app by alexbelgium, as the other apps of Home Assistant reach it.
DEFAULT_GITEA_URL="http://db21ed7f-gitea:3000"

# The name of the OAuth application the user creates in Gitea: one for every AI service.
OAUTH_APP_NAME="AI assistants (MCP)"
# Claude Code opens a local web server for the sign-in. Gitea ignores the port only for
# 127.0.0.1, not for localhost, so the port is fixed here and set with --callback-port.
CLAUDE_CODE_PORT=3118
# Where claude.ai and Claude Code send the user back after signing in to Gitea. ChatGPT shows a
# callback of its own (https://chatgpt.com/connector/oauth/<id>) for every connector; the user
# adds that one by hand.
REMOTE_REDIRECT_URIS=(
  "https://claude.ai/api/mcp/auth_callback"
  "https://claude.com/api/mcp/auth_callback"
  "http://localhost:${CLAUDE_CODE_PORT}/callback"
)

GM_PROBLEMS=()
GM_PROBLEM_DETAILS=()

# add_problem <code> <english text> [name value ...]
# Collects a problem as text (log and fallback) and as code with arguments (the app page
# translates it into the language of the browser).
add_problem() {
  local code="$1" text="$2"
  shift 2
  GM_PROBLEMS+=("$text")
  GM_PROBLEM_DETAILS+=("$(message "$code" "$text" "$@")")
  log_error "$text"
}

# The Gitea address the local endpoint talks to: the configured one, or the Gitea app's.
resolve_local_gitea() {
  local configured
  GM_LOCAL_URL=""
  GM_LOCAL_SOURCE=""

  configured="$(trim_url "$(option gitea_url)")"
  configured="${configured%/api/v1}"
  if [[ -z "$configured" || "$configured" == "$DEFAULT_GITEA_URL" ]]; then
    GM_LOCAL_URL="$DEFAULT_GITEA_URL"
    GM_LOCAL_SOURCE="default"
  elif is_http_url "$configured"; then
    GM_LOCAL_URL="$configured"
    GM_LOCAL_SOURCE="url"
  else
    add_problem bad_gitea_url "gitea_url '${configured}' is not a web address. Use the form http://db21ed7f-gitea:3000." url "$configured"
  fi
}

# The public addresses the AI services use. Optional: without public_url the remote endpoint stays off.
resolve_remote_access() {
  local public gitea_public
  GM_REMOTE_URL=""
  GM_REMOTE_GITEA_URL=""

  public="$(trim_url "$(option remote_access.public_url)")"
  [[ -z "$public" ]] && return 0
  if ! is_https_origin "$public"; then
    add_problem bad_public_url "remote_access.public_url '${public}' must look like https://mcp.example.com (HTTPS, no path)." url "$public"
    return 0
  fi

  gitea_public="$(trim_url "$(option remote_access.gitea_public_url)")"
  if [[ -z "$gitea_public" && "$GM_LOCAL_URL" == https://* ]]; then
    gitea_public="$GM_LOCAL_URL"
  fi
  if [[ -z "$gitea_public" ]]; then
    add_problem need_gitea_public "Remote access needs the public address of your Gitea in remote_access.gitea_public_url."
    return 0
  fi
  if ! is_http_url "$gitea_public"; then
    add_problem bad_gitea_public "remote_access.gitea_public_url '${gitea_public}' is not a web address." url "$gitea_public"
    return 0
  fi
  if [[ "$gitea_public" != https://* ]]; then
    log_warning "The AI services only sign in to Gitea over HTTPS; '${gitea_public}' will not work for them."
  fi

  GM_REMOTE_URL="$public"
  GM_REMOTE_GITEA_URL="$gitea_public"
}

write_resolved() {
  local redirects
  redirects="$(printf '%s\n' "${REMOTE_REDIRECT_URIS[@]}" | jq -R . | jq -sc .)"
  mkdir -p "$RUNTIME_DIR"
  jq -n \
    --arg hostname "$GM_APP_HOSTNAME" --arg version "$GM_APP_VERSION" \
    --argjson read_only "$GM_READ_ONLY" --arg toolsets "$GM_TOOLSETS" \
    --arg local_url "$GM_LOCAL_URL" --arg local_source "$GM_LOCAL_SOURCE" \
    --argjson local_insecure "$GM_IGNORE_TLS" --argjson local_port "$GM_LOCAL_PORT" \
    --arg remote_url "$GM_REMOTE_URL" --arg remote_gitea_url "$GM_REMOTE_GITEA_URL" \
    --argjson remote_port "$GM_REMOTE_PORT" --argjson redirect_uris "$redirects" \
    --arg oauth_app_name "$OAUTH_APP_NAME" --argjson claude_code_port "$CLAUDE_CODE_PORT" \
    --argjson debug "$GM_DEBUG" \
    --argjson problems "$(printf '%s\n' "${GM_PROBLEMS[@]}" | jq -R . | jq -sc 'map(select(. != ""))')" \
    --argjson problem_details "$(printf '%s\n' "${GM_PROBLEM_DETAILS[@]}" | jq -sc 'map(select(. != null))')" '
    {
      app: {hostname: $hostname, version: $version},
      read_only: $read_only,
      toolsets: ($toolsets | split(",") | map(select(. != ""))),
      debug: $debug,
      local: {
        url: $local_url, source: $local_source, insecure: $local_insecure, port: $local_port,
        mcp_url: (if $local_url == "" then "" else "http://\($hostname):\($local_port)/mcp" end)
      },
      remote: {
        public_url: $remote_url, gitea_url: $remote_gitea_url, insecure: $local_insecure, port: $remote_port,
        mcp_url: (if $remote_url == "" then "" else "\($remote_url)/mcp" end),
        app_name: $oauth_app_name, redirect_uris: $redirect_uris
      },
      claude_code_port: $claude_code_port,
      problems: $problems,
      problem_details: $problem_details
    }
  ' >"$RUNTIME_DIR/resolved.json"
}

resolve_settings() {
  local identity
  GM_PROBLEMS=()
  GM_PROBLEM_DETAILS=()
  GM_TOKEN="$(option access_token)"
  GM_READ_ONLY="$(option read_only true)"
  GM_TOOLSETS="$(option_list toolsets)"
  GM_DEBUG="$(option advanced.debug_logging false)"
  GM_IGNORE_TLS="$(option advanced.ignore_certificate_errors false)"

  identity="$(own_app_info)"
  GM_APP_HOSTNAME="$(jq -r '.hostname' <<<"$identity")"
  GM_APP_VERSION="$(jq -r '.version' <<<"$identity")"

  resolve_local_gitea
  resolve_remote_access
  write_resolved
}
