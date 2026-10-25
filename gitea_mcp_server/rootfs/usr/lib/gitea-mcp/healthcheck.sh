#!/usr/bin/env bash
# shellcheck shell=bash
# Docker health check: every MCP server the start script launched has to answer.
# The start script lists their ports in $RUNTIME_DIR/ports; no file means the app is
# still starting, or idle because the configuration needs attention (see the app page).

ports_file="${RUNTIME_DIR:-/run/gitea-mcp}/ports"
[[ -f "$ports_file" ]] || exit 0

while read -r port; do
  [[ -n "$port" ]] || continue
  gitea-mcp -healthcheck -p "$port" >/dev/null 2>&1 || exit 1
done <"$ports_file"
