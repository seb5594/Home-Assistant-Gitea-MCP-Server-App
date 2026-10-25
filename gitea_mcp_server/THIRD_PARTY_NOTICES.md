# Third-party notices

This app contains software of the following projects, used unmodified.

| Component | License | Source |
| --- | --- | --- |
| Gitea MCP Server (`gitea-mcp`), copied from the official `gitea/gitea-mcp-server` image | MIT, see `licenses/gitea-mcp-MIT.txt` | <https://gitea.com/gitea/gitea-mcp> |
| Home Assistant base image with bashio and s6-overlay | Apache-2.0, MIT | <https://github.com/home-assistant/docker-base> |
| BusyBox (page server), curl, jq (installed through Alpine packages) | GPL-2.0, curl, MIT | <https://pkgs.alpinelinux.org> |

The notices of the Alpine packages are in the image under `/usr/share/licenses`.

The cup in the icon and logo is the Gitea logo from the repository <https://github.com/go-gitea/gitea>
(`assets/logo.svg`). It is a trademark of the Gitea project and is used here only to show that this app
works with Gitea; this app is not an official Gitea product.
