# Changelog

## 1.0.0-dev8

* The app page is fully translated: the messages of the checks and the configuration problems
  now come as codes and are shown in German when the browser prefers German, otherwise in
  English. The log stays in English.
* Claude Code: the redirect address `http://localhost:3118/callback` is in the list of the app
  page, together with a ready-to-copy `claude mcp add` command with the fixed callback port.

## 1.0.0-dev7

* Debug logging now also writes one line per request to the remote address: method, path,
  status, User-Agent, whether a token was sent and whether an `Origin` header came along, never
  the token. It shows whether claude.ai or ChatGPT reach the app after the sign-in, and what the
  app answers. A small nginx sits in front of the remote server for this, only while debug
  logging is on.

## 1.0.0-dev6

* The Claude-User check now says that it comes from your own network and only claims to be
  Claude, so a block there is a hint and not proof; the documentation explains how to read the
  firewall log for the real requests.

## 1.0.0-dev5

* Fixed: the app stopped right after start when a connection check got no answer, for example
  when the public address is blocked (`jq: invalid JSON text passed to --argjson`, exit code 2).
  The Supervisor starts services with strict shell options, in which a failing `curl` ended the
  checks. They now keep curl's exit code and answer in every case. The runtime test runs with the
  same options, so this cannot return unnoticed.

## 1.0.0-dev4

* The Claude-User check also recognises a connection that is cut off instead of answered (the
  way Cloudflare drops these requests) and compares it with an ordinary request, so the message
  says plainly that only Claude's name is blocked.

## 1.0.0-dev3

* New check for remote access: the public address is called the way Claude's servers call it
  (User-Agent `Claude-User`), because bot protection such as Cloudflare's often accepts the
  sign-in and then refuses exactly these calls, which ends in "connection failed" in claude.ai.
  The message names the cause and where to change it.
* Documentation: how to test this by hand and where to look in Cloudflare.

## 1.0.0-dev2

* The checks for remote access tell apart Gitea's own sign-in requirement (shown as fine) from a
  firewall, bot protection or access gate in front of Gitea or the app, and name Cloudflare when
  it is the one answering. Before, `REQUIRE_SIGNIN_VIEW` showed up as an error.
* New check: Gitea's sign-in addresses are announced with the public address and answer from the
  internet. A wrong `ROOT_URL` is reported with the value to set.
* Documentation: what to look at when claude.ai or ChatGPT report a failed connection after the
  Gitea sign-in.

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
