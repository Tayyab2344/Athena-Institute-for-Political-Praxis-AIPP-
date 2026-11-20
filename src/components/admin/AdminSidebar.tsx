"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  BookOpen,
  PenSquare,
  Layers,
  Image as ImageIcon,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Plus,
  List,
  Users,
  GraduationCap,
} from "lucide-react";
import { AdminRole } from "@prisma/client";
import { SafeAdminUser } from "@/lib/auth/session";

export interface NavModuleItem {
  id: string;
  label: string;
  shortLabel?: string;
  href?: string;
  icon: React.ElementType;
  status: "operational" | "upcoming";
  phaseBadge?: string;
  roles: AdminRole[];
  subLinks?: { label: string; href: string; icon?: React.ElementType }[];
}

export const ADMIN_MODULES: NavModuleItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    href: "/admin",
    icon: LayoutDashboard,
    status: "operational",
    roles: [AdminRole.SUPER_ADMIN, AdminRole.EDITOR, AdminRole.INQUIRY_MANAGER],
  },
  {
    id: "inquiries",
    label: "Requests & Inquiries",
    shortLabel: "Inquiries",
    href: "/admin/inquiries",
    icon: Inbox,
    status: "operational",
    roles: [AdminRole.SUPER_ADMIN, AdminRole.INQUIRY_MANAGER],
  },
  {
    id: "subscribers",
    label: "Newsletter Subscribers",
    shortLabel: "Subscribers",
    href: "/admin/subscribers",
    icon: Users,
    status: "operational",
    roles: [AdminRole.SUPER_ADMIN, AdminRole.INQUIRY_MANAGER],
  },
  {
    id: "publications",
    label: "Research & Publications",
    shortLabel: "Publications",
    href: "/admin/publications",
    icon: FileText,
    status: "operational",
    roles: [AdminRole.SUPER_ADMIN, AdminRole.EDITOR],
    subLinks: [
      { label: "All Publications", href: "/admin/publications", icon: List },
      { label: "New Publication", href: "/admin/publications/new", icon: Plus },
    ],
  },
  {
    id: "journals",
    label: "Journals & Issues",
    shortLabel: "Journals",
    href: "/admin/journals",
    icon: BookOpen,
    status: "operational",
    roles: [AdminRole.SUPER_ADMIN, AdminRole.EDITOR],
    subLinks: [
      { label: "All Journals", href: "/admin/journals", icon: List },
      { label: "New Journal", href: "/admin/journals/new", icon: Plus },
    ],
  },
  {
    id: "authors",
    label: "Authors & Scholars",
    shortLabel: "Authors",
    href: "/admin/authors",
    icon: GraduationCap,
    status: "operational",
    roles: [AdminRole.SUPER_ADMIN, AdminRole.EDITOR],
    subLinks: [
      { label: "All Authors", href: "/admin/authors", icon: List },
      { label: "New Author", href: "/admin/authors/new", icon: Plus },
    ],
  },
  {
    id: "blogs",
    label: "Blogs & Perspectives",
    shortLabel: "Blogs",
    icon: PenSquare,
    status: "upcoming",
    phaseBadge: "Upcoming",
    roles: [AdminRole.SUPER_ADMIN, AdminRole.EDITOR],
  },
  {
    id: "programs",
    label: "Programs",
    shortLabel: "Programs",
    icon: Layers,
    status: "upcoming",
    phaseBadge: "Upcoming",
    roles: [AdminRole.SUPER_ADMIN, AdminRole.EDITOR],
  },
  {
    id: "media",
    label: "Media Library",
    shortLabel: "Media",
    href: "/admin/media",
    icon: ImageIcon,
    status: "operational",
    roles: [AdminRole.SUPER_ADMIN, AdminRole.EDITOR],
  },
  {
    id: "email",
    label: "SMTP & Diagnostics",
    shortLabel: "Email",
    href: "/admin/email",
    icon: Mail,
    status: "operational",
    roles: [AdminRole.SUPER_ADMIN],
  },
  {
    id: "settings",
    label: "Admin Settings",
    shortLabel: "Settings",
    icon: Shield,
    status: "upcoming",
    phaseBadge: "Upcoming",
    roles: [AdminRole.SUPER_ADMIN],
  },
];

