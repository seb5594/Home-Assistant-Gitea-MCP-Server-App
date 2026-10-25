#!/usr/bin/env bash
# shellcheck shell=bash
# Finds a Gitea app installed next to this one, through the Supervisor.
#
# The Supervisor lets an app with `hassio_api` read the info of other apps by slug.
# Listing all apps would need the "manager" role, so the known slugs are probed instead.

SUPERVISOR_URL="${SUPERVISOR_URL:-http://supervisor}"

# slug:port of the Gitea apps this app can connect to by itself.
#   db21ed7f_gitea  github.com/alexbelgium/hassio-addons (Gitea)
#   local_gitea     the same app installed from the local app folder
KNOWN_GITEA_APPS=("db21ed7f_gitea:3000" "local_gitea:3000")

# supervisor_get <path>
# Body of a Supervisor API response; fails on HTTP errors.
supervisor_get() {
  curl -fsS --max-time 10 -H "Authorization: Bearer ${SUPERVISOR_TOKEN:-}" "${SUPERVISOR_URL}$1"
}

# find_gitea_app
# Prints one JSON object for the first installed Gitea app and fails when there is none:
#   {"slug", "name", "hostname", "state", "port", "ssl", "root_url"}
find_gitea_app() {
  local entry reply
  for entry in "${KNOWN_GITEA_APPS[@]}"; do
    reply="$(supervisor_get "/addons/${entry%%:*}/info" 2>/dev/null)" || continue
    jq -ce --arg slug "${entry%%:*}" --argjson port "${entry##*:}" '
      select(.result == "ok" and (.data.version // "") != "")
      | .data
      | {slug: $slug, name: .name, hostname: .hostname, state: .state, port: $port,
         ssl: (.options.ssl // false), root_url: (.options.ROOT_URL // "")}
    ' <<<"$reply" && return 0
  done
  return 1
}

# own_app_info
# {"hostname", "version"} of this app, with fallbacks for runs outside the Supervisor.
own_app_info() {
  local reply
  reply="$(supervisor_get /addons/self/info 2>/dev/null)" || reply='{}'
  jq -c --arg fallback "$(hostname)" '
    {hostname: (.data.hostname // $fallback), version: (.data.version // "unknown")}
  ' <<<"$reply"
}
