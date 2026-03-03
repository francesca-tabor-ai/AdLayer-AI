"use client";

import { ChevronRight } from "lucide-react";

interface IABlock {
  id: string;
  block_type: string;
  element_ids: string[];
  hierarchy_score: number | null;
}

interface IATreeProps {
  blocks: IABlock[];
}

const blockLabels: Record<string, string> = {
  brand_block: "Brand",
  value_block: "Value Proposition",
  offer_block: "Offer",
  conversion_block: "Conversion",
  compliance_block: "Compliance",
};

export function IATree({ blocks }: IATreeProps) {
  if (blocks.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-4 text-center">
        No information architecture blocks detected.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Information Architecture
      </h3>
      {blocks.map((block) => (
        <div
          key={block.id}
          className="bg-white rounded-lg border border-gray-200 p-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {blockLabels[block.block_type] || block.block_type}
              </span>
            </div>
            {block.hierarchy_score != null && (
              <span className="text-xs text-gray-500">
                Score: {block.hierarchy_score.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            {block.element_ids.length} element{block.element_ids.length !== 1 ? "s" : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
