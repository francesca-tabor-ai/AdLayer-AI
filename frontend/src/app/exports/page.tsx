"use client";

import { AppLayout } from "@/components/layout/app-layout";

export default function ExportsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exports</h2>
          <p className="text-sm text-gray-500 mt-1">
            View and download your exported data files
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">
            No exports yet. Process an image and export the results to see them here.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
