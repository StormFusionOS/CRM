"""High-level orchestration for the AI-powered SEO engine."""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Dict, Iterable, List, Optional

from langchain.embeddings.base import Embeddings
from langchain.schema import BaseRetriever
from langchain.vectorstores import Qdrant
from langchain_core.language_models import BaseLanguageModel

from .config import AISettings
from .generators import (
    AnomalyAnalysisResult,
    AnomalyAnalyzer,
    ContentRefresher,
    FAQEntry,
    FAQGenerator,
    MetaDescriptionRewriter,
    SchemaInjector,
)
from .retriever import DocumentPayload, QdrantVectorStoreManager, build_combined_retriever

LOGGER = logging.getLogger(__name__)


@dataclass
class AuditIssue:
    """Represents a detected SEO issue needing follow-up."""

    page_id: str
    summary: str
    recommended_actions: List[str]


@dataclass
class ChangeLogEntry:
    """Tracks generated changes awaiting human review."""

    page_id: str
    change_type: str
    payload: Dict[str, str]
    status: str = "pending"


@dataclass
class SEOContext:
    """State container passed across the SEO processing cycle."""

    site_documents: Iterable[DocumentPayload] = field(default_factory=list)
    competitor_documents: Iterable[DocumentPayload] = field(default_factory=list)
    new_scraped_content: Iterable[DocumentPayload] = field(default_factory=list)


class ActionOrchestrator:
    """Coordinates follow-up actions based on analyzer output."""

    def __init__(
        self,
        *,
        content_refresher: ContentRefresher,
        faq_generator: FAQGenerator,
        schema_injector: SchemaInjector,
        change_log: List[ChangeLogEntry],
        audit_issues: List[AuditIssue],
    ) -> None:
        self.content_refresher = content_refresher
        self.faq_generator = faq_generator
        self.schema_injector = schema_injector
        self.change_log = change_log
        self.audit_issues = audit_issues

    def handle_anomaly(
        self,
        *,
        page_id: str,
        page_content: str,
        topic: str,
        competitor_insights: str,
        analysis: AnomalyAnalysisResult,
    ) -> None:
        LOGGER.info("Handling anomaly for page %s", page_id)
        self.audit_issues.append(
            AuditIssue(
                page_id=page_id,
                summary="; ".join(analysis.likely_causes),
                recommended_actions=analysis.recommended_actions,
            )
        )
        update_needed = any("content" in action.lower() for action in analysis.recommended_actions)
        if update_needed:
            refresh = self.content_refresher.generate(
                page_content=page_content,
                topic=topic,
                competitor_insights=competitor_insights,
            )
            self.change_log.append(
                ChangeLogEntry(
                    page_id=page_id,
                    change_type="content_refresh",
                    payload={
                        "sections_to_improve": "\n".join(refresh.sections_to_improve),
                        "suggested_updates": "\n".join(refresh.suggested_updates),
                    },
                )
            )
        faq_needed = any("faq" in action.lower() for action in analysis.recommended_actions)
        if faq_needed:
            faqs = self.faq_generator.generate(page_content=page_content, topic=topic)
            self.change_log.append(
                ChangeLogEntry(
                    page_id=page_id,
                    change_type="faq_update",
                    payload={"faqs": faqs.model_dump_json()},
                )
            )
            schema = self.schema_injector.generate(page_content=page_content, faqs=faqs.faqs, business_info="")
            self.change_log.append(
                ChangeLogEntry(
                    page_id=page_id,
                    change_type="schema_update",
                    payload={"schema": schema.model_dump_json()},
                )
            )


