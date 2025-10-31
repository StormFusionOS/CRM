"""Validation utilities for LLM outputs."""
from __future__ import annotations

import json
import logging
import re
from typing import Any, Callable, Dict, Optional

from pydantic import BaseModel, ValidationError

LOGGER = logging.getLogger(__name__)


class ValidationErrorWithInput(RuntimeError):
    """Raised when validation fails even after retries."""

    def __init__(self, message: str, *, raw_output: str) -> None:
        super().__init__(message)
        self.raw_output = raw_output


class LLMValidator:
    """Wraps an LLM call and validates the returned content."""

    def __init__(
        self,
        *,
        schema_model: Optional[type[BaseModel]] = None,
        regex: Optional[str] = None,
        max_retries: int = 2,
        repair_prompt: Optional[Callable[[str], str]] = None,
    ) -> None:
        if not schema_model and not regex:
            raise ValueError("Either schema_model or regex must be provided")
        self.schema_model = schema_model
        self.regex = re.compile(regex) if regex else None
        self.max_retries = max_retries
        self.repair_prompt = repair_prompt

    def validate(self, raw_output: str) -> Any:
        """Validate the raw LLM output and return structured data."""

        last_error: Optional[Exception] = None
        attempt = 0
        candidate = raw_output
        while attempt <= self.max_retries:
            try:
                return self._coerce(candidate)
            except Exception as exc:  # noqa: BLE001 - capture validation errors
                last_error = exc
                attempt += 1
                LOGGER.warning("Validation failed (attempt %s/%s): %s", attempt, self.max_retries, exc)
                if attempt > self.max_retries:
                    break
                if self.repair_prompt:
                    candidate = self.repair_prompt(candidate)
                else:
                    candidate = candidate.strip()
        raise ValidationErrorWithInput("LLM output failed validation", raw_output=candidate) from last_error

    def _coerce(self, candidate: str) -> Any:
        """Convert the candidate string into the expected structure."""

        if self.schema_model:
            data = json.loads(candidate)
            return self.schema_model.model_validate(data)
        if self.regex and not self.regex.search(candidate):
            raise ValidationError("Regex validation failed")
        return candidate


def default_repair_prompt(previous_output: str) -> str:
    """Create a repair prompt to fix malformed JSON outputs."""

    template = (
        "The previous response failed validation. "
        "Return ONLY valid JSON that matches the requested schema. Previous response was:\n" + previous_output
    )
    return template
