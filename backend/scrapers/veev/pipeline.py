from datetime import datetime, timezone

import structlog
from playwright.async_api import async_playwright

from .age_gate import AgeGateHandler
from .config import SITE_REGISTRY, VeevScraperSettings
from .crawler import VeevCrawler
from .downloader import VeevDownloader
from .models import ScrapeJob, ScrapeManifest, ScrapedItem
from .parser import VeevParser
from .storage import StorageAdapter

log = structlog.get_logger()


class VeevScrapePipeline:
    """Orchestrates the full scrape workflow: crawl -> parse -> download -> manifest."""

    def __init__(self, settings: VeevScraperSettings | None = None):
        self.settings = settings or VeevScraperSettings()
        self.age_gate = AgeGateHandler(self.settings)
        self.crawler = VeevCrawler(self.settings)
        self.parser = VeevParser()
        self.downloader = VeevDownloader(self.settings)
        self.storage = StorageAdapter(self.settings)

    async def run(
        self,
        regions: list[str] | None = None,
        dry_run: bool = False,
    ) -> ScrapeManifest:
        """
        Execute the full scrape pipeline.

        Args:
            regions: List of region codes to scrape (default: all in SITE_REGISTRY)
            dry_run: If True, crawl and parse but don't download images
        """
        if regions is None:
            regions = list(SITE_REGISTRY.keys())

        job = ScrapeJob(regions=regions, status="running")
        self.storage.ensure_dirs(regions)

        log.info("pipeline_started", job_id=job.job_id, regions=regions)

        all_items: list[ScrapedItem] = []

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=self.settings.headless,
            )

            for region in regions:
                site = SITE_REGISTRY.get(region)
                if not site:
                    log.warning("unknown_region", region=region)
                    job.errors.append(f"Unknown region: {region}")
                    continue

                log.info("scraping_region", region=region, base_url=site["base_url"])

                context = await browser.new_context(
                    viewport={
                        "width": self.settings.viewport_width,
                        "height": self.settings.viewport_height,
                    },
                    user_agent=self.settings.user_agent,
                )
                page = await context.new_page()

                try:
                    # Navigate to base URL and handle age gate
                    await page.goto(
                        site["base_url"],
                        wait_until="domcontentloaded",
                        timeout=30000,
                    )
                    await page.wait_for_timeout(2000)

                    try:
                        await self.age_gate.bypass(page, region)
                    except Exception as exc:
                        log.error("age_gate_failed", region=region, error=str(exc))
                        job.errors.append(f"Age gate failed for {region}: {exc}")
                        continue

                    # Crawl to discover pages
                    page_urls = await self.crawler.crawl(page, region)
                    job.pages_crawled += len(page_urls)

                    # Parse each page for images
                    region_items: list[ScrapedItem] = []
                    for url in page_urls:
                        try:
                            await page.goto(
                                url,
                                wait_until="domcontentloaded",
                                timeout=30000,
                            )
                            await page.wait_for_timeout(1000)
                            items = await self.parser.parse_page(page, url, region)
                            region_items.extend(items)
                        except Exception as exc:
                            log.warning("parse_failed", url=url, error=str(exc))
                            job.errors.append(f"Parse failed for {url}: {exc}")

                    # Deduplicate by image URL across all pages
                    seen_urls: set[str] = set()
                    unique_items: list[ScrapedItem] = []
                    for item in region_items:
                        if item.image.source_url not in seen_urls:
                            seen_urls.add(item.image.source_url)
                            unique_items.append(item)

                    job.images_found += len(unique_items)
                    log.info(
                        "region_parsed",
                        region=region,
                        pages=len(page_urls),
                        images_total=len(region_items),
                        images_unique=len(unique_items),
                    )

                    all_items.extend(unique_items)

                finally:
                    await context.close()

            await browser.close()

        # Download images (unless dry run)
        if not dry_run and all_items:
            downloaded = await self.downloader.download_all(all_items)
            job.images_downloaded = len(downloaded)
            all_items = downloaded
        elif dry_run:
            log.info("dry_run_mode", images_found=len(all_items))

        # Build and write manifest
        job.status = "completed"
        job.completed_at = datetime.now(timezone.utc)

        manifest = ScrapeManifest(job=job, items=all_items)
        manifest_path = self.storage.write_manifest(manifest)

        log.info(
            "pipeline_complete",
            job_id=job.job_id,
            pages=job.pages_crawled,
            images_found=job.images_found,
            images_downloaded=job.images_downloaded,
            errors=len(job.errors),
            manifest=manifest_path,
        )

        return manifest
