"use client";

import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";

export default function AnalysisIndexPage() {
  return (
    <AppLayout>
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis</h2>
        <p className="text-sm text-gray-500">
          Select an image from the dashboard to view its analysis.
        </p>
      </div>
    </AppLayout>
  );
}
