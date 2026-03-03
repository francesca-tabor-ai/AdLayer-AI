import re
from urllib.parse import urljoin

import structlog
from playwright.async_api import Page

from .config import SITE_REGISTRY
from .models import (
    ImageType,
    PageMetadata,
    ProductMetadata,
    ScrapedImage,
    ScrapedItem,
)
from .utils import normalize_url, is_image_url, extract_extension

log = structlog.get_logger()

# Minimum image dimensions to consider (skip tiny icons/spacers)
MIN_IMAGE_SIZE = 40


class VeevParser:
    """Extracts images and metadata from VEEV web pages."""

    async def parse_page(self, page: Page, url: str, region: str) -> list[ScrapedItem]:
        """Extract all images and metadata from a single page."""
        site = SITE_REGISTRY[region]

        # Trigger lazy loading by scrolling
        await self._trigger_lazy_load(page)

        # Extract page metadata
        page_meta = await self._extract_page_metadata(page, url)

        # Find all images
        image_selectors = site["image_selectors"]
        seen_urls: set[str] = set()
        items: list[ScrapedItem] = []

        for selector in image_selectors:
            try:
                elements = await page.query_selector_all(selector)
            except Exception:
                continue

            for el in elements:
                try:
                    img_data = await self._extract_image_data(el, page, url, region)
                    if not img_data:
                        continue
                    img_url = img_data["source_url"]
                    if img_url in seen_urls:
                        continue
                    seen_urls.add(img_url)

                    # Classify image type
                    image_type = self._classify_image(
                        img_url, img_data.get("alt", ""), img_data.get("classes", [])
                    )

                    # Extract product context
                    product = await self._extract_product_context(el)

                    item = ScrapedItem(
                        image=ScrapedImage(
                            source_url=img_url,
                            image_type=image_type,
                            file_format=extract_extension(img_url),
                        ),
                        page=page_meta,
                        product=product,
                        alt_text=img_data.get("alt"),
                        css_classes=img_data.get("classes"),
                        region=region,
                    )
                    items.append(item)
                except Exception as exc:
                    log.debug("image_extraction_error", error=str(exc), selector=selector)

        log.info("page_parsed", url=url, images=len(items))
        return items

    async def _trigger_lazy_load(self, page: Page) -> None:
        """Scroll through the page to trigger lazy-loaded images."""
        try:
            await page.evaluate("""
                async () => {
                    const delay = ms => new Promise(r => setTimeout(r, ms));
                    const height = document.body.scrollHeight;
                    const step = window.innerHeight;
                    for (let y = 0; y < height; y += step) {
                        window.scrollTo(0, y);
                        await delay(300);
                    }
                    window.scrollTo(0, 0);
                }
            """)
            await page.wait_for_timeout(1000)
        except Exception as exc:
            log.debug("lazy_load_scroll_failed", error=str(exc))

    async def _extract_page_metadata(self, page: Page, url: str) -> PageMetadata:
        """Extract page-level metadata from head tags."""
        try:
            data = await page.evaluate("""
                () => ({
                    title: document.title || '',
                    metaDesc: document.querySelector('meta[name="description"]')?.content || '',
                    ogTitle: document.querySelector('meta[property="og:title"]')?.content || '',
                    ogDesc: document.querySelector('meta[property="og:description"]')?.content || '',
                    ogImage: document.querySelector('meta[property="og:image"]')?.content || '',
                    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
                })
            """)
        except Exception:
            data = {}

        return PageMetadata(
            page_url=url,
            page_title=data.get("title"),
            meta_description=data.get("metaDesc") or None,
            og_title=data.get("ogTitle") or None,
            og_description=data.get("ogDesc") or None,
            og_image=data.get("ogImage") or None,
            canonical_url=data.get("canonical") or None,
        )

    async def _extract_image_data(
        self, el, page: Page, page_url: str, region: str
    ) -> dict | None:
        """Extract image URL, alt text, and classes from an element."""
        try:
            data = await el.evaluate("""
                el => {
                    let src = '';
                    if (el.tagName === 'SOURCE') {
                        src = el.srcset || el.src || '';
                    } else if (el.tagName === 'IMG') {
                        src = el.currentSrc || el.src || el.dataset.src || el.dataset.lazy || '';
                    }
                    // Handle srcset - pick largest
                    if (src && src.includes(',')) {
                        const parts = src.split(',').map(s => s.trim().split(/\\s+/));
                        src = parts[parts.length - 1][0];
                    }
                    return {
                        src: src,
                        alt: el.alt || '',
                        classes: Array.from(el.classList || []),
                        width: el.naturalWidth || el.width || 0,
                        height: el.naturalHeight || el.height || 0,
                    };
                }
            """)
        except Exception:
            return None

        src = data.get("src", "").strip()
        if not src or src.startswith("data:"):
            return None

        # Resolve relative URLs
        source_url = normalize_url(src, page_url)
        if not source_url or not is_image_url(source_url):
            # Also accept CDN URLs even without obvious extension
            site = SITE_REGISTRY[region]
            if not any(re.search(p, source_url) for p in site["cdn_patterns"]):
                return None

        # Filter out tiny images (spacers, tracking pixels)
        w = data.get("width", 0)
        h = data.get("height", 0)
        if w and h and w < MIN_IMAGE_SIZE and h < MIN_IMAGE_SIZE:
            return None

        return {
            "source_url": source_url,
            "alt": data.get("alt") or None,
            "classes": data.get("classes") or [],
        }

    def _classify_image(self, url: str, alt: str, classes: list[str]) -> ImageType:
        """Classify the image type based on URL, alt text, and CSS classes."""
        url_lower = url.lower()
        alt_lower = (alt or "").lower()
        classes_str = " ".join(classes).lower()

        # Logo detection
        if any(kw in url_lower for kw in ("logo", "brand-logo")):
            return ImageType.LOGO
        if any(kw in alt_lower for kw in ("logo", "veev logo", "iqos logo")):
            return ImageType.LOGO
        if url_lower.endswith(".svg"):
            return ImageType.LOGO

        # Product image detection
        product_keywords = ("product", "device", "pod", "starter", "veev-one", "veev-now", "thumbnail")
        if any(kw in url_lower for kw in product_keywords):
            return ImageType.PRODUCT
        if any(kw in alt_lower for kw in ("veev one", "veev now", "device", "pod", "starter kit")):
            return ImageType.PRODUCT
        if any(kw in classes_str for kw in ("product",)):
            return ImageType.PRODUCT

        # Banner detection
        banner_keywords = ("banner", "hero", "promo", "campaign", "header-image")
        if any(kw in url_lower for kw in banner_keywords):
            return ImageType.BANNER
        if any(kw in classes_str for kw in ("hero", "banner", "slick")):
            return ImageType.BANNER

        # Lifestyle
        if any(kw in url_lower for kw in ("lifestyle", "editorial", "discover")):
            return ImageType.LIFESTYLE

        return ImageType.UNKNOWN

    async def _extract_product_context(self, img_element) -> ProductMetadata | None:
        """Walk up the DOM to find product card context around the image."""
        try:
            data = await img_element.evaluate("""
                el => {
                    // Walk up to find a product card container
                    let node = el;
                    let card = null;
                    for (let i = 0; i < 8; i++) {
                        node = node.parentElement;
                        if (!node) break;
                        const cls = (node.className || '').toLowerCase();
                        const tag = node.tagName.toLowerCase();
                        if (cls.includes('product') || cls.includes('card') ||
                            cls.includes('node--type') || node.dataset.productId ||
                            cls.includes('MuiCard') || tag === 'article') {
                            card = node;
                            break;
                        }
                    }
                    if (!card) return null;

                    // Extract text from card
                    const getText = sel => {
                        const el = card.querySelector(sel);
                        return el ? el.textContent.trim() : '';
                    };

                    const name = getText('h2, h3, h4, .product-name, .product-title, [class*="title"]');
                    const price = getText('.price, [class*="price"], .product-price');
                    const sku = card.dataset.sku || card.dataset.productId || '';
                    const color = getText('[class*="color"], [class*="variant"]');

                    return { name, price, sku, color };
                }
            """)
        except Exception:
            return None

        if not data or not any(data.values()):
            return None

        # Detect product line
        name = (data.get("name") or "").lower()
        product_line = None
        if "veev one" in name or "veev-one" in name:
            product_line = "VEEV ONE"
        elif "veev now" in name or "veev-now" in name:
            product_line = "VEEV NOW ULTRA"

        # Detect flavor from name
        flavor = None
        known_flavors = [
            "blue mint", "blue raspberry", "blueberry", "watermelon",
            "classic mint", "gold tobacco", "sour apple", "grape",
            "peach", "strawberry", "cherry",
        ]
        for f in known_flavors:
            if f in name:
                flavor = f.title()
                break

        return ProductMetadata(
            product_name=data.get("name") or None,
            product_line=product_line,
            color=data.get("color") or None,
            flavor=flavor,
            sku=data.get("sku") or None,
            price=data.get("price") or None,
        )
