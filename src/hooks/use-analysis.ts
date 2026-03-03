import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { isDemoMode } from "@/stores/auth-store";
import { MOCK_ANALYSIS } from "@/lib/mock-data";

interface ElementData {
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

interface IABlock {
  id: string;
  block_type: string;
  element_ids: string[];
  hierarchy_score: number | null;
}

interface AnalysisData {
  image_id: string;
  status: string;
  elements: ElementData[];
  information_architecture: IABlock[];
}

export function useAnalysis(imageId: string) {
  return useQuery({
    queryKey: ["analysis", imageId],
    queryFn: async () => {
      if (isDemoMode()) {
        await new Promise((r) => setTimeout(r, 400));
        // Return mock analysis data, substituting the requested imageId
        return { ...MOCK_ANALYSIS, image_id: imageId } as AnalysisData;
      }
      const res = await apiClient.get<AnalysisData>(`/analysis/${imageId}`);
      return res.data;
    },
    enabled: !!imageId,
  });
}
