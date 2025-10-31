"""Prompt templates for SEO-focused AI tasks."""
from __future__ import annotations

from langchain.prompts import PromptTemplate

FAQ_PROMPT = PromptTemplate(
    input_variables=["page_content", "topic"],
    template=(
        "You are an expert SEO content strategist.\n"
        "Topic: {topic}\n"
        "Page Content:\n{page_content}\n\n"
        "Generate exactly 5 FAQ entries that align with the topic and content. "
        "Return a JSON object with key 'faqs' whose value is an array of objects with 'question' and 'answer' fields."
    ),
)

META_DESCRIPTION_PROMPT = PromptTemplate(
    input_variables=["page_content", "current_description", "target_keywords"],
    template=(
        "You are an SEO specialist tasked with improving meta descriptions.\n"
        "Current Description: {current_description}\n"
        "Target Keywords: {target_keywords}\n"
        "Page Content:\n{page_content}\n\n"
        "Produce a compelling meta description under 160 characters that naturally includes the target keywords. Return JSON with keys 'meta_description' and 'notes' (notes explain rationale)."
    ),
)

CONTENT_REFRESH_PROMPT = PromptTemplate(
    input_variables=["page_content", "topic", "competitor_insights"],
    template=(
        "You are an SEO content editor.\n"
        "Topic: {topic}\n"
        "Competitor Insights:\n{competitor_insights}\n"
        "Page Content:\n{page_content}\n\n"
        "Identify sections that are outdated or lacking depth. "
        "Return JSON with keys 'sections_to_improve' (list of strings) and 'suggested_updates' (list of strings)."
    ),
)

SCHEMA_INJECTOR_PROMPT = PromptTemplate(
    input_variables=["page_content", "faqs", "business_info"],
    template=(
        "You are a structured data expert.\n"
        "Page Content:\n{page_content}\n"
        "FAQs:\n{faqs}\n"
        "Business Info:\n{business_info}\n\n"
        "Determine the most appropriate JSON-LD schema markup and return JSON with a 'schema_json' key whose value is the JSON-LD object."
    ),
)

ANOMALY_ANALYZER_PROMPT = PromptTemplate(
    input_variables=["page_metrics", "competitor_context", "recent_changes"],
    template=(
        "You are an SEO analyst investigating performance anomalies.\n"
        "Page Metrics:\n{page_metrics}\n"
        "Competitor Context:\n{competitor_context}\n"
        "Recent Changes:\n{recent_changes}\n\n"
        "Hypothesize likely causes for the anomaly and recommend next actions. "
        "Return JSON with keys 'likely_causes' and 'recommended_actions'."
    ),
)
