import asyncio
import re

import structlog
from playwright.async_api import Page

from .config import SITE_REGISTRY, VeevScraperSettings
from .utils import normalize_url, is_same_domain

log = structlog.get_logger()


class VeevCrawler:
    """Discovers all pages containing VEEV product images."""

    def __init__(self, settings: VeevScraperSettings):
        self.settings = settings
        self.visited: set[str] = set()

    async def crawl(self, page: Page, region: str) -> list[str]:
        """
        Discover all page URLs to scrape for a given region.
        Returns a deduplicated list of URLs.
        """
        site = SITE_REGISTRY[region]
        base_url = site["base_url"]
        entry_points = site["entry_points"]
        link_patterns = [re.compile(p) for p in site["link_patterns"]]
        exclude_patterns = [re.compile(p) for p in site["exclude_patterns"]]

        # Start with entry point URLs
        queue: list[str] = []
        for ep in entry_points:
            url = normalize_url(ep, base_url)
            if url not in self.visited:
                queue.append(url)

        discovered: list[str] = []

        while queue and len(discovered) < self.settings.max_pages_per_site:
            url = queue.pop(0)
            if url in self.visited:
                continue
            self.visited.add(url)

            log.info("crawling_page", url=url, discovered=len(discovered))

            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(1500)  # let JS render
            except Exception as exc:
                log.warning("crawl_page_failed", url=url, error=str(exc))
                continue

            discovered.append(url)

            # Extract links from the page
            links = await self._extract_links(page, base_url)

            for link in links:
                normalized = normalize_url(link, base_url)
                if normalized in self.visited:
                    continue
                if not self._is_valid_url(normalized, base_url, link_patterns, exclude_patterns):
                    continue
                queue.append(normalized)

            # Respect crawl delay
            await asyncio.sleep(self.settings.crawl_delay_seconds)

        log.info("crawl_complete", region=region, pages=len(discovered))
        return discovered

    async def _extract_links(self, page: Page, base_url: str) -> list[str]:
        """Extract all anchor hrefs from the current page."""
        try:
            links = await page.eval_on_selector_all(
                "a[href]",
                "elements => elements.map(e => e.href)"
            )
            return [
                link for link in links
                if link and is_same_domain(link, base_url)
            ]
        except Exception as exc:
            log.warning("link_extraction_failed", error=str(exc))
            return []

    def _is_valid_url(
        self,
        url: str,
        base_url: str,
        link_patterns: list[re.Pattern],
        exclude_patterns: list[re.Pattern],
    ) -> bool:
        """Check if a URL should be crawled."""
        if not is_same_domain(url, base_url):
            return False
        # Must match at least one link pattern
        if not any(p.search(url) for p in link_patterns):
            return False
        # Must not match any exclusion pattern
        if any(p.search(url) for p in exclude_patterns):
            return False
        return True
