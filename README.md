# MedFind

Sri Lanka Medicine Availability Network. A responsive web prototype for locating exact medicines at participating pharmacies, with visible confirmation times and pharmacist-approved short holds.

## Prototype documentation

| Document | Markdown | Microsoft Word |
| --- | --- | --- |
| Product requirements | [PRD](docs/PRD.md) | [PRD](docs/PRD.docx) |
| Technology and architecture | [Tech stack](docs/TECH_STACK.md) | [Tech stack](docs/TECH_STACK.docx) |
| Experience and visual design | [Design](docs/DESIGN.md) | [Design](docs/DESIGN.docx) |

Version 1.0, 2 October 2026. Markdown is the editable source; Word files contain the same substantive content. Update both formats when requirements change.

The documents translate Team Enigma's supplied Gate 1 proposal into a build specification. They distinguish proposal evidence from proposed implementation decisions. Real patient use remains conditional on validation, pharmacy verification, and operational readiness. The repository now includes the foundation release described below; the original specification documents remain the target for later milestones.


## Foundation release

### Deploy the demo

[Deploy to Render](https://render.com/deploy?repo=https://github.com/Kathuskan/MedFind)

The included `render.yaml` creates one web/API container and a private PostgreSQL database in Singapore. Both use free plans for a short-lived demonstration. Sign in to Render, review the Blueprint, and deploy. See [deployment instructions](docs/DEPLOYMENT.md) for limits, checks, and updating the app. Deployment is not confirmed until Render reports success and the public search flow has been checked.

The first working slice includes a responsive React interface, exact medicine selection, town filtering, pharmacy details, a FastAPI public API, SQLAlchemy models, Alembic migrations, synthetic seed data, and automated checks. PostgreSQL is the target database; SQLite is supported for quick local development only.

All pharmacy and stock records are fictional. No contact information is collected. Staff authentication, inventory editing, holds, notifications, verified licensing, reviewed aliases, distance search, and multilingual content are **not implemented yet**. This is a local demo, not a service for real patient use. The green pharmacy fields in the seed are test fixtures, not verified real licences.

### Project layout

```text
apps/web/             React, TypeScript, Vite, routes and shared UI
services/api/app/     FastAPI routes, schemas, database and domain logic
services/api/tests/   API and freshness tests
services/api/migrations/  Versioned database changes
infra/                Local container and reverse-proxy configuration
.github/workflows/    Build and test checks, including PostgreSQL in CI
docs/                 Product, technology and design specifications
```

### Run locally

Requirements: Node.js 24 and Python 3.12 or newer. Run these commands from the repository root unless a directory change is shown.

```sh
npm ci
python3.12 -m venv services/api/.venv
services/api/.venv/bin/python -m pip install -r services/api/requirements.lock
services/api/.venv/bin/python -m pip install --no-deps -e services/api
cd services/api
cp .env.example .env
.venv/bin/alembic upgrade head
.venv/bin/python -m app.db.seed
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --no-access-log
```

In another terminal at the repository root:

```sh
npm run dev
```

Open http://127.0.0.1:5173. The Vite development server forwards `/api` requests to the backend. API documentation is at http://127.0.0.1:8000/docs. Try **Metformin**, choose **500 mg** or **850 mg**, and search all demo areas or Colombo.

Demo stock timestamps are set only when the seed is first inserted. Re-running the seed or restarting the API does not refresh them. After 24 hours the records correctly become Unconfirmed. To make a fresh disposable demonstration, point DATABASE_URL at a new SQLite file, run migrations, then seed it. Never delete or replace a database containing records you want to retain.

### Local Docker option

Docker and Compose are required for this alternative. Copy the root `.env.example` to `.env` and replace the password with a unique alphanumeric local value. Do not commit `.env`.

```sh
docker compose up --build -d
docker compose exec api python -m app.db.seed
```

Open http://127.0.0.1:8080. Only the web port is exposed, bound to loopback. The API waits for PostgreSQL, applies migrations, and does not automatically seed records. `docker compose down` stops containers while retaining the named database volume.

The container configuration is for local development. Before deployment, pin reviewed image digests, configure HTTPS, secret storage, backups, monitoring, and rate/body limits. Docker was not installed on the authoring machine, so the container startup path still needs execution verification. CI runs database checks with PostgreSQL; local API checks use SQLite unless TEST_DATABASE_URL is provided.

### Verify changes

```sh
npm run format:check
npm run build
npm test
cd services/api
.venv/bin/ruff check app tests migrations
.venv/bin/ruff format --check app tests migrations
.venv/bin/python -m pytest -q
.venv/bin/alembic check
```

`TEST_DATABASE_URL` must point only at a dedicated disposable test database: the API tests create and remove their tables. Never set it to a live or shared database. `DATABASE_URL` is the application database used by migrations. A Python 3.12 dependency snapshot is committed in `requirements.lock`; frontend dependencies are pinned by `package-lock.json`.

### Next milestones

1. Verified pharmacy onboarding, staff authentication, membership checks, and audit records.
2. Stock updates with version checks, discrepancy resolution, reviewed catalogue aliases, and exact product identity fields.
3. Consented enquiries and transactional pharmacist-approved holds, including contact deletion and expiry jobs.
4. Accessibility and language review, abuse controls, operational hardening, and supervised pilot validation.

The current client uses typed API helpers. Generate client types from OpenAPI as the full contract stabilises. Native mobile clients can reuse the versioned API later.
