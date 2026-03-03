"use client";

import { useCallback, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, Zap, AlertCircle, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadAndAnalyze } from "@/hooks/use-images";
import { ExportKVSpecButton } from "@/components/export-kv-spec-button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

export function ImageUploadArea() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedId, setUploadedId] = useState<string | null>(null);
  const analyze = useUploadAndAnalyze();
  const router = useRouter();

  const handleFile = useCallback(
    (file: File) => {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        toast("Unsupported file type. Use JPG, PNG, or WebP.", "error");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast("File too large. Maximum 20 MB.", "error");
        return;
      }
      analyze.mutate(file, {
        onSuccess: (data) => {
          setUploadedId(data.imageId);
          toast("AI analysis complete!", "success");
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "Analysis failed";
          toast(msg, "error");
        },
      });
    },
    [analyze]
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

  // Error state
  if (analyze.isError) {
    const errMsg =
      analyze.error instanceof Error
        ? analyze.error.message
        : "Analysis failed";
    const isApiKeyError = errMsg.includes("API key");

    return (
      <div className="border-2 border-red-200 bg-red-50/50 rounded-xl p-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-700">
              {isApiKeyError ? "AI API Key Required" : "Analysis Failed"}
            </p>
            <p className="text-xs text-red-500 mt-1 max-w-md">
              {errMsg}
            </p>
            {isApiKeyError && (
              <p className="text-xs text-slate-500 mt-3 max-w-md">
                Add <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">ANTHROPIC_API_KEY</code> or{" "}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">OPENAI_API_KEY</code> to
                your Vercel environment variables.
              </p>
            )}
          </div>
          <button
            onClick={() => {
              analyze.reset();
              setUploadedId(null);
            }}
            className="text-sm font-medium text-red-600 hover:text-red-700 underline underline-offset-2 transition-colors mt-1"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (uploadedId) {
    return (
      <div className="border-2 border-emerald-200 bg-emerald-50/50 rounded-xl p-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              KV Analysis Complete
            </p>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {uploadedId}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => router.push(`/analysis/${uploadedId}`)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-purple hover:text-accent-purple/80 underline underline-offset-2 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              View Analysis
            </button>
            <ExportKVSpecButton imageId={uploadedId} variant="secondary" />
            <button
              onClick={() => {
                setUploadedId(null);
                analyze.reset();
              }}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors"
            >
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Upload / Analyzing state
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
        analyze.isPending
          ? "border-accent-purple/30 bg-accent-purple/5 cursor-wait"
          : dragOver
          ? "border-primary-500 bg-primary-50 cursor-pointer"
          : "border-gray-300 hover:border-gray-400 cursor-pointer"
      )}
      onClick={() => {
        if (analyze.isPending) return;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".jpg,.jpeg,.png,.webp";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFile(file);
        };
        input.click();
      }}
    >
      {analyze.isPending ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Spinner size="lg" />
            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-accent-purple" />
          </div>
          <div>
            <p className="text-sm font-medium text-accent-purple">
              Analyzing with AI...
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Running KV Creative Deconstruction Engine
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Upload className="h-10 w-10 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              Drop your ad image here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, WebP (max 20 MB) — AI will analyze for KV automation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
