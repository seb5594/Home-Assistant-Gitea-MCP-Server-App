#!/usr/bin/env bash
# shellcheck shell=bash
# shellcheck disable=SC2034  # the GM_* variables are read by the scripts that source this file
# Turns the app options into the values the MCP servers are started with.
#
# resolve_settings fills the GM_* variables and writes the non-secret part to
# $RUNTIME_DIR/resolved.json for the status page. Anything wrong with the options is
# collected in GM_PROBLEMS instead of aborting, so that the status page can explain it.

SSL_DIR="${SSL_DIR:-/ssl}"

GM_LOCAL_PORT=8080
GM_REMOTE_PORT=8081
# Where the remote server listens while the request log (nginx) sits in front of it.
GM_REMOTE_UPSTREAM_PORT=8082

# Where claude.ai and ChatGPT send the user back after signing in to Gitea.
# ChatGPT also shows a callback of its own in the connector form; that one is added by hand.
REMOTE_REDIRECT_URIS=(
  "https://claude.ai/api/mcp/auth_callback"
  "https://claude.com/api/mcp/auth_callback"
  "https://chatgpt.com/connector_platform_oauth_redirect"
)

GM_PROBLEMS=()

add_problem() {
  GM_PROBLEMS+=("$1")
  log_error "$1"
}

resolve_ca_certificate() {
  local name
  GM_CA_CERT=""
  name="$(option advanced.ca_certificate)"
  [[ -z "$name" ]] && return 0
  if [[ "$name" == *..* || ! -f "${SSL_DIR}/${name}" ]]; then
    add_problem "Certificate file '${name}' was not found in the /ssl folder."
    return 0
  fi
  GM_CA_CERT="${SSL_DIR}/${name}"
}

# The Gitea address the local endpoint talks to: the configured one, or the Gitea app.
resolve_local_gitea() {
  local configured scheme
  GM_LOCAL_URL=""
  GM_LOCAL_SOURCE=""
  GM_LOCAL_INSECURE="$GM_IGNORE_TLS"
  GM_APP_JSON=""

  configured="$(trim_url "$(option gitea_url)")"
  configured="${configured%/api/v1}"
  if [[ -n "$configured" ]]; then
    if is_http_url "$configured"; then
      GM_LOCAL_URL="$configured"
      GM_LOCAL_SOURCE="url"
    else
      add_problem "gitea_url '${configured}' is not a web address. Use the form http://homeassistant.local:3000."
    fi
  elif GM_APP_JSON="$(find_gitea_app)"; then
    scheme="http"
    if [[ "$(jq -r '.ssl' <<<"$GM_APP_JSON")" == "true" ]]; then
      scheme="https"
    fi
    GM_LOCAL_URL="${scheme}://$(jq -r '.hostname' <<<"$GM_APP_JSON"):$(jq -r '.port' <<<"$GM_APP_JSON")"
    GM_LOCAL_SOURCE="app:$(jq -r '.slug' <<<"$GM_APP_JSON")"
    if [[ "$scheme" == "https" && -z "$GM_CA_CERT" ]]; then
      # The certificate belongs to the public domain, not to the app's internal host name.
      GM_LOCAL_INSECURE=true
      log_info "The Gitea app uses SSL; its certificate is not checked for the connection inside Home Assistant."
    fi
  else
    add_problem "No Gitea was found. Install the Gitea app, or enter the address of your Gitea in 'gitea_url'."
  fi
}

# The public addresses Claude and ChatGPT use. Optional: without public_url the remote endpoint stays off.
resolve_remote_access() {
  local public gitea_public app_root
  GM_REMOTE_URL=""
  GM_REMOTE_GITEA_URL=""

  public="$(trim_url "$(option remote_access.public_url)")"
  [[ -z "$public" ]] && return 0
  if ! is_https_origin "$public"; then
    add_problem "remote_access.public_url '${public}' must look like https://mcp.example.com (HTTPS, no path)."
    return 0
  fi

  gitea_public="$(trim_url "$(option remote_access.gitea_public_url)")"
  if [[ -z "$gitea_public" ]]; then
    app_root=""
    if [[ -n "$GM_APP_JSON" ]]; then
      app_root="$(trim_url "$(jq -r '.root_url' <<<"$GM_APP_JSON")")"
    fi
    if [[ "$GM_LOCAL_SOURCE" == "url" && "$GM_LOCAL_URL" == https://* ]]; then
      gitea_public="$GM_LOCAL_URL"
    elif [[ "$app_root" == https://* ]]; then
      gitea_public="$app_root"
    fi
  fi
  if [[ -z "$gitea_public" ]]; then
    add_problem "Remote access needs the public address of your Gitea in remote_access.gitea_public_url."
    return 0
  fi
  if ! is_http_url "$gitea_public"; then
    add_problem "remote_access.gitea_public_url '${gitea_public}' is not a web address."
    return 0
  fi
  if [[ "$gitea_public" != https://* ]]; then
    log_warning "Claude and ChatGPT only sign in to Gitea over HTTPS; '${gitea_public}' will not work for them."
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
    --argjson local_insecure "$GM_LOCAL_INSECURE" --argjson local_port "$GM_LOCAL_PORT" \
    --arg remote_url "$GM_REMOTE_URL" --arg remote_gitea_url "$GM_REMOTE_GITEA_URL" \
    --argjson remote_port "$GM_REMOTE_PORT" --argjson redirect_uris "$redirects" \
    --argjson insecure "$GM_IGNORE_TLS" --arg ca_cert "$GM_CA_CERT" \
    --argjson problems "$(printf '%s\n' "${GM_PROBLEMS[@]}" | jq -R . | jq -sc 'map(select(. != ""))')" '
    {
      app: {hostname: $hostname, version: $version},
      read_only: $read_only,
      toolsets: ($toolsets | split(",") | map(select(. != ""))),
      ca_cert: $ca_cert,
      local: {
        url: $local_url, source: $local_source, insecure: $local_insecure, port: $local_port,
        mcp_url: (if $local_url == "" then "" else "http://\($hostname):\($local_port)/mcp" end)
      },
      remote: {
        public_url: $remote_url, gitea_url: $remote_gitea_url, insecure: $insecure, port: $remote_port,
        mcp_url: (if $remote_url == "" then "" else "\($remote_url)/mcp" end),
        redirect_uris: $redirect_uris
      },
      problems: $problems
    }
  ' >"$RUNTIME_DIR/resolved.json"
}

resolve_settings() {
  local identity
  GM_PROBLEMS=()
  GM_TOKEN="$(option access_token)"
  GM_READ_ONLY="$(option read_only true)"
  GM_TOOLSETS="$(option_list toolsets)"
  GM_DEBUG="$(option advanced.debug_logging false)"
  GM_IGNORE_TLS="$(option advanced.ignore_certificate_errors false)"

  identity="$(own_app_info)"
  GM_APP_HOSTNAME="$(jq -r '.hostname' <<<"$identity")"
  GM_APP_VERSION="$(jq -r '.version' <<<"$identity")"

  resolve_ca_certificate
  resolve_local_gitea
  resolve_remote_access
  write_resolved
}
