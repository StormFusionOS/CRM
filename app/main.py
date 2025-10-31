"""FastAPI application factory for the CRM backend."""
from __future__ import annotations

import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging_config import configure_logging  # noqa: F401  # ensure logging configured
from app.db.session import Base, engine
from app.routers import (
    appointments,
    auth,
    calendar,
    campaigns,
    contacts,
    inbox,
    interactions,
    leads,
    logs,
    media,
    pipeline,
    review,
    users,
    webhooks,
)


logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(contacts.router)
app.include_router(leads.router)
app.include_router(interactions.router)
app.include_router(appointments.router)
app.include_router(campaigns.router)
app.include_router(inbox.router)
app.include_router(pipeline.router)
app.include_router(calendar.router)
app.include_router(review.router)
app.include_router(logs.router)
app.include_router(media.router)
app.include_router(webhooks.router)

app.mount("/protected-media", StaticFiles(directory=settings.media_root), name="protected-media")


@app.on_event("startup")
def on_startup() -> None:
    """Initialize application resources on startup."""

    logger.info("Starting %s in %s environment", settings.app_name, settings.environment)
    Base.metadata.create_all(bind=engine)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Return structured validation errors."""

    logger.warning("Validation error for %s: %s", request.url, exc.errors())
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all exception handler that logs failures."""

    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/health", tags=["monitoring"])
def health_check() -> dict[str, Any]:
    """Return service health information."""

    return {"status": "ok", "app": settings.app_name}
