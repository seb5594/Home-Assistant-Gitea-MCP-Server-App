# Changelog

## 1.0.0-dev1

First pre-release.

* Runs the official Gitea MCP server (1.11.0) as a Home Assistant app, over HTTP at `/mcp`.
* Finds the Gitea app of alexbelgium by itself; any other Gitea is set with `gitea_url`.
* Read-only by default, with a choice of toolsets.
* Optional remote access for claude.ai and ChatGPT: a second server signs users in to Gitea
  with OAuth. The app page lists the redirect URIs, the connector address and the checks.
* App page (Open Web UI) with connection checks, copy buttons and a button that adds the
  integration to Home Assistant. English and German.
* Configuration problems no longer stop the app; they are shown in the log and on the app page.
