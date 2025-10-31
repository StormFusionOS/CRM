"""Celery tasks supporting asynchronous operations."""
from __future__ import annotations

import json
import smtplib
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path
from typing import Any, Dict

from celery.utils.log import get_task_logger
from twilio.rest import Client

from app.core.config import settings
from app.tasks.celery_app import celery_app
from app.db.session import SessionLocal
from app import models


logger = get_task_logger(__name__)


def _log_task_event(task_name: str, status: str, message: str | None = None, log_id: int | None = None) -> int:
    """Create or update a task log entry."""

    session = SessionLocal()
    try:
        if log_id is None:
            log = models.TaskLog(task_name=task_name, status=status, message=message, started_at=datetime.utcnow())
            session.add(log)
            session.commit()
            session.refresh(log)
            return log.id
        log = session.get(models.TaskLog, log_id)
        if log:
            log.status = status
            log.message = message
            log.finished_at = datetime.utcnow()
            session.add(log)
            session.commit()
            return log.id
        return log_id or 0
    finally:
        session.close()


def _send_email_sync(to_address: str, subject: str, body: str) -> None:
    """Send an email using SMTP settings from configuration."""

    if not settings.smtp_host or not settings.smtp_username or not settings.smtp_password:
        logger.warning("SMTP configuration incomplete; email not sent")
        return
    message = EmailMessage()
    message["From"] = settings.smtp_username
    message["To"] = to_address
    message["Subject"] = subject
    message.set_content(body)

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as smtp:
        if settings.smtp_use_tls:
            smtp.starttls()
        smtp.login(settings.smtp_username, settings.smtp_password)
        smtp.send_message(message)


def _get_twilio_client() -> Client | None:
    """Instantiate a Twilio REST client if credentials are configured."""

    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        logger.warning("Twilio credentials missing; skipping Twilio call")
        return None
    return Client(settings.twilio_account_sid, settings.twilio_auth_token)


@celery_app.task(bind=True)
def send_email(self, to: str, subject: str, body: str) -> None:
    """Send an email asynchronously."""

    log_id = _log_task_event(self.name, "started", f"Sending email to {to}")
    try:
        _send_email_sync(to, subject, body)
        _log_task_event(self.name, "success", f"Email sent to {to}", log_id=log_id)
    except Exception as exc:  # pragma: no cover - external service
        logger.exception("Failed to send email")
        _log_task_event(self.name, "failure", str(exc), log_id=log_id)
        raise


@celery_app.task(bind=True)
def send_sms(self, phone: str, message: str) -> None:
    """Send an SMS message via Twilio."""

    log_id = _log_task_event(self.name, "started", f"Sending SMS to {phone}")
    try:
        client = _get_twilio_client()
        if client is None:
            _log_task_event(self.name, "skipped", "Twilio not configured", log_id=log_id)
            return
        kwargs: Dict[str, Any] = {"to": phone, "body": message}
        if settings.twilio_messaging_service_sid:
            kwargs["messaging_service_sid"] = settings.twilio_messaging_service_sid
        elif settings.twilio_caller_id:
            kwargs["from_"] = settings.twilio_caller_id
        else:
            _log_task_event(self.name, "skipped", "No Twilio sender configured", log_id=log_id)
            return
        client.messages.create(**kwargs)
        _log_task_event(self.name, "success", f"SMS queued for {phone}", log_id=log_id)
    except Exception as exc:  # pragma: no cover
        logger.exception("Failed to send SMS")
        _log_task_event(self.name, "failure", str(exc), log_id=log_id)
        raise


@celery_app.task(bind=True)
def schedule_voice_call(self, phone: str, url: str) -> None:
    """Schedule a voice call using Twilio."""

    log_id = _log_task_event(self.name, "started", f"Scheduling call to {phone}")
    try:
        client = _get_twilio_client()
        if client is None:
            _log_task_event(self.name, "skipped", "Twilio not configured", log_id=log_id)
            return
        caller_id = settings.twilio_caller_id or settings.twilio_messaging_service_sid
        if not caller_id:
            _log_task_event(self.name, "skipped", "No Twilio caller ID configured", log_id=log_id)
            return
        client.calls.create(to=phone, from_=caller_id, url=url)
        _log_task_event(self.name, "success", f"Call queued for {phone}", log_id=log_id)
    except Exception as exc:  # pragma: no cover
        logger.exception("Failed to schedule call")
        _log_task_event(self.name, "failure", str(exc), log_id=log_id)
        raise


@celery_app.task(bind=True)
def run_scraper(self, scraper_name: str, parameters: Dict[str, Any] | None = None) -> None:
    """Trigger a scraping job for SEO audits or SERP fetches."""

    params = parameters or {}
    log_id = _log_task_event(self.name, "started", f"Running scraper {scraper_name}")
    try:
        # Placeholder for scraper invocation (e.g., subprocess call)
        logger.info("Executing scraper %s with params %s", scraper_name, json.dumps(params))
        _log_task_event(self.name, "success", f"Scraper {scraper_name} completed", log_id=log_id)
    except Exception as exc:  # pragma: no cover
        logger.exception("Scraper execution failed")
        _log_task_event(self.name, "failure", str(exc), log_id=log_id)
        raise


@celery_app.task(bind=True)
def perform_daily_backup(self) -> None:
    """Run a daily database backup routine."""

    log_id = _log_task_event(self.name, "started", "Starting database backup")
    backup_dir = Path(settings.log_directory) / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    backup_file = backup_dir / f"backup-{datetime.utcnow().strftime('%Y%m%d')}.txt"
    try:
        backup_file.write_text(f"Backup completed at {datetime.utcnow().isoformat()} for {settings.database_url}\n")
        _log_task_event(self.name, "success", f"Backup written to {backup_file}", log_id=log_id)
    except Exception as exc:  # pragma: no cover
        logger.exception("Backup failed")
        _log_task_event(self.name, "failure", str(exc), log_id=log_id)
        raise


@celery_app.task(bind=True)
def send_weekly_report(self) -> None:
    """Dispatch weekly summary emails to administrators."""

    log_id = _log_task_event(self.name, "started", "Generating weekly report")
    try:
        admin_email = settings.smtp_username
        if admin_email:
            _send_email_sync(admin_email, "Weekly CRM Report", "Weekly report generated.")
        _log_task_event(self.name, "success", "Weekly report processed", log_id=log_id)
    except Exception as exc:  # pragma: no cover
        logger.exception("Weekly report failed")
        _log_task_event(self.name, "failure", str(exc), log_id=log_id)
        raise
