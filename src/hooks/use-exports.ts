import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { isDemoMode } from "@/stores/auth-store";

interface ExportCreateResponse {
  export_id: string;
  status: string;
  message: string;
}

export function useCreateExport() {
  return useMutation({
    mutationFn: async (imageId: string) => {
      if (isDemoMode()) {
        await new Promise((r) => setTimeout(r, 500));
        return {
          export_id: `demo-exp-${imageId}`,
          status: "completed",
          message: "Export generated (demo mode)",
        } as ExportCreateResponse;
      }
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
      if (isDemoMode()) {
        // Generate a demo CSV and trigger download
        const csvContent = [
          "element_id,element_type,semantic_role,value,x,y,width,height,confidence,z_order,dominant_color",
          'el-001,text,headline,"Switch to VEEV ONE",40,60,520,80,0.97,3,#1a1a2e',
          'el-002,text,subheadline,"Premium vaping, simplified",40,150,400,40,0.94,3,#6b7280',
          "el-003,image,hero_product,,600,20,380,560,0.99,2,#e5e7eb",
          'el-004,button,cta_primary,"Shop Now",40,220,160,48,0.96,4,#7c3aed',
          "el-005,image,brand_logo,,40,10,120,40,0.98,5,#1a1a2e",
          "el-006,shape,background,,0,0,1024,600,1.00,1,#f8fafc",
          'el-007,text,legal_disclaimer,"18+ only. This product contains nicotine.",40,560,400,20,0.91,3,#9ca3af',
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `export-${exportId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
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
