import json
import os
import re
import subprocess
from pathlib import Path
from urllib.request import urlopen

APP = Path("gitea_mcp_server")
UPSTREAM = "https://gitea.com/api/v1/repos/gitea/gitea-mcp/releases/latest"
VERSION = r"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)"


def version_key(version):
    match = re.fullmatch(VERSION, version, re.ASCII)
    if not match:
        raise ValueError(f"Expected a stable version, got {version!r}")
    return tuple(map(int, match.groups()))


def update():
    config = APP / "config.yaml"
    dockerfile = APP / "Dockerfile"
    changelog = APP / "CHANGELOG.md"
    config_text = config.read_text(encoding="utf-8")
    docker_text = dockerfile.read_text(encoding="utf-8")
    changelog_text = changelog.read_text(encoding="utf-8")
    current = re.search(r'^version: "([^"]+)"$', config_text, re.M)[1]
    current_key = version_key(current)
    arguments = ("GITEA_MCP_VERSION", "BUILD_VERSION")
    for argument in arguments:
        if f"ARG {argument}={current}" not in docker_text.splitlines():
            raise ValueError(f"{argument} must match config.yaml version {current}")
    if not changelog_text.startswith(f"# Changelog\n\n## {current}\n"):
        raise ValueError(f"The changelog must start with version {current}")

    if os.environ.get("CHECK_ONLY") == "true":
        return

    with urlopen(UPSTREAM, timeout=30) as response:
        release = json.load(response)
    latest = release["tag_name"].removeprefix("v")
    if release["draft"] or release["prerelease"] or version_key(latest) <= current_key:
        return

    # Check availability before updating the app pin.
    subprocess.run(
        ["docker", "manifest", "inspect", f"docker.io/gitea/gitea-mcp-server:{latest}"],
        stdout=subprocess.DEVNULL,
        check=True,
    )
    config.write_text(config_text.replace(f'version: "{current}"', f'version: "{latest}"', 1), encoding="utf-8")
    for argument in arguments:
        docker_text = docker_text.replace(f"ARG {argument}={current}\n", f"ARG {argument}={latest}\n", 1)
    dockerfile.write_text(docker_text, encoding="utf-8")
    heading = "# Changelog\n"
    changelog.write_text(
        f"{heading}\n## {latest}\n\n* Update Gitea MCP to {latest}.\n{changelog_text[len(heading):]}",
        encoding="utf-8",
    )
    with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as output:
        print(f"version={latest}", file=output)


if __name__ == "__main__":
    update()
