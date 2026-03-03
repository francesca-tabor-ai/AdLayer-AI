import type { KVAnalysisResult } from "./kv-analysis";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Dimension {
  width: number;
  height: number;
}

interface LayerChild {
  type: string;
  name: string;
  font?: string;
  size?: number;
  alignment?: string;
  default_text?: string;
  fill_mode?: string;
  replacement_source?: string;
  blend_mode?: string;
  opacity?: number;
  initial_alignment?: string;
}

interface LayerGroup {
  group: string;
  locked?: boolean;
  smart_object?: boolean;
  children: LayerChild[];
  analysis_notes?: string;
}

export interface KVMasterSpec {
  kv_master_spec: {
    document: {
      name: string;
      width: number;
      height: number;
      resolution: number;
      color_mode: string;
      color_profile: string;
      background: string;
    };
    safe_zones: {
      core_safe_zone: Dimension & { centered: boolean };
      vertical_extension: Dimension;
      horizontal_extension: Dimension;
    };
    layer_structure: LayerGroup[];
    export_presets: {
      social: Dimension[];
      display: Dimension[];
      ecommerce: Dimension[];
    };
    analysis_metadata: {
      source_image: string;
      analyzed_at: string;
      readiness_score: number | null;
      archetype: string | null;
      image_id: string;
    };
    analysis_sections: Record<string, string>;
  };
}

// ─── Reference Spec Constants (from docs/KV_Master_Spec.json) ────────────────

const DOCUMENT = {
  name: "KV_Master_Project.psd",
  width: 3000,
  height: 3000,
  resolution: 300,
  color_mode: "RGB",
  color_profile: "sRGB IEC61966-2.1",
  background: "transparent",
};

const SAFE_ZONES = {
  core_safe_zone: { width: 1080, height: 1080, centered: true },
  vertical_extension: { width: 1080, height: 1920 },
  horizontal_extension: { width: 1920, height: 1080 },
};

const BASE_LAYER_STRUCTURE: LayerGroup[] = [
  {
    group: "00_GUIDES",
    locked: true,
    children: [
      { type: "guide", name: "Safe_Zone_1080" },
      { type: "guide", name: "Vertical_Extension_Guide" },
      { type: "guide", name: "Horizontal_Extension_Guide" },
      { type: "guide", name: "Banner_Safe_Area" },
    ],
  },
  {
    group: "01_BACKGROUND",
    children: [
      {
        type: "smart_object_placeholder",
        name: "BG_SMART",
        fill_mode: "cover_canvas",
        replacement_source: "VARIANT/BG.png",
      },
      {
        type: "adjustment_layer",
        name: "Gradient_Overlay",
        blend_mode: "normal",
        opacity: 100,
      },
    ],
  },
  {
    group: "02_PRODUCT",
    children: [
      {
        type: "smart_object_placeholder",
        name: "PRODUCT_SMART",
        replacement_source: "VARIANT/PRODUCT.png",
        initial_alignment: "center",
      },
      {
        type: "raster_layer",
        name: "PRODUCT_SHADOW",
        blend_mode: "multiply",
        opacity: 70,
      },
    ],
  },
  {
    group: "03_BRAND",
    children: [
      {
        type: "text",
        name: "Logo_VEEV",
        font: "BrandFont-Bold",
        size: 160,
        alignment: "center",
        default_text: "VEEV",
      },
      {
        type: "text",
        name: "SubBrand_One",
        font: "BrandFont-Regular",
        size: 90,
        default_text: "one",
      },
      { type: "shape", name: "Large_Backdrop_V", opacity: 20 },
    ],
  },
  {
    group: "04_FLAVOR",
    children: [
      {
        type: "text",
        name: "Flavor_Name",
        font: "BrandFont-Bold",
        size: 140,
        default_text: "Flavor Name",
      },
      {
        type: "text",
        name: "Flavor_Subtext",
        font: "BrandFont-Regular",
        size: 60,
        default_text: "",
      },
      { type: "solid_color_fill", name: "Flavor_Color_Accent" },
    ],
  },
  {
    group: "05_PRICING",
    children: [
      { type: "text", name: "Current_Price", default_text: "" },
      { type: "text", name: "Was_Price", default_text: "" },
      { type: "text", name: "Save_Amount", default_text: "" },
      { type: "text", name: "From_Label", default_text: "" },
    ],
  },
  {
    group: "06_PROMO",
    children: [
      { type: "text", name: "Mix_And_Match_Label" },
      { type: "text", name: "Free_Pack_Label" },
      { type: "text", name: "Discontinued_Label" },
      { type: "text", name: "Limited_Time_Label" },
    ],
  },
  {
    group: "07_BADGES",
    children: [
      { type: "text", name: "Puff_Count" },
      { type: "text", name: "Nicotine_Strength" },
      { type: "text", name: "Pack_Count" },
      { type: "text", name: "Device_Count" },
    ],
  },
  {
    group: "08_REGULATORY",
    smart_object: true,
    children: [
      { type: "shape", name: "Warning_Background" },
      { type: "text", name: "Warning_Text" },
      { type: "shape", name: "Warning_Border" },
    ],
  },
];

