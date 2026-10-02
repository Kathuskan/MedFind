from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException

from app.api.routes import router

app = FastAPI(
    title="MedFind API", version="0.1.0", description="Synthetic prototype. No dispensing or holds."
)
app.include_router(router)


@app.middleware("http")
async def response_headers(request: Request, call_next):
    request.state.request_id = str(uuid4())
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Request-ID"] = request.state.request_id
    return response


def error(request: Request, status: int, code: str, message: str, fields=None):
    return JSONResponse(
        status_code=status,
        content={
            "code": code,
            "message": message,
            "field_errors": fields or [],
            "request_id": getattr(request.state, "request_id", str(uuid4())),
        },
    )


@app.exception_handler(HTTPException)
async def http_error(request: Request, exc: HTTPException):
    return error(request, exc.status_code, "REQUEST_FAILED", str(exc.detail))


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    fields = [
        {"field": ".".join(map(str, item["loc"])), "message": item["msg"]} for item in exc.errors()
    ]
    return error(request, 422, "INVALID_INPUT", "Check the submitted fields", fields)


@app.exception_handler(SQLAlchemyError)
async def database_error(request: Request, exc: SQLAlchemyError):
    return error(
        request, 503, "SERVICE_UNAVAILABLE", "Availability could not be checked. Try again later."
    )
