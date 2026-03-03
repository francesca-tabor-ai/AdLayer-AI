"use client";

import { useCallback, useState } from "react";
import { Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAnalysis } from "@/lib/kv-analysis";
import { generateKVMasterSpec, downloadKVSpec } from "@/lib/kv-spec-generator";

interface ExportKVSpecButtonProps {
  imageId: string;
  variant?: "primary" | "secondary" | "icon";
  className?: string;
}

export function ExportKVSpecButton({
  imageId,
  variant = "primary",
  className,
}: ExportKVSpecButtonProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = useCallback(() => {
    const analysis = getAnalysis(imageId);
    if (!analysis) return;

    const spec = generateKVMasterSpec(analysis);
    downloadKVSpec(spec, analysis.filename);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }, [imageId]);

  const analysis = getAnalysis(imageId);
  const disabled = !analysis;

  if (variant === "icon") {
    return (
      <button
        onClick={handleExport}
        disabled={disabled}
        title={disabled ? "No analysis data" : "Export KV_Master_Spec.json"}
        className={cn(
          "inline-flex items-center justify-center p-2 rounded-xl transition-colors",
          disabled
            ? "text-slate-300 cursor-not-allowed"
            : downloaded
            ? "text-emerald-600 bg-emerald-50"
            : "text-slate-500 hover:text-ink hover:bg-slate-100",
          className
        )}
      >
        {downloaded ? (
          <Check className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        onClick={handleExport}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors",
          disabled
            ? "border-slate-200 text-slate-300 cursor-not-allowed"
            : downloaded
            ? "border-emerald-200 text-emerald-600 bg-emerald-50"
            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-ink hover:bg-slate-50",
          className
        )}
      >
        {downloaded ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        {downloaded ? "Downloaded" : "Export KV Spec"}
      </button>
    );
  }

  // Primary variant
  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
        disabled
          ? "bg-slate-100 text-slate-300 cursor-not-allowed"
          : downloaded
          ? "bg-emerald-600 text-white"
          : "bg-ink text-white hover:bg-ink/90",
        className
      )}
    >
      {downloaded ? (
        <Check className="h-4 w-4" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {downloaded ? "Downloaded!" : "Export KV Spec"}
    </button>
  );
}
