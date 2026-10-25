# Changelog

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
