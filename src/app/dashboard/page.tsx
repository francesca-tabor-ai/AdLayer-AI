"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardWidgets } from "@/components/dashboard-widgets";
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight } from "lucide-react";
import { DEMO_DASHBOARD_STATS } from "@/lib/mock-data";
import { isDemoMode } from "@/stores/auth-store";

export default function DashboardPage() {
  // In demo mode, show populated stats; otherwise show zeroes until real API
  const stats = isDemoMode() ? DEMO_DASHBOARD_STATS : undefined;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Dashboard</h2>
            <p className="text-sm text-slate-500 mt-1">
              Your analysis pipeline at a glance
            </p>
          </div>
          <Link href="/upload">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </Link>
        </div>

        <DashboardWidgets {...(stats || {})} />

        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-8">
          <h3 className="text-lg font-semibold text-ink mb-3">
            Getting Started
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            Drop an ad image to begin. The engine detects layout layers, extracts
            text via OCR, classifies semantic roles, and maps the information
            architecture. Output: structured JSON and CSV, ready for your pipeline.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/upload">
              <Button size="sm">
                Upload your first ad
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
            <Link href="/scrapers">
              <Button variant="secondary" size="sm">
                Run a brand scrape
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
