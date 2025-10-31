"""Unit tests for scraper parsing logic."""
from __future__ import annotations

from app.scraper import parse_backlinks


HTML_FIXTURE = """
<html>
  <body>
    <a href="https://example.com">Example</a>
    <a href="http://another.test/page">Another</a>
    <a href="/relative/path">Should be ignored</a>
  </body>
</html>
""".strip()


def test_parse_backlinks_extracts_absolute_urls() -> None:
    urls = parse_backlinks(HTML_FIXTURE)
    assert urls == [
        "https://example.com",
        "http://another.test/page",
    ]
