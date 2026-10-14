# MedFind Developer Guide 🛠️

Welcome to MedFind's developer onboarding guide. This document explains coding standards, branch management, local setup, database migrations, and testing practices.

---

## 1. System Prerequisites

Before setting up MedFind locally, verify that your development machine has:
- **Git** (for source control and cloning)
- **Docker Desktop** (to run the PostgreSQL database service seamlessly)
- **Python 3.12+** (for the backend FastAPI environment)
- **Node.js 20+ & npm 10+** (for the frontend React + Vite client)

---

## 2. Dependencies

### Backend (Python & FastAPI)
Configured in `backend/pyproject.toml`, installed via `pip install -e ".[dev]"`:
- **FastAPI**: Asynchronous web API framework
- **Uvicorn**: High-performance ASGI server
- **SQLAlchemy 2.0**: Typed async ORM
- **Alembic**: Database migrations
- **Pydantic v2**: Data validation and serialization
- **Psycopg / Asyncpg**: PostgreSQL database connectors
- **PyJWT / Passlib**: Token-based authentication and password hashing
- **Pytest**: Automated testing runner (via `[dev]` optional dependencies)

### Frontend (React & TypeScript)
Configured in `frontend/package.json`, installed via `npm install`:
- **React & React DOM**: UI foundation
- **Vite**: Rapid bundler and dev server
- **React Router**: Client-side routing for Seeker, Pharmacy, and Admin portals
- **TanStack Query (React Query)**: Asynchronous cache, background synchronization, and state management
- **Tailwind CSS**: Utility styling framework
- **Lucide React**: Medical and UI iconography

---

## 3. Quickstart Checklist

```bash
# 1. Start Database Container
docker compose up -d db

# 2. Setup and Run Backend
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -e ".[dev]"
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload

# 3. Setup and Run Frontend (In a separate terminal)
cd frontend
npm install
npm run dev
```

---

## 2. Architecture Overview

- **Backend**: FastAPI (Python) asynchronous web framework with SQLAlchemy 2.0 ORM and Pydantic v2 schemas.
- **Database**: PostgreSQL with Alembic for version-controlled schema migrations.
- **Frontend**: React 18, TypeScript, and Vite with React Router for SPA navigation.
- **Cache / Reservations**: Transient holding service for temporary medicine reserves.

---

## 3. Database Migrations (Alembic)

All schema changes must be accompanied by an Alembic migration script.

```bash
cd backend

# Create a new migration revision
alembic revision --autogenerate -m "Add enquiry status field"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

---

## 4. Coding & Linting Conventions

### Backend
- Format and lint with **Ruff**:
  ```bash
  ruff check app/
  ruff format app/
  ```
- Type checking with **Mypy**:
  ```bash
  mypy app/
  ```

### Frontend
- Code formatting and type check:
  ```bash
  cd frontend
  npm run build # runs tsc and vite build
  ```

---

## 5. Testing Guidelines

### Backend Testing
Backend tests live in `backend/app/tests/`. Always mock external services and use in-memory SQLite or test Postgres DB fixtures.
```bash
cd backend
pytest -v
```

### Frontend Testing
Test interactive components and mock API requests using standard React testing utilities.
