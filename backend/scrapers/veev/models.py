from datetime import datetime, timezone
from enum import Enum
from typing import Optional
import uuid

from pydantic import BaseModel, Field


class ImageType(str, Enum):
    PRODUCT = "product"
    LIFESTYLE = "lifestyle"
    BANNER = "banner"
    LOGO = "logo"
    ICON = "icon"
    PROMOTIONAL = "promotional"
    UNKNOWN = "unknown"


class ScrapedImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source_url: str
    local_path: Optional[str] = None
    s3_url: Optional[str] = None
    content_hash: Optional[str] = None
    file_format: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    file_size_bytes: Optional[int] = None
    image_type: ImageType = ImageType.UNKNOWN


class ProductMetadata(BaseModel):
    product_name: Optional[str] = None
    product_line: Optional[str] = None
    color: Optional[str] = None
    flavor: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[str] = None
    currency: Optional[str] = None


class PageMetadata(BaseModel):
    page_url: str
    page_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None


class ScrapedItem(BaseModel):
    """A single scraped item combining an image with its context."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image: ScrapedImage
    page: PageMetadata
    product: Optional[ProductMetadata] = None
    alt_text: Optional[str] = None
    css_classes: Optional[list[str]] = None
    region: str
    scraped_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ScrapeJob(BaseModel):
    """Represents a complete scrape run."""
    job_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand: str = "veev"
    regions: list[str] = Field(default_factory=list)
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    status: str = "pending"
    pages_crawled: int = 0
    images_found: int = 0
    images_downloaded: int = 0
    errors: list[str] = Field(default_factory=list)


class ScrapeManifest(BaseModel):
    """Output manifest written alongside downloaded images."""
    job: ScrapeJob
    items: list[ScrapedItem] = Field(default_factory=list)
    metadata_version: str = "1.0.0"
