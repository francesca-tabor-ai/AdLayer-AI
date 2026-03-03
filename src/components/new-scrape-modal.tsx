"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { Globe, Loader2 } from "lucide-react";

interface NewScrapeModalProps {
  open: boolean;
  onClose: () => void;
  onJobCreated: (jobId: string) => void;
}

export function NewScrapeModal({ open, onClose, onJobCreated }: NewScrapeModalProps) {
  const [url, setUrl] = useState("");
  const [brand, setBrand] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Auto-detect brand from URL if not provided
    const detectedBrand = brand.trim() || detectBrand(url);

    setIsRunning(true);
    setProgress(0);

    // Simulate scraping progress
    const steps = [
      { pct: 15, delay: 400, msg: "Connecting..." },
      { pct: 30, delay: 600, msg: "Bypassing age gate..." },
      { pct: 50, delay: 800, msg: "Crawling pages..." },
      { pct: 70, delay: 700, msg: "Discovering images..." },
      { pct: 85, delay: 600, msg: "Downloading assets..." },
      { pct: 100, delay: 400, msg: "Generating manifest..." },
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, step.delay));
      setProgress(step.pct);
    }

    // Create a new job ID
    const jobId = `demo-${crypto.randomUUID().slice(0, 8)}`;

    toast(`Scrape complete: ${detectedBrand}`, "success");
    setIsRunning(false);
    setProgress(0);
    setUrl("");
    setBrand("");
    onClose();
    onJobCreated(jobId);
    router.push(`/scrapers/${jobId}`);
  };

  return (
    <Modal open={open} onClose={isRunning ? () => {} : onClose} title="New Scrape Job">
      {isRunning ? (
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-accent-purple animate-spin" />
            <p className="text-sm text-slate-600">
              Scraping <span className="font-mono text-ink">{new URL(url).hostname}</span>...
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent-purple to-accent-blue h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 text-center font-mono">{progress}%</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Input
              id="scrape-url"
              label="Target URL"
              type="url"
              placeholder="https://www.bullbrand.co.uk/collections/veev"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Enter a product collection or brand page URL to scrape
            </p>
          </div>

          <Input
            id="scrape-brand"
            label="Brand Name (optional)"
            type="text"
            placeholder="Auto-detected from URL"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">
              <Globe className="h-3 w-3 inline mr-1" />
              The scraper will crawl the page, bypass age gates, discover product images,
              and download assets with metadata.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Start Scrape
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function detectBrand(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("bullbrand")) return "Bull Brand UK";
    if (hostname.includes("veev")) return "VEEV";
    if (hostname.includes("iqos")) return "IQOS";
    // Fallback: use the domain name
    return hostname.replace("www.", "").split(".")[0].charAt(0).toUpperCase()
      + hostname.replace("www.", "").split(".")[0].slice(1);
  } catch {
    return "Unknown Brand";
  }
}
