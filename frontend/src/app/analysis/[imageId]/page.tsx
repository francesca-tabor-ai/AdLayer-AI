"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { ElementTable } from "@/components/element-table";
import { IATree } from "@/components/ia-tree";
import { ExportOptions } from "@/components/export-options";
import { Spinner } from "@/components/ui/spinner";
import { useAnalysis } from "@/hooks/use-analysis";

export default function AnalysisPage() {
  const params = useParams();
  const imageId = params.imageId as string;
  const { data, isLoading, isError } = useAnalysis(imageId);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis</h2>
            <p className="text-sm text-gray-500 mt-1 font-mono">{imageId}</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              Failed to load analysis data. Please try again.
            </p>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Detected Elements ({data.elements.length})
                </h3>
                <ElementTable
                  elements={data.elements}
                  selectedId={selectedElement}
                  onSelect={setSelectedElement}
                />
              </div>
            </div>

            <div className="space-y-4">
              <IATree blocks={data.information_architecture} />
              <ExportOptions imageId={imageId} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
