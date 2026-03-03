"use client";

import { useQuery } from "@tanstack/react-query";
import {
  MOCK_SCRAPE_JOBS,
  MOCK_MANIFEST,
  type ScrapeJobSummary,
  type ScrapeManifest,
} from "@/lib/mock-data";

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
      return MOCK_MANIFEST;
    },
    enabled: !!jobId,
  });
}
