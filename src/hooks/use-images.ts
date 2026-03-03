import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { isDemoMode } from "@/stores/auth-store";

interface ImageUploadResponse {
  image_id: string;
  status: string;
  message: string;
}

interface ImageStatusResponse {
  image_id: string;
  status: string;
  message: string;
}

let demoUploadCounter = 0;

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      if (isDemoMode()) {
        await new Promise((r) => setTimeout(r, 800)); // simulate upload
        demoUploadCounter++;
        return {
          image_id: `demo-img-${String(demoUploadCounter).padStart(3, "0")}`,
          status: "completed",
          message: `${file.name} processed successfully (demo mode)`,
        } as ImageUploadResponse;
      }
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.post<ImageUploadResponse>(
        "/images/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    },
  });
}

export function useImageStatus(imageId: string | null) {
  return useQuery({
    queryKey: ["imageStatus", imageId],
    queryFn: async () => {
      if (isDemoMode()) {
        await new Promise((r) => setTimeout(r, 200));
        return {
          image_id: imageId!,
          status: "completed",
          message: "Analysis complete (demo mode)",
        } as ImageStatusResponse;
      }
      const res = await apiClient.get<ImageStatusResponse>(
        `/images/${imageId}/status`
      );
      return res.data;
    },
    enabled: !!imageId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 3000;
    },
  });
}
