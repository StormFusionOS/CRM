# AI CRM Backend

Production-ready FastAPI backend for a self-hosted CRM/SaaS platform unifying AI SEO, web scraping, CRM, and media archival workflows. The stack leverages FastAPI, SQLAlchemy, Celery, and Redis to deliver secure APIs and background processing suitable for containerized deployments on Ubuntu 22.04.

## Features

- JWT-based authentication with role-based access control (admin, sales, tech, client).
- RESTful APIs for contacts, leads, interactions, appointments, campaigns, inbox, pipeline, calendar, review queue, logs, media management, and external webhooks.
- Celery workers and beat scheduler for email/SMS/voice notifications, scraping jobs, and maintenance tasks.
- Webhook ingestion for Twilio, Facebook, Yelp, and Google sources with auditing and deduplication logic.
- Secure media storage with authenticated downloads and metadata tracking.
- Structured logging with rotating file handlers and database-backed task/webhook logs.

## Getting Started

1. Copy `.env.example` to `.env` and update secrets, database URLs, and provider credentials.
2. Install dependencies:

   ```bash
   pip install -e .
   ```

3. Run the FastAPI application (development):

   ```bash
   uvicorn app.main:app --reload
   ```

4. Start Celery worker and beat scheduler:

   ```bash
   celery -A app.tasks.celery_app.celery_app worker -l info
   celery -A app.tasks.celery_app.celery_app beat -l info
   ```

5. Access the interactive API docs at `http://localhost:8000/docs`.

## Project Structure

- `app/main.py` – FastAPI application setup and router registration.
- `app/models.py` – SQLAlchemy models for all domain entities.
- `app/routers/` – Modular API routers grouped by domain.
- `app/tasks/` – Celery configuration and task definitions.
- `app/schemas/` – Pydantic models for request/response validation.
- `app/core/` – Configuration, security, and logging utilities.
- `app/utils/` – Shared utilities such as media file helpers.

## Database Migrations

For production environments, manage schema evolution using Alembic or a similar migration tool. The startup hook currently performs metadata creation for local development convenience.

## Testing

Install dev dependencies and run your preferred test suite (e.g., `pytest`).
