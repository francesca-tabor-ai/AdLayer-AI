"use client";

import Link from "next/link";
import { FileSearch, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageCardProps {
  id: string;
  status: string;
  createdAt?: string;
}

const statusColors: Record<string, string> = {
  uploaded: "bg-gray-100 text-gray-700",
  processing: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export function ImageCard({ id, status, createdAt }: ImageCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-mono text-gray-500 truncate max-w-[180px]">
          {id}
        </span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full capitalize",
            statusColors[status] || statusColors.uploaded
          )}
        >
          {status}
        </span>
      </div>

      {createdAt && (
        <p className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      )}

      <div className="flex gap-2 mt-auto">
        {status === "completed" && (
          <>
            <Link href={`/analysis/${id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                <FileSearch className="h-4 w-4 mr-1" />
                Analyze
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </>
        )}
        {status === "processing" && (
          <p className="text-xs text-yellow-600">Processing...</p>
        )}
      </div>
    </div>
  );
}
