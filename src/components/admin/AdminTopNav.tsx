"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronDown,
  ChevronRight,
  User,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import { AdminRole } from "@prisma/client";
import { SafeAdminUser } from "@/lib/auth/session";
import AdminLogoutButton from "./AdminLogoutButton";

interface AdminTopNavProps {
  user: SafeAdminUser;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

export default function AdminTopNav({
  user,
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: AdminTopNavProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && dropdownOpen) {
        setDropdownOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dropdownOpen]);

  // Derive breadcrumbs / title
  const getBreadcrumbs = () => {
    if (pathname === "/admin") {
      return [{ label: "Dashboard" }];
    }
    if (pathname === "/admin/publications") {
      return [{ label: "Research & Publications" }];
    }
    if (pathname === "/admin/publications/new") {
      return [
        { label: "Research & Publications", href: "/admin/publications" },
        { label: "New Publication" },
      ];
    }
    if (pathname.startsWith("/admin/publications/") && pathname.endsWith("/edit")) {
      return [
        { label: "Research & Publications", href: "/admin/publications" },
        { label: "Edit Publication" },
      ];
    }
    if (pathname === "/admin/inquiries") {
      return [{ label: "Requests & Inquiries" }];
    }
    if (pathname.startsWith("/admin/inquiries/")) {
      return [
        { label: "Requests & Inquiries", href: "/admin/inquiries" },
        { label: "Inquiry Details" },
      ];
    }
    if (pathname === "/admin/journals") {
      return [{ label: "Journals & Issues" }];
    }
    if (pathname === "/admin/journals/new") {
      return [
        { label: "Journals & Issues", href: "/admin/journals" },
        { label: "New Journal" },
      ];
    }
    if (pathname.startsWith("/admin/journals/") && pathname.endsWith("/issues/new")) {
      const parts = pathname.split("/");
      const journalId = parts[3];
      return [
        { label: "Journals & Issues", href: "/admin/journals" },
        { label: "Journal Workspace", href: `/admin/journals/${journalId}/edit` },
        { label: "New Issue" },
      ];
    }
    if (pathname.startsWith("/admin/journals/") && pathname.includes("/issues/") && pathname.endsWith("/edit")) {
      const parts = pathname.split("/");
      const journalId = parts[3];
      return [
        { label: "Journals & Issues", href: "/admin/journals" },
        { label: "Journal Workspace", href: `/admin/journals/${journalId}/edit` },
        { label: "Edit Issue" },
      ];
    }
    if (pathname.startsWith("/admin/journals/") && pathname.endsWith("/edit")) {
      return [
        { label: "Journals & Issues", href: "/admin/journals" },
        { label: "Edit Journal" },
      ];
    }
    if (pathname === "/admin/authors") {
      return [{ label: "Authors & Scholars" }];
    }
    if (pathname === "/admin/authors/new") {
      return [
        { label: "Authors & Scholars", href: "/admin/authors" },
        { label: "New Author" },
      ];
    }
    if (pathname.startsWith("/admin/authors/") && pathname.endsWith("/edit")) {
      return [
        { label: "Authors & Scholars", href: "/admin/authors" },
        { label: "Edit Author" },
      ];
    }
    if (pathname === "/admin/media" || pathname.startsWith("/admin/media/")) {
      return [{ label: "Media Library" }];
    }
    if (pathname === "/admin/subscribers") {
      return [{ label: "Newsletter Subscribers" }];
    }
    if (pathname === "/admin/email") {
      return [{ label: "SMTP & Diagnostics" }];
    }
    return [{ label: "Console" }];
  };

  const breadcrumbs = getBreadcrumbs();

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case AdminRole.SUPER_ADMIN:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B09C4B]/15 text-[#6D5D25] border border-[#B09C4B]/35 text-[10px] font-sans font-semibold uppercase tracking-wider">
            Super Admin
          </span>
        );
      case AdminRole.EDITOR:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0D2C49]/10 text-[#0D2C49] border border-[#0D2C49]/20 text-[10px] font-sans font-semibold uppercase tracking-wider">
            Editor
          </span>
        );
      case AdminRole.INQUIRY_MANAGER:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
            Inquiry Mgr
          </span>
        );
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#D9DEE2] shadow-xs px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Area: Mobile toggle, Desktop collapse, Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation sidebar"
          className="lg:hidden p-2 rounded-lg text-[#64717C] hover:text-[#081D2E] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex p-1.5 rounded-lg text-[#64717C] hover:text-[#081D2E] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Current Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-sans text-[#64717C] truncate"
        >
          <Link
            href="/admin"
            className="hover:text-[#0D2C49] hover:underline transition-colors shrink-0"
          >
            AIPP
          </Link>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <span key={idx} className="flex items-center gap-1.5 truncate">
                <ChevronRight className="w-3.5 h-3.5 text-[#64717C]/40 shrink-0" />
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#0D2C49] hover:underline transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? "text-[#081D2E] font-medium truncate"
                        : "text-[#64717C] truncate"
                    }
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Right Area: Public Site Link, Administrator Identity & Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Link to Public Website */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9DEE2] hover:border-[#0D2C49]/40 text-[#64717C] hover:text-[#0D2C49] text-xs font-sans font-medium transition-colors"
          title="Open Public Website in new tab"
        >
          <span>Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Administrator Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
          >
            <div className="w-8 h-8 rounded-full bg-[#0D2C49] text-white flex items-center justify-center text-xs font-semibold tracking-wider shrink-0 shadow-2xs">
              {getInitials(user.name)}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-medium text-[#081D2E] leading-tight truncate max-w-[140px]">
                {user.name}
              </span>
              <span className="text-[10px] text-[#64717C] leading-none">
                {user.role.replace("_", " ")}
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-[#64717C] transition-transform duration-150 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#D9DEE2] py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100"
            >
              {/* Identity Header */}
              <div className="px-4 py-3 border-b border-[#D9DEE2]/60">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-semibold text-[#081D2E] truncate">
                    {user.name}
                  </p>
                  {getRoleBadge(user.role)}
                </div>
                <p className="text-[11px] text-[#64717C] truncate">
                  {user.email}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Session Active (Verified)</span>
                </div>
              </div>

              {/* Navigation links inside dropdown */}
              <div className="py-1">
                <Link
                  href="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 text-xs text-[#081D2E] hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#64717C]" />
                  <span>Dashboard Console</span>
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 text-xs text-[#081D2E] hover:bg-slate-50 flex items-center gap-2 transition-colors md:hidden"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#64717C]" />
                  <span>Public Website ↗</span>
                </Link>
              </div>

              {/* Sign Out Action */}
              <div className="border-t border-[#D9DEE2]/60 pt-1">
                <AdminLogoutButton
                  variant="dropdown"
                  onLogoutStart={() => setDropdownOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

