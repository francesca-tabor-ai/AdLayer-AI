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
      image_url: "https://www.veev-vape.com/ch/sites/g/files/hncfsx1141/files/2024-11/Veev_one_Blue_Mint_450x450.png",
      local_path: "output/veev/ch_en/product/veev-one-blue-mint_a1b2c3.png",
      content_hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      format: "png",
      width: 450,
      height: 450,
      file_size_bytes: 245000,
      image_type: "product",
      alt_text: "VEEV ONE Blue Mint",
      page_url: "https://www.veev-vape.com/ch/en",
      page_title: "VEEV Vape Switzerland",
      product_name: "VEEV ONE Blue Mint",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.veev-vape.com/ch/sites/g/files/hncfsx1141/files/2024-11/Veev_one_Blue_Rasperry_450x450.png",
      local_path: "output/veev/ch_en/product/veev-one-blue-raspberry_d4e5f6.png",
      content_hash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
      format: "png",
      width: 450,
      height: 450,
      file_size_bytes: 178000,
      image_type: "product",
      alt_text: "VEEV ONE Blue Raspberry",
      page_url: "https://www.veev-vape.com/ch/en",
      page_title: "VEEV Vape Switzerland",
      product_name: "VEEV ONE Blue Raspberry",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.veev-vape.com/ch/sites/g/files/hncfsx1141/files/2024-11/Now_Ultra_70x310_BLUE_RASPBERRY%402x.png",
      local_path: "output/veev/ch_en/product/now-ultra-blue-raspberry_b8c9d0.png",
      content_hash: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9",
      format: "png",
      width: 140,
      height: 620,
      file_size_bytes: 95000,
      image_type: "product",
      alt_text: "VEEV NOW ULTRA Blue Raspberry",
      page_url: "https://www.veev-vape.com/ch/en",
      page_title: "VEEV Vape Switzerland",
      product_name: "VEEV NOW ULTRA",
      product_line: "VEEV NOW ULTRA",
    },
    {
      image_url: "https://www.veev-vape.com/ch/sites/g/files/hncfsx1141/files/2026-02/20251118_PMIP4_X-TRA_Flavours_Web_Assets_Launch-HP-Banner_desktop_1920x810%402x.jpg",
      local_path: "output/veev/ch_en/banner/xtra-flavours-launch_f7a8b9.jpg",
      content_hash: "f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
      format: "jpg",
      width: 3840,
      height: 1620,
      file_size_bytes: 520000,
      image_type: "banner",
      alt_text: "VEEV X-TRA Flavours Launch Banner",
      page_url: "https://www.veev-vape.com/ch/en",
      page_title: "VEEV Vape Switzerland",
      product_name: null,
      product_line: null,
    },
    {
      image_url: "https://www.veev-vape.com/ch/sites/g/files/hncfsx1141/files/2024-12/VEEV_Logo_Black_footer.svg",
      local_path: "output/veev/ch_en/logo/veev-logo-black_c1d2e3.svg",
      content_hash: "c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
      format: "svg",
      width: null,
      height: null,
      file_size_bytes: 4200,
      image_type: "logo",
      alt_text: "VEEV Logo",
      page_url: "https://www.veev-vape.com/ch/en",
      page_title: "VEEV Vape Switzerland",
      product_name: null,
      product_line: null,
    },
    {
      image_url: "https://www.veev-vape.com/ch/sites/g/files/hncfsx1141/files/2025-03/Discover_Visual_desktop_1100x650%402x%20%282%29.jpg",
      local_path: "output/veev/ch_en/lifestyle/discover-visual_e4f5a6.jpg",
      content_hash: "e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5",
      format: "jpg",
      width: 2200,
      height: 1300,
      file_size_bytes: 380000,
      image_type: "lifestyle",
      alt_text: "Discover VEEV Lifestyle",
      page_url: "https://www.veev-vape.com/ch/en",
      page_title: "VEEV Vape Switzerland",
      product_name: null,
      product_line: null,
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
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/VEEVONEClassicTob.jpg?v=1726148846",
      local_path: "output/bullbrand/gb_en/product/veev-one-classic-tobacco_f1a2b3.jpg",
      content_hash: "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
      format: "jpg",
      width: 600,
      height: 600,
      file_size_bytes: 185000,
      image_type: "product",
      alt_text: "VEEV ONE Classic Tobacco",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: "VEEV ONE Classic Tobacco",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/VEEVONEBlueRaspberry.jpg?v=1726149420",
      local_path: "output/bullbrand/gb_en/product/veev-one-blue-raspberry_a3b4c5.jpg",
      content_hash: "a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4",
      format: "jpg",
      width: 600,
      height: 600,
      file_size_bytes: 142000,
      image_type: "product",
      alt_text: "VEEV ONE Blue Raspberry",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: "VEEV ONE Blue Raspberry",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/VEEVONEWatermelon.jpg?v=1726151719",
      local_path: "output/bullbrand/gb_en/product/veev-one-watermelon_c5d6e7.jpg",
      content_hash: "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      format: "jpg",
      width: 600,
      height: 600,
      file_size_bytes: 138000,
      image_type: "product",
      alt_text: "VEEV ONE Watermelon",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: "VEEV ONE Watermelon",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/VEEVONEMango.jpg?v=1726151989",
      local_path: "output/bullbrand/gb_en/product/veev-one-mango_e7f8a9.jpg",
      content_hash: "e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8",
      format: "jpg",
      width: 600,
      height: 600,
      file_size_bytes: 156000,
      image_type: "product",
      alt_text: "VEEV ONE Mango",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: "VEEV ONE Mango",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/Veev_StarterKit_Classic.jpg?v=1726216332",
      local_path: "output/bullbrand/gb_en/banner/veev-starter-kit-classic_b9c0d1.jpg",
      content_hash: "b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
      format: "jpg",
      width: 1200,
      height: 400,
      file_size_bytes: 320000,
      image_type: "banner",
      alt_text: "VEEV ONE Classic Starter Kit",
      page_url: "https://www.bullbrand.co.uk/collections/veev",
      page_title: "VEEV Collection | Bull Brand UK",
      product_name: "VEEV ONE Starter Kit",
      product_line: "VEEV ONE",
    },
    {
      image_url: "https://www.bullbrand.co.uk/cdn/shop/files/bullbrand-logo.png?v=1686172148",
      local_path: "output/bullbrand/gb_en/logo/bullbrand-logo_d1e2f3.png",
      content_hash: "d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2",
      format: "png",
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

