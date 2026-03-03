import { useMutation } from "@tanstack/react-query";
import {
  storeAnalysis,
  parseAnalysisSections,
  extractReadinessScore,
  extractArchetype,
} from "@/lib/kv-analysis";

export interface UploadAnalysisResult {
  imageId: string;
  status: "completed" | "error";
  message: string;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

let uploadCounter = 0;

export function useUploadAndAnalyze() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadAnalysisResult> => {
      uploadCounter++;
      const imageId = `img-${Date.now()}-${String(uploadCounter).padStart(3, "0")}`;

      // Convert file to data URL for preview
      const imageDataUrl = await fileToDataUrl(file);

      // Send to our API route for AI analysis
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      const raw: string = data.analysis;
      const sections = parseAnalysisSections(raw);
      const readinessScore = extractReadinessScore(sections);
      const archetype = extractArchetype(sections);

      // Store in client-side cache
      storeAnalysis({
        imageId,
        filename: file.name,
        imageDataUrl,
        sections,
        raw,
        readinessScore,
        archetype,
        analyzedAt: new Date().toISOString(),
      });

      return {
        imageId,
        status: "completed",
        message: `${file.name} analyzed successfully`,
      };
    },
  });
}
