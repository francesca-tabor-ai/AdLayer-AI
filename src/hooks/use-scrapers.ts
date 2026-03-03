"use client";

import { useQuery } from "@tanstack/react-query";
import {
  MOCK_SCRAPE_JOBS,
  MOCK_MANIFEST,
  MOCK_BULLBRAND_MANIFEST,
  type ScrapeJobSummary,
  type ScrapeManifest,
} from "@/lib/mock-data";

// Map job IDs to their manifests for demo mode
const MANIFEST_MAP: Record<string, ScrapeManifest> = {
  "6039ce52-96f7-4921-9837-153f11326f45": MOCK_MANIFEST,
  "d8f3a712-bb41-4e9c-a5d3-7c2e19f08b64": MOCK_BULLBRAND_MANIFEST,
};

export function useScrapeJobs() {
  return useQuery<ScrapeJobSummary[]>({
    queryKey: ["scrapeJobs"],
    queryFn: async () => {
      // TODO: Replace with real API call
      // const res = await apiClient.get<ScrapeJobSummary[]>("/scrapers/jobs");
      // return res.data;
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_SCRAPE_JOBS;
    },
  });
}

export function useScrapeJob(jobId: string) {
  return useQuery<ScrapeManifest>({
    queryKey: ["scrapeJob", jobId],
    queryFn: async () => {
      // TODO: Replace with real API call
      // const res = await apiClient.get<ScrapeManifest>(`/scrapers/jobs/${jobId}`);
      // return res.data;
      await new Promise((r) => setTimeout(r, 300));
      // Return matching manifest or fall back to the first one
      return MANIFEST_MAP[jobId] || MOCK_MANIFEST;
    },
    enabled: !!jobId,
  });
}
