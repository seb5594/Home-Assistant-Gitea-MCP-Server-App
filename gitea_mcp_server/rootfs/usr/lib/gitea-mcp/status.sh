#!/usr/bin/env bash
# shellcheck shell=bash
# Builds $RUNTIME_DIR/status.json, the file the app page shows.
#
# It combines the resolved settings (resolved.json, written at start) with fresh connection
# checks. The page can ask for a new run at any time, see cgi-bin/recheck.

# refresh_status
# Runs the checks and replaces status.json atomically. Prints the new status.
refresh_status() {
  local resolved="$RUNTIME_DIR/resolved.json"
  local token local_url remote_url insecure local_insecure scratch
  local gitea_check='null' remote_check='null' has_token=false

  [[ -f "$resolved" ]] || { log_error "No resolved settings yet."; return 1; }
  token="$(option access_token)"
  if [[ -n "$token" ]]; then
    has_token=true
  fi
  local_url="$(jq -r '.local.url' "$resolved")"
  local_insecure="$(jq -r '.local.insecure' "$resolved")"
  remote_url="$(jq -r '.remote.public_url' "$resolved")"
  insecure="$(jq -r '.remote.insecure' "$resolved")"

  if [[ -n "$local_url" ]]; then
    gitea_check="$(probe_gitea "$local_url" "$local_insecure" "$token")"
  fi
  if [[ -n "$remote_url" ]]; then
    remote_check="$(probe_remote "$remote_url" "$(jq -r '.remote.gitea_url' "$resolved")" "$insecure")"
  fi

  scratch="$(mktemp "$RUNTIME_DIR/status.XXXXXX")"
  jq --argjson gitea "$gitea_check" --argjson remote "$remote_check" \
    --argjson has_token "$has_token" \
    --arg checked_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '
    .checked_at = $checked_at
    | .local.gitea = $gitea
    | .local.has_token = $has_token
    | .remote.checks = $remote
  ' "$resolved" >"$scratch"
  chmod 644 "$scratch"
  mv "$scratch" "$RUNTIME_DIR/status.json"
  cat "$RUNTIME_DIR/status.json"
}

# log_status
# One summary of the status for the app log.
log_status() {
  local status="$RUNTIME_DIR/status.json"

  if [[ "$(jq -r '.local.gitea.reachable // false' "$status")" == "true" ]]; then
    log_info "Gitea $(jq -r '.local.gitea.version' "$status") at $(jq -r '.local.url' "$status") ($(jq -r '.local.source' "$status"))"
  elif [[ "$(jq -r '.local.url' "$status")" != "" ]]; then
    log_warning "Gitea at $(jq -r '.local.url' "$status"): $(jq -r '.local.gitea.error' "$status")"
    log_warning "The MCP server starts anyway and connects as soon as Gitea answers."
  fi

  case "$(jq -r '.local.gitea.token.state // "none"' "$status")" in
    ok) log_info "Signed in as $(jq -r '.local.gitea.token.login' "$status")." ;;
    rejected | error) log_warning "$(jq -r '.local.gitea.token.error' "$status")" ;;
    *) log_warning "No access token set: only public data is readable. Create one in Gitea under Settings > Applications." ;;
  esac

  if [[ "$(jq -r '.remote.public_url' "$status")" != "" ]]; then
    jq -r '.remote.checks | [.mcp.error, .agent.error, (.agent.agents[]?.error), .gitea.error, .oauth.error] | .[] | select(. != "")' "$status" \
      | while read -r line; do log_warning "$line"; done
  fi
}
