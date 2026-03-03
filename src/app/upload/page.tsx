"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ImageUploadArea } from "@/components/image-upload-area";

export default function UploadPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload an ad image for AI-powered creative deconstruction
          </p>
        </div>

        <ImageUploadArea />

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Supported Formats
          </h3>
          <div className="flex gap-2">
            {["JPG", "PNG", "WebP", "PDF"].map((fmt) => (
              <span
                key={fmt}
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {fmt}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Maximum file size: 50 MB</p>
        </div>
      </div>
    </AppLayout>
  );
}
