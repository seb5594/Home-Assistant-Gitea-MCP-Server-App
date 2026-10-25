<!-- header:begin (generated from project metadata) -->
<h1 align="center">Gitea MCP Server</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/seb5594/Home-Assistant-Gitea-MCP-Server-App/main/gitea_mcp_server/logo.png" alt="Gitea MCP Server" width="286" height="160">
</p>

---

<p align="center">
  <a href="https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fseb5594%2FHome-Assistant-Apps"><img src="https://img.shields.io/static/v1?label=Home%20Assistant&amp;message=Add%20app%20repository&amp;color=18BCF2&amp;logo=homeassistant&amp;logoColor=white&amp;style=for-the-badge" alt="Home Assistant" height="28"></a>
  <a href="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App/releases/tag/v1.0.0-dev6"><img src="https://img.shields.io/static/v1?label=version&amp;message=1.0.0-dev6&amp;color=1877A5&amp;style=for-the-badge" alt="version" height="28"></a>
  <img src="https://img.shields.io/static/v1?label=image%20pulls&amp;message=24&amp;color=1877A5&amp;style=for-the-badge" alt="image pulls" height="28"><br>
  <img src="https://img.shields.io/static/v1?label=arch&amp;message=amd64%20%C2%B7%20aarch64&amp;color=157F71&amp;style=flat" alt="arch" height="20">
  <img src="https://img.shields.io/static/v1?label=stage&amp;message=experimental&amp;color=2F855A&amp;style=flat" alt="stage" height="20">
  <img src="https://img.shields.io/static/v1?label=ingress&amp;message=enabled&amp;color=7C3AED&amp;style=flat" alt="ingress" height="20">
  <img src="https://img.shields.io/static/v1?label=mounts%20%28read-only%29&amp;message=ssl&amp;color=157F71&amp;style=flat" alt="mounts (read-only)" height="20">
  <img src="https://img.shields.io/static/v1?label=image%20size&amp;message=amd64%2056.4%20%C2%B7%20aarch64%2064.5%20MiB&amp;color=157F71&amp;style=flat" alt="image size" height="20"><br>
  <a href="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App/issues"><img src="https://img.shields.io/github/issues/seb5594/Home-Assistant-Gitea-MCP-Server-App?label=issues&amp;style=flat" alt="issues" height="20"></a>
  <img src="https://img.shields.io/static/v1?label=runtime%20tests&amp;message=22%20passed&amp;color=2F855A&amp;style=flat" alt="runtime tests" height="20">
  <a href="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/seb5594/Home-Assistant-Gitea-MCP-Server-App/ci.yml?branch=main&amp;label=checks&amp;style=flat" alt="checks" height="20"></a>
  <a href="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App#license"><img src="https://img.shields.io/github/license/seb5594/Home-Assistant-Gitea-MCP-Server-App?label=license&amp;style=flat" alt="license" height="20"></a><br>
  <a href="https://paypal.me/seb5594"><img src="https://img.shields.io/static/v1?label=Support&amp;message=PayPal&amp;color=0070BA&amp;logo=paypal&amp;logoColor=white&amp;style=for-the-badge" alt="PayPal" height="40"></a>
  <a href="https://buymeacoffee.com/seb5594"><img src="https://img.shields.io/static/v1?label=Support&amp;message=Buy%20Me%20a%20Coffee&amp;color=FFDD00&amp;logo=buy-me-a-coffee&amp;logoColor=black&amp;style=for-the-badge" alt="Buy Me a Coffee" height="40"></a>
</p>
<!-- header:end -->

Brings the official [Gitea MCP server](https://gitea.com/gitea/gitea-mcp) to Home Assistant. MCP, the
Model Context Protocol, is how AI assistants use tools. With this app, Assist, Claude and ChatGPT can
search your repositories, read files, and look at or write issues and pull requests in your own Gitea.

> **Pre-release.** The version is `1.0.0-dev1`: tested against a real Gitea, not yet on many
> installations. Please report what you see.

* **Finds your Gitea.** The [Gitea app by alexbelgium](https://github.com/alexbelgium/hassio-addons/tree/master/gitea)
  is detected automatically; for any other Gitea, enter its address. You only add an access token.
* **Safe by default.** Read-only, port closed, tool groups to choose from.
* **Home Assistant, Claude and ChatGPT.** A local address for Assist, and optional OAuth sign-in
  through your own Gitea account for claude.ai and ChatGPT.
* **Guided.** The app page checks the connection, shows every value to copy, and links straight to
  the Home Assistant integration. English and German.

## Install

In Home Assistant open **Settings → Apps → App store → ⋮ → Repositories**, add
`https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App` and install **Gitea MCP Server**.
Older versions call these *Add-ons* and *Add-on store*. Setup, remote access and troubleshooting
are in the [documentation](gitea_mcp_server/DOCS.md).

## How it fits together

```text
Home Assistant (Assist) ──► :8080  local server  ──┐  access token
                                                   ├──► Gitea
claude.ai / ChatGPT ──► tunnel ──► :8081 remote ───┘  OAuth, per user
```

Both servers are the same official binary, started with different settings. The app only wires it
into Home Assistant: it finds Gitea, checks the connection, and writes the setup guide.

## Development

```text
gitea_mcp_server/
  config.yaml, translations/    options and their labels
  rootfs/usr/lib/gitea-mcp/     shell libraries: options, Gitea app lookup, checks, status
  rootfs/etc/s6-overlay/        the MCP service and the app page service
  rootfs/usr/share/gitea-mcp/   the app page (plain HTML, CSS and JavaScript)
.github/tests/runtime.sh        runs inside the built image
```

The runtime test starts a real `gitea-mcp` against a mocked Gitea and Supervisor and asks it for its
tools over MCP. Gitea MCP is pinned in the `Dockerfile` and kept current by Renovate.

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
