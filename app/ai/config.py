"""Configuration dataclasses and helpers for AI SEO tooling."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, Optional


@dataclass
class AISettings:
    """Runtime configuration for the AI SEO engine."""

    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: Optional[str] = None
    embeddings_model: str = "text-embedding-3-large"
    llm_model: str = "gpt-4o"
    serp_api_key: Optional[str] = None
    default_collection: str = "seo_content"
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Return a dictionary representation for easier serialization/logging."""

        return {
            "qdrant_url": self.qdrant_url,
            "qdrant_api_key": bool(self.qdrant_api_key),
            "embeddings_model": self.embeddings_model,
            "llm_model": self.llm_model,
            "serp_api_key": bool(self.serp_api_key),
            "default_collection": self.default_collection,
            "metadata": self.metadata,
        }
