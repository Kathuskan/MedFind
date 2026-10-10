#!/bin/sh
set -eu
: "${DATABASE_URL:?DATABASE_URL is required for hosted deployment}"
alembic upgrade head
if [ "${SEED_DEMO:-false}" = "true" ]; then
  python -m app.db.seed
fi
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-10000}" --no-access-log
