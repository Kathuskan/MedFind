import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.config import Settings
from app.web import mount_web


@pytest.mark.parametrize("scheme", ["postgres", "postgresql", "postgresql+psycopg"])
def test_hosted_database_driver(scheme):
    settings = Settings(database_url=f"{scheme}://user:pass@db/medfind", _env_file=None)
    assert settings.database_url == "postgresql+psycopg://user:pass@db/medfind"


def test_hosted_client_routes_and_missing_resources(tmp_path):
    (tmp_path / "index.html").write_text("<html>MedFind</html>")
    (tmp_path / "assets").mkdir()
    (tmp_path / "assets" / "app.js").write_text("// built asset")
    app = FastAPI()
    mount_web(app, str(tmp_path))
    with TestClient(app) as client:
        for path in (
            "/",
            "/search",
            "/help",
            "/privacy",
            "/staff/login",
            "/pharmacies/00000000-0000-0000-0000-000000000065",
        ):
            assert client.get(path).text == "<html>MedFind</html>"
        assert client.get("/assets/app.js").status_code == 200
        for path in ("/api/v1/missing", "/assets/missing.js", "/.env"):
            assert client.get(path).status_code == 404


def test_missing_web_build_fails_startup(tmp_path):
    with pytest.raises(RuntimeError, match="compiled web application"):
        mount_web(FastAPI(), str(tmp_path))
