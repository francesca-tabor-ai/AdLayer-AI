import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

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
      const res = await apiClient.get<AnalysisData>(`/analysis/${imageId}`);
      return res.data;
    },
    enabled: !!imageId,
  });
}