class SEOPipeline:
    """Orchestrates retrieval, analysis, and content generation workflows."""

    def __init__(
        self,
        *,
        settings: AISettings,
        llm: BaseLanguageModel,
        embeddings: Embeddings,
    ) -> None:
        self.settings = settings
        self.llm = llm
        self.embeddings = embeddings
        self.vector_manager = QdrantVectorStoreManager(settings, embeddings)
        self.retriever: Optional[BaseRetriever] = None
        self.competitor_collection = f"{self.settings.default_collection}_competitors"
        self.change_log: List[ChangeLogEntry] = []
        self.audit_issues: List[AuditIssue] = []
        self.faq_generator = FAQGenerator(llm)
        self.meta_description_rewriter = MetaDescriptionRewriter(llm)
        self.content_refresher = ContentRefresher(llm)
        self.schema_injector = SchemaInjector(llm)
        self.anomaly_analyzer = AnomalyAnalyzer(llm)
        self.orchestrator = ActionOrchestrator(
            content_refresher=self.content_refresher,
            faq_generator=self.faq_generator,
            schema_injector=self.schema_injector,
            change_log=self.change_log,
            audit_issues=self.audit_issues,
        )

    def initialize_retriever(self, competitor_collection: Optional[str] = None) -> None:
        """Initialize the combined retriever if not already set."""

        if self.retriever is None:
            self.retriever = build_combined_retriever(
                settings=self.settings,
                embeddings=self.embeddings,
                competitor_collection=competitor_collection,
            )
            LOGGER.info("Combined retriever initialized")

    def ingest_documents(self, *, documents: Iterable[DocumentPayload]) -> None:
        """Add documents to the default Qdrant collection."""

        docs = list(documents)
        if not docs:
            return
        LOGGER.info("Ingesting %s documents", len(docs))
        self.vector_manager.add_documents(docs)

    def ingest_competitor_documents(self, *, documents: Iterable[DocumentPayload]) -> None:
        """Add competitor documents to the dedicated collection."""

        docs = list(documents)
        if not docs:
            return
        LOGGER.info("Ingesting %s competitor documents", len(docs))
        self.vector_manager.add_documents_to_collection(docs, collection_name=self.competitor_collection)

    def run_anomaly_workflow(
        self,
        *,
        page_id: str,
        page_content: str,
        topic: str,
        competitor_insights: str,
        metrics: str,
        recent_changes: str,
    ) -> None:
        """Execute the anomaly analysis and downstream remediation actions."""

        analysis = self.anomaly_analyzer.generate(
            page_metrics=metrics,
            competitor_context=competitor_insights,
            recent_changes=recent_changes,
        )
        self.orchestrator.handle_anomaly(
            page_id=page_id,
            page_content=page_content,
            topic=topic,
            competitor_insights=competitor_insights,
            analysis=analysis,
        )

    def generate_meta_description(
        self,
        *,
        page_id: str,
        page_content: str,
        current_description: str,
        target_keywords: str,
    ) -> None:
        """Generate an improved meta description and log the suggestion."""

        suggestion = self.meta_description_rewriter.generate(
            page_content=page_content,
            current_description=current_description,
            target_keywords=target_keywords,
        )
        self.change_log.append(
            ChangeLogEntry(
                page_id=page_id,
                change_type="meta_description",
                payload=suggestion.model_dump(),
            )
        )

    def process_cycle(self, context: SEOContext) -> Dict[str, List]:
        """Run a full SEO processing cycle."""

        LOGGER.info("Starting SEO cycle")
        if context.site_documents:
            self.ingest_documents(documents=context.site_documents)
        if context.competitor_documents:
            self.ingest_competitor_documents(documents=context.competitor_documents)
        if context.new_scraped_content:
            self.ingest_documents(documents=context.new_scraped_content)
        self.initialize_retriever(competitor_collection=self.competitor_collection)
        LOGGER.info("SEO cycle complete")
        return {
            "change_log": [entry.__dict__ for entry in self.change_log],
            "audit_issues": [issue.__dict__ for issue in self.audit_issues],
        }


def process_seo_cycle(
    *,
    settings: AISettings,
    llm: BaseLanguageModel,
    embeddings: Embeddings,
    context: Optional[SEOContext] = None,
) -> Dict[str, List]:
    """Convenience function to execute a cycle end-to-end.

    Example:
        >>> from langchain_openai import ChatOpenAI, OpenAIEmbeddings
        >>> settings = AISettings()
        >>> pipeline = process_seo_cycle(
        ...     settings=settings,
        ...     llm=ChatOpenAI(model=settings.llm_model),
        ...     embeddings=OpenAIEmbeddings(model=settings.embeddings_model),
        ...     context=SEOContext(
        ...         site_documents=[
        ...             DocumentPayload(content="Sample page text", metadata={"source": "site", "page_id": "home"})
        ...         ]
        ...     ),
        ... )
        >>> pipeline["change_log"]
    """

    pipeline = SEOPipeline(settings=settings, llm=llm, embeddings=embeddings)
    return pipeline.process_cycle(context or SEOContext())
