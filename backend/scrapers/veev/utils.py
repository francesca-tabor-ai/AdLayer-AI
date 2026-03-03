import hashlib
import re
from urllib.parse import urljoin, urlparse, urlunparse, parse_qs, urlencode

from slugify import slugify


def normalize_url(url: str, base_url: str = "") -> str:
    """Resolve relative URLs and strip fragments/tracking params."""
    if base_url:
        url = urljoin(base_url, url)
    parsed = urlparse(url)
    # Strip fragment
    cleaned = parsed._replace(fragment="")
    # Remove common tracking params
    if cleaned.query:
        params = parse_qs(cleaned.query, keep_blank_values=False)
        tracking_prefixes = ("utm_", "fbclid", "gclid", "mc_", "ref_")
        filtered = {
            k: v for k, v in params.items()
            if not any(k.startswith(p) for p in tracking_prefixes)
        }
        cleaned = cleaned._replace(query=urlencode(filtered, doseq=True))
    return urlunparse(cleaned)


def content_hash(data: bytes) -> str:
    """SHA-256 hash of file content for deduplication."""
    return hashlib.sha256(data).hexdigest()


def slugify_filename(name: str, max_length: int = 80) -> str:
    """Create a filesystem-safe slug from a name."""
    return slugify(name, max_length=max_length)


def extract_extension(url: str) -> str:
    """Extract file extension from a URL path."""
    path = urlparse(url).path
    match = re.search(r'\.([a-zA-Z0-9]+)(?:\?|$)', path)
    if match:
        ext = match.group(1).lower()
        if ext in ("jpg", "jpeg", "png", "gif", "webp", "svg", "avif"):
            return ext
    return "png"  # default fallback


def is_same_domain(url: str, base_url: str) -> bool:
    """Check if url belongs to the same domain as base_url."""
    return urlparse(url).netloc == urlparse(base_url).netloc


def is_image_url(url: str) -> bool:
    """Check if a URL likely points to an image file."""
    path = urlparse(url).path.lower()
    return any(path.endswith(ext) for ext in (
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif",
    )) or "is/image/" in url  # Adobe Dynamic Media pattern
