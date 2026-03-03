# Backend Engineer: AdLayer AI Server-Side Implementation Plan

## API Endpoint Specifications

The AdLayer AI backend will expose a RESTful API, primarily using JSON for request and response bodies. Authentication will be handled via OAuth 2.0 with JWTs.

### 1. Image Ingestion & Processing

*   **POST `/api/v1/images/upload`**
    *   **Description:** Uploads a new ad image for processing.
    *   **Request Body:** `multipart/form-data` containing the image file.
    *   **Response:**
        ```json
        {
            "image_id": "uuid-of-uploaded-image",
            "status": "processing",
            "message": "Image uploaded and processing started."
        }
        ```
    *   **Error Codes:** 400 (Invalid file type), 401 (Unauthorized), 500 (Internal server error).

*   **GET `/api/v1/images/{image_id}/status`**
    *   **Description:** Retrieves the current processing status of an image.
    *   **Response:**
        ```json
        {
            "image_id": "uuid-of-image",
            "status": "completed", // or processing, failed
            "progress": 80, // percentage
            "message": "Processing complete."
        }
        ```

### 2. Structured Data Retrieval

*   **GET `/api/v1/analysis/{image_id}`**
    *   **Description:** Retrieves the full structured data for a processed ad image.
    *   **Response:**
        ```json
        {
            "image_id": "uuid-of-image",
            "metadata": { ... }, // Image dimensions, aspect ratio, etc.
            "elements": [ // Array of detected elements
                {
                    "id": "element-uuid",
                    "type": "text",
                    "semantic_role": "headline",
                    "value": "Your Headline Here",
                    "bounding_box": "x,y,w,h",
                    "confidence": 0.95
                }
            ],
            "information_architecture": [ ... ] // Structured blocks
        }
        ```

### 3. Data Export

*   **POST `/api/v1/exports/{image_id}/csv`**
    *   **Description:** Initiates a CSV export for a processed image.
    *   **Request Body (Optional):**
        ```json
        {
            "template_id": "custom-template-uuid",
            "encoding": "UTF-8",
            "path_format": "windows"
        }
        ```
    *   **Response:**
        ```json
        {
            "export_id": "export-uuid",
            "status": "pending",
            "message": "CSV export initiated."
        }
        ```

*   **GET `/api/v1/exports/{export_id}/download`**
    *   **Description:** Downloads the generated CSV or JSON file.
    *   **Response:** File download.

### 4. User Management

*   **POST `/api/v1/auth/register`**: User registration.
*   **POST `/api/v1/auth/login`**: User login, returns JWT.
*   **GET `/api/v1/users/me`**: Get current user profile.

### 5. Subscription & Payments

*   **GET `/api/v1/subscriptions/plans`**: List available subscription plans.
*   **POST `/api/v1/subscriptions/subscribe`**: Subscribe to a plan.
*   **POST `/api/v1/payments/webhook`**: Webhook endpoint for payment processor notifications.

## Database Models

Based on the Technical Architect's conceptual design, here are the detailed database models, primarily for PostgreSQL.

### `User` Model
```python
class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # Relationships: one-to-many with Image, Subscription
```

### `Image` Model
```python
class Image(Base):
    __tablename__ = "images"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    original_s3_url = Column(String, nullable=False)
    processed_s3_url = Column(String, nullable=True) # URL to processed image if applicable
    status = Column(String, default="uploaded") # uploaded, processing, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # Relationships: one-to-many with Element, InformationArchitecture, Export
    user = relationship("User", back_populates="images")
```

### `Element` Model
```python
class Element(Base):
    __tablename__ = "elements"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_id = Column(UUID(as_uuid=True), ForeignKey("images.id"), nullable=False)
    element_type = Column(String, nullable=False) # e.g., 'text', 'image', 'logo'
    semantic_role = Column(String, nullable=True) # e.g., 'headline', 'cta', 'brand'
    value = Column(Text, nullable=True) # Extracted text or S3 URL for cropped asset
    bounding_box = Column(JSONB, nullable=False) # {x, y, width, height}
    confidence_score = Column(Float, nullable=True)
    z_order = Column(Integer, nullable=True)
    dominant_color = Column(String, nullable=True)
    edited_by_user = Column(Boolean, default=False)
    # Relationships: many-to-one with Image
    image = relationship("Image", back_populates="elements")
```