const EXPORT_PRESETS = {
  social: [
    { width: 1080, height: 1080 },
    { width: 1080, height: 1350 },
    { width: 1080, height: 1920 },
  ],
  display: [
    { width: 300, height: 250 },
    { width: 728, height: 90 },
    { width: 160, height: 600 },
    { width: 300, height: 600 },
  ],
  ecommerce: [
    { width: 2000, height: 2000 },
    { width: 1200, height: 628 },
  ],
};

// ─── Section-to-Group Mapping ────────────────────────────────────────────────

// Maps AI analysis section numbers to the KV groups they annotate
const SECTION_GROUP_MAP: Record<number, string[]> = {
  1: ["01_BACKGROUND", "02_PRODUCT", "03_BRAND", "04_FLAVOR"], // Visual Layer Decomposition
  2: ["00_GUIDES", "01_BACKGROUND", "02_PRODUCT", "03_BRAND", "04_FLAVOR", "05_PRICING", "06_PROMO", "07_BADGES", "08_REGULATORY"], // Structural Group Mapping
  3: ["01_BACKGROUND", "02_PRODUCT"], // Automation Mapping (Smart Objects)
  4: ["00_GUIDES"],                    // Crop Hierarchy
  5: ["04_FLAVOR", "07_BADGES"],       // Flavor / Variant Variables
  6: ["03_BRAND", "04_FLAVOR"],        // Static vs Dynamic
  7: ["08_REGULATORY"],                // Compliance & Regulatory
};

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateKVMasterSpec(result: KVAnalysisResult): KVMasterSpec {
  // Build analysis_sections map
  const analysisSections: Record<string, string> = {};
  for (const section of result.sections) {
    analysisSections[section.title] = section.content;
  }

  // Enrich layer structure with analysis notes
  const layerStructure: LayerGroup[] = BASE_LAYER_STRUCTURE.map((group) => {
    const notes: string[] = [];

    for (const [sectionNum, groups] of Object.entries(SECTION_GROUP_MAP)) {
      if (groups.includes(group.group)) {
        const section = result.sections.find(
          (s) => s.number === parseInt(sectionNum, 10)
        );
        if (section) {
          notes.push(`[${section.title}] ${section.content.slice(0, 500)}`);
        }
      }
    }

    return {
      ...group,
      ...(notes.length > 0 ? { analysis_notes: notes.join("\n\n") } : {}),
    };
  });

  return {
    kv_master_spec: {
      document: DOCUMENT,
      safe_zones: SAFE_ZONES,
      layer_structure: layerStructure,
      export_presets: EXPORT_PRESETS,
      analysis_metadata: {
        source_image: result.filename,
        analyzed_at: result.analyzedAt,
        readiness_score: result.readinessScore,
        archetype: result.archetype,
        image_id: result.imageId,
      },
      analysis_sections: analysisSections,
    },
  };
}

// ─── Download Helper ─────────────────────────────────────────────────────────

export function downloadKVSpec(spec: KVMasterSpec, filename?: string): void {
  const json = JSON.stringify(spec, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const safeName = (filename || spec.kv_master_spec.analysis_metadata.source_image || "analysis")
    .replace(/\.[^.]+$/, "") // strip file extension
    .replace(/[^a-zA-Z0-9_-]/g, "_"); // sanitize

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `KV_Master_Spec_${safeName}.json`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
