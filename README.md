# MedFind 🏥💊

MedFind is a real-time pharmacy medicine availability and stock discovery platform. It connects patients with local pharmacies, enabling instant medicine stock inquiries, temporary reservations (holds), and pharmacy inventory management.

---

## 📁 Repository Structure

```text
medfind/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .github/workflows/ci.yml
├── docs/
│   ├── DEVELOPMENT_GUIDE.md
│   ├── PRIVACY_AND_SAFETY.md
│   └── validation/            # anonymised interview notes, decision log
├── backend/
│   ├── pyproject.toml
│   ├── alembic/
│   └── app/
│       ├── main.py
│       ├── core/              # config, security, db
│       ├── models/            # SQLAlchemy models
│       ├── schemas/           # Pydantic schemas
│       ├── routers/           # search, pharmacies, stock, enquiries, holds, admin, auth
│       ├── services/          # stock_status, holds, retention
│       └── tests/
└── frontend/
    ├── package.json
    └── src/
        ├── pages/             # Home, Search, Results, PharmacyDetails, pharmacy/*, admin/*
        ├── components/
        ├── api/
        └── routes.tsx
```

---

## 🛠️ 1. System-Level Prerequisites

Before installing project-specific packages, ensure your computer has these core tools installed:
- **Git** (to clone and version the repository)
- **Docker Desktop** (to run the PostgreSQL database container easily)
- **Python 3.12+** (for the backend FastAPI service)
- **Node.js 20+ and npm** (for the frontend React + Vite application)

---

## 📦 2. Backend Dependencies (Python & FastAPI)

The backend uses Python with FastAPI, SQLAlchemy 2.0, Alembic, and Pydantic v2, defined in `backend/pyproject.toml`.
Running `pip install -e ".[dev]"` installs:
- **FastAPI** — Web framework for building high-performance APIs.
- **Uvicorn** — ASGI server to run the FastAPI app with live reloading.
- **SQLAlchemy (v2.0)** — Modern SQL toolkit and Object Relational Mapper (ORM).
- **Alembic** — Database migration tool for PostgreSQL.
- **Pydantic (v2)** — High-speed data validation and schemas using Python type hints.
- **Psycopg / Asyncpg** — PostgreSQL database adapters for Python.
- **PyJWT / Passlib** — JWT authentication token generation and bcrypt password hashing.
- **Pytest / Test dependencies** — Asynchronous testing suite and fixtures (via `[dev]`).

---

## 🎨 3. Frontend Dependencies (React & TypeScript)

The frontend uses React with Vite, React Router, TanStack Query, and Tailwind CSS, defined in `frontend/package.json`.
Running `npm install` installs:
- **React & React DOM** — UI component library.
- **Vite** — Fast frontend build tool and dev server.
- **React Router** — SPA routing (Seeker, Pharmacy Portal, and Admin management).
- **TanStack Query (React Query)** — Powerful asynchronous state management, server cache, and data fetching.
- **Tailwind CSS** — Utility-first CSS framework for modern styling.
- **Lucide React** — Clean, responsive medical and UI icons.

---

## 📋 Summary Checklist: What to Run

Once your repository is cloned and your `.env` file is ready (`cp .env.example .env`), run:

### Step 1: Start PostgreSQL Database Container
```bash
docker compose up -d db
```

### Step 2: Backend Setup
```bash
cd backend
python -m venv .venv

# Activate virtual environment:
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies, run migrations, and seed sample data:
pip install -e ".[dev]"
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```
- API Base URL: [http://localhost:8000](http://localhost:8000)
- Interactive API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

### Step 3: Frontend Setup (in a New Terminal)
```bash
cd frontend
npm install
npm run dev
```
- Frontend Web App: [http://localhost:5173](http://localhost:5173)

---

## 🔒 Privacy & Safety

Please consult [`docs/PRIVACY_AND_SAFETY.md`](docs/PRIVACY_AND_SAFETY.md) for data protection measures, prescription verification considerations, and automatic retention policies.
