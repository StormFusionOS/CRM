"""Endpoints for executing AI prompt templates on demand."""
from __future__ import annotations

from typing import Any, Callable, Dict

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["ai"])


PromptHandler = Callable[[Dict[str, Any]], str]


class PromptRequest(BaseModel):
    """Payload describing the prompt template to run."""

    name: str
    parameters: Dict[str, Any] = {}


class PromptResponse(BaseModel):
    """Structured response returned to the UI."""

    name: str
    rendered_prompt: str
    result: str


def _faq_prompt(parameters: Dict[str, Any]) -> str:
    topic = parameters.get("topic", "product")
    return (
        f"Suggested FAQ for {topic}:\n"
        "Q: How does it work?\n"
        "A: The CRM automates tasks and centralizes customer information."
    )


def _meta_rewrite_prompt(parameters: Dict[str, Any]) -> str:
    title = parameters.get("title", "CRM Platform")
    tone = parameters.get("tone", "professional")
    return (
        f"Meta Description ({tone}): Optimize your {title} presence with actionable analytics."
    )


def _structured_schema_prompt(parameters: Dict[str, Any]) -> str:
    business = parameters.get("business", "CRM Inc")
    url = parameters.get("url", "https://example.com")
    return (
        "{" "\n"
        f'  "@context": "https://schema.org",\n'
        f'  "@type": "Organization",\n'
        f'  "name": "{business}",\n'
        f'  "url": "{url}"\n'
        "}"
    )


_PROMPTS: dict[str, tuple[str, PromptHandler]] = {
    "FAQ Generator": (
        "Create an FAQ outline for a landing page.",
        _faq_prompt,
    ),
    "Meta Rewriter": (
        "Rewrite metadata snippets for SEO testing.",
        _meta_rewrite_prompt,
    ),
    "Schema Generator": (
        "Return a JSON-LD schema block for the provided business context.",
        _structured_schema_prompt,
    ),
}


@router.get("/prompts")
def list_prompts() -> dict[str, dict[str, str]]:
    """Return the available prompt templates with descriptions."""

    return {
        name: {"description": description}
        for name, (description, _handler) in _PROMPTS.items()
    }


@router.post("/run_prompt", response_model=PromptResponse)
def run_prompt(payload: PromptRequest) -> PromptResponse:
    """Execute a named prompt template using the provided parameters."""

    if payload.name not in _PROMPTS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found")

    description, handler = _PROMPTS[payload.name]
    result = handler(payload.parameters)
    rendered_prompt = description
    return PromptResponse(name=payload.name, rendered_prompt=rendered_prompt, result=result)
