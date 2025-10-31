"""Utility functions for scraping backlinks."""
from __future__ import annotations

from typing import List

from bs4 import BeautifulSoup


def parse_backlinks(html: str) -> List[str]:
    """Extract backlink URLs from a chunk of HTML."""
    soup = BeautifulSoup(html, "html.parser")
    links: List[str] = []
    for anchor in soup.select("a[href]"):
        href = anchor.get("href", "").strip()
        if href and href.startswith("http"):
            links.append(href)
    return links
