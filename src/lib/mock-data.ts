export interface ScrapeJobSummary {
  job_id: string;
  brand: string;
  regions: string[];
  started_at: string;
  completed_at: string | null;
  status: "pending" | "running" | "completed" | "failed";
  pages_crawled: number;
  images_found: number;
  images_downloaded: number;
  errors: number;
}

export interface ScrapedImageItem {
  image_url: string;
  local_path: string;
  content_hash: string;
  format: string;
  width: number | null;
  height: number | null;
  file_size_bytes: number;
  image_type: "product" | "banner" | "logo" | "lifestyle" | "promotional";
  alt_text: string;
  page_url: string;
  page_title: string;
  product_name: string | null;
  product_line: string | null;
}

export interface ScrapeManifest {
  job_id: string;
  brand: string;
  regions: string[];
  status: "completed" | "failed";
  started_at: string;
  completed_at: string;
  pages_crawled: number;
  images_found: number;
  images_downloaded: number;
  errors: string[];
  items: ScrapedImageItem[];
}

export const MOCK_SCRAPE_JOBS: ScrapeJobSummary[] = [
  {
    job_id: "6039ce52-96f7-4921-9837-153f11326f45",
    brand: "VEEV",
    regions: ["ch_en"],
    started_at: "2025-06-15T14:32:00Z",
    completed_at: "2025-06-15T14:35:42Z",
    status: "completed",
    pages_crawled: 5,
    images_found: 52,
    images_downloaded: 46,
    errors: 0,
  },
  {
    job_id: "d8f3a712-bb41-4e9c-a5d3-7c2e19f08b64",
    brand: "Bull Brand UK",
    regions: ["gb_en"],
    started_at: "2025-06-17T16:20:00Z",
    completed_at: "2025-06-17T16:24:38Z",
    status: "completed",
    pages_crawled: 3,
    images_found: 28,
    images_downloaded: 24,
    errors: 0,
  },
  {
    job_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    brand: "VEEV",
    regions: ["gb_en"],
    started_at: "2025-06-16T09:10:00Z",
    completed_at: null,
    status: "pending",
    pages_crawled: 0,
    images_found: 0,
    images_downloaded: 0,
    errors: 0,
  },
  {
    job_id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    brand: "VEEV",
    regions: ["ch_en", "gb_en"],
    started_at: "2025-06-14T11:00:00Z",
    completed_at: "2025-06-14T11:08:15Z",
    status: "completed",
    pages_crawled: 12,
    images_found: 98,
    images_downloaded: 81,
    errors: 2,
  },
];

export const MOCK_MANIFEST: ScrapeManifest = {
  job_id: "6039ce52-96f7-4921-9837-153f11326f45",
  brand: "VEEV",
  regions: ["ch_en"],
  status: "completed",
  started_at: "2025-06-15T14:32:00Z",
  completed_at: "2025-06-15T14:35:42Z",
  pages_crawled: 5,
  images_found: 52,
  images_downloaded: 46,
  errors: [],
  items: [
    {
      image_url: "https://veev-vape.com/ch/en/sites/g/files/hncfsx123/files/veev-one-device-slate.png",
      local_path: "output/veev/ch_en/product/veev-one-device-slate_a1b2c3.png",
      content_hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      format: "png",
      width: 800,
      height: 1200,
      file_size_bytes: 245000,
      image_type: "product",
      alt_text: "VEEV ONE device in Slate Grey",
      page_url: "https://veev-vape.com/ch/en/veev-one",
      page_title: "VEEV ONE | Premium Vaping Device",
      product_name: "VEEV ONE",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://veev-vape.com/ch/en/sites/g/files/hncfsx123/files/veev-now-ultra-berry.png",
      local_path: "output/veev/ch_en/product/veev-now-ultra-berry_d4e5f6.png",
      content_hash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
      format: "png",
      width: 600,
      height: 900,
      file_size_bytes: 178000,
      image_type: "product",
      alt_text: "VEEV NOW ULTRA Berry Blend",
      page_url: "https://veev-vape.com/ch/en/veev-now-ultra",
      page_title: "VEEV NOW ULTRA | Disposable Vape",
      product_name: "VEEV NOW ULTRA",
      product_line: "VEEV NOW ULTRA",
    },
    {
      image_url: "https://veev-vape.com/ch/en/sites/g/files/hncfsx123/files/hero-banner-summer.jpg",
      local_path: "output/veev/ch_en/banner/hero-banner-summer_f7a8b9.jpg",
      content_hash: "f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
      format: "jpg",
      width: 1920,
      height: 800,
      file_size_bytes: 520000,
      image_type: "banner",
      alt_text: "Discover VEEV - A better alternative",
      page_url: "https://veev-vape.com/ch/en",
      page_title: "VEEV Vape Switzerland",
      product_name: null,
      product_line: null,
    },
    {
      image_url: "https://veev-vape.com/ch/en/sites/g/files/hncfsx123/files/veev-logo-white.svg",
      local_path: "output/veev/ch_en/logo/veev-logo-white_c1d2e3.svg",
      content_hash: "c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
      format: "svg",
      width: null,
      height: null,
      file_size_bytes: 4200,
      image_type: "logo",
      alt_text: "VEEV Logo",
      page_url: "https://veev-vape.com/ch/en",
      page_title: "VEEV Vape Switzerland",
      product_name: null,
      product_line: null,
    },
    {
      image_url: "https://veev-vape.com/ch/en/sites/g/files/hncfsx123/files/lifestyle-cafe.jpg",
      local_path: "output/veev/ch_en/lifestyle/lifestyle-cafe_e4f5a6.jpg",
      content_hash: "e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5",
      format: "jpg",
      width: 1440,
      height: 960,
      file_size_bytes: 380000,
      image_type: "lifestyle",
      alt_text: "Enjoying VEEV at a caf\u00e9",
      page_url: "https://veev-vape.com/ch/en/discover-veev",
      page_title: "Discover VEEV",
      product_name: null,
      product_line: null,
    },
    {
      image_url: "https://veev-vape.com/ch/en/sites/g/files/hncfsx123/files/pods-collection.jpg",
      local_path: "output/veev/ch_en/product/pods-collection_b8c9d0.jpg",
      content_hash: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9",
      format: "jpg",
      width: 1200,
      height: 800,
      file_size_bytes: 295000,
      image_type: "product",
      alt_text: "VEEV ONE Pods Collection",
      page_url: "https://veev-vape.com/ch/en/pods",
      page_title: "VEEV Pods | Flavours",
      product_name: "VEEV ONE Pods",
      product_line: "VEEV ONE",
    },
  ],
};

