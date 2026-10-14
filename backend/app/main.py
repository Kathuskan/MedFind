from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.db import engine, Base
from app.routers import (
    auth_router,
    search_router,
    pharmacies_router,
    stock_router,
    enquiries_router,
    holds_router,
    admin_router,
    prescriptions_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and shutdown routines."""
    # Create tables if using SQLite or quick development
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Real-time Medicine Availability & Pharmacy Discovery Platform API",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root & Health Check Endpoints
@app.get("/", tags=["Health"])
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "healthy",
        "docs_url": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}


# Mount API Routers
api_prefix = "/api"
app.include_router(auth_router, prefix=api_prefix)
app.include_router(search_router, prefix=api_prefix)
app.include_router(pharmacies_router, prefix=api_prefix)
app.include_router(stock_router, prefix=api_prefix)
app.include_router(enquiries_router, prefix=api_prefix)
app.include_router(holds_router, prefix=api_prefix)
app.include_router(admin_router, prefix=api_prefix)
app.include_router(prescriptions_router, prefix=api_prefix)
