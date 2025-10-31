"""SEO content generation utilities built on LangChain."""
from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional

from langchain.chains import LLMChain
from langchain_core.language_models import BaseLanguageModel
from pydantic import BaseModel, Field

from .prompt_templates import (
    ANOMALY_ANALYZER_PROMPT,
    CONTENT_REFRESH_PROMPT,
    FAQ_PROMPT,
    META_DESCRIPTION_PROMPT,
    SCHEMA_INJECTOR_PROMPT,
)
from .validators import LLMValidator, default_repair_prompt

LOGGER = logging.getLogger(__name__)


class FAQEntry(BaseModel):
    """Represents a single FAQ entry."""

    question: str
    answer: str


class FAQGenerationResult(BaseModel):
    """Structured result for FAQ generation."""

    faqs: List[FAQEntry]


class MetaDescriptionResult(BaseModel):
    """Structured meta description suggestion."""

    meta_description: str = Field(..., max_length=200)
    notes: str


class ContentRefreshResult(BaseModel):
    """Suggestions for refreshing stale content."""

    sections_to_improve: List[str]
    suggested_updates: List[str]


class SchemaInjectorResult(BaseModel):
    """Schema markup recommendation."""

    schema_json: Dict[str, Any]


class AnomalyAnalysisResult(BaseModel):
    """LLM-backed anomaly diagnosis."""

    likely_causes: List[str]
    recommended_actions: List[str]


class BaseGenerationModule:
    """Common base for LangChain-backed generation utilities."""

    output_model: Optional[type[BaseModel]] = None

    def __init__(self, llm: BaseLanguageModel, *, validator: Optional[LLMValidator] = None) -> None:
        self.llm = llm
        self.validator = validator
        self.chain: Optional[LLMChain] = None

    def _ensure_chain(self, prompt) -> LLMChain:
        if self.chain is None:
            self.chain = LLMChain(llm=self.llm, prompt=prompt, verbose=False)
        return self.chain

    def _post_process(self, raw_output: str) -> Any:
        if self.validator:
            return self.validator.validate(raw_output)
        if self.output_model:
            data = json.loads(raw_output)
            return self.output_model.model_validate(data)
        return raw_output


class FAQGenerator(BaseGenerationModule):
    """Generates FAQ content from existing page copy or topics."""

    output_model = FAQGenerationResult

    def __init__(self, llm: BaseLanguageModel) -> None:
        super().__init__(
            llm,
            validator=LLMValidator(
                schema_model=FAQGenerationResult,
                max_retries=2,
                repair_prompt=default_repair_prompt,
            ),
        )

    def generate(self, *, page_content: str, topic: str) -> FAQGenerationResult:
        LOGGER.info("Generating FAQs for topic: %s", topic)
        chain = self._ensure_chain(FAQ_PROMPT)
        raw_output = chain.run(page_content=page_content, topic=topic)
        result = self._post_process(raw_output)
        LOGGER.debug("FAQ generation complete with %s entries", len(result.faqs))
        return result


class MetaDescriptionRewriter(BaseGenerationModule):
    """Produces optimized meta description suggestions."""

    output_model = MetaDescriptionResult

    def __init__(self, llm: BaseLanguageModel) -> None:
        super().__init__(
            llm,
            validator=LLMValidator(
                schema_model=MetaDescriptionResult,
                max_retries=2,
                repair_prompt=default_repair_prompt,
            ),
        )

    def generate(
        self,
        *,
        page_content: str,
        current_description: str,
        target_keywords: str,
    ) -> MetaDescriptionResult:
        LOGGER.info("Rewriting meta description for keywords: %s", target_keywords)
        chain = self._ensure_chain(META_DESCRIPTION_PROMPT)
        raw_output = chain.run(
            page_content=page_content,
            current_description=current_description,
            target_keywords=target_keywords,
        )
        result = self._post_process(raw_output)
        LOGGER.debug("Meta description generation complete")
        return result


class ContentRefresher(BaseGenerationModule):
    """Highlights content gaps and proposes updates."""

    output_model = ContentRefreshResult

    def __init__(self, llm: BaseLanguageModel) -> None:
        super().__init__(
            llm,
            validator=LLMValidator(
                schema_model=ContentRefreshResult,
                max_retries=2,
                repair_prompt=default_repair_prompt,
            ),
        )

    def generate(
        self,
        *,
        page_content: str,
        topic: str,
        competitor_insights: str,
    ) -> ContentRefreshResult:
        LOGGER.info("Refreshing content for topic: %s", topic)
        chain = self._ensure_chain(CONTENT_REFRESH_PROMPT)
        raw_output = chain.run(
            page_content=page_content,
            topic=topic,
            competitor_insights=competitor_insights,
        )
        result = self._post_process(raw_output)
        LOGGER.debug("Content refresher produced %s suggestions", len(result.suggested_updates))
        return result


class SchemaInjector(BaseGenerationModule):
    """Generates JSON-LD schema recommendations."""

    output_model = SchemaInjectorResult

    def __init__(self, llm: BaseLanguageModel) -> None:
        super().__init__(
            llm,
            validator=LLMValidator(
                schema_model=SchemaInjectorResult,
                max_retries=2,
                repair_prompt=default_repair_prompt,
            ),
        )

    def generate(
        self,
        *,
        page_content: str,
        faqs: List[FAQEntry],
        business_info: str,
    ) -> SchemaInjectorResult:
        LOGGER.info("Generating schema markup recommendations")
        chain = self._ensure_chain(SCHEMA_INJECTOR_PROMPT)
        raw_output = chain.run(
            page_content=page_content,
            faqs=json.dumps([faq.model_dump() for faq in faqs]),
            business_info=business_info,
        )
        data = self._post_process(raw_output)
        if isinstance(data, SchemaInjectorResult):
            result = data
        else:
            result = SchemaInjectorResult(schema_json=json.loads(data))
        LOGGER.debug("Schema injector completed")
        return result


class AnomalyAnalyzer(BaseGenerationModule):
    """Provides hypotheses for SEO anomalies and suggested actions."""

    output_model = AnomalyAnalysisResult

    def __init__(self, llm: BaseLanguageModel) -> None:
        super().__init__(
            llm,
            validator=LLMValidator(
                schema_model=AnomalyAnalysisResult,
                max_retries=2,
                repair_prompt=default_repair_prompt,
            ),
        )

    def generate(
        self,
        *,
        page_metrics: str,
        competitor_context: str,
        recent_changes: str,
    ) -> AnomalyAnalysisResult:
        LOGGER.info("Analyzing anomaly for page context")
        chain = self._ensure_chain(ANOMALY_ANALYZER_PROMPT)
        raw_output = chain.run(
            page_metrics=page_metrics,
            competitor_context=competitor_context,
            recent_changes=recent_changes,
        )
        result = self._post_process(raw_output)
        LOGGER.debug("Anomaly analysis produced %s causes", len(result.likely_causes))
        return result
