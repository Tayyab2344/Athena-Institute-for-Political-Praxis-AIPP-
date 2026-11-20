"use client";

import { useState, useEffect } from "react";
import { SafeAdminUser } from "@/lib/auth/session";
import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";

interface AdminShellProps {
  user: SafeAdminUser;
  children: React.ReactNode;
}

export default function AdminShell({ user, children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Restore collapsed preference from localStorage asynchronously after hydration
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem("aipp_admin_sidebar_collapsed");
        if (saved === "true") {
          setCollapsed(true);
        }
      } catch {
        // Ignore localStorage access restrictions in sandboxes
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("aipp_admin_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex text-[#081D2E] font-sans antialiased selection:bg-[#B09C4B]/20 selection:text-[#081D2E]">
      {/* Sidebar Navigation */}
      <AdminSidebar
        user={user}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminTopNav
          user={user}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>

        {/* Institutional Admin Footer */}
        <footer className="border-t border-[#D9DEE2] bg-white py-4 px-6 text-center text-xs font-sans text-[#64717C]">
          Athena Institute for Political Praxis · Executive Administration Console
        </footer>
      </div>
    </div>
  );
}

