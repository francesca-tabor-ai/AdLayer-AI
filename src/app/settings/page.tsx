"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account and subscription
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p className="text-sm font-medium text-gray-900">
                {user?.email || "Not signed in"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Account ID</span>
              <p className="text-sm font-mono text-gray-600">
                {user?.id || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
          <p className="text-sm text-gray-600">
            No active subscription. Choose a plan to unlock full features.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Starter", price: "$29/mo", desc: "50 credits, CSV export" },
              { name: "Pro", price: "$99/mo", desc: "500 credits, API access" },
              { name: "Enterprise", price: "Custom", desc: "Unlimited, custom schema" },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-lg border border-gray-200 p-4 text-center"
              >
                <p className="font-semibold text-gray-900">{plan.name}</p>
                <p className="text-lg font-bold text-primary-600 mt-1">{plan.price}</p>
                <p className="text-xs text-gray-500 mt-1">{plan.desc}</p>
                <Button variant="secondary" size="sm" className="mt-3 w-full">
                  Choose
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
