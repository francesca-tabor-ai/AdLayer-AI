# AdLayer AI

**Turn every advertisement into structured, machine-readable, automation-ready data.**

AdLayer AI is a Creative Intelligence Platform that deconstructs static ad creatives into queryable, reusable data models. Upload a flat image. Get back structured layers, semantic classifications, information architecture, and production-ready exports.

---

## The Problem

Marketing teams produce thousands of ads across paid social, display, e-commerce, print, email, and retail. But the intelligence inside those creatives stays locked in flat image files.

- Scaling creative production is slow and manual
- Reverse-engineering competitor ads is guesswork
- Design systems are inconsistently applied across campaigns
- Data Merge and automation workflows require hours of manual setup

There is no standard way to extract messaging hierarchy, CTA positioning, offer structure, brand placement, or layout architecture from an advertisement.

**AdLayer AI fixes that.**

---

## How It Works

```
Upload an ad image  -->  AI deconstructs it  -->  Export structured data
```

1. **Upload** any ad creative (JPG, PNG, WebP, PDF)
2. **Deconstruct** -- AI detects visual layers, extracts text, classifies every element
3. **Structure** -- elements are grouped into semantic marketing blocks (Brand, Value, Offer, Conversion, Compliance)
4. **Export** -- download production-ready CSV, JSON, or cropped asset packages

---

## Core Capabilities

### Creative Deconstruction Engine
Detect and isolate text regions, product images, logos, CTA buttons, badges, backgrounds, and decorative elements -- each with bounding box coordinates, confidence scores, and z-order.

### Semantic Classification
Every element is auto-labeled: Headline, Subheadline, Offer, Price, Discount, CTA, Brand, Legal, Badge. Override any classification with a single click.

### Information Architecture Modeling
Elements are grouped into logical marketing blocks -- Brand Layer, Value Proposition Layer, Offer Layer, Conversion Layer, Compliance Layer -- transforming a flat image into a content system.

### Data-Merge Ready Export
Generate CSVs with customizable headers, @Image field formatting, and asset folders. Plug directly into InDesign Data Merge, Figma, or any automation pipeline.

### Brand Scraping & Ingestion
Automatically scrape product images and metadata from brand websites. Feed them directly into the analysis pipeline for competitive intelligence, creative audits, or catalog automation.

---

## Quick Start: Brand Scraper

The scraper module collects product images and structured metadata from brand websites, bypassing age gates and cookie walls automatically.

### Install

```bash
pip install -r backend/requirements.txt
python -m playwright install chromium
```

### Run

```bash
# Scrape a brand website (e.g., VEEV by PMI -- Swiss site)
python -m backend.scrapers.veev scrape --region ch_en

# Limit to 5 pages for a quick test
python -m backend.scrapers.veev scrape --region ch_en --max-pages 5

# Preview what would be scraped without downloading
python -m backend.scrapers.veev scrape --region ch_en --dry-run

# Show browser for debugging
python -m backend.scrapers.veev scrape --region ch_en --headed
```

### Output

```
output/veev/
  ch_en/
    product/     # Device images, pod images, starter kits
    banner/      # Campaign banners, hero images
    logo/        # Brand logos, icons
    lifestyle/   # Editorial and discover imagery
  metadata/
    manifest_<job-id>.json   # Full structured metadata for every image
```

Each image in the manifest includes:
- **Source**: original CDN URL, content hash (SHA-256), file format, dimensions
- **Product context**: product name, product line, color, flavor, SKU, price
- **Page context**: page title, canonical URL, Open Graph tags, alt text
- **Classification**: image type (product, banner, logo, lifestyle, promotional)

---

## Architecture

```
Client (Web UI / CLI)
      |
  API Gateway (FastAPI)
      |
  +---------+---------+---------+---------+
  | Image   | Layout  | OCR     | Semantic|
  | Ingest  | Detect  | Extract | Classify|
  +---------+---------+---------+---------+
      |           |         |         |
  Object Storage (S3)   PostgreSQL   Redis/Celery
```

- **Backend**: Python, FastAPI, SQLAlchemy, Celery
- **Frontend**: Next.js 14, React, TailwindCSS, Zustand
- **Storage**: S3-compatible (MinIO for local dev)
- **Database**: PostgreSQL
- **Queue**: Redis + Celery for async processing
- **Browser Automation**: Playwright (for scraping)

---

## Who It's For

**Marketing Operations** -- Automate creative production. Extract structured data from any ad. Scale variants across markets without rebuilding from scratch.

**Creative Agencies** -- Reverse-engineer competitor ads at scale. Convert mockups into structured production files. Audit layout systems across entire campaigns.

**E-commerce Brands** -- Turn promotional ads into structured product feeds. Generate localized versions automatically. Connect creative data to catalog automation.

**Automation & Publishing Teams** -- Feed structured outputs directly into layout automation pipelines. Enable print-ready workflows via InDesign Data Merge.

---

## Roadmap

| Phase | Timeline | Focus |
|-------|----------|-------|
| **MVP** | 0-6 months | Core deconstruction engine + CSV export |
| **V1** | 6-12 months | Creative intelligence layer + analytics |
| **V2** | 12-18 months | API platform + DAM integrations |
| **V3** | 18-24 months | Auto-template reconstruction + variant generation |

---

## Project Structure

```
backend/
  scrapers/           # Brand website scraping modules
    veev/             # VEEV (PMI) scraper -- first implementation
  requirements.txt    # Python dependencies
docs/                 # Architecture and planning documentation
```

---

## License

Proprietary. All rights reserved.
