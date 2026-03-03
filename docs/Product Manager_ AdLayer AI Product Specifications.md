# Product Manager: AdLayer AI Product Specifications

## Product Requirement Document (PRD) - Core Deconstruction Engine (MVP)

**1. Introduction**

This PRD outlines the requirements for the Minimum Viable Product (MVP) of the AdLayer AI Core Deconstruction Engine. The primary goal of this MVP is to enable users to upload static advertisement images and receive structured, machine-readable data in a CSV format, facilitating basic automation workflows.

**2. Goals**

*   Enable accurate extraction of visual and textual elements from ad creatives.
*   Provide a structured output (CSV) that is compatible with data merge tools.
*   Allow users to review and edit extracted data.
*   Ensure a smooth and intuitive upload and export process.

**3. Target Users**

*   Marketing Operations Specialists
*   Junior Creative Production Assistants

**4. User Stories**

*   **As a Marketing Operations Specialist,** I want to upload an ad image so that I can get its content in a structured format.
*   **As a Creative Production Assistant,** I want to see the extracted text and visual elements so that I can verify their accuracy.
*   **As a Marketing Operations Specialist,** I want to export the structured data as a CSV so that I can use it in my data merge workflows.
*   **As a Creative Production Assistant,** I want to be able to correct any misclassified elements so that the output data is accurate.

**5. Features & Detailed Requirements**

### 5.1. Image Ingestion & Processing

*   **Description:** Allows users to upload ad images in various formats and prepares them for processing.
*   **Functional Specifications:**
    *   Support for JPG, PNG, WebP, PDF file formats.
    *   Single image upload via a web interface.
    *   Automatic normalization of resolution, color profile, and orientation.
    *   Extraction of basic metadata (dimensions, aspect ratio).
    *   Versioning: Store original and processed images.

### 5.2. Layout & Region Detection Engine

*   **Description:** Identifies and categorizes distinct visual and textual regions within the uploaded ad.
*   **Functional Specifications:**
    *   Detects text regions, image regions, logos, CTA buttons, badges/stickers, background panels, decorative shapes, and product images.
    *   For each detected region, output:
        *   Bounding box coordinates (x, y, width, height, normalized).
        *   Confidence score.
        *   Visual category (e.g., 'text', 'image', 'logo').
        *   Z-order estimation (layering).
        *   Dominant color.

### 5.3. OCR & Text Structuring

*   **Description:** Extracts text from detected text regions and structures it.
*   **Functional Specifications:**
    *   Multi-language OCR support.
    *   Line merging and paragraph reconstruction for coherent text blocks.
    *   Estimation of font size (relative) and alignment (left/center/right).
    *   Detection of uppercase text.
    *   Price pattern detection (e.g., £, $, €).
    *   Basic semantic inference (rule-based):
        *   Largest text block = Headline candidate.
        *   High-contrast, button-shaped region = CTA candidate.
        *   Small, dense bottom text = Disclaimer candidate.
        *   Currency symbol detection = Price candidate.

### 5.4. Semantic Classification Engine (v1)

*   **Description:** Automatically labels detected elements with marketing-specific roles.
*   **Functional Specifications:**
    *   Auto-labels elements as: Brand, Headline, Subheadline, Body copy, Offer, Price, Discount, CTA label, CTA URL (if visible), Legal, Badge, Icon.
    *   User interface to allow manual override of classifications.

### 5.5. Information Architecture Builder

*   **Description:** Groups semantically classified elements into logical marketing blocks.
*   **Functional Specifications:**
    *   Groups elements into: Brand Block, Value Proposition Block, Offer Block, Conversion Block, Compliance Block.
    *   Visual block grouping based on proximity and semantic relationships.
    *   Hierarchy scoring for elements within blocks.
    *   Editable IA tree view for user adjustments.

### 5.6. Structured Data Table View

*   **Description:** Presents the extracted and structured data in an editable table format.
*   **Functional Specifications:**
    *   UI displays: Field Name, Value, Confidence Score, Source Region, Coordinates, Editable status.
    *   Inline editing of 'Value' field.
    *   Ability to reassign semantic roles.
    *   Functionality to merge or split text blocks.
    *   Manual crop override for image assets.
    *   Validation warnings for potential data inconsistencies.

### 5.7. CSV Export Engine (Data-Merge Ready)

*   **Description:** Exports the structured data into a CSV format suitable for automation.
*   **Functional Specifications:**
    *   Customizable header templates.
    *   Support for `@Image` field formatting for image paths.
    *   Absolute path generation for assets.
    *   UTF-8 and UTF-16 encoding options.
    *   Windows and Mac path format options.
    *   One-row-per-ad export.
    *   Generation of an asset folder containing cropped hero images, logos, etc.

**6. Acceptance Criteria (Examples)**

*   **GIVEN** a user uploads a JPG ad image **WHEN** processing is complete **THEN** a structured data table is displayed with at least 80% accuracy for headline and CTA detection.
*   **GIVEN** a user edits a 'Value' in the structured data table **WHEN** they click save **THEN** the change is reflected in the preview and the subsequent CSV export.
*   **GIVEN** a user exports to CSV **WHEN** the export is complete **THEN** a CSV file and an asset folder are downloaded, with the CSV containing correct `@Image` paths.

**7. Dependencies & Risks**

*   **Dependencies:** Core Deconstruction Engine (Computer Vision, OCR, Semantic Mapping).
*   **Risks:** Accuracy of AI models, performance for large images/batches, user adoption of editing features.

**8. Future Considerations (V1)**

*   Batch upload functionality.
*   API access for programmatic integration.
*   Advanced semantic modeling (ML-based).
*   Creative Intelligence Dashboard integration.
