"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { ScrapedImageGrid } from "@/components/scraped-image-grid";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useScrapeJob } from "@/hooks/use-scrapers";
import {
  ArrowLeft,
  Images,
  FileSearch,
  Download,
  Globe,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ScrapeJobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const { data: manifest, isLoading } = useScrapeJob(jobId);
  const [showManifest, setShowManifest] = useState(false);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (!manifest) {
    return (
      <AppLayout>
        <div className="text-center py-24">
          <p className="text-sm text-slate-500">Job not found</p>
        </div>
      </AppLayout>
    );
  }

  const stats = [
    { label: "Pages Crawled", value: manifest.pages_crawled, icon: Globe },
    { label: "Images Found", value: manifest.images_found, icon: FileSearch },
    { label: "Downloaded", value: manifest.images_downloaded, icon: Download },
    { label: "Errors", value: manifest.errors.length, icon: Clock },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <Link
            href="/scrapers"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-ink transition-colors mb-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Scrapers
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">{manifest.brand}</h2>
              <p className="text-sm text-slate-500 mt-1 font-mono">
                {manifest.regions.join(", ")} / {manifest.job_id.slice(0, 8)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700">
              <CheckCircle className="h-3 w-3" />
              {manifest.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-soft p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="h-4 w-4 text-slate-400" />
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
              <p className="text-xl font-bold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={showManifest ? "secondary" : "primary"}
            size="sm"
            onClick={() => setShowManifest(false)}
          >
            <Images className="h-3.5 w-3.5 mr-1.5" />
            Image Grid
          </Button>
          <Button
            variant={showManifest ? "primary" : "secondary"}
            size="sm"
            onClick={() => setShowManifest(true)}
          >
            <FileSearch className="h-3.5 w-3.5 mr-1.5" />
            Manifest JSON
          </Button>
        </div>

        {showManifest ? (
          <div className="bg-ink rounded-2xl p-6 overflow-auto max-h-[600px]">
            <pre className="font-mono text-xs text-white/80 whitespace-pre-wrap">
              {JSON.stringify(manifest, null, 2)}
            </pre>
          </div>
        ) : (
          <ScrapedImageGrid items={manifest.items} />
        )}
      </div>
    </AppLayout>
  );
}
