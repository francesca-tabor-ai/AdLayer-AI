import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

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

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
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
