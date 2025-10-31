"""Retrievers and vector store management for SEO workflows."""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Iterable, List, Optional

from langchain.docstore.document import Document
from langchain.embeddings.base import Embeddings
from langchain.schema import BaseRetriever
from langchain.schema.vectorstore import VectorStore
from langchain.vectorstores import Qdrant
from qdrant_client import QdrantClient

from .config import AISettings

LOGGER = logging.getLogger(__name__)


@dataclass
class DocumentPayload:
    """Representation of indexed content with metadata."""

    content: str
    metadata: dict


class QdrantVectorStoreManager:
    """Wraps a Qdrant vector store for storing SEO-related documents."""

    def __init__(self, settings: AISettings, embeddings: Embeddings) -> None:
        self.settings = settings
        self.embeddings = embeddings
        self.client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key,
        )
        LOGGER.info("Initialized Qdrant client for %s", settings.qdrant_url)
        self.vector_store: VectorStore = Qdrant(
            client=self.client,
            collection_name=settings.default_collection,
            embeddings=embeddings,
        )

    def add_documents(self, documents: Iterable[DocumentPayload]) -> List[str]:
        """Add documents to the default Qdrant collection and return vector ids."""

        return self.add_documents_to_collection(documents)

    def add_documents_to_collection(
        self,
        documents: Iterable[DocumentPayload],
        *,
        collection_name: Optional[str] = None,
    ) -> List[str]:
        """Add documents to a specific Qdrant collection and return vector ids."""

        docs = [Document(page_content=doc.content, metadata=doc.metadata) for doc in documents]
        if not docs:
            return []
        target_collection = collection_name or self.settings.default_collection
        LOGGER.debug("Adding %s documents to collection %s", len(docs), target_collection)
        if collection_name and collection_name != self.settings.default_collection:
            vector_store = Qdrant(
                client=self.client,
                collection_name=collection_name,
                embeddings=self.embeddings,
            )
            ids = vector_store.add_documents(docs)
        else:
            ids = self.vector_store.add_documents(docs)
        LOGGER.info("Added %s documents", len(ids))
        return ids

    def as_retriever(self, *, search_kwargs: Optional[dict] = None) -> BaseRetriever:
        """Return a LangChain retriever wrapping Qdrant."""

        return self.vector_store.as_retriever(search_kwargs=search_kwargs or {"k": 5})


class SERPRetriever(BaseRetriever):
    """Retriever fetching live SERP data via an external API."""

    serp_api_key: Optional[str] = None

    def __init__(self, serp_api_key: Optional[str]) -> None:
        super().__init__()
        self.serp_api_key = serp_api_key

    def _get_relevant_documents(self, query: str) -> List[Document]:
        LOGGER.info("Fetching SERP results for query: %s", query)
        if not self.serp_api_key:
            LOGGER.warning("SERP API key not configured; returning empty results")
            return []
        # Placeholder for actual SERP API integration.
        # In production, call the API and transform results into Document objects.
        return [
            Document(page_content=f"SERP snippet for '{query}'", metadata={"source": "serp", "rank": i + 1})
            for i in range(3)
        ]

    async def _aget_relevant_documents(self, query: str) -> List[Document]:
        return self._get_relevant_documents(query)


class CombinedRetriever(BaseRetriever):
    """Aggregates multiple retrievers (internal, competitors, live SERP)."""

    def __init__(
        self,
        *,
        internal_retriever: BaseRetriever,
        competitor_retriever: Optional[BaseRetriever] = None,
        serp_retriever: Optional[BaseRetriever] = None,
    ) -> None:
        super().__init__()
        self.internal_retriever = internal_retriever
        self.competitor_retriever = competitor_retriever
        self.serp_retriever = serp_retriever

    def _get_relevant_documents(self, query: str) -> List[Document]:
        LOGGER.info("Combined retriever executing for query: %s", query)
        documents: List[Document] = []
        documents.extend(self.internal_retriever.get_relevant_documents(query))
        if self.competitor_retriever:
            documents.extend(self.competitor_retriever.get_relevant_documents(query))
        if self.serp_retriever:
            documents.extend(self.serp_retriever.get_relevant_documents(query))
        LOGGER.debug("Combined retriever returning %s documents", len(documents))
        return documents

    async def _aget_relevant_documents(self, query: str) -> List[Document]:
        return self._get_relevant_documents(query)


def build_combined_retriever(
    *,
    settings: AISettings,
    embeddings: Embeddings,
    competitor_collection: Optional[str] = None,
) -> CombinedRetriever:
    """Construct the combined retriever based on configured stores."""

    vector_manager = QdrantVectorStoreManager(settings, embeddings)
    internal_retriever = vector_manager.as_retriever()

    competitor_retriever: Optional[BaseRetriever] = None
    if competitor_collection and competitor_collection != settings.default_collection:
        competitor_vs = Qdrant(
            client=vector_manager.client,
            collection_name=competitor_collection,
            embeddings=embeddings,
        )
        competitor_retriever = competitor_vs.as_retriever(search_kwargs={"k": 5})

    serp_retriever = SERPRetriever(settings.serp_api_key)
    return CombinedRetriever(
        internal_retriever=internal_retriever,
        competitor_retriever=competitor_retriever,
        serp_retriever=serp_retriever,
    )
