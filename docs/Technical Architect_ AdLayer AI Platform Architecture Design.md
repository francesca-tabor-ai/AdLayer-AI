# Technical Architect: AdLayer AI Platform Architecture Design

## High-Level Architecture Diagram (Text Description)

At a high level, the AdLayer AI platform will adopt a **microservices-oriented architecture** deployed on a cloud provider (e.g., AWS, GCP, Azure). This design promotes modularity, scalability, and independent deployment of services. The core components include:

1.  **Client Applications:** Web UI (React/Next.js) and potentially mobile applications.
2.  **API Gateway:** A single entry point for all client requests, handling routing, authentication, and rate limiting.
3.  **Core Services:** Independent microservices for Image Ingestion, Layout Detection, OCR, Semantic Classification, Information Architecture, and Data Export.
4.  **Data Stores:** Polyglot persistence, including relational databases (PostgreSQL/MySQL) for structured metadata, object storage (S3) for raw and processed images, and potentially NoSQL databases (DynamoDB/MongoDB) for flexible data models.
5.  **Message Queue/Event Bus:** (e.g., Kafka, RabbitMQ, SQS) for asynchronous communication between services, enabling event-driven architecture and decoupling.
6.  **Background Processing Workers:** (e.g., Celery, AWS Lambda) for long-running tasks like image processing, OCR, and data export generation.
7.  **Caching Layer:** (e.g., Redis, Memcached) to improve performance and reduce database load.
8.  **Monitoring & Logging:** Centralized systems (e.g., Prometheus, Grafana, ELK Stack) for observability.
9.  **CI/CD Pipeline:** Automated build, test, and deployment processes.

```mermaid
graph TD
    A[Client Applications] --> B(API Gateway)
    B --> C[Image Ingestion Service]
    B --> D[Layout Detection Service]
    B --> E[OCR Service]
    B --> F[Semantic Classification Service]
    B --> G[Information Architecture Service]
    B --> H[Data Export Service]

    C --> I(Object Storage)
    D --> I
    E --> I
    F --> I
    G --> I

    C --> J(Message Queue)
    D --> J
    E --> J
    F --> J
    G --> J
    H --> J

    J --> K[Background Processing Workers]
    K --> L(Relational Database)
    K --> I

    B --> M(Caching Layer)
    C --> M
    D --> M
    E --> M
    F --> M
    G --> M
    H --> M

    SubGraph Observability
        N[Monitoring] --> O[Logging]
    End
    K --> N
    L --> N
    I --> N
    B --> N

    P[CI/CD Pipeline] --> Q[Deployment]
    Q --> C
    Q --> D
    Q --> E
    Q --> F
    Q --> G
    Q --> H
    Q --> L
    Q --> I
    Q --> M
    Q --> J
    Q --> K

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#ccf,stroke:#333,stroke-width:2px
    style D fill:#ccf,stroke:#333,stroke-width:2px
    style E fill:#ccf,stroke:#333,stroke-width:2px
    style F fill:#ccf,stroke:#333,stroke-width:2px
    style G fill:#ccf,stroke:#333,stroke-width:2px
    style H fill:#ccf,stroke:#333,stroke-width:2px
    style I fill:#fcf,stroke:#333,stroke-width:2px
    style J fill:#cfc,stroke:#333,stroke-width:2px
    style K fill:#ffc,stroke:#333,stroke-width:2px
    style L fill:#fcf,stroke:#333,stroke-width:2px
    style M fill:#ccf,stroke:#333,stroke-width:2px
    style N fill:#eee,stroke:#333,stroke-width:2px
    style O fill:#eee,stroke:#333,stroke-width:2px
    style P fill:#f9f,stroke:#333,stroke-width:2px
    style Q fill:#bbf,stroke:#333,stroke-width:2px
```

## Service Breakdown

*   **Image Ingestion Service:** Handles file uploads, validation, normalization, and storage of raw images. Triggers processing workflows.
*   **Layout Detection Service:** Analyzes images to identify and categorize visual regions (text, images, logos, CTAs, etc.) and their bounding boxes.
*   **OCR Service:** Extracts text from identified text regions, performs line merging, and basic text structuring.
*   **Semantic Classification Service:** Applies machine learning models to classify extracted elements into marketing-specific semantic roles (headline, CTA, offer, brand).
*   **Information Architecture Service:** Groups semantically classified elements into logical marketing blocks and builds the hierarchical structure of the ad.
*   **Data Export Service:** Generates structured outputs (CSV, JSON) based on the processed data and manages asset packaging.
*   **User Management Service:** Handles user authentication, authorization, and profile management.
*   **Billing & Subscription Service:** Manages subscription plans, payment processing, and usage tracking.
*   **Notification Service:** Sends email or in-app notifications to users.

## API Architecture

The API will be a **RESTful API** exposed through the API Gateway. It will follow standard HTTP methods (GET, POST, PUT, DELETE) and use JSON for request/response bodies. Key API endpoints will include:

