"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Layers,
  FolderTree,
  Zap,
  Crop,
  Palette,
  ToggleLeft,
  Shield,
  LayoutGrid,
  Gauge,
  Wrench,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { KVAnalysisSection } from "@/lib/kv-analysis";

const sectionIcons = [
  Layers,       // 1. Visual Layer Decomposition
  FolderTree,   // 2. Structural Group Mapping
  Zap,          // 3. Automation Mapping
  Crop,         // 4. Crop Hierarchy Analysis
  Palette,      // 5. Flavor / Variant Variables
  ToggleLeft,   // 6. Static vs Dynamic
  Shield,       // 7. Compliance & Regulatory
  LayoutGrid,   // 8. Template Archetype
  Gauge,        // 9. Automation Readiness Score
  Wrench,       // 10. Required Adjustments
];

const sectionColors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
  "bg-red-100 text-red-700",
  "bg-indigo-100 text-indigo-700",
  "bg-orange-100 text-orange-700",
  "bg-slate-100 text-slate-700",
];

interface KVAnalysisViewProps {
  sections: KVAnalysisSection[];
  readinessScore: number | null;
  archetype: string | null;
}

export function KVAnalysisView({
  sections,
  readinessScore,
  archetype,
}: KVAnalysisViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set(sections.map((s) => s.number))
  );

  const toggleSection = (num: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const expandAll = () =>
    setExpandedSections(new Set(sections.map((s) => s.number)));
  const collapseAll = () => setExpandedSections(new Set());

  return (
    <div className="space-y-6">
      {/* Summary badges */}
      <div className="flex flex-wrap items-center gap-3">
        {readinessScore !== null && (
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold",
              readinessScore >= 8
                ? "bg-emerald-100 text-emerald-700"
                : readinessScore >= 5
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
            )}
          >
            <Gauge className="h-4 w-4" />
            Readiness: {readinessScore}/10
          </div>
        )}
        {archetype && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold bg-indigo-100 text-indigo-700">
            <LayoutGrid className="h-4 w-4" />
            {archetype}
          </div>
        )}
        <div className="ml-auto flex gap-2">
          <button
            onClick={expandAll}
            className="text-[11px] text-slate-400 hover:text-ink transition-colors"
          >
            Expand All
          </button>
          <span className="text-slate-200">|</span>
          <button
            onClick={collapseAll}
            className="text-[11px] text-slate-400 hover:text-ink transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Section cards */}
      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = sectionIcons[section.number - 1] || Layers;
          const color = sectionColors[section.number - 1] || sectionColors[0];
          const isExpanded = expandedSections.has(section.number);

          return (
            <div
              key={section.number}
              className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.number)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
              >
                <div
                  className={cn(
                    "shrink-0 p-2 rounded-xl",
                    color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      {String(section.number).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-semibold text-ink truncate">
                      {section.title}
                    </h3>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="pl-11 border-l-2 border-slate-100 ml-3">
                    <div className="pl-4 prose-sm">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600 leading-relaxed">
                        {section.content}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
