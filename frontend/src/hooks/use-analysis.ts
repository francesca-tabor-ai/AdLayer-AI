import { useQuery } from "@tanstack/react-query";
import { getAnalysis, type KVAnalysisResult } from "@/lib/kv-analysis";

export function useKVAnalysis(imageId: string) {
  return useQuery<KVAnalysisResult | null>({
    queryKey: ["kvAnalysis", imageId],
    queryFn: async () => {
      // Read from the client-side analysis store
      return getAnalysis(imageId);
    },
    enabled: !!imageId,
  });
}
