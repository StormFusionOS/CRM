"""Configure structured logging for the application."""
from __future__ import annotations

import logging
import logging.config
from pathlib import Path
from typing import Any, Dict

from app.core.config import settings


def configure_logging() -> None:
    """Configure logging with console and rotating file handlers."""

    log_path = settings.log_directory / settings.log_file_name
    logging_config: Dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "structured": {
                "format": "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "structured",
                "level": "INFO",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "formatter": "structured",
                "level": "INFO",
                "filename": str(log_path),
                "maxBytes": 10 * 1024 * 1024,
                "backupCount": 5,
            },
        },
        "loggers": {
            "": {
                "handlers": ["console", "file"],
                "level": "INFO",
            }
        },
    }
    log_path.parent.mkdir(parents=True, exist_ok=True)
    logging.config.dictConfig(logging_config)


configure_logging()
