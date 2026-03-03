"use client";

import { Button } from "@/components/ui/button";
import { useCreateExport } from "@/hooks/use-exports";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface ExportOptionsProps {
  imageId: string;
}

export function ExportOptions({ imageId }: ExportOptionsProps) {
  const createExport = useCreateExport();

  const handleExport = () => {
    createExport.mutate(imageId, {
      onSuccess: (data) => {
        toast(`Export started! ID: ${data.export_id}`, "success");
      },
      onError: () => {
        toast("Export failed. Please try again.", "error");
      },
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Export Data</h3>
      <Button
        onClick={handleExport}
        disabled={createExport.isPending}
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        {createExport.isPending ? "Exporting..." : "Export CSV"}
      </Button>
    </div>
  );
}
