"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ScraperJobCard } from "@/components/scraper-job-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useScrapeJobs } from "@/hooks/use-scrapers";
import { SUPPORTED_BRANDS } from "@/lib/mock-data";
import { Plus, Globe } from "lucide-react";

export default function ScrapersPage() {
  const { data: jobs, isLoading } = useScrapeJobs();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Brand Scrapers</h2>
            <p className="text-sm text-slate-500 mt-1">
              Collect product images and metadata from brand websites
            </p>
          </div>
          <Button disabled title="API not connected yet">
            <Plus className="h-4 w-4 mr-2" />
            New Scrape
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-semibold text-ink mb-4">Recent Jobs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs?.map((job) => (
                  <ScraperJobCard key={job.job_id} job={job} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
              <h3 className="text-sm font-semibold text-ink mb-4">
                Supported Brands
              </h3>
              <div className="space-y-4">
                {SUPPORTED_BRANDS.map((brand) => (
                  <div
                    key={brand.name}
                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50"
                  >
                    <div className="p-2 rounded-xl bg-accent-purple/10 text-accent-purple">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">
                        {brand.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {brand.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {brand.regions.map((region) => (
                          <span
                            key={region.code}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white border border-slate-200 text-slate-600"
                          >
                            <span className="font-mono">{region.code}</span>
                            <span className="text-slate-300">|</span>
                            <span>{region.label}</span>
                            <span
                              className={
                                region.status === "active"
                                  ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                                  : "h-1.5 w-1.5 rounded-full bg-slate-300"
                              }
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ink rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                Run via CLI
              </h3>
              <pre className="font-mono text-xs text-white/70 bg-white/5 rounded-xl p-4 overflow-x-auto">
{`# Scrape VEEV Switzerland
python -m backend.scrapers.veev scrape --region ch_en

# Quick test (5 pages)
python -m backend.scrapers.veev scrape --region ch_en --max-pages 5

# Dry run (no downloads)
python -m backend.scrapers.veev scrape --region ch_en --dry-run`}
              </pre>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
