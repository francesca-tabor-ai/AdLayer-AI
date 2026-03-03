"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Sidebar />
      <main
        className={cn(
          "pt-16 transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
