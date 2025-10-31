from fastapi import FastAPI
from backend.app.routes import scraper

app = FastAPI(title="CRM API")

app.include_router(scraper.router, prefix="/api")


@app.get("/api/status")
async def get_status():
    return [
        {
            "id": "core",
            "name": "Core Services",
            "queueDepth": 3,
            "lastSuccessfulRun": "2024-03-08T07:30:00Z",
            "quarantinedDomains": 1,
        },
        {
            "id": "scraper",
            "name": "Scraper",
            "queueDepth": 2,
            "lastSuccessfulRun": "2024-03-08T07:40:00Z",
            "quarantinedDomains": 2,
        },
    ]
