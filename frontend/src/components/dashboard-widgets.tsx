"use client";

import { Images, Download, Clock, CheckCircle } from "lucide-react";

interface StatWidgetProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

function StatWidget({ label, value, icon: Icon, color }: StatWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-ink">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

interface DashboardWidgetsProps {
  totalImages?: number;
  completedImages?: number;
  pendingExports?: number;
  totalExports?: number;
}

export function DashboardWidgets({
  totalImages = 0,
  completedImages = 0,
  pendingExports = 0,
  totalExports = 0,
}: DashboardWidgetsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatWidget
        label="Total Images"
        value={totalImages}
        icon={Images}
        color="bg-blue-100 text-blue-600"
      />
      <StatWidget
        label="Completed"
        value={completedImages}
        icon={CheckCircle}
        color="bg-green-100 text-green-600"
      />
      <StatWidget
        label="Pending Exports"
        value={pendingExports}
        icon={Clock}
        color="bg-yellow-100 text-yellow-600"
      />
      <StatWidget
        label="Total Exports"
        value={totalExports}
        icon={Download}
        color="bg-purple-100 text-purple-600"
      />
    </div>
  );
}
