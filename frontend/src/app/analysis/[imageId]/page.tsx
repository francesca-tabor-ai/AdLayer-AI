"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { KVAnalysisView } from "@/components/kv-analysis-view";
import { Spinner } from "@/components/ui/spinner";
import { useKVAnalysis } from "@/hooks/use-analysis";
import {
  ArrowLeft,
  ImageIcon,
  Clock,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function AnalysisPage() {
  const params = useParams();
  const imageId = params.imageId as string;
  const { data, isLoading } = useKVAnalysis(imageId);
  const [showRaw, setShowRaw] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Upload
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            KV Analysis
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-mono">{imageId}</p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Empty state — no analysis found */}
        {!isLoading && !data && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
              <ImageIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No analysis found
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              This image hasn&apos;t been analyzed yet, or the analysis session
              has expired. Upload an image to run KV Creative Deconstruction.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-xl text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go to Upload
            </Link>
          </div>
        )}

        {/* Analysis result */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column — image preview + metadata */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
                {/* Image preview */}
                {data.imageDataUrl && (
                  <div className="aspect-square bg-slate-50 flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.imageDataUrl}
                      alt={data.filename}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                )}

                {/* Metadata */}
                <div className="p-4 space-y-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-slate-600 truncate">
                      {data.filename}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-slate-600">
                      {new Date(data.analyzedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — KV analysis sections */}
            <div className="lg:col-span-2 space-y-6">
              <KVAnalysisView
                sections={data.sections}
                readinessScore={data.readinessScore}
                archetype={data.archetype}
              />

              {/* Raw AI response toggle */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="shrink-0 p-2 rounded-xl bg-slate-100 text-slate-700">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-ink flex-1">
                    Raw AI Response
                  </span>
                  {showRaw ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {showRaw && (
                  <div className="px-4 pb-4">
                    <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 max-h-[600px] overflow-y-auto">
                      {data.raw}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
