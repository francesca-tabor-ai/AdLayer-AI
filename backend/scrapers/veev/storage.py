import json
import os

import structlog

from .config import VeevScraperSettings
from .models import ScrapeManifest

log = structlog.get_logger()


class StorageAdapter:
    """Manages local file storage and manifest output."""

    def __init__(self, settings: VeevScraperSettings):
        self.settings = settings

    def ensure_dirs(self, regions: list[str]) -> None:
        """Create output directory structure."""
        for region in regions:
            for subdir in ("product", "banner", "logo", "lifestyle", "promotional", "icon", "unknown"):
                path = os.path.join(self.settings.output_dir, region, subdir)
                os.makedirs(path, exist_ok=True)
        metadata_dir = os.path.join(self.settings.output_dir, "metadata")
        os.makedirs(metadata_dir, exist_ok=True)

    def write_manifest(self, manifest: ScrapeManifest) -> str:
        """Write the JSON manifest file. Returns the file path."""
        metadata_dir = os.path.join(self.settings.output_dir, "metadata")
        os.makedirs(metadata_dir, exist_ok=True)
        path = os.path.join(metadata_dir, f"manifest_{manifest.job.job_id}.json")

        with open(path, "w", encoding="utf-8") as f:
            json.dump(manifest.model_dump(mode="json"), f, indent=2, default=str)

        log.info("manifest_written", path=path, items=len(manifest.items))
        return path
