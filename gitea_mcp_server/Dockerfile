ARG BUILD_FROM=ghcr.io/home-assistant/base:3.24-2026.10.0

# The official image is distroless: it holds nothing but the static Go binary. That binary is
# copied into the Home Assistant base image, which brings bashio and s6-overlay.
# renovate: datasource=docker depName=docker.io/gitea/gitea-mcp-server
ARG GITEA_MCP_VERSION=1.11.0
FROM docker.io/gitea/gitea-mcp-server:${GITEA_MCP_VERSION} AS gitea-mcp

FROM ${BUILD_FROM}

# Alpine's busybox is built without the httpd applet; busybox-extras brings it (app page).
# nginx only runs in debug mode, as the request log of the remote address.
RUN apk add --no-cache \
    # renovate: datasource=repology depName=alpine_3_24/busybox-extras
    busybox-extras=1.37.0-r31 \
    # renovate: datasource=repology depName=alpine_3_24/nginx
    nginx=1.30.6-r0 \
    # renovate: datasource=repology depName=alpine_3_24/curl
    curl=8.22.0-r0 \
    # renovate: datasource=repology depName=alpine_3_24/jq
    jq=1.8.2-r0

COPY --from=gitea-mcp /app/gitea-mcp /usr/local/bin/gitea-mcp
RUN gitea-mcp --version

COPY rootfs/ /
COPY licenses/ /usr/share/licenses/gitea-mcp-server/
COPY LICENSE THIRD_PARTY_NOTICES.md /usr/share/licenses/gitea-mcp-server/

# Git does not keep the executable bit when files are uploaded through the GitHub API.
RUN chmod a+x /usr/lib/gitea-mcp/*.sh /usr/share/gitea-mcp/web/cgi-bin/* \
    && find /etc/s6-overlay/s6-rc.d -type f \( -name run -o -name finish \) -exec chmod a+x {} + \
    && mkdir -p /run/gitea-mcp \
    && ln -s /run/gitea-mcp/status.json /usr/share/gitea-mcp/web/status.json

ARG BUILD_VERSION=1.0.0-dev10
ARG BUILD_ARCH=amd64
RUN echo "${BUILD_VERSION}" >/etc/gitea-mcp/version
LABEL io.hass.version="${BUILD_VERSION}" \
    io.hass.type="addon" \
    io.hass.arch="${BUILD_ARCH}" \
    org.opencontainers.image.source="https://github.com/seb5594/Home-Assistant-Gitea-MCP-Server-App"

HEALTHCHECK --interval=5m --timeout=10s --start-period=1m --retries=3 \
    CMD ["/usr/lib/gitea-mcp/healthcheck.sh"]
