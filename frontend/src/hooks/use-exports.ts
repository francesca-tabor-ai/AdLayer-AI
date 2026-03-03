import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

interface ExportCreateResponse {
  export_id: string;
  status: string;
  message: string;
}

export function useCreateExport() {
  return useMutation({
    mutationFn: async (imageId: string) => {
      const res = await apiClient.post<ExportCreateResponse>(
        `/exports/${imageId}/csv`
      );
      return res.data;
    },
  });
}

export function useDownloadExport() {
  return useMutation({
    mutationFn: async (exportId: string) => {
      const res = await apiClient.get(`/exports/${exportId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `export-${exportId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}
