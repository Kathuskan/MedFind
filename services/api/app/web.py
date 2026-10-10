"""Serve the compiled web app on the API origin for hosted demonstrations."""

import re
from pathlib import Path

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles


class WebFiles(StaticFiles):
    async def get_response(self, path, scope):
        # Only client routes get the shell. Missing API paths/assets stay 404.
        if path in (".", "", "search", "help", "privacy", "staff/login") or re.fullmatch(
            r"pharmacies/[0-9a-fA-F-]{36}", path
        ):
            path = "index.html"
        return await super().get_response(path, scope)


def mount_web(app: FastAPI, directory: str) -> None:
    if not (Path(directory) / "index.html").is_file():
        raise RuntimeError("WEB_DIST must contain the compiled web application")
    app.mount("/", WebFiles(directory=directory), name="web")