*   `/api/v1/images`: For uploading and managing ad images.
*   `/api/v1/analysis/{image_id}`: To retrieve the structured analysis of an ad.
*   `/api/v1/exports/{image_id}/csv`: To trigger and download CSV exports.
*   `/api/v1/exports/{image_id}/json`: To trigger and download JSON exports.
*   `/api/v1/users`: For user registration and profile management.
*   `/api/v1/subscriptions`: For managing user subscriptions.

**Authentication:** OAuth 2.0 with JWT (JSON Web Tokens) for secure API access.
**Versioning:** API versioning (e.g., `/v1/`) to allow for future changes without breaking existing integrations.

## Database Schema Design (Conceptual)

### `users` table
*   `id` (PK, UUID)
*   `email` (UNIQUE)
*   `password_hash`
*   `created_at`
*   `updated_at`

### `images` table
*   `id` (PK, UUID)
*   `user_id` (FK to `users.id`)
*   `original_url` (S3 path)
*   `processed_url` (S3 path)
*   `status` (e.g., 'uploaded', 'processing', 'completed', 'failed')
*   `created_at`
*   `updated_at`

### `elements` table (for detected regions/semantic classifications)
*   `id` (PK, UUID)
*   `image_id` (FK to `images.id`)
*   `type` (e.g., 'text', 'image', 'logo', 'cta')
*   `semantic_role` (e.g., 'headline', 'offer', 'brand')
*   `value` (extracted text or asset URL)
*   `bounding_box` (JSON/TEXT)
*   `confidence_score`
*   `z_order`
*   `dominant_color`
*   `edited_by_user` (boolean)

### `information_architecture` table (for structured blocks)
*   `id` (PK, UUID)
*   `image_id` (FK to `images.id`)
*   `block_type` (e.g., 'brand_block', 'value_block')
*   `elements` (JSON array of `element_id`s)
*   `hierarchy_score`

### `exports` table
*   `id` (PK, UUID)
*   `image_id` (FK to `images.id`)
*   `export_type` (e.g., 'csv', 'json')
*   `export_url` (S3 path)
*   `status`
*   `created_at`

## Technology Stack Recommendations

*   **Backend Framework:** Python with FastAPI or Node.js with Express.js (optimizing for simplicity and developer velocity initially, with FastAPI offering strong performance and type hinting).
*   **Database:** PostgreSQL for core relational data (user management, image metadata, element relationships) due to its robustness and extensibility. Consider DynamoDB for flexible schema needs in later phases (e.g., for raw element data).
*   **Object Storage:** AWS S3 (or equivalent GCP Cloud Storage/Azure Blob Storage) for storing raw and processed image files and export artifacts.
*   **Message Queue:** AWS SQS/SNS or RabbitMQ for asynchronous task processing and inter-service communication.
*   **Containerization:** Docker for packaging services.
*   **Orchestration:** Kubernetes (K8s) for production deployment and scaling, or AWS ECS/GCP Cloud Run for simpler managed container services.
*   **Frontend:** React with Next.js for a performant, SEO-friendly, and scalable web application.
*   **CI/CD:** GitHub Actions, GitLab CI, or Jenkins.
*   **Monitoring & Logging:** Prometheus + Grafana for metrics, ELK Stack (Elasticsearch, Logstash, Kibana) or AWS CloudWatch/GCP Cloud Logging for centralized logging.

**Tradeoffs:** Choosing Python/FastAPI offers a good balance of rapid development and performance, especially for AI/ML heavy tasks. PostgreSQL is a proven, reliable relational database, but may require sharding for extreme scale. Kubernetes provides powerful orchestration but adds operational complexity; managed services like ECS/Cloud Run offer a simpler alternative for initial deployments.

## Scaling Strategy

1.  **Horizontal Scaling of Microservices:** Each service can be scaled independently based on demand. Stateless services are preferred to facilitate easy scaling.
2.  **Asynchronous Processing:** Utilize message queues and background workers for computationally intensive tasks (image processing, OCR) to prevent blocking the main API threads and ensure responsiveness.
3.  **Database Sharding/Read Replicas:** For PostgreSQL, implement read replicas to offload read traffic. For extreme scale, consider sharding strategies or migrating specific data models to NoSQL databases better suited for high throughput.
4.  **Caching:** Implement caching at various layers (API Gateway, service level, database level) to reduce latency and database load for frequently accessed data.
5.  **Content Delivery Network (CDN):** Use a CDN (e.g., CloudFront, Cloudflare) to serve static assets (images, frontend bundles) closer to users, reducing latency and improving load times.
6.  **Auto-scaling Groups:** Configure cloud provider auto-scaling groups for compute resources to automatically adjust capacity based on real-time traffic and load.
7.  **Stateless Design:** Design services to be stateless wherever possible to simplify horizontal scaling and fault tolerance.
8.  **Load Balancing:** Distribute incoming traffic across multiple instances of services using load balancers.
