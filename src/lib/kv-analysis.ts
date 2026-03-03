// ─── KV Analysis Types & Client Store ─────────────────────────────────────────

export interface KVAnalysisSection {
  number: number;
  title: string;
  content: string;
}

export interface KVAnalysisResult {
  imageId: string;
  filename: string;
  imageDataUrl: string; // base64 data URL for preview
  sections: KVAnalysisSection[];
  raw: string; // full AI response text
  readinessScore: number | null; // extracted from section 9
  archetype: string | null; // extracted from section 8
  analyzedAt: string;
}

// Client-side in-memory store for analysis results (no backend needed)
const analysisCache = new Map<string, KVAnalysisResult>();

export function storeAnalysis(result: KVAnalysisResult): void {
  analysisCache.set(result.imageId, result);
}

export function getAnalysis(imageId: string): KVAnalysisResult | null {
  return analysisCache.get(imageId) ?? null;
}

export function getAllAnalyses(): KVAnalysisResult[] {
  return Array.from(analysisCache.values()).sort(
    (a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
  );
}

// ─── Section Parsing ──────────────────────────────────────────────────────────

const SECTION_TITLES = [
  "Visual Layer Decomposition",
  "Structural Group Mapping",
  "Automation Mapping (Smart Object Targets)",
  "Crop Hierarchy Analysis",
  "Flavor / Variant Variables",
  "Static vs Dynamic Asset Identification",
  "Compliance & Regulatory Layer Isolation",
  "Template Archetype Classification",
  "Automation Readiness Score",
  "Required Adjustments for Full KV Automation Compatibility",
];

export function parseAnalysisSections(raw: string): KVAnalysisSection[] {
  const sections: KVAnalysisSection[] = [];

  // Try to split by numbered section headers (## 1., **1.**, 1., etc.)
  for (let i = 0; i < SECTION_TITLES.length; i++) {
    const num = i + 1;
    const nextNum = num + 1;

    // Build regex to find section start
    const patterns = [
      `#{1,3}\\s*${num}\\.\\s*`,   // ## 1. or ### 1.
      `\\*\\*${num}\\.\\s*`,        // **1.
      `^${num}\\.\\s+`,             // 1.  (at line start)
    ];

    let startIdx = -1;
    for (const p of patterns) {
      const re = new RegExp(p, "m");
      const match = raw.match(re);
      if (match && match.index !== undefined) {
        if (startIdx === -1 || match.index < startIdx) {
          startIdx = match.index;
        }
      }
    }

    if (startIdx === -1) continue;

    // Find end of section (start of next section or end of text)
    let endIdx = raw.length;
    if (nextNum <= 10) {
      const endPatterns = [
        `#{1,3}\\s*${nextNum}\\.\\s*`,
        `\\*\\*${nextNum}\\.\\s*`,
        `^${nextNum}\\.\\s+`,
      ];
      for (const p of endPatterns) {
        const re = new RegExp(p, "m");
        const sub = raw.slice(startIdx + 5); // skip past current header
        const match = sub.match(re);
        if (match && match.index !== undefined) {
          const candidate = startIdx + 5 + match.index;
          if (candidate < endIdx) endIdx = candidate;
        }
      }
    }

    // Extract content, removing the header line
    let content = raw.slice(startIdx, endIdx).trim();
    // Remove the first line (the header)
    const firstNewline = content.indexOf("\n");
    if (firstNewline !== -1) {
      content = content.slice(firstNewline).trim();
    }
    // Clean up markdown bold markers in remaining content
    content = content.replace(/\*\*/g, "");

    sections.push({
      number: num,
      title: SECTION_TITLES[i],
      content,
    });
  }

  // If parsing failed, return single section with full text
  if (sections.length === 0) {
    return [{
      number: 1,
      title: "Full Analysis",
      content: raw,
    }];
  }

  return sections;
}

export function extractReadinessScore(sections: KVAnalysisSection[]): number | null {
  const section9 = sections.find((s) => s.number === 9);
  if (!section9) return null;
  const match = section9.content.match(/(\d+)\s*\/\s*10|score[:\s]*(\d+)/i);
  if (match) return parseInt(match[1] || match[2], 10);
  // Try to find just a standalone number
  const numMatch = section9.content.match(/\b([1-9]|10)\b/);
  return numMatch ? parseInt(numMatch[1], 10) : null;
}

export function extractArchetype(sections: KVAnalysisSection[]): string | null {
  const section8 = sections.find((s) => s.number === 8);
  if (!section8) return null;
  const match = section8.content.match(/MASTER_\w+/);
  return match ? match[0] : null;
}

// ─── System Prompt ────────────────────────────────────────────────────────────

export const KV_SYSTEM_PROMPT = `Creative Layer Deconstruction & Automation Mapping Engine
You are a Senior Creative Systems Architect and Automation Director.
Your task is to analyze a commercial advertisement image and deconstruct it into:
* Structural layers
* Modular template components
* Automation-ready Smart Object placeholders
* Crop-safe hierarchy
* KV Automation System compatibility
You must analyze the image as if preparing it for production automation inside:
KV_Master_Project.psd
Do not describe the image casually. Do not provide marketing commentary. Provide structured production analysis only.
OUTPUT STRUCTURE (MANDATORY)
You must respond in the following sections:
1. Visual Layer Decomposition
2. Structural Group Mapping
3. Automation Mapping (Smart Object Targets)
4. Crop Hierarchy Analysis
5. Flavor/Variant Variables
6. Static vs Dynamic Asset Identification
7. Compliance & Regulatory Layer Isolation
8. Template Archetype Classification
9. Automation Readiness Score
10. Required Adjustments for Full KV Automation Compatibility
Do not skip sections.
1. Visual Layer Decomposition
Break the image into probable Photoshop layers from back to front.
Identify:
* Base color fills
* Texture overlays
* Gradient lighting
* Product renders
* Shadows
* Typography layers
* Shape layers
* Badges
* Regulatory blocks
List them in correct stacking order (bottom to top).
2. Structural Group Mapping
Map the detected elements into KV group structure:
00_GUIDES 01_BACKGROUND 02_PRODUCT 03_BRAND 04_FLAVOR 05_PRICING 06_PROMO 07_BADGES 08_REGULATORY
Specify exactly which elements belong to which group.
3. Automation Mapping (Smart Object Targets)
Identify which elements should be:
BG_SMART PRODUCT_SMART
Specify:
* What must be isolated for background swapping
* What must be isolated for product swapping
* What should NOT be baked into those Smart Objects
4. Crop Hierarchy Analysis
Determine:
* What must remain inside 1080 safe zone
* What can extend into vertical safe extension
* What can extend into horizontal extension
* What must never sit near edges
Identify risk areas for:
* 16:9 crop
* 9:16 crop
* 728x90 banner
5. Flavor / Variant Variables
Identify all elements that change per SKU:
* Flavor name
* Flavor color palette
* Background texture
* Box artwork
* Device accent color
* Puff count
* Nicotine strength
Mark each as:
TEXT VARIABLE COLOR VARIABLE SMART OBJECT VARIABLE TOGGLE VARIABLE
6. Static vs Dynamic Asset Identification
Separate into:
STATIC BRAND ELEMENTS DYNAMIC SKU ELEMENTS
Be explicit.
7. Compliance & Regulatory Layer Isolation
Identify:
* Warning text block
* Border
* Background
Recommend whether this should be a standalone Smart Object.
8. Template Archetype Classification
Choose:
MASTER_SQUARE MASTER_VERTICAL MASTER_HORIZONTAL MASTER_BANNER
Justify based on layout structure.
9. Automation Readiness Score
Score from 1-10 based on:
* Modularity
* Separation of product from background
* Layer clarity
* Crop flexibility
* Reusability
10. Required Adjustments for Full KV Automation Compatibility
List specific structural changes needed:
Example:
* Separate large V backdrop from box artwork
* Move nicotine strength out of box render
* Extract puff count into badge layer
* Convert flavor color to global fill
Only list structural changes.
ANALYSIS RULES
* Do not speculate beyond visible evidence.
* Do not invent unseen layers.
* Do not describe emotional tone unless structurally relevant.
* Focus on production, scalability, automation.
* Write for senior designers and automation engineers.`;
