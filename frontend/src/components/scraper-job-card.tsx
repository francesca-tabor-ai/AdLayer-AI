"use client";

import Link from "next/link";
import { Images, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScrapeJobSummary } from "@/lib/mock-data";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-slate-100 text-slate-600",
    icon: Clock,
  },
  running: {
    label: "Running",
    color: "bg-amber-100 text-amber-700",
    icon: Loader2,
    animate: true,
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
};

export function ScraperJobCard({ job }: { job: ScrapeJobSummary }) {
  const status = statusConfig[job.status];
  const StatusIcon = status.icon;

  return (
    <Link href={`/scrapers/${job.job_id}`}>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 hover:shadow-card transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-ink group-hover:text-accent-purple transition-colors">
              {job.brand}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              {job.regions.join(", ")}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium",
              status.color
            )}
          >
            <StatusIcon
              className={cn(
                "h-3 w-3",
                "animate" in status && status.animate && "animate-spin"
              )}
            />
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-slate-400">Pages</p>
            <p className="text-sm font-semibold text-ink">{job.pages_crawled}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Found</p>
            <p className="text-sm font-semibold text-ink">{job.images_found}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Downloaded</p>
            <p className="text-sm font-semibold text-ink">{job.images_downloaded}</p>
          </div>
        </div>

        {job.completed_at && (
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-50">
            {new Date(job.completed_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </Link>
  );
}
