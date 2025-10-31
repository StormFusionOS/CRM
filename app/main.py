"""FastAPI application entry point for CRM admin tooling."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import ai, change_log, diff, seo

app = FastAPI(title="CRM Admin Tooling API", version="0.1.0")

# Allow local development clients to connect easily.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(change_log.router)
app.include_router(diff.router)
app.include_router(seo.router)
app.include_router(ai.router)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    """Return a simple healthcheck payload."""

    return {"status": "ok"}
