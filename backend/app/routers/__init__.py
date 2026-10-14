"""API Route Handlers."""

from app.routers.auth import router as auth_router
from app.routers.search import router as search_router
from app.routers.pharmacies import router as pharmacies_router
from app.routers.stock import router as stock_router
from app.routers.enquiries import router as enquiries_router
from app.routers.holds import router as holds_router
from app.routers.admin import router as admin_router
from app.routers.prescriptions import router as prescriptions_router

__all__ = [
    "auth_router",
    "search_router",
    "pharmacies_router",
    "stock_router",
    "enquiries_router",
    "holds_router",
    "admin_router",
    "prescriptions_router",
]