interface AdminSidebarProps {
  user: SafeAdminUser;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  user,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Close mobile drawer on route changes
  useEffect(() => {
    onCloseMobile();
  }, [pathname, onCloseMobile]);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileOpen) {
        onCloseMobile();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  // Filter modules based on current user role
  const visibleModules = ADMIN_MODULES.filter((m) =>
    m.roles.includes(user.role)
  );

  const isModuleActive = (item: NavModuleItem) => {
    if (!item.href) return false;
    if (item.href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(item.href);
  };

  const renderNavContent = (isMobileView = false) => {
    const isNarrow = !isMobileView && collapsed;

    return (
      <div className="flex flex-col h-full bg-[#081D2E] text-slate-200 select-none border-r border-[#D9DEE2]/15">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          <Link
            href="/admin"
            className="flex items-center gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] rounded-lg p-1"
            title="AIPP Executive Administration Console"
          >
            <div className="relative w-8 h-8 rounded-lg bg-[#0D2C49] border border-[#B09C4B]/40 flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="AIPP Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
            {(!isNarrow || isMobileView) && (
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="font-serif text-sm font-semibold tracking-wide text-white truncate">
                  AIPP Console
                </span>
                <span className="text-[10px] font-sans uppercase tracking-[0.14em] text-[#B09C4B] truncate">
                  Executive CMS
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          {!isMobileView ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onCloseMobile}
              title="Close navigation"
              aria-label="Close navigation"
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav
          aria-label="Admin Navigation"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 focus:outline-hidden"
        >
          {visibleModules.map((item) => {
            const Icon = item.icon;
            const active = isModuleActive(item);
            const isOperational = item.status === "operational";

            if (isOperational && item.href) {
              const hasActiveSublinks =
                active && item.subLinks && (!isNarrow || isMobileView);

              return (
                <div key={item.id} className="space-y-1">
                  <Link
                    href={item.href}
                    title={item.label}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-sans transition-colors relative group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] ${
                      active
                        ? "bg-[#0D2C49] text-white font-medium border-l-2 border-[#B09C4B]"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    } ${isNarrow ? "justify-center px-2" : ""}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-[#B09C4B]" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    />
                    {(!isNarrow || isMobileView) && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                  </Link>

                  {/* Operational Sublinks */}
                  {hasActiveSublinks && item.subLinks && (
                    <div className="pl-9 pr-2 py-1 space-y-1">
                      {item.subLinks.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-sans transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#B09C4B] ${
                              isSubActive
                                ? "text-[#B09C4B] font-medium bg-white/5"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            }`}
                          >
                            {SubIcon && <SubIcon className="w-3 h-3 shrink-0" />}
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Upcoming non-operational module
            return (
              <div
                key={item.id}
                title={`${item.label} (${item.phaseBadge || "Coming Soon"} - Under Development)`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-sans text-slate-400/80 cursor-not-allowed opacity-75 select-none ${
                  isNarrow ? "justify-center px-2" : ""
                }`}
                aria-disabled="true"
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                {(!isNarrow || isMobileView) && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 font-medium shrink-0">
                      {item.phaseBadge || "Soon"}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-3 border-t border-white/10 shrink-0 space-y-2">
          {(!isNarrow || isMobileView) ? (
            <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-left">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-sans text-slate-400 uppercase tracking-wider truncate">
                  Role
                </span>
                <span className="text-[10px] font-sans font-semibold text-[#B09C4B] uppercase tracking-wider">
                  {user.role.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-white font-medium truncate mt-0.5">
                {user.name}
              </p>
            </div>
          ) : (
            <div
              className="flex items-center justify-center p-2 rounded-lg bg-white/5 text-[#B09C4B] text-[10px] font-bold"
              title={`${user.name} (${user.role})`}
            >
              {user.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          )}

          {/* Return to Public Website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Public Website in new tab"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-sans text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] ${
              isNarrow ? "justify-center px-2" : ""
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            {(!isNarrow || isMobileView) && (
              <span className="truncate">Public Website ↗</span>
            )}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ease-in-out sticky top-0 h-screen z-30 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer Backdrop & Slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
}

