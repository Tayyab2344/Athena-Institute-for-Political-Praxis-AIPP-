"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

interface AdminLogoutButtonProps {
  variant?: "default" | "dropdown" | "compact" | "sidebar";
  className?: string;
  onLogoutStart?: () => void;
}

export default function AdminLogoutButton({
  variant = "default",
  className = "",
  onLogoutStart,
}: AdminLogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    onLogoutStart?.();

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "dropdown") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={`w-full text-left px-3.5 py-2.5 text-xs text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
        ) : (
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
        )}
        <span>Sign Out</span>
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        title="Sign out of Administration Console"
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-sans text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#B09C4B]" />
        ) : (
          <LogOut className="w-4 h-4 text-slate-400" />
        )}
        <span className="truncate">Sign Out</span>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        title="Sign out of Admin CMS"
        aria-label="Sign out"
        className={`p-1.5 rounded-lg border border-[#D9DEE2] hover:border-rose-300 hover:bg-rose-50 text-[#64717C] hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title="Sign out of Admin CMS"
      className={`px-3 py-1.5 rounded-lg border border-[#D9DEE2] hover:border-rose-300 hover:bg-rose-50 text-[#64717C] hover:text-rose-700 text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>Sign Out</span>
    </button>
  );
}
