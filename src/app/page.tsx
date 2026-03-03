"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Layers,
  ScanSearch,
  FileJson,
  Tags,
  ArrowRight,
  Scan,
  Sparkles,
  Zap,
  Check,
} from "lucide-react";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const capabilities = [
  {
    icon: Layers,
    title: "Creative Deconstruction",
    description:
      "Detect and isolate text regions, product images, logos, CTA buttons, badges, and backgrounds with bounding box coordinates and confidence scores.",
  },
  {
    icon: Tags,
    title: "Semantic Classification",
    description:
      "Auto-label every element: Headline, Subheadline, Offer, Price, Discount, CTA, Brand, Legal. Override any classification with a single click.",
  },
  {
    icon: ScanSearch,
    title: "IA Modeling",
    description:
      "Elements are grouped into logical marketing blocks: Brand Layer, Value Layer, Offer Layer, Conversion Layer, Compliance Layer.",
  },
  {
    icon: FileJson,
    title: "Data-Merge Export",
    description:
      "Generate CSVs with customizable headers, @Image formatting, and asset folders. Plug directly into InDesign Data Merge, Figma, or any pipeline.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For individuals exploring creative intelligence",
    features: [
      "10 ad analyses per month",
      "CSV export",
      "Basic semantic classification",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For teams scaling creative production",
    features: [
      "Unlimited ad analyses",
      "CSV + JSON export",
      "Advanced IA modeling",
      "Batch uploads",
      "API access",
      "Brand scraping module",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with custom workflows",
    features: [
      "Everything in Pro",
      "Custom schema mapping",
      "Brand rule engines",
      "Dedicated model tuning",
      "SSO & RBAC",
      "SLA guarantee",
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            AdLayer <span className="gradient-text">AI</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-medium text-accent-purple mb-4 tracking-wide uppercase">
              Creative Intelligence Platform
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.1]">
              Turn every ad into{" "}
              <span className="gradient-text">structured data</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Upload a flat image. Get back structured layers, semantic
              classifications, information architecture, and production-ready
              exports. Machine-readable in seconds.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" variant="gradient">
                Start for free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="secondary" size="lg">
                How it works
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-sm font-medium text-accent-purple mb-3 tracking-wide uppercase text-center">
              How It Works
            </p>
            <h2 className="text-3xl font-bold text-ink text-center tracking-tight">
              Three steps. Structured output.
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="mt-16 bg-ink rounded-2xl p-8 shadow-elevated">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Upload",
                    code: "POST /api/v1/images/upload",
                    desc: "JPG, PNG, WebP, PDF",
                  },
                  {
                    step: "02",
                    title: "Deconstruct",
                    code: "GET  /api/v1/analysis/{id}",
                    desc: "Layers, OCR, semantics",
                  },
                  {
                    step: "03",
                    title: "Export",
                    code: "GET  /api/v1/exports/{id}/csv",
                    desc: "CSV, JSON, asset pack",
                  },
                ].map((item, i) => (
                  <div key={item.step} className="text-center">
                    <span className="text-xs font-mono text-accent-purple">
                      {item.step}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-2">
                      {item.title}
                    </h3>
                    <code className="block mt-3 text-xs font-mono text-white/50 bg-white/5 rounded-xl px-3 py-2">
                      {item.code}
                    </code>
                    <p className="text-xs text-white/40 mt-2">{item.desc}</p>
                    {i < 2 && (
                      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
                        <ArrowRight className="h-4 w-4 text-white/20" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-sm font-medium text-accent-purple mb-3 tracking-wide uppercase text-center">
              Capabilities
            </p>
            <h2 className="text-3xl font-bold text-ink text-center tracking-tight">
              Beyond OCR. Full creative intelligence.
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {capabilities.map((cap, i) => (
              <AnimatedSection key={cap.title} delay={i * 0.1}>
                <div className="h-full bg-white rounded-2xl border border-slate-100 shadow-soft p-6 hover:shadow-card transition-all duration-300">
                  <div className="p-2.5 rounded-xl bg-accent-purple/10 text-accent-purple w-fit">
                    <cap.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-ink mt-4">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Scraping */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-medium mb-4">
                  <Scan className="h-3 w-3" />
                  Brand Scraping Module
                </div>
                <h2 className="text-3xl font-bold text-ink tracking-tight">
                  Scrape brand websites automatically
                </h2>
                <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                  Collect product images and structured metadata from brand
                  websites. Bypass age gates, cookie walls, and lazy-loaded
                  content. Feed everything directly into the analysis pipeline.
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Automated age gate bypass",
                    "Full metadata extraction (product, page, OG tags)",
                    "SHA-256 content deduplication",
                    "Image classification (product, banner, logo, lifestyle)",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <Check className="h-3.5 w-3.5 text-accent-purple shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ink rounded-2xl p-6">
                <pre className="font-mono text-xs text-white/70 overflow-x-auto">
{`$ python -m backend.scrapers.veev scrape \\
    --region ch_en \\
    --max-pages 5

[INFO] age_gate_bypassed method=swiss_multi_step
[INFO] crawl_complete pages=5 links=12
[INFO] parse_complete images=52 unique=46
[INFO] download_complete saved=46 errors=0

output/veev/ch_en/
  product/   # 28 images
  banner/    # 8 images
  logo/      # 4 images
  lifestyle/ # 6 images
  metadata/manifest.json`}
                </pre>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-sm font-medium text-accent-purple mb-3 tracking-wide uppercase text-center">
              Pricing
            </p>
            <h2 className="text-3xl font-bold text-ink text-center tracking-tight">
              Simple, transparent pricing
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <AnimatedSection key={tier.name} delay={i * 0.1}>
                <div
                  className={`h-full rounded-2xl p-6 ${
                    tier.featured
                      ? "bg-ink text-white shadow-elevated ring-1 ring-accent-purple/20"
                      : "bg-white border border-slate-100 shadow-soft"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      tier.featured ? "text-accent-purple" : "text-slate-500"
                    }`}
                  >
                    {tier.name}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span
                      className={`text-3xl font-bold ${
                        tier.featured ? "text-white" : "text-ink"
                      }`}
                    >
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span
                        className={`text-sm ${
                          tier.featured ? "text-white/50" : "text-slate-400"
                        }`}
                      >
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      tier.featured ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    {tier.description}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-2 text-sm ${
                          tier.featured ? "text-white/80" : "text-slate-600"
                        }`}
                      >
                        <Check
                          className={`h-3.5 w-3.5 shrink-0 ${
                            tier.featured
                              ? "text-accent-purple"
                              : "text-slate-400"
                          }`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/register">
                      <Button
                        variant={tier.featured ? "gradient" : "secondary"}
                        size="sm"
                        className="w-full"
                      >
                        {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6 bg-ink">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <Sparkles className="h-8 w-8 text-accent-purple mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Make every ad machine-readable
            </h2>
            <p className="text-sm text-white/50 mt-4 max-w-xl mx-auto leading-relaxed">
              Stop treating creatives as flat files. Start treating them as
              structured, queryable, automation-ready data.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="gradient" size="lg">
                  Start for free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xs text-slate-400">
            AdLayer AI. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs text-slate-400 hover:text-ink transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs text-slate-400 hover:text-ink transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
