# Gitea MCP Server

Runs the official [Gitea MCP server](https://gitea.com/gitea/gitea-mcp) inside Home Assistant.
MCP, the Model Context Protocol, is how AI assistants use tools. With this app, Assist, Claude
and ChatGPT can search your repositories, read files, and look at or write issues and pull
requests in your own Gitea.

**This is a pre-release (`dev` versions).** It is tested against a real Gitea, but not yet
on many installations. Expect rough edges, and please report what you see.

## Quick start

Using the Gitea app from [alexbelgium/hassio-addons](https://github.com/alexbelgium/hassio-addons/tree/master/gitea):

1. Install and start the Gitea app, and sign in once.
2. In Gitea open **Settings → Applications**, generate a token and copy it. For the default
   read-only mode, **Read** for each category is enough.
3. Install this app, paste the token into **Access token** and start it.
4. Open **Open Web UI**. The page shows whether Gitea and the token work, and the address to
   enter in Home Assistant.

The Gitea app is found automatically; there is nothing to type besides the token. With any other
Gitea, enter its address in **Gitea address**.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `gitea_url` | empty | Address of your Gitea, for example `http://homeassistant.local:3000`. Empty: use the Gitea app next to this one. |
| `access_token` | empty | Personal access token of your Gitea account. Local clients such as Home Assistant act with its permissions. |
| `read_only` | on | Hides every tool that creates or changes something. |
| `toolsets` | all | Groups of tools to offer, see [Toolsets](#toolsets). |
| `remote_access.public_url` | empty | Public HTTPS address of this app for claude.ai and ChatGPT, see [Remote access](#claudeai-and-chatgpt). |
| `remote_access.gitea_public_url` | empty | Public HTTPS address of your Gitea. Empty when `gitea_url` is already public. |
| `advanced.ca_certificate` | empty | PEM file in `/ssl` of the certificate authority that signed your Gitea certificate. |
| `advanced.ignore_certificate_errors` | off | Accept any certificate. Prefer `ca_certificate`. |
| `advanced.debug_logging` | off | Log every request sent to Gitea. The log can then contain private data. |

Invalid values do not stop the app. It keeps running, says what is wrong in the log and on the
app page, and starts whatever is configured correctly.

### Which Gitea apps are found automatically

| App | Slug | Address used |
| --- | --- | --- |
| [Gitea (alexbelgium)](https://github.com/alexbelgium/hassio-addons/tree/master/gitea) | `db21ed7f_gitea` | `http://db21ed7f-gitea:3000`, or `https://` when its `ssl` option is on |
| The same app as local app | `local_gitea` | `http://local-gitea:3000` |

If the Gitea app uses SSL, its certificate belongs to your public domain and not to the
internal host name, so the certificate is not checked for this connection inside Home Assistant.

## Toolsets

Gitea offers around 60 tools. Voice assistants cope better with a short list, and every tool
costs tokens in each request. Pick only what you need; leave the list empty for everything.

| Toolset | For |
| --- | --- |
| `repository` | Find, create and fork repositories |
| `file` | Read files and folders, create, change and delete files |
| `branch`, `tag`, `commit`, `release` | Branches, tags, commit history and comparisons, releases |
| `issue`, `label`, `milestone` | Issues with comments and attachments, labels, milestones |
| `pull_request` | Pull requests, reviews and merging |
| `actions` | Workflow runs and Actions settings |
| `search` | Search repositories, issues, users |
| `wiki`, `project`, `packages`, `timetracking` | Wikis, project boards, package registry, time tracking |
| `notification`, `user`, `version` | Your notifications, your account and organisations, server version |

With **Read-only** on, the write tools of the chosen toolsets stay hidden.

## Home Assistant

1. **Settings → Devices & services → Add integration → Model Context Protocol** (the button on
   the app page opens it directly).
2. Enter the address from the app page, `http://<app host name>:8080/mcp`.
3. In the settings of your Assist conversation agent, select the new integration as a source of
   tools. Home Assistant lists the tools and lets the agent use them.

Port 8080 is not published to your network by default. Home Assistant reaches the app through
the internal Home Assistant network. Publish the port under **Network** only for a client
outside Home Assistant; read [Security](#security) first.

## claude.ai and ChatGPT

Both services run in the cloud, so they connect to your server over the internet, over HTTPS,
and they sign you in to Gitea with OAuth instead of using your token. Everyone who connects acts
with their own Gitea account and permissions.

You need:

* a public HTTPS address for this app, for example `https://mcp.example.com`
* a public HTTPS address for Gitea, for example `https://git.example.com`. Gitea itself takes
  part in the sign-in, so it has to be reachable from the internet as well.

### Publish the app

Any tunnel or reverse proxy works. With the **Cloudflared** app, add hostnames to its
`additional_hosts`:

```yaml
additional_hosts:
  - hostname: mcp.example.com
    service: http://<app host name>:8081
  - hostname: git.example.com
    service: http://db21ed7f-gitea:3000
```

The host name of this app is shown next to the address on the app page. With another reverse
proxy, forward to port 8081 of this app and pass the `Host` header on unchanged; the server
answers only to the address you configure.

Then fill in the **Remote access** section of this app and restart it:

```yaml
remote_access:
  public_url: https://mcp.example.com
  gitea_public_url: https://git.example.com
```

The app page now shows two checks, whether both public addresses answer, and every value needed
below, each with a copy button.

### Create the OAuth application in Gitea

Gitea cannot register clients by itself, so create one application, once, for all services:

1. Open `https://git.example.com/user/settings/applications`.
2. Under **Manage OAuth2 Applications**, create a new application. Name it as you like.
3. Add the redirect URIs from the app page, one per line.
4. Leave **Confidential Client** unchecked, so the sign-in uses PKCE.
5. Save and copy the **Client ID**.

### Connect claude.ai

Open **Settings → Connectors → Add custom connector**. Enter `https://mcp.example.com/mcp`, open
**Advanced settings** and paste the client ID. Leave the client secret empty. Claude opens a
Gitea sign-in; after you approve, the Gitea tools are available in your chats.

### Connect ChatGPT

Custom MCP connectors are part of ChatGPT's developer mode, which OpenAI has been rolling out in
stages by plan and platform, and its menus keep moving. Check that your plan offers it. Then
switch developer mode on and create a connector with OAuth and the address
`https://mcp.example.com/mcp`. Choose a user-defined OAuth client and enter the client ID.

ChatGPT shows a callback address of its own for the connector. Add it to the redirect URIs of
the Gitea application, then connect. If ChatGPT insists on a client secret, create a second
OAuth application in Gitea with **Confidential Client** checked and use its ID and secret.

### How the remote mode behaves

* **Read-only** and **Toolsets** apply to the remote connection as well. Read-only also asks
  Gitea for read permissions only during sign-in.
* The token in **Access token** is not used for remote connections.
* Both ways can run side by side: Home Assistant through the local address, claude.ai and
  ChatGPT through the public one.

## Security

* The **local address (port 8080) has no sign-in of its own.** Whoever reaches it acts with your
  access token. That is why the port is closed by default and the app is read-only by default.
  Publish port 8080 only in a network you trust, and never to the internet. Use the remote mode
  for that.
* Give the access token only the permissions you want to allow. With **Read-only** on, a token
  with read permissions is enough.
* The remote mode needs no token of yours: every user signs in to Gitea. Keep read-only on
  unless you want assistants to change things.
* Debug logging prints every request sent to Gitea. Switch it off after troubleshooting.

## Troubleshooting

Open the app page and press **Check again**; it shows what the app sees. The log has the same
messages.

| Message | What to do |
| --- | --- |
| *No Gitea was found* | Install the Gitea app, or enter `gitea_url`. |
| *the connection was refused (is the app started?)* | Start the Gitea app, or check the address and port in `gitea_url`. |
| *the TLS certificate is not trusted* | Set `advanced.ca_certificate` to your certificate authority file in `/ssl`. As a last resort, ignore certificate errors. |
| *Gitea does not accept this access token* | The token was deleted or typed wrongly. Create a new one. |
| *No access token set* | Only public data is readable. Create a token in Gitea. |
| *remote_access.public_url must look like https://…* | HTTPS only, no path, for example `https://mcp.example.com`. |
| *The public address answers, but not with this app* | The tunnel or proxy points at the wrong place. It has to forward to port 8081 of this app. |
| *The public address does not answer* | The tunnel is down, DNS is missing, or your router does not loop requests back. If the connector works from outside, ignore this. |
| claude.ai or ChatGPT shows an error while signing in | The redirect URI is missing in the Gitea application, or Gitea is not reachable from the internet. |

## Credits

The server is the official [Gitea MCP server](https://gitea.com/gitea/gitea-mcp) (MIT license),
used unchanged. This app only wires it into Home Assistant. See `THIRD_PARTY_NOTICES.md`.
