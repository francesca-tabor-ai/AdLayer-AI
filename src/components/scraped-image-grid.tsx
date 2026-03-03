"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, ImageIcon } from "lucide-react";
import type { ScrapedImageItem } from "@/lib/mock-data";

const typeColors: Record<string, string> = {
  product: "bg-blue-100 text-blue-700",
  banner: "bg-purple-100 text-purple-700",
  logo: "bg-emerald-100 text-emerald-700",
  lifestyle: "bg-amber-100 text-amber-700",
  promotional: "bg-pink-100 text-pink-700",
};

function ImageCard({ item }: { item: ScrapedImageItem }) {
  const [showDetails, setShowDetails] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden hover:shadow-card transition-all duration-200"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center overflow-hidden relative">
        {!imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.image_url}
            alt={item.alt_text || "Scraped image"}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-slate-300">
            <ImageIcon className="h-8 w-8" />
            <div className="text-xs font-mono text-center px-4">
              {item.width && item.height
                ? `${item.width} x ${item.height}`
                : item.format.toUpperCase()}
              <br />
              {(item.file_size_bytes / 1024).toFixed(0)} KB
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-ink font-medium truncate flex-1">
            {item.alt_text || "Untitled"}
          </p>
          <span
            className={cn(
              "shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium",
              typeColors[item.image_type] || "bg-slate-100 text-slate-600"
            )}
          >
            {item.image_type}
          </span>
        </div>
        {item.product_name && (
          <p className="text-[11px] text-slate-400 mt-1">{item.product_name}</p>
        )}
      </div>

      {/* Hover overlay with details + external links */}
      {showDetails && (
        <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm p-4 flex flex-col justify-between transition-opacity">
          <div className="flex justify-end gap-1.5">
            <a
              href={item.image_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Open image"
            >
              <ImageIcon className="h-3.5 w-3.5 text-white" />
            </a>
            <a
              href={item.page_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Open source page"
            >
              <ExternalLink className="h-3.5 w-3.5 text-white" />
            </a>
          </div>
          <div className="text-white space-y-1.5">
            <p className="text-xs font-medium">{item.alt_text}</p>
            <a
              href={item.page_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block text-[10px] text-white/60 font-mono truncate hover:text-white/90 transition-colors"
            >
              {item.page_url}
            </a>
            <p className="text-[10px] text-white/60 font-mono truncate">
              {item.content_hash.slice(0, 16)}...
            </p>
            <p className="text-[10px] text-white/40">
              {item.format.toUpperCase()}
              {item.width && item.height && ` / ${item.width}x${item.height}`}
              {" / "}
              {(item.file_size_bytes / 1024).toFixed(0)} KB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ScrapedImageGridProps {
  items: ScrapedImageItem[];
}

export function ScrapedImageGrid({ items }: ScrapedImageGridProps) {
  const grouped = items.reduce(
    (acc, item) => {
      const type = item.image_type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    },
    {} as Record<string, ScrapedImageItem[]>
  );

  const typeOrder = ["product", "banner", "logo", "lifestyle", "promotional"];
  const sortedTypes = typeOrder.filter((t) => grouped[t]);

  return (
    <div className="space-y-8">
      {sortedTypes.map((type) => (
        <div key={type}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-ink capitalize">{type}</h3>
            <span className="text-xs text-slate-400">
              {grouped[type].length} images
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {grouped[type].map((item, i) => (
              <ImageCard key={`${type}-${i}`} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
