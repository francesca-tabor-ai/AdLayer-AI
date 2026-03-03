# Data Engineer: AdLayer AI Analytics Infrastructure

## Event Tracking Schema

To enable comprehensive analytics and product decision-making, AdLayer AI will implement a robust event tracking schema. Events will capture user interactions and system processes, providing insights into platform usage, feature adoption, and performance.

### Core Event Properties (Common to all events)

| Property Name | Data Type | Description |
| :------------ | :-------- | :---------- |
| `event_id` | UUID | Unique identifier for each event. |
| `timestamp` | TIMESTAMP WITH TIME ZONE | Time when the event occurred. |
| `user_id` | UUID | Identifier for the user who triggered the event (if authenticated). |
| `session_id` | UUID | Identifier for the user session. |
| `platform` | VARCHAR | e.g., `web`, `mobile`, `api`. |
| `device_info` | JSONB | Device details (OS, browser, resolution). |
| `ip_address` | VARCHAR | User's IP address (anonymized). |

### Key Event Categories and Properties

#### 1. User Engagement Events

*   **`user_signed_up`**
    *   `plan_type`: `starter`, `pro`, `enterprise` (if selected during signup).
*   **`user_logged_in`**
    *   `login_method`: `email_password`, `oauth_google`.
*   **`page_viewed`**
    *   `page_name`: e.g., `dashboard`, `upload`, `analysis`.
    *   `page_url`: Full URL of the page viewed.
*   **`button_clicked`**
    *   `button_name`: e.g., `upload_image`, `export_csv`, `edit_element`.
    *   `context`: JSONB, additional context about where the button was clicked.

#### 2. Image Processing Events

*   **`image_uploaded`**
    *   `image_id`: UUID of the uploaded image.
    *   `file_type`: `jpg`, `png`, `pdf`.
    *   `file_size_kb`: Size of the uploaded file.
*   **`image_processing_started`**
    *   `image_id`: UUID.
    *   `processing_engine_version`: Version of the AI engine used.
*   **`image_processing_completed`**
    *   `image_id`: UUID.
    *   `duration_ms`: Time taken for processing.
    *   `status`: `success`, `failure`.
    *   `error_message`: (if failure) Details of the error.
    *   `elements_detected_count`: Number of elements detected.
    *   `semantic_roles_classified_count`: Number of semantic roles classified.
*   **`image_processing_failed`**
    *   `image_id`: UUID.
    *   `error_code`: Specific error code.
    *   `error_message`: Detailed error message.

#### 3. Data Interaction Events

*   **`element_edited`**
    *   `image_id`: UUID.
    *   `element_id`: UUID of the edited element.
    *   `field_edited`: `value`, `semantic_role`.
    *   `old_value`: Previous value.
    *   `new_value`: New value.
*   **`export_initiated`**
    *   `image_id`: UUID.
    *   `export_type`: `csv`, `json`.
    *   `export_options`: JSONB, e.g., `{"template_id": "abc", "encoding": "UTF-8"}`.
*   **`export_completed`**
    *   `export_id`: UUID.
    *   `image_id`: UUID.
    *   `export_type`: `csv`, `json`.
    *   `duration_ms`: Time taken for export.
    *   `status`: `success`, `failure`.

#### 4. Subscription Events

*   **`subscription_started`**
    *   `plan_type`: `starter`, `pro`, `enterprise`.
    *   `billing_period`: `monthly`, `annually`.
*   **`subscription_renewed`**
    *   `plan_type`: `starter`, `pro`, `enterprise`.
*   **`subscription_cancelled`**
    *   `reason`: User-provided reason (if available).
*   **`payment_failed`**
    *   `subscription_id`: UUID.
    *   `amount`: Amount of failed payment.
    *   `currency`: Currency.
    *   `error_code`: Payment processor error code.

## Data Pipeline Architecture

The data pipeline will be designed to collect, process, store, and serve analytical data efficiently and reliably.

```mermaid
graph TD
    A[AdLayer AI Frontend/Backend] --> B(Event Tracking SDK/API)
    B --> C[Message Queue (e.g., Kafka/Kinesis)]
    C --> D[Stream Processing (e.g., Flink/Spark Streaming/Kinesis Analytics)]
    D --> E[Data Lake (e.g., S3)]
    E --> F[Data Warehouse (e.g., Snowflake/BigQuery/Redshift)]
    F --> G[BI Tools (e.g., Tableau/Power BI/Looker)]
    F --> H[Custom Dashboards/APIs]
    F --> I[Machine Learning Models]

    SubGraph Batch Processing
        E --> J[Batch Processing (e.g., Spark/EMR)]
        J --> F
    End

    SubGraph Data Governance
        K[Schema Registry] --> D
        K --> J
    End

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#cfc,stroke:#333,stroke-width:2px
    style D fill:#ccf,stroke:#333,stroke-width:2px
    style E fill:#fcf,stroke:#333,stroke-width:2px
    style F fill:#fcf,stroke:#333,stroke-width:2px
    style G fill:#ffc,stroke:#333,stroke-width:2px
    style H fill:#ffc,stroke:#333,stroke-width:2px
    style I fill:#ffc,stroke:#333,stroke-width:2px
    style J fill:#ccf,stroke:#333,stroke-width:2px
    style K fill:#eee,stroke:#333,stroke-width:2px
```

