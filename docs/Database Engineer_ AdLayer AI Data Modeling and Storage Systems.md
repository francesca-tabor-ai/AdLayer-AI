# Database Engineer: AdLayer AI Data Modeling and Storage Systems

## Schema Design

The AdLayer AI database schema will be designed for PostgreSQL, focusing on efficiency, scalability, and data integrity. The core entities are Users, Images, Elements (representing detected regions), Information Architecture (structured blocks), and Exports.

### `users` Table

Stores user authentication and profile information.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT `gen_random_uuid()` | Unique identifier for the user. |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email address, used for login. |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password for security. |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT `NOW()` | Timestamp of user creation. |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT `NOW()` | Last update timestamp. |

### `images` Table

Stores metadata about uploaded ad images and their processing status.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT `gen_random_uuid()` | Unique identifier for the image. |
| `user_id` | UUID | NOT NULL, FOREIGN KEY (`users.id`) | User who uploaded the image. |
| `original_s3_url` | TEXT | NOT NULL | S3 URL to the original uploaded image. |
| `processed_s3_url` | TEXT | NULLABLE | S3 URL to a processed version of the image (e.g., normalized). |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT `'uploaded'` | Current processing status (e.g., `uploaded`, `processing`, `completed`, `failed`). |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT `NOW()` | Timestamp of image upload. |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT `NOW()` | Last update timestamp. |

### `elements` Table

Stores details about each detected visual or textual element within an ad image.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT `gen_random_uuid()` | Unique identifier for the element. |
| `image_id` | UUID | NOT NULL, FOREIGN KEY (`images.id`) | The image this element belongs to. |
| `element_type` | VARCHAR(50) | NOT NULL | Type of element (e.g., `text`, `image`, `logo`, `cta`). |
| `semantic_role` | VARCHAR(50) | NULLABLE | Marketing role of the element (e.g., `headline`, `offer`, `brand`). |
| `value` | TEXT | NULLABLE | Extracted text content or S3 URL for cropped asset. |
| `bounding_box` | JSONB | NOT NULL | JSON object `{x, y, width, height}` representing element position. |
| `confidence_score` | NUMERIC(5,2) | NULLABLE | Confidence level of detection/classification (0.00-1.00). |
| `z_order` | INTEGER | NULLABLE | Z-index of the element (layering). |
| `dominant_color` | VARCHAR(7) | NULLABLE | Hex code of the dominant color of the element. |
| `edited_by_user` | BOOLEAN | NOT NULL, DEFAULT `FALSE` | Flag if the element was manually edited by a user. |

### `information_architecture` Table

Represents the structured logical blocks derived from elements.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT `gen_random_uuid()` | Unique identifier for the IA block. |
| `image_id` | UUID | NOT NULL, FOREIGN KEY (`images.id`) | The image this IA block belongs to. |
| `block_type` | VARCHAR(50) | NOT NULL | Type of marketing block (e.g., `brand_block`, `value_block`). |
| `element_ids` | UUID[] | NOT NULL | Array of `element.id`s belonging to this block. |
| `hierarchy_score` | NUMERIC(5,2) | NULLABLE | Score indicating the importance or position in the hierarchy. |

### `exports` Table

Tracks all data export jobs.

| Column Name | Data Type | Constraints | Description |
| :---------- | :-------- | :---------- | :---------- |
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT `gen_random_uuid()` | Unique identifier for the export job. |
| `image_id` | UUID | NOT NULL, FOREIGN KEY (`images.id`) | The image associated with this export. |
| `export_type` | VARCHAR(50) | NOT NULL | Type of export (e.g., `csv`, `json`). |
| `s3_url` | TEXT | NULLABLE | S3 URL to the generated export file. |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT `'pending'` | Current status of the export job (e.g., `pending`, `completed`, `failed`). |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT `NOW()` | Timestamp of export request. |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT `NOW()` | Last update timestamp. |

## Table Relationships

*   **`users` to `images`:** One-to-Many. A user can upload multiple images.
    *   `images.user_id` references `users.id`.
*   **`images` to `elements`:** One-to-Many. An image consists of multiple detected elements.
    *   `elements.image_id` references `images.id`.
*   **`images` to `information_architecture`:** One-to-Many. An image has one or more IA blocks.
    *   `information_architecture.image_id` references `images.id`.
*   **`images` to `exports`:** One-to-Many. An image can have multiple export jobs.
    *   `exports.image_id` references `images.id`.
*   **`information_architecture` to `elements`:** Many-to-Many (via `element_ids` array). An IA block contains multiple elements, and an element can conceptually belong to multiple blocks (though in our current model, it's a list of element IDs within a block).

## Indexing Strategy

Effective indexing is crucial for query performance, especially as the dataset grows.

*   **Primary Keys:** All `id` columns (UUIDs) will automatically have unique indexes.
*   **Foreign Keys:** Indexes will be created on all foreign key columns to speed up joins and referential integrity checks.
    *   `images.user_id`
    *   `elements.image_id`
    *   `information_architecture.image_id`
    *   `exports.image_id`
*   **Frequently Queried Columns:**
    *   `users.email`: For fast user lookup during authentication.
    *   `images.status`: To quickly retrieve images in a specific processing state.
    *   `elements.element_type`, `elements.semantic_role`: For filtering elements by type or role.
    *   `exports.status`, `exports.export_type`: For querying export job statuses and types.
*   **JSONB Indexes:** For `elements.bounding_box` (if queries involve specific coordinates or ranges) and `information_architecture.element_ids` (if querying for specific elements within blocks), consider using GIN indexes for JSONB columns.

## Query Optimization Strategy

1.  **`EXPLAIN ANALYZE`:** Regularly use `EXPLAIN ANALYZE` to understand query execution plans and identify bottlenecks.
2.  **Avoid `SELECT *`:** Only select the columns needed for a query to reduce network overhead and memory usage.
3.  **Batch Operations:** For bulk inserts or updates, use batch operations instead of individual statements.
4.  **Pagination:** Implement server-side pagination for all list views (e.g., lists of images, elements, exports) to avoid fetching large datasets.
5.  **Materialized Views:** For complex analytical queries or frequently accessed aggregated data, consider using materialized views to pre-compute results.
6.  **Connection Pooling:** Use a connection pooler (e.g., PgBouncer) to efficiently manage database connections from the application.
7.  **Denormalization (Selective):** In specific cases where read performance is critical and data consistency can be managed, selective denormalization might be considered (e.g., caching a user's email on the `images` table if it's frequently displayed alongside image data).
8.  **Optimize Joins:** Ensure proper indexing on join columns. Avoid complex multi-table joins where simpler queries or pre-aggregation can achieve the same result.

## Migration Strategy

Database migrations will be managed using a tool like **Alembic** (for Python-based backends) or **Flyway/Liquibase** (for Java/JVM-based backends). This ensures that schema changes are version-controlled, repeatable, and can be applied consistently across all environments.

1.  **Version Control:** Migration scripts will be stored in the project's version control system.
2.  **Automated Application:** Migrations will be automatically applied as part of the CI/CD pipeline during deployment to each environment (dev, staging, prod).
3.  **Rollback Capability:** Each migration will ideally have a corresponding downgrade script to allow for safe rollbacks if issues arise.
4.  **Schema Evolution:** Design schema changes to be additive and non-breaking where possible to minimize downtime during deployments.
5.  **Data Migrations:** For complex data transformations, separate data migration scripts will be developed and run as part of the deployment process, ensuring data integrity during schema changes.
6.  **Testing:** Migrations will be thoroughly tested in staging environments before being applied to production. This includes testing both the upgrade and downgrade paths.
