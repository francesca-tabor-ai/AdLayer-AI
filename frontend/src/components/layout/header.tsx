"use client";

import { Menu, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
        >
          <Menu className="h-5 w-5 text-slate-500" />
        </button>
        <h1 className="text-xl font-bold text-ink">
          AdLayer <span className="gradient-text">AI</span>
        </h1>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{user.email}</span>
          <button
            onClick={logout}
            className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      )}
    </header>
  );
}
