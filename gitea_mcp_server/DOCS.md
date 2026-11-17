# Gitea MCP-Server

This app runs the official [Gitea MCP server](https://gitea.com/gitea/gitea-mcp) in Home Assistant.
MCP clients can use it to work with repositories, files, issues, pull requests and releases in your Gitea instance.

## Contents

* [How it works](#how-it-works)
* [Quick start](#quick-start)
* [What the app can reach](#what-the-app-can-reach)
* [Options](#options)
* [Tool groups](#tool-groups)
* [Home Assistant](#home-assistant)
* [Remote access](#remote-access)
* [Connect MCP clients](#connect-mcp-clients)
* [Security](#security)
* [Troubleshooting](#troubleshooting)
* [Questions](#questions)

## How it works

The app starts up to two servers from the same official program:

| Server | Port | Sign-in | For |
| --- | --- | --- | --- |
| **Local** | 8080 | The access token from the app configuration | Home Assistant and other clients in your network |
| **Remote** (optional) | 8081 | OAuth: each person signs in to Gitea | MCP clients outside your local network |

Neither port is published to your network by default. Other apps and Home Assistant reach them
through Home Assistant's internal network, under the host name of this app (the *MCP address*
that the app page shows). The remote server only starts when you enter public addresses.

The app page (**Open Web UI**) is the control centre: it checks the connection, explains what is
missing in your language (English, or German when your browser prefers it), and has a tab with
setup instructions with the MCP addresses ready to copy.

## Quick start

With the Gitea app from [alexbelgium/hassio-addons](https://github.com/alexbelgium/hassio-addons/tree/master/gitea):

1. Install and start the Gitea app and sign in once.
2. In Gitea open **Settings → Applications**, generate a token and copy it. For the default
   read-only mode, **Read** for each category is enough.
3. Install this app, paste the token into **Access token** and start it.
4. Open **Open Web UI**. The Overview tab shows whether Gitea and the token work. The Home Assistant and MCP clients tabs show the connection details.

The address of the Gitea app, `http://db21ed7f-gitea:3000`, is already filled in. For another
Gitea, change **Gitea address**.

## What the app can reach

The app is deliberately small and runs with the lowest permissions Home Assistant offers:

* **No access to the Supervisor or Home Assistant APIs**, so it cannot see or change your apps,
  entities or settings.
* **No access to your files:** none of the Home Assistant folders (`config`, `share`, `ssl` …) is
  mounted.
* **No Docker access, no host network, no extra privileges.**
* **Network:** it connects to your Gitea (and nothing else on its own). Like every app it sits on
  Home Assistant's internal network, so other apps can connect to its ports.

That is also why there is no automatic detection of the Gitea app and no option for a custom
certificate authority file: both would need one of the permissions above. The address of the
Gitea app is the default instead, and a self-signed certificate is handled by *Ignore
certificate errors* (only for a Gitea inside your own network).

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `gitea_url` | `http://db21ed7f-gitea:3000` | Address of your Gitea. Another app: `http://<host name>:3000`; another machine: `https://git.example.com`. |
| `access_token` | empty | Personal access token of your Gitea account. The local server and every client that uses it act with its permissions. |
| `read_only` | on | Hides every tool that creates or changes something, for both servers. |
| `toolsets` | all | Groups of tools to offer, see [Tool groups](#tool-groups). |
| `remote_access.public_url` | empty | Public HTTPS address of this app, for example `https://mcp.example.com`. Switches the remote server on. |
| `remote_access.gitea_public_url` | empty | Public HTTPS address of your Gitea. Empty when `gitea_url` is already an HTTPS address. |
| `advanced.ignore_certificate_errors` | off | Accept any certificate of Gitea. Only for a Gitea in your own network. |
| `advanced.debug_logging` | off | Log every request sent to Gitea and one line for each request to the remote address (method, path, status, User-Agent, whether a token was sent; never the token). The log can then contain private data. |

Invalid values do not stop the app. It keeps running, says what is wrong in the log and on the
app page, and starts whatever is configured correctly.

## Tool groups

Choose the tool groups your clients need. Leave the list empty to enable all groups.

| Group | For |
| --- | --- |
| `repository` | Find, create and fork repositories |
| `file` | Read files and folders; create, change and delete files |
| `branch`, `tag`, `commit`, `release` | Branches, tags, commit history and comparisons, releases |
| `issue`, `label`, `milestone` | Issues with comments and attachments, labels, milestones |
| `pull_request` | Pull requests, reviews and merging |
| `actions` | Workflow runs and Actions settings (the Gitea Runner app runs them) |
| `search` | Search repositories, issues and users |
| `wiki`, `project`, `packages`, `timetracking` | Wikis, project boards, package registry, time tracking |
| `notification`, `user`, `version` | Your notifications, your account and organisations, the server version |

With **Read-only** on, the write tools of the chosen groups stay hidden.

## Home Assistant

1. Open **Settings → Devices & services → Add integration → Model Context Protocol**. The
   **Home Assistant** tab in the app links directly to the integration setup.
2. Enter the local MCP address shown in the app, for example
   `http://<host name of this app>:8080/mcp`.
3. Enable the integration under **Control Home Assistant** where you want to use its tools.
   If you change read-only mode or tool groups, restart the app and reload the integration.

## Remote access

Remote clients connect to the app over HTTPS. Each user signs in to Gitea with OAuth and uses
the permissions of their own account.

You need:

* a public HTTPS address for this app, for example `https://mcp.example.com`;
* a public HTTPS address for Gitea, for example `https://git.example.com`. Gitea takes part in the
  sign-in, so it has to be reachable from the internet as well, and its `ROOT_URL` has to be that
  address.

### Publish the app

Any tunnel or reverse proxy works. With the **Cloudflared** app, add hostnames to its
`additional_hosts`:

```yaml
additional_hosts:
  - hostname: mcp.example.com
    service: http://<host name of this app>:8081
  - hostname: git.example.com
    service: http://db21ed7f-gitea:3000
```

With another reverse proxy, forward to port 8081 of this app and pass the `Host` header on
unchanged; the server answers only to the address you configure.

Then fill in the **Remote access** section of the configuration and restart the app:

```yaml
remote_access:
  public_url: https://mcp.example.com
  gitea_public_url: https://git.example.com
```

The **Remote access** tab checks the public MCP and Gitea addresses and their OAuth endpoints.

### Create the OAuth application in Gitea

1. In Gitea, open **Settings → Applications → Manage OAuth2 Applications**.
2. Create an application named **Gitea MCP**. Leave **Confidential Client** unchecked to use PKCE.
3. Add the callback URL shown by your MCP client to the application's redirect URIs.
4. Save and enter the **Client ID** in the MCP client.

## Connect MCP clients

Use a client that supports MCP over HTTP.

| Where the client runs | Address | What to do |
| --- | --- | --- |
| **As an app on Home Assistant OS** | `http://<host name of this app>:8080/mcp`, for example `http://4c7fee11-gitea-mcp-server:8080/mcp` | Nothing: apps reach each other by host name on Home Assistant's internal network. The app page shows the exact address. |
| **On another machine in your network** | `http://<IP address or local host name of Home Assistant>:8080/mcp`, for example `http://homeassistant.local:8080/mcp` | Publish port 8080 under *Network* in the configuration of this app. |
| **On the internet** | `https://mcp.example.com/mcp` (the public address) | Set up [remote access](#remote-access). The tool must accept a client ID and show a callback address, which you add to the redirect URIs of the Gitea application. |

The first two use the access token of the app. Anyone who can reach the port acts with its permissions,
so publish port 8080 only in a network you trust. Most tools take a configuration like
`{"mcpServers": {"gitea": {"url": "http://<host name>:8080/mcp"}}}`. The third way needs no token: every
user signs in to Gitea.

### Optionally through Home Assistant's own MCP server

Home Assistant has an **MCP Server** integration of its own. According to its
[documentation](https://www.home-assistant.io/integrations/mcp_server/):

* Add it under Settings → Devices & services → Add integration → **MCP Server**.
* The endpoint is `http://homeassistant.local:8123/api/mcp`. Use HTTPS if clients connect over the internet.
* Clients sign in with a Home Assistant account through OAuth with PKCE.
* Gitea requests through this integration use the access token configured in the app.

### How the remote server behaves

* **Read-only** and **Tool groups** apply to the remote server as well. Read-only also asks Gitea
  for read permissions only during sign-in.
* The token in **Access token** is not used for remote connections.
* Both servers can run at the same time.

## Security

* The **local address (port 8080) has no sign-in of its own.** Whoever reaches it acts with your
  access token. That is why the port is closed by default and the app is read-only by default.
  Publish port 8080 only in a network you trust, and never to the internet. Use the remote server
  for that.
* Give the access token only the permissions you want to allow. With **Read-only** on, a token
  with read permissions is enough.
* The remote server needs no token of yours: every user signs in to Gitea. Keep read-only on
  unless clients need to make changes.
* Opening the remote server opens your Gitea sign-in to the internet. Use HTTPS only, keep Gitea
  up to date and decide who may register.
* Debug logging prints every request sent to Gitea. Switch it off after troubleshooting.

## Troubleshooting

Open the app page and press **Check again**; it shows what the app sees. The log has the same
messages.

| Message | What to do |
| --- | --- |
| *the connection was refused (is the app started?)* | Start the Gitea app, or check the address and port in `gitea_url`. |
| *the TLS certificate is not trusted* | Use the `http://` address of the Gitea app inside Home Assistant, or switch on `ignore_certificate_errors` for a Gitea in your own network. |
| *Gitea does not accept this access token* | The token was deleted or typed wrongly. Create a new one. |
| *No access token yet* | Only public data is readable. Create a token in Gitea. |
| *remote_access.public_url must look like https://…* | HTTPS only, no path, for example `https://mcp.example.com`. |
| *The public address answers, but not with this app* | The tunnel or proxy points at the wrong place. It has to forward to port 8081 of this app. |
| *The public address does not answer* | The tunnel is down, DNS is missing, or your router does not loop requests back. If the connector works from outside, ignore this. |
| *refuses the request (HTTP 403)*, *Cloudflare refuses…* | Something in front of Gitea or of this app turns away requests that do not come from a person in a browser. See [Connection failed after signing in](#connection-failed-after-signing-in). |
| *Gitea announces its sign-in at …* | Gitea builds its sign-in addresses from `ROOT_URL`. Set it to your public Gitea address, with a trailing slash. In the Gitea app this is the `ROOT_URL` option. |
| *Gitea asks for a sign-in before it shows anything* | Gitea has `REQUIRE_SIGNIN_VIEW` enabled and still supports OAuth sign-in. |
| *Unregistered Redirect URI* when signing in | Copy the client's exact callback address into the Gitea application's redirect URIs. |
| A client shows an error while signing in | The redirect URI is missing, or Gitea is not reachable from the internet. |
| The client says the connection failed after the Gitea window | See below. |

### Connection failed after signing in

Check the tunnel or reverse proxy and firewall logs for requests to both public host names.
Turn on **Debug logging** and try again to see requests that reach the app. The log records the
method, path, response status and User-Agent.

If the app returns `403` or `421`, check the request's `Origin` and `Host` headers. The host must
match `remote_access.public_url`. The callback URL in the OAuth application must match the
one the client sends.

## Questions

**Do I need the remote server?** Only for clients outside your network. Home Assistant and
other local clients use the local endpoint.

**Which language does the configuration use?** English by default. Home Assistant shows the
German texts when your profile language is German; the app page follows your browser the same way.

**Why can't it find my Gitea by itself?** Detecting other apps needs access to the Supervisor, which
this app does not ask for. The default address matches the Gitea app of alexbelgium; any other
address goes into `gitea_url`.

## Credits

The server is the official [Gitea MCP server](https://gitea.com/gitea/gitea-mcp) (MIT license),
used unchanged. This app only wires it into Home Assistant. See `THIRD_PARTY_NOTICES.md`.
