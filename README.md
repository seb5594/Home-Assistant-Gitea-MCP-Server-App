<!-- header:begin (generated from project metadata) -->
<h1 align="center">Gitea MCP-Server</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/seb5594/Home-Assistant-Gitea-MCP-Server-App/main/gitea_mcp_server/logo.png" alt="Gitea MCP-Server" width="286" height="160">
</p>

---

<p align="center">
  <a href="https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fseb5594%2FHome-Assistant-Apps"><img src="https://img.shields.io/static/v1?label=Home%20Assistant&amp;message=Add%20app%20repository&amp;color=18BCF2&amp;logo=homeassistant&amp;logoColor=white&amp;style=for-the-badge" alt="Home Assistant" height="28"></a>
  <a href="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App/releases"><img src="https://img.shields.io/static/v1?label=version&amp;message=1.0.0-dev12&amp;color=1877A5&amp;style=for-the-badge" alt="version" height="28"></a>
  <img src="https://img.shields.io/static/v1?label=image%20pulls&amp;message=40&amp;color=1877A5&amp;style=for-the-badge" alt="image pulls" height="28"><br>
  <img src="https://img.shields.io/static/v1?label=arch&amp;message=amd64%20%C2%B7%20aarch64&amp;color=157F71&amp;style=flat" alt="arch" height="20">
  <img src="https://img.shields.io/static/v1?label=stage&amp;message=experimental&amp;color=2F855A&amp;style=flat" alt="stage" height="20">
  <img src="https://img.shields.io/static/v1?label=ingress&amp;message=enabled&amp;color=7C3AED&amp;style=flat" alt="ingress" height="20">
  <img src="https://img.shields.io/static/v1?label=image%20size&amp;message=amd64%2058.3%20%C2%B7%20aarch64%2066.6%20MiB&amp;color=157F71&amp;style=flat" alt="image size" height="20"><br>
  <a href="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App/stargazers"><img src="https://img.shields.io/github/stars/seb5594/Home-Assistant-Gitea-MCP-Server-App?label=stars&amp;style=flat" alt="stars" height="20"></a>
  <a href="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App/issues"><img src="https://img.shields.io/github/issues/seb5594/Home-Assistant-Gitea-MCP-Server-App?label=issues&amp;style=flat" alt="issues" height="20"></a>
  <img src="https://img.shields.io/static/v1?label=runtime%20tests&amp;message=23%20passed&amp;color=2F855A&amp;style=flat" alt="runtime tests" height="20">
  <a href="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/seb5594/Home-Assistant-Gitea-MCP-Server-App/ci.yml?branch=main&amp;label=checks&amp;style=flat" alt="checks" height="20"></a>
  <a href="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App#license"><img src="https://img.shields.io/github/license/seb5594/Home-Assistant-Gitea-MCP-Server-App?label=license&amp;style=flat" alt="license" height="20"></a><br>
  <a href="https://paypal.me/seb5594"><img src="https://img.shields.io/static/v1?label=Support&amp;message=PayPal&amp;color=0070BA&amp;logo=paypal&amp;logoColor=white&amp;style=for-the-badge" alt="PayPal" height="40"></a>
  <a href="https://buymeacoffee.com/seb5594"><img src="https://img.shields.io/static/v1?label=Support&amp;message=Buy%20Me%20a%20Coffee&amp;color=FFDD00&amp;logo=buy-me-a-coffee&amp;logoColor=black&amp;style=for-the-badge" alt="Buy Me a Coffee" height="40"></a>
</p>
<!-- header:end -->

Brings the official [Gitea MCP server](https://gitea.com/gitea/gitea-mcp) to Home Assistant. MCP, the
Model Context Protocol, is how AI assistants use tools. With this app, Assist, claude.ai, ChatGPT,
Claude Code and other agents can search your repositories, read files, and look at or write issues
and pull requests in your own Gitea. You decide which of them you connect.

> **Pre-release.** The version is `1.0.0-dev12`: tested against a real Gitea, not yet on many
> installations. Please report what you see.

* **Minimal permissions.** No Supervisor or Home Assistant API, no folders, no Docker, no host
  network. The address of the [Gitea app by alexbelgium](https://github.com/alexbelgium/hassio-addons/tree/master/gitea)
  is already filled in; you add an access token.
* **Safe by default.** Read-only, ports closed, tool groups to choose from.
* **Every assistant has its tab.** Home Assistant (Assist), claude.ai, ChatGPT, Claude Code and any
  other MCP client: step-by-step instructions with your addresses filled in, and checks that show
  whether bot protection in front of the app turns an AI service away.
* **Local and remote.** A local address for Assist, and optional OAuth sign-in through your own Gitea
  account for AI services on the internet.
* **English and German.** The app page follows your browser, the configuration follows your Home
  Assistant language.

## Install

In Home Assistant open **Settings → Apps → App store → ⋮ → Repositories**, add
`https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App` and install **Gitea MCP-Server**.
Older versions call these *Add-ons* and *Add-on store*. Setup, remote access and troubleshooting
are in the [documentation](gitea_mcp_server/DOCS.md).

## How it fits together

```text
Home Assistant (Assist) ──► :8080  local server  ──┐  access token
                                                   ├──► Gitea
AI services ──► tunnel ──► :8081 remote server ────┘  OAuth, per user
```

Both servers are the same official binary, started with different settings. The app only wires it
into Home Assistant: it checks the connection and writes the setup guide.

## Development

```text
gitea_mcp_server/
  config.yaml, translations/    options and their labels
  rootfs/usr/lib/gitea-mcp/     shell libraries: options, checks, status
  rootfs/etc/s6-overlay/        the MCP service and the app page service
  rootfs/usr/share/gitea-mcp/   the app page (plain HTML, CSS and JavaScript)
.github/tests/runtime.sh        runs inside the built image
.github/workflows/upstream.yml  follows the releases of Gitea MCP
```

The runtime test starts a real `gitea-mcp` against a mocked Gitea and asks it for its tools over MCP.
Gitea MCP is pinned in the `Dockerfile`. A scheduled workflow follows its releases and commits the
new pin together with a new app version and changelog entry, so each upstream release becomes a
release of this app by itself; Renovate pull requests for the base image and the Alpine packages get
their version bump the same way. See `.github/scripts/upstream.py`.

<!-- support:begin (generated, shared text) -->
## Say thanks

All my projects are built in my spare time, just for the fun of it. Still, they take a lot of time and care, and many of the smart home gadgets I buy end up here because I want to make them cloud-free and smart-home ready. Every bit of support means a lot to me.

If my work helped you or turned out to be useful, show your appreciation with a hot drink for my next sleepless night.

[![PayPal](https://img.shields.io/static/v1?label=Support&message=PayPal&color=0070BA&logo=paypal&logoColor=white&style=for-the-badge)](https://paypal.me/seb5594) [![Buy Me a Coffee](https://img.shields.io/static/v1?label=Support&message=Buy%20Me%20a%20Coffee&color=FFDD00&logo=buy-me-a-coffee&logoColor=black&style=for-the-badge)](https://buymeacoffee.com/seb5594)
<!-- support:end -->

<!-- license:begin (generated from the license file) -->
## License

[![license](https://img.shields.io/static/v1?label=license&message=Apache-2.0&color=5B6770&style=flat)](LICENSE)

Published under the [Apache License 2.0](LICENSE).
<!-- license:end -->
