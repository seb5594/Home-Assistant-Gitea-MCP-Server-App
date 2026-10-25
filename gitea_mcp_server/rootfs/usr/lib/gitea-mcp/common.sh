#!/usr/bin/env bash
# shellcheck shell=bash
# Helpers shared by the start script, the status page and the tests.
#
# The caller may define log_info, log_warning and log_error before sourcing this file
# (the start script maps them to bashio); the fallbacks print to stderr.

OPTIONS_FILE="${OPTIONS_FILE:-/data/options.json}"
RUNTIME_DIR="${RUNTIME_DIR:-/run/gitea-mcp}"

declare -F log_info >/dev/null || log_info() { printf '[INFO] %s\n' "$*" >&2; }
declare -F log_warning >/dev/null || log_warning() { printf '[WARNING] %s\n' "$*" >&2; }
declare -F log_error >/dev/null || log_error() { printf '[ERROR] %s\n' "$*" >&2; }

# option <dotted.path> [default]
# Value of an app option. Empty values count as "not set" and give the default.
option() {
  jq -r --arg path "$1" --arg fallback "${2:-}" '
    getpath($path | split(".")) as $value
    | if $value == null or $value == "" then $fallback else ($value | tostring) end
  ' "$OPTIONS_FILE"
}

# option_list <dotted.path>
# Items of a list option, comma separated.
option_list() {
  jq -r --arg path "$1" 'getpath($path | split(".")) // [] | join(",")' "$OPTIONS_FILE"
}

# trim_url <url>
# The URL without surrounding blanks and trailing slashes.
trim_url() {
  local url="${1//[[:space:]]/}"
  while [[ "$url" == */ ]]; do
    url="${url%/}"
  done
  printf '%s' "$url"
}

is_http_url() {
  [[ "$1" =~ ^https?://[^/[:space:]]+(/[^[:space:]]*)?$ ]]
}

# An origin is scheme and host (with optional port), nothing else.
is_https_origin() {
  [[ "$1" =~ ^https://[^/[:space:]]+$ ]]
}
