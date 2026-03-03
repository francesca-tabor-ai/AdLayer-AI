"use client";

import { cn } from "@/lib/utils";

interface Element {
  id: string;
  element_type: string;
  semantic_role: string | null;
  value: string | null;
  confidence_score: number | null;
  z_order: number | null;
}

interface ElementTableProps {
  elements: Element[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function ElementTable({ elements, selectedId, onSelect }: ElementTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {elements.map((el) => (
            <tr
              key={el.id}
              onClick={() => onSelect?.(el.id)}
              className={cn(
                "cursor-pointer transition-colors",
                el.id === selectedId ? "bg-primary-50" : "hover:bg-gray-50"
              )}
            >
              <td className="px-3 py-2 text-sm text-gray-900 capitalize">{el.element_type}</td>
              <td className="px-3 py-2 text-sm">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 capitalize">
                  {el.semantic_role || "unknown"}
                </span>
              </td>
              <td className="px-3 py-2 text-sm text-gray-700 max-w-[200px] truncate">
                {el.value || "-"}
              </td>
              <td className="px-3 py-2 text-sm">
                {el.confidence_score != null ? (
                  <span
                    className={cn(
                      "font-mono text-xs",
                      el.confidence_score >= 0.9
                        ? "text-green-600"
                        : el.confidence_score >= 0.7
                        ? "text-yellow-600"
                        : "text-red-600"
                    )}
                  >
                    {(el.confidence_score * 100).toFixed(0)}%
                  </span>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
