# Gitea MCP-Server

Lets AI assistants work with your own Gitea: search repositories, read files, and look at or
write issues, pull requests, releases and more. The app runs the official
[Gitea MCP server](https://gitea.com/gitea/gitea-mcp) and wires it into Home Assistant.

MCP, the *Model Context Protocol*, is the common language in which AI assistants discover and use
tools. Home Assistant's Assist, claude.ai, ChatGPT, Claude Code, Cursor, OpenClaw and many others
speak it. You decide which of them you connect; none is required.

**This is a pre-release (`dev` versions).** It is tested against a real Gitea, but not yet on many
installations. Expect rough edges and please report what you see.

## Contents

* [How it works](#how-it-works)
* [Quick start](#quick-start)
* [What the app can reach](#what-the-app-can-reach)
* [Options](#options)
* [Tool groups](#tool-groups)
* [Home Assistant and Assist](#home-assistant-and-assist)
* [Remote access for AI services](#remote-access-for-ai-services)
* [Connect claude.ai, ChatGPT, Claude Code and others](#connect-claudeai-chatgpt-claude-code-and-others)
* [Security](#security)
* [Troubleshooting](#troubleshooting)
* [Questions](#questions)

## How it works

The app starts up to two servers from the same official program:

| Server | Port | Sign-in | For |
| --- | --- | --- | --- |
| **Local** | 8080 | The access token from the app configuration | Home Assistant and other clients in your network |
| **Remote** (optional) | 8081 | OAuth: each person signs in to Gitea | AI services on the internet: claude.ai, ChatGPT, Claude Code and others |

Neither port is published to your network by default. Other apps and Home Assistant reach them
through Home Assistant's internal network, under the host name of this app (the *MCP address*
that the app page shows). The remote server only starts when you enter public addresses.

The app page (**Open Web UI**) is the control centre: it checks the connection, explains what is
missing in your language (English, or German when your browser prefers it), and has a tab with
step-by-step instructions for every assistant, with all values ready to copy.

## Quick start

With the Gitea app from [alexbelgium/hassio-addons](https://github.com/alexbelgium/hassio-addons/tree/master/gitea):

1. Install and start the Gitea app and sign in once.
2. In Gitea open **Settings → Applications**, generate a token and copy it. For the default
   read-only mode, **Read** for each category is enough.
3. Install this app, paste the token into **Access token** and start it.
4. Open **Open Web UI**. The Overview tab shows whether Gitea and the token work. Pick the
   assistant you want to connect and follow its tab.

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

Gitea offers around 60 tools. Voice assistants cope better with a short list, and every tool costs
tokens in each request. Pick only what you need; leave the list empty for everything.

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

## Home Assistant and Assist

Home Assistant can use this app as a source of tools for its conversation agents. Home Assistant is
the MCP client here, and the local server (port 8080) is the one it talks to.

1. **Add the integration.** Settings → Devices & services → Add integration → **Model Context
   Protocol** (the button in the *Home Assistant* tab of the app page opens it). Enter the MCP
   address from the app page: `http://<host name of this app>:8080/mcp`.
2. **Give the assistant the tools.** Open Settings → Voice assistants, select your assistant and
   open the settings of its conversation agent. Where it lists the APIs it may use (usually
   labelled *Control Home Assistant*), enable the entry that carries the name of the integration.
3. **Try it.** Ask in a chat with the assistant: *"List the open issues of owner/repository."*

What to know:

* The conversation agent must be able to use tools, which means a language model: the OpenAI,
  Anthropic, Google Generative AI or Ollama integrations, for example. The built-in Assist agent
  without a language model cannot call tools.
* The tools work with the permissions of the **access token**, for everything that is asked of the
  assistant, by anyone who can talk to it. Use a token with only the permissions you want, ideally
  from a separate Gitea account, and keep the app read-only until you trust the setup.
* Voice works better with fewer tools. Choose a few [tool groups](#tool-groups), for example
  `issue`, `pull_request` and `repository`.
* Which entities an assistant may control is a different setting (Settings → Voice assistants →
  Expose). It has no influence on these tools, and these tools cannot reach your entities.
* Home Assistant lists the tools when the integration loads. After you change the tool groups or
  read-only, restart the app and reload the integration.

Home Assistant also has an MCP server of its own that can offer these tools to agents outside; see
[Optionally through Home Assistant's own MCP server](#optionally-through-home-assistants-own-mcp-server).

## Remote access for AI services

claude.ai, ChatGPT and other online assistants run in the cloud. They cannot reach your home
network, so they connect to a public HTTPS address and sign in to Gitea with OAuth. Everyone who
connects acts with their own Gitea account and permissions, and nobody needs your access token.

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

The *Remote access* tab of the app page now runs checks on both addresses and on how AI services
are treated by whatever sits in front of the app.

### Create the OAuth application in Gitea

Gitea cannot register clients by itself, so create one application, once, for all assistants:

1. Open `https://git.example.com/user/settings/applications`.
2. Under **Manage OAuth2 Applications**, create a new application. The app page suggests the
   name *AI assistants (MCP)*.
3. Add the redirect URIs from the app page, one per line. Later you add one more for ChatGPT and
   for every other tool that shows its own callback address.
4. Leave **Confidential Client** unchecked, so the sign-in uses PKCE.
5. Save and copy the **Client ID**.

## Connect claude.ai, ChatGPT, Claude Code and others

The tabs of the app page (*Home Assistant*, *Claude Code*, *claude.ai*, *ChatGPT*, *Other agents*,
*Remote access*) show every step with your addresses filled in. In short:

### Claude Code

Claude Code signs in through a small web server on your own computer. Gitea accepts such a return
address only with its exact port (it ignores the port for `127.0.0.1`, but not for `localhost`),
so the port is fixed to `3118`, and `http://localhost:3118/callback` is among the redirect URIs.

```bash
claude mcp add --transport http gitea https://mcp.example.com/mcp --client-id <client-id> --callback-port 3118
```

Then run `/mcp` in Claude Code and sign in.

### claude.ai

**Settings → Connectors → Add custom connector.** Enter `https://mcp.example.com/mcp`, open the
advanced settings and paste the client ID; leave the secret empty. Claude opens a Gitea sign-in;
after you approve, the tools are available in your chats.

### ChatGPT

Custom MCP connectors belong to ChatGPT's developer mode, which OpenAI offers for some plans, and
its menus keep moving. Switch developer mode on (in the settings under *Connectors → Advanced*),
create a connector with OAuth and the address `https://mcp.example.com/mcp`.

ChatGPT now shows a callback address of its own, like
`https://chatgpt.com/connector/oauth/<random value>`. It is different for every connector. Add it
to the redirect URIs of the Gitea application, enter the client ID and create the connector.
Without that step Gitea answers *Unregistered Redirect URI*.

### Other agents (Cursor, OpenClaw, Codex, your own scripts …)

Anything that speaks MCP over HTTP can use the app. The address depends on where the agent runs:

| Where the agent runs | Address | What to do |
| --- | --- | --- |
| **As an app on Home Assistant OS** | `http://<host name of this app>:8080/mcp`, for example `http://4c7fee11-gitea-mcp-server:8080/mcp` | Nothing: apps reach each other by host name on Home Assistant's internal network. The app page shows the exact address. |
| **On another machine in your network** | `http://<IP address or local host name of Home Assistant>:8080/mcp`, for example `http://homeassistant.local:8080/mcp` | Publish port 8080 under *Network* in the configuration of this app. |
| **On the internet** | `https://mcp.example.com/mcp` (the public address) | Set up [remote access](#remote-access-for-ai-services). The tool must accept a client ID and show a callback address, which you add to the redirect URIs of the Gitea application. |

The first two use the access token of the app. Anyone who can reach the port acts with its permissions,
so publish port 8080 only in a network you trust. Most tools take a configuration like
`{"mcpServers": {"gitea": {"url": "http://<host name>:8080/mcp"}}}`. The third way needs no token: every
user signs in to Gitea.

### Optionally through Home Assistant's own MCP server

Home Assistant has an **MCP Server** integration of its own. According to its
[documentation](https://www.home-assistant.io/integrations/mcp_server/):

* Add it under Settings → Devices & services → Add integration → **MCP Server**.
* It runs on the port of Home Assistant itself (8123) at the path `/api/mcp`, for example
  `http://homeassistant.local:8123/api/mcp`. Cloud agents need Home Assistant reachable from the
  internet over HTTPS; Claude Code requires HTTPS.
* Sign-in is OAuth with a Home Assistant account (PKCE, no client secret). *Require an administrator
  account* is on by default.
* It offers the tools of Home Assistant's LLM APIs. *Expose all LLM APIs* is on by default; switch it
  off to choose the APIs under *Control Home Assistant*.

The Model Context Protocol integration, which you add to use this app with Assist, registers this app
as one such LLM API. So the Gitea tools should come along through Home Assistant's address. That follows
Home Assistant's documentation and source; it has not been tested with this app.

The trade-offs: every Gitea action runs with the one access token of this app, not with the permissions
of whoever asks, and Home Assistant itself becomes the public address. This app's own remote server
keeps Home Assistant out of it and uses the Gitea account of each person.

### How the remote server behaves

* **Read-only** and **Tool groups** apply to the remote server as well. Read-only also asks Gitea
  for read permissions only during sign-in.
* The token in **Access token** is not used for remote connections.
* Both servers run side by side: Home Assistant through the local address, the AI services
  through the public one.

## Security

* The **local address (port 8080) has no sign-in of its own.** Whoever reaches it acts with your
  access token. That is why the port is closed by default and the app is read-only by default.
  Publish port 8080 only in a network you trust, and never to the internet. Use the remote server
  for that.
* Give the access token only the permissions you want to allow. With **Read-only** on, a token
  with read permissions is enough.
* The remote server needs no token of yours: every user signs in to Gitea. Keep read-only on
  unless you want assistants to change things.
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
| *Gitea asks for a sign-in before it shows anything* | Not a problem. Gitea runs with `REQUIRE_SIGNIN_VIEW`, and the sign-in of the AI services works with it. |
| *Unregistered Redirect URI* when signing in | The callback address of the tool is not among the redirect URIs of the Gitea application. ChatGPT's changes with every connector. Copy it exactly. |
| An assistant shows an error while signing in | The redirect URI is missing, or Gitea is not reachable from the internet. |
| The assistant says the connection failed after the Gitea window | See below. |

### Connection failed after signing in

The Gitea window is your browser talking to Gitea. After it, servers of the AI service take over,
and they introduce themselves differently. Claude, for example, signs in with one HTTP client and
then calls this app with another that calls itself `Claude-User`; Claude Code calls itself
`claude-code/<version>`. Bot protection in front of the app often lets the sign-in through and
then refuses exactly one of these names, so the sign-in looks fine and the connection still
fails.

The *test requests* on the tab *Remote access* make calls that only claim to come from the services
(`Claude-User`, `python-httpx`, `ChatGPT-User`, `claude-code/<version>`), one name after the other, and
show which one is turned away. You can also try it yourself:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -A "Claude-User" -X POST https://mcp.example.com/mcp \
  -H "Content-Type: application/json" -d '{}'
```

This call comes from your own network and only claims to be Claude. Bot protection such as
Cloudflare's often lets the real service in by its address and turns look-alikes away, so ChatGPT, for
example, can be refused in the test and still connect without a problem. A block here is a hint, not proof:
if your connector works, ignore it. The security log of the firewall shows what the real requests got.

`401` is right: the request reached the app and was asked to sign in. `403`, a web page, or a cut
connection (`HTTP/2 stream … PROTOCOL_ERROR`, `Empty reply`) means something in front of it stops
the request. Run it once more with `-A "curl/8.5.0"`: if that one returns `401`, the block is about
the name the service uses.

With **Cloudflare**, look at these places for both host names (Gitea and this app):

* *Security → Settings*: bot protection (*Bot Fight Mode*, *Block AI bots*).
* *AI Crawl Control*: it has a setting for each crawler. `Claude-User` is a separate entry from
  `ClaudeBot` and may be listed under another category (assistant instead of crawler), so clear
  any filter and search for it. The same applies to the OpenAI entries for ChatGPT.
* *Security → Events*: blocked requests show up here right after a failed attempt.
* A WAF rule that skips other rules does not necessarily switch these settings off. Allow the
  agent in the setting itself, or turn the setting off for the two host names.

Anthropic publishes the [address ranges](https://platform.claude.com/docs/en/api/ip-addresses) of
its servers, OpenAI does the same for [ChatGPT](https://openai.com/chatgpt-user.json), if you
prefer to allow by address. Other causes of the same symptom are a proxy or firewall with geo
blocking or rate limits, and a `ROOT_URL` in Gitea that points to an internal address.

To see whether calls reach the app at all, switch on **Debug logging** and try again. The log then
has one line per request to the remote address, for example
`request: POST /mcp -> 401 … agent="Claude-User" auth=token-sent`. No line means the call never
arrived; `403` and `421` are answers of the app itself (a request with an `Origin` header, or with
a different `Host` than `public_url`).

## Questions

**Do I need the remote server?** Only for assistants on the internet (claude.ai, ChatGPT, online
agents). Home Assistant and tools in your network use the local server.

**Can I connect only one assistant?** Yes. Every tab of the app page is independent; the
OAuth application in Gitea is shared and created once.

**Which language does the configuration use?** English by default. Home Assistant shows the
German texts when your profile language is German; the app page follows your browser the same way.

**Why can't it find my Gitea by itself?** Detecting other apps needs access to the Supervisor, which
this app does not ask for. The default address matches the Gitea app of alexbelgium; any other
address goes into `gitea_url`.

**Is anything sent to third parties?** Only what the assistants you connect ask for, to the
services you connected. The app itself talks to your Gitea only.

## Credits

The server is the official [Gitea MCP server](https://gitea.com/gitea/gitea-mcp) (MIT license),
used unchanged. This app only wires it into Home Assistant. See `THIRD_PARTY_NOTICES.md`.
