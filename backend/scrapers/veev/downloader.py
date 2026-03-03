import asyncio
import os

import httpx
import structlog
from PIL import Image as PILImage
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from .config import VeevScraperSettings
from .models import ScrapedItem
from .utils import content_hash, slugify_filename, extract_extension

log = structlog.get_logger()


class VeevDownloader:
    """Downloads images asynchronously with retry and deduplication."""

    def __init__(self, settings: VeevScraperSettings):
        self.settings = settings
        self.semaphore = asyncio.Semaphore(settings.max_concurrent_downloads)
        self.downloaded_hashes: set[str] = set()
        self._stats = {"downloaded": 0, "skipped_dup": 0, "failed": 0}

    async def download_all(self, items: list[ScrapedItem]) -> list[ScrapedItem]:
        """Download all images concurrently. Returns items with updated local_path/hash."""
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(self.settings.download_timeout_seconds),
            follow_redirects=True,
            headers={"User-Agent": self.settings.user_agent},
        ) as client:
            tasks = [self._download_one(client, item) for item in items]
            results = await asyncio.gather(*tasks, return_exceptions=True)

        successful = []
        for result in results:
            if isinstance(result, Exception):
                log.warning("download_exception", error=str(result))
                self._stats["failed"] += 1
            elif result is not None:
                successful.append(result)

        log.info(
            "download_complete",
            downloaded=self._stats["downloaded"],
            skipped_dup=self._stats["skipped_dup"],
            failed=self._stats["failed"],
        )
        return successful

    async def _download_one(
        self, client: httpx.AsyncClient, item: ScrapedItem
    ) -> ScrapedItem | None:
        """Download a single image with semaphore-bounded concurrency."""
        async with self.semaphore:
            try:
                return await self._do_download(client, item)
            except Exception as exc:
                log.warning(
                    "download_failed",
                    url=item.image.source_url,
                    error=str(exc),
                )
                self._stats["failed"] += 1
                return None

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=2, min=1, max=30),
        retry=retry_if_exception_type((httpx.TimeoutException, httpx.NetworkError)),
    )
    async def _do_download(
        self, client: httpx.AsyncClient, item: ScrapedItem
    ) -> ScrapedItem | None:
        """Execute the actual download with retries."""
        url = item.image.source_url
        response = await client.get(url)
        response.raise_for_status()

        data = response.content
        if not data:
            return None

        # Deduplication by content hash
        file_hash = content_hash(data)
        if file_hash in self.downloaded_hashes:
            log.debug("skipping_duplicate", url=url, hash=file_hash[:12])
            self._stats["skipped_dup"] += 1
            item.image.content_hash = file_hash
            return None
        self.downloaded_hashes.add(file_hash)

        # Build local file path
        ext = extract_extension(url)
        content_type = response.headers.get("content-type", "")
        if "svg" in content_type:
            ext = "svg"
        elif "webp" in content_type:
            ext = "webp"

        slug = slugify_filename(item.alt_text or item.image.id[:12])
        filename = f"{slug}_{file_hash[:8]}.{ext}"
        type_dir = item.image.image_type.value
        local_dir = os.path.join(
            self.settings.output_dir, item.region, type_dir
        )
        os.makedirs(local_dir, exist_ok=True)
        local_path = os.path.join(local_dir, filename)

        # Write file
        with open(local_path, "wb") as f:
            f.write(data)

        # Extract dimensions
        width, height = self._get_dimensions(local_path, ext)

        # Update item
        item.image.local_path = local_path
        item.image.content_hash = file_hash
        item.image.file_size_bytes = len(data)
        item.image.file_format = ext
        if width and height:
            item.image.width = width
            item.image.height = height

        self._stats["downloaded"] += 1
        log.debug("downloaded", url=url, path=local_path, size=len(data))
        return item

    def _get_dimensions(self, path: str, ext: str) -> tuple[int | None, int | None]:
        """Extract image dimensions using Pillow. Skip SVGs."""
        if ext == "svg":
            return None, None
        try:
            with PILImage.open(path) as img:
                return img.width, img.height
        except Exception:
            return None, None