### Stages:

1.  **Event Collection:**
    *   **Frontend:** Use a client-side SDK (e.g., Segment, Mixpanel, custom JS) to capture user interaction events.
    *   **Backend:** Directly send server-side events (e.g., image processing status, subscription changes) to the event ingestion layer.
    *   **API:** A dedicated API endpoint for receiving events, ensuring proper authentication and validation.
2.  **Event Ingestion:**
    *   A highly scalable and durable message queue (e.g., Apache Kafka, AWS Kinesis) will act as the central nervous system for all events.
    *   This decouples event producers from consumers and handles backpressure.
3.  **Stream Processing:**
    *   Real-time processing of events for immediate insights, anomaly detection, and data enrichment.
    *   **Tools:** Apache Flink, Spark Streaming, or cloud-native services like AWS Kinesis Analytics.
    *   Tasks: Data cleaning, transformation, aggregation, and routing to different destinations.
4.  **Data Lake:**
    *   Raw and semi-processed event data will be stored in a cost-effective, scalable object storage solution (e.g., AWS S3).
    *   This serves as the single source of truth and allows for future re-processing or new analytical use cases.
5.  **Data Warehouse:**
    *   Transformed and aggregated data will be loaded into a columnar data warehouse (e.g., Snowflake, Google BigQuery, AWS Redshift).
    *   Optimized for analytical queries and reporting.
6.  **Data Consumption:**
    *   **Business Intelligence (BI) Tools:** Connect BI tools (e.g., Tableau, Power BI, Looker) to the data warehouse for ad-hoc analysis and dashboarding.
    *   **Custom Dashboards/APIs:** Develop internal dashboards or expose data via APIs for specific product features or internal tools.
    *   **Machine Learning Models:** Feed processed data into ML models for predictive analytics, personalization, or further creative intelligence.

## Analytics Storage Design

### 1. Data Lake (AWS S3)

*   **Purpose:** Store raw, immutable event logs and intermediate processed data.
*   **Structure:** Organized by event type and date (e.g., `s3://adlayer-data-lake/raw/events/user_signed_up/year=2024/month=03/day=01/`).
*   **Format:** Parquet or ORC for columnar storage, GZIP compressed.
*   **Retention:** Long-term retention (e.g., 7+ years).

### 2. Data Warehouse (Snowflake/BigQuery)

*   **Purpose:** Store structured, aggregated, and transformed data optimized for analytical queries.
*   **Schema:** Star or Snowflake schema design for easy querying.
    *   **Fact Tables:** `fact_user_activity`, `fact_image_processing`, `fact_exports`, `fact_subscriptions`.
    *   **Dimension Tables:** `dim_users`, `dim_images`, `dim_elements`, `dim_plans`, `dim_time`.
*   **Partitioning/Clustering:** Partition tables by date or other relevant keys to improve query performance.
*   **Materialized Views:** For frequently queried aggregates.
*   **Retention:** Data retained based on business requirements (e.g., 2-5 years of detailed data, longer for aggregates).

## Dashboard Data Models

Dashboard data models will be derived from the data warehouse, focusing on specific KPIs and user-facing metrics.

### 1. Product Usage Dashboard

*   **Metrics:**
    *   Monthly Active Users (MAU), Daily Active Users (DAU).
    *   New Signups, Churn Rate.
    *   Images Uploaded (daily, weekly, monthly).
    *   Exports Generated (CSV, JSON).
    *   Feature Adoption (e.g., % of users editing elements).
*   **Dimensions:** Date, User Segment, Plan Type.

### 2. Processing Performance Dashboard

*   **Metrics:**
    *   Average Image Processing Time.
    *   Processing Success Rate.
    *   Error Rates by Service/Error Type.
    *   Queue Lengths for Processing Jobs.
*   **Dimensions:** Date, Image Type, Processing Engine Version.

### 3. Revenue & Subscription Dashboard

*   **Metrics:**
    *   Monthly Recurring Revenue (MRR).
    *   Average Revenue Per User (ARPU).
    *   Subscription Conversion Rate.
    *   Trial to Paid Conversion Rate.
    *   Payment Failure Rate.
*   **Dimensions:** Date, Plan Type, Country.

### 4. Creative Intelligence Dashboard (Future Phase)

*   **Metrics:**
    *   Average CTA Placement Frequency.
    *   Headline Length Distribution.
    *   Visual Density Scores.
    *   Layout Similarity Clusters.
*   **Dimensions:** Date, Ad Type, Industry.

## Focus on Enabling Product Decision Making

*   **Self-Service Analytics:** Provide easy-to-use BI tools and well-documented data models to enable product managers and business analysts to answer their own questions.
*   **A/B Testing Support:** Design the event tracking and data models to support A/B testing frameworks, allowing for easy analysis of experiment results.
*   **Data Quality:** Implement data validation and monitoring throughout the pipeline to ensure the accuracy and reliability of analytical data.
*   **Data Governance:** Establish clear data ownership, definitions, and access controls.
*   **Actionable Insights:** Work closely with product and business teams to ensure that dashboards and reports provide actionable insights, not just raw data. Focus on metrics that drive business outcomes and user value.
