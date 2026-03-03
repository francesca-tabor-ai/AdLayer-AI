"use client";

import { useCallback, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ExportKVSpecButton } from "@/components/export-kv-spec-button";
import { getAllAnalyses, type KVAnalysisResult } from "@/lib/kv-analysis";
import { generateKVMasterSpec, downloadKVSpec } from "@/lib/kv-spec-generator";
import {
  Download,
  FileJson,
  Gauge,
  LayoutGrid,
  Clock,
  FileText,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ExportsPage() {
  const [analyses, setAnalyses] = useState<KVAnalysisResult[]>([]);

  useEffect(() => {
    setAnalyses(getAllAnalyses());
    const interval = setInterval(() => setAnalyses(getAllAnalyses()), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleExportAll = useCallback(() => {
    for (const analysis of analyses) {
      const spec = generateKVMasterSpec(analysis);
      downloadKVSpec(spec, analysis.filename);
    }
  }, [analyses]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Exports</h2>
            <p className="text-sm text-gray-500 mt-1">
              Download KV_Master_Spec.json files from your analyzed images
            </p>
          </div>
          {analyses.length > 0 && (
            <button
              onClick={handleExportAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-xl text-sm font-medium hover:bg-ink/90 transition-colors shrink-0"
            >
              <Download className="h-4 w-4" />
              Export All ({analyses.length})
            </button>
          )}
        </div>

        {analyses.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
              <FileJson className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No exports yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Upload and analyze an ad image to generate KV_Master_Spec.json
              exports for Photoshop automation.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-xl text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
              Upload Image
            </Link>
          </div>
        )}

        {analyses.length > 0 && (
          <div className="space-y-3">
            {analyses.map((analysis) => (
              <div
                key={analysis.imageId}
                className="bg-white rounded-2xl border border-slate-100 shadow-soft p-4 flex items-center gap-4"
              >
                <div className="shrink-0 w-16 h-16 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center">
                  {analysis.imageDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={analysis.imageDataUrl}
                      alt={analysis.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <Link
                    href={`/analysis/${analysis.imageId}`}
                    className="text-sm font-semibold text-ink truncate hover:text-accent-purple transition-colors block"
                  >
                    {analysis.filename}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(analysis.analyzedAt).toLocaleString()}
                    </span>
                    <span className="font-mono">{analysis.imageId}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  {analysis.readinessScore !== null && (
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
                        analysis.readinessScore >= 8
                          ? "bg-emerald-100 text-emerald-700"
                          : analysis.readinessScore >= 5
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      <Gauge className="h-3 w-3" />
                      {analysis.readinessScore}/10
                    </div>
                  )}
                  {analysis.archetype && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700">
                      <LayoutGrid className="h-3 w-3" />
                      {analysis.archetype}
                    </div>
                  )}
                </div>
                <ExportKVSpecButton
                  imageId={analysis.imageId}
                  variant="secondary"
                  className="shrink-0"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