export const MOCK_BULLBRAND_MANIFEST: ScrapeManifest = {
  job_id: "d8f3a712-bb41-4e9c-a5d3-7c2e19f08b64",
  brand: "Bull Brand UK",
  regions: ["gb_en"],
  status: "completed",
  started_at: "2025-06-17T16:20:00Z",
  completed_at: "2025-06-17T16:24:38Z",
  pages_crawled: 3,
  images_found: 28,
  images_downloaded: 24,
  errors: [],
  items: [
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/veev-one-device-midnight-black.png",
      local_path: "output/bullbrand/gb_en/product/veev-one-device-midnight-black_f1a2b3.png",
      content_hash: "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
      format: "png",
      width: 600,
      height: 600,
      file_size_bytes: 185000,
      image_type: "product",
      alt_text: "VEEV ONE Device - Midnight Black",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: "VEEV ONE Device",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/veev-one-pods-classic-tobacco.png",
      local_path: "output/bullbrand/gb_en/product/veev-one-pods-classic-tobacco_a3b4c5.png",
      content_hash: "a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4",
      format: "png",
      width: 600,
      height: 600,
      file_size_bytes: 142000,
      image_type: "product",
      alt_text: "VEEV ONE Pods - Classic Tobacco",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: "VEEV ONE Pods",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/veev-one-pods-blueberry.png",
      local_path: "output/bullbrand/gb_en/product/veev-one-pods-blueberry_c5d6e7.png",
      content_hash: "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      format: "png",
      width: 600,
      height: 600,
      file_size_bytes: 138000,
      image_type: "product",
      alt_text: "VEEV ONE Pods - Blueberry",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: "VEEV ONE Pods",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/veev-now-disposable-mango.png",
      local_path: "output/bullbrand/gb_en/product/veev-now-disposable-mango_e7f8a9.png",
      content_hash: "e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8",
      format: "png",
      width: 600,
      height: 600,
      file_size_bytes: 156000,
      image_type: "product",
      alt_text: "VEEV NOW Disposable - Mango",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: "VEEV NOW",
      product_line: "VEEV NOW",
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/veev-collection-banner.jpg",
      local_path: "output/bullbrand/gb_en/banner/veev-collection-banner_b9c0d1.jpg",
      content_hash: "b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
      format: "jpg",
      width: 1200,
      height: 400,
      file_size_bytes: 320000,
      image_type: "banner",
      alt_text: "VEEV Collection - Premium Vaping",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: null,
      product_line: null,
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/bullbrand-logo.svg",
      local_path: "output/bullbrand/gb_en/logo/bullbrand-logo_d1e2f3.svg",
      content_hash: "d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2",
      format: "svg",
      width: null,
      height: null,
      file_size_bytes: 3800,
      image_type: "logo",
      alt_text: "Bull Brand UK Logo",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: null,
      product_line: null,
    },
  ],
};