### `InformationArchitecture` Model
```python
class InformationArchitecture(Base):
    __tablename__ = "information_architecture"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_id = Column(UUID(as_uuid=True), ForeignKey("images.id"), nullable=False)
    block_type = Column(String, nullable=False) # e.g., 'brand_block', 'value_block'
    element_ids = Column(ARRAY(UUID(as_uuid=True)), nullable=False) # Array of element IDs in this block
    hierarchy_score = Column(Float, nullable=True)
    # Relationships: many-to-one with Image
    image = relationship("Image", back_populates="information_architecture")
```

### `Export` Model
```python
class Export(Base):
    __tablename__ = "exports"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_id = Column(UUID(as_uuid=True), ForeignKey("images.id"), nullable=False)
    export_type = Column(String, nullable=False) # 'csv', 'json'
    s3_url = Column(String, nullable=True) # S3 URL to the exported file
    status = Column(String, default="pending") # pending, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # Relationships: many-to-one with Image
    image = relationship("Image", back_populates="exports")
```

## Service Logic Design

### 1. Image Upload Workflow

1.  Client uploads image to `/api/v1/images/upload`.
2.  Backend validates file type and size.
3.  Image is stored in S3 (original_s3_url).
4.  A new `Image` record is created in the database with status `uploaded`.
5.  A message is published to a queue (e.g., SQS) to trigger the image processing pipeline (Layout Detection, OCR, Semantic Classification, IA Building).
6.  API returns `image_id` and `status: processing`.

### 2. Image Processing Pipeline (Asynchronous)

1.  Worker consumes message from queue for `image_id`.
2.  **Layout Detection Service:** Downloads image from S3, performs layout analysis, and stores detected regions as `Element` records in DB.
3.  **OCR Service:** Processes text regions from `Element` records, updates `value` and `semantic_role` for text elements.
4.  **Semantic Classification Service:** Further refines `semantic_role` for all elements using ML models.
5.  **Information Architecture Service:** Groups `Element` records into `InformationArchitecture` blocks.
6.  Updates `Image` status to `completed` (or `failed` if errors occur).
7.  Publishes an event (e.g., to SNS) that image processing is complete, potentially triggering notifications.

### 3. Data Export Workflow

1.  Client requests CSV/JSON export via `/api/v1/exports/{image_id}/csv`.
2.  Backend creates an `Export` record with status `pending`.
3.  A message is published to a queue to trigger the export generation.
4.  Worker consumes message, retrieves all `Element` and `InformationArchitecture` records for the `image_id`.
5.  Generates the CSV/JSON file and any associated cropped assets.
6.  Uploads the generated files to S3.
7.  Updates `Export` record with `s3_url` and `status: completed`.
8.  Publishes an event that export is ready, potentially triggering a download link notification.

## Background Job Architecture

*   **Task Queue:** Utilize a robust task queue system like Celery (with Redis or RabbitMQ as broker) or AWS SQS/Lambda for managing asynchronous, long-running tasks.
*   **Workers:** Dedicated worker processes will consume tasks from the queue. These workers will be responsible for:
    *   Image processing (Layout Detection, OCR, Semantic Classification, IA Building).
    *   Data export generation (CSV, JSON, asset packaging).
    *   Email sending.
    *   Any other computationally intensive or time-consuming operations.
*   **Concurrency:** Workers will be configured to run multiple tasks concurrently to maximize throughput.
*   **Retries & Dead-Letter Queues (DLQ):** Implement automatic retries for transient failures and route failed tasks to a DLQ for manual inspection and reprocessing.

## Error Handling Strategy

1.  **API Error Responses:** Standardized JSON error responses for API endpoints, including a clear error code, message, and optional details.
    ```json
    {
        "code": "INVALID_INPUT",
        "message": "The provided file type is not supported.",
        "details": {"field": "file", "expected": "JPG, PNG, WebP, PDF"}
    }
    ```
2.  **Centralized Logging:** All errors (application, database, external service calls) will be logged to a centralized logging system (e.g., ELK Stack, CloudWatch Logs) with appropriate severity levels.
3.  **Monitoring & Alerting:** Set up alerts for critical errors, high error rates, or service outages to notify the operations team.
4.  **Graceful Degradation:** Design services to degrade gracefully when external dependencies fail (e.g., if an external OCR service is down, queue the task for retry rather than failing immediately).
5.  **Idempotency:** Design API endpoints and background jobs to be idempotent where possible, to prevent unintended side effects from retries.
6.  **Circuit Breakers:** Implement circuit breakers for calls to external services to prevent cascading failures.
7.  **Transaction Management:** Use database transactions to ensure data consistency for multi-step operations. If a step fails, the transaction should be rolled back.
