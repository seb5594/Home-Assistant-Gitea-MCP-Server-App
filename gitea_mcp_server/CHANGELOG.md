# Changelog

## 1.13.0

* Use the Gitea MCP version as the Home Assistant app version.
* Publish the app as a stable release.
* Document local MCP and remote OAuth setup with client-neutral instructions.

## 1.0.0-alpha.12

* 📦 Update gitea/gitea-mcp-server to 1.13.0 (was 1.12.0).

## 1.0.0-alpha.11

* Update the base image and packaged dependencies to available release versions; restore reproducible CI builds.

## 1.0.0-alpha.10

* Update release and badge version labels.

## 1.0.0-dev14

* Dependencies: update alpine base and packages (base image 3.24-2026.10.1, curl 8.23.0-r0).

## 1.0.0-dev13

* Update the app page and document addresses for local and remote MCP clients.
* The official Gitea logo with the name of the app as icon and logo. The license is MIT.

## 1.0.0-dev12

* The app is now called "Gitea MCP-Server".
* Fix the app stopping at start with "GM_LOCAL_INSECURE: unbound variable" (dev10 and dev11).

## 1.0.0-dev11

* The app page no longer shows an empty version when Gitea hides it from visitors without a token.

## 1.0.0-dev10

* **Less access.** The app no longer asks for the Supervisor API or the `ssl` folder. It cannot see
  your other apps, entities or files. The address of the Gitea app (`http://db21ed7f-gitea:3000`) is
  the default of `gitea_url` instead of being detected. The option `advanced.ca_certificate` is gone;
  use `ignore_certificate_errors` for a self-signed Gitea in your own network.
* Add a new app page with connection status, local and remote setup, and copyable addresses.
* Expand documentation for tool groups, security and Home Assistant.

## 1.0.0-dev9

* "Open app configuration" on the app page now opens the configuration of this app (it used a
  short name that only works for apps from the local folder).
* Messages whose values start with a dash no longer break the checks.
* New releases of Gitea MCP are followed by a scheduled workflow, which raises the app version.

## 1.0.0-dev8

* The app page is fully translated: the messages of the checks and the configuration problems
  now come as codes and are shown in German when the browser prefers German, otherwise in
  English. The log stays in English.

## 1.0.0-dev7

* Debug logging now also writes one line per request to the remote address: method, path,
  status, User-Agent, whether a token was sent and whether an `Origin` header came along, never
  the token. A small nginx sits in front of the remote server while debug logging is on.

## 1.0.0-dev6

* Clarify how to interpret remote connectivity checks.

## 1.0.0-dev5

* Fixed: the app stopped right after start when a connection check got no answer, for example
  when the public address is blocked (`jq: invalid JSON text passed to --argjson`, exit code 2).
  The Supervisor starts services with strict shell options, in which a failing `curl` ended the
  checks. They now keep curl's exit code and answer in every case. The runtime test runs with the
  same options, so this cannot return unnoticed.

## 1.0.0-dev4

* Report connections that are cut off before an HTTP response.

## 1.0.0-dev3

* Add remote connectivity checks and troubleshooting instructions.

## 1.0.0-dev2

* The checks for remote access tell apart Gitea's own sign-in requirement (shown as fine) from a
  firewall, bot protection or access gate in front of Gitea or the app, and name Cloudflare when
  it is the one answering. Before, `REQUIRE_SIGNIN_VIEW` showed up as an error.
* New check: Gitea's sign-in addresses are announced with the public address and answer from the
  internet. A wrong `ROOT_URL` is reported with the value to set.

## 1.0.0-dev1

* Runs the official Gitea MCP server (1.11.0) as a Home Assistant app, over HTTP at `/mcp`.
* Finds the Gitea app of alexbelgium by itself; any other Gitea is set with `gitea_url`.
* Read-only by default, with a choice of toolsets.
* Optional remote access with Gitea OAuth and connection checks in the app page.
* App page (Open Web UI) with connection checks, copy buttons and a button that adds the
  integration to Home Assistant. English and German.
* Configuration problems no longer stop the app; they are shown in the log and on the app page.
