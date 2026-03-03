"use client";

import { useCallback, useState, type DragEvent } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadImage } from "@/hooks/use-images";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

export function ImageUploadArea() {
  const [dragOver, setDragOver] = useState(false);
  const upload = useUploadImage();

  const handleFile = useCallback(
    (file: File) => {
      const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowed.includes(file.type)) {
        toast("Unsupported file type. Use JPG, PNG, WebP, or PDF.", "error");
        return;
      }
      upload.mutate(file, {
        onSuccess: (data) => {
          toast(`Image uploaded! ID: ${data.image_id}`, "success");
        },
        onError: () => {
          toast("Upload failed. Please try again.", "error");
        },
      });
    },
    [upload]
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
        dragOver
          ? "border-primary-500 bg-primary-50"
          : "border-gray-300 hover:border-gray-400"
      )}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".jpg,.jpeg,.png,.webp,.pdf";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFile(file);
        };
        input.click();
      }}
    >
      {upload.isPending ? (
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-600">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Upload className="h-10 w-10 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              Drop your ad image here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports JPG, PNG, WebP, PDF (max 50 MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