export const SUPPORTED_BRANDS = [
  {
    name: "VEEV",
    description: "PMI premium vaping brand",
    regions: [
      { code: "ch_en", label: "Switzerland (English)", status: "active" as const },
      { code: "gb_en", label: "United Kingdom (English)", status: "configured" as const },
    ],
  },
  {
    name: "Bull Brand UK",
    description: "UK vaping retailer — VEEV collection",
    regions: [
      { code: "gb_en", label: "United Kingdom (English)", status: "active" as const },
    ],
  },
];

// ─── Demo mode: upload, analysis & dashboard mocks ───────────────────────────

export const DEMO_DASHBOARD_STATS = {
  totalImages: 7,
  completedImages: 5,
  pendingExports: 1,
  totalExports: 3,
};

export interface DemoUploadedImage {
  image_id: string;
  filename: string;
  status: "completed";
  uploaded_at: string;
}

export const DEMO_UPLOADED_IMAGES: DemoUploadedImage[] = [
  {
    image_id: "demo-img-001",
    filename: "veev-one-campaign-hero.jpg",
    status: "completed",
    uploaded_at: "2025-06-15T10:00:00Z",
  },
  {
    image_id: "demo-img-002",
    filename: "veev-now-banner-uk.png",
    status: "completed",
    uploaded_at: "2025-06-16T14:30:00Z",
  },
];

export interface MockElement {
  id: string;
  element_type: string;
  semantic_role: string | null;
  value: string | null;
  bounding_box: { x: number; y: number; width: number; height: number };
  confidence_score: number | null;
  z_order: number | null;
  dominant_color: string | null;
  edited_by_user: boolean;
}

export interface MockIABlock {
  id: string;
  block_type: string;
  element_ids: string[];
  hierarchy_score: number | null;
}

export interface MockAnalysisData {
  image_id: string;
  status: string;
  elements: MockElement[];
  information_architecture: MockIABlock[];
}

export const MOCK_ANALYSIS: MockAnalysisData = {
  image_id: "demo-img-001",
  status: "completed",
  elements: [
    {
      id: "el-001",
      element_type: "text",
      semantic_role: "headline",
      value: "Switch to VEEV ONE",
      bounding_box: { x: 40, y: 60, width: 520, height: 80 },
      confidence_score: 0.97,
      z_order: 3,
      dominant_color: "#1a1a2e",
      edited_by_user: false,
    },
    {
      id: "el-002",
      element_type: "text",
      semantic_role: "subheadline",
      value: "Premium vaping, simplified",
      bounding_box: { x: 40, y: 150, width: 400, height: 40 },
      confidence_score: 0.94,
      z_order: 3,
      dominant_color: "#6b7280",
      edited_by_user: false,
    },
    {
      id: "el-003",
      element_type: "image",
      semantic_role: "hero_product",
      value: null,
      bounding_box: { x: 600, y: 20, width: 380, height: 560 },
      confidence_score: 0.99,
      z_order: 2,
      dominant_color: "#e5e7eb",
      edited_by_user: false,
    },
    {
      id: "el-004",
      element_type: "button",
      semantic_role: "cta_primary",
      value: "Shop Now",
      bounding_box: { x: 40, y: 220, width: 160, height: 48 },
      confidence_score: 0.96,
      z_order: 4,
      dominant_color: "#7c3aed",
      edited_by_user: false,
    },
    {
      id: "el-005",
      element_type: "image",
      semantic_role: "brand_logo",
      value: null,
      bounding_box: { x: 40, y: 10, width: 120, height: 40 },
      confidence_score: 0.98,
      z_order: 5,
      dominant_color: "#1a1a2e",
      edited_by_user: false,
    },
    {
      id: "el-006",
      element_type: "shape",
      semantic_role: "background",
      value: null,
      bounding_box: { x: 0, y: 0, width: 1024, height: 600 },
      confidence_score: 1.0,
      z_order: 1,
      dominant_color: "#f8fafc",
      edited_by_user: false,
    },
    {
      id: "el-007",
      element_type: "text",
      semantic_role: "legal_disclaimer",
      value: "18+ only. This product contains nicotine.",
      bounding_box: { x: 40, y: 560, width: 400, height: 20 },
      confidence_score: 0.91,
      z_order: 3,
      dominant_color: "#9ca3af",
      edited_by_user: false,
    },
  ],
  information_architecture: [
    {
      id: "ia-001",
      block_type: "hero_section",
      element_ids: ["el-001", "el-002", "el-003", "el-004"],
      hierarchy_score: 1.0,
    },
    {
      id: "ia-002",
      block_type: "branding",
      element_ids: ["el-005"],
      hierarchy_score: 0.9,
    },
    {
      id: "ia-003",
      block_type: "compliance",
      element_ids: ["el-007"],
      hierarchy_score: 0.3,
    },
    {
      id: "ia-004",
      block_type: "canvas",
      element_ids: ["el-006"],
      hierarchy_score: 0.1,
    },
  ],
};
