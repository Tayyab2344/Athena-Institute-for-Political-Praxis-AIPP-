import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FileText,
  BookOpen,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Layers,
  Inbox,
  Image as ImageIcon,
  Mail,
  CheckCircle2,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { AdminRole, InquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

export const metadata = {
  title: "Dashboard Console | AIPP Admin",
  description: "Executive Administration Console for Athena Institute for Political Praxis.",
};

export default async function AdminDashboardPage() {
  const sessionData = await getAdminSessionFromCookies();
  if (!sessionData) {
    redirect("/admin/login?from=/admin");
  }

  const { user } = sessionData;

  const canManagePubs = hasPermission(user.role, "manage_publications");
  const canManageJournals = hasPermission(user.role, "manage_journals");
  const canManageAuthors = hasPermission(user.role, "manage_authors");
  const canManageUsers = hasPermission(user.role, "manage_users");
  const canUpload = hasPermission(user.role, "upload_files");
  const canViewMedia = hasPermission(user.role, "view_media");
  const canViewInquiries = hasPermission(user.role, "view_inquiries");
  const canManageInquiries = hasPermission(user.role, "manage_inquiries");

  // Query actual operational counts from database
  const [
    totalPublications,
    publishedPublications,
    draftPublications,
    totalJournals,
    totalIssues,
    totalAuthors,
    totalActiveAdmins,
    totalInquiries,
    newInquiries,
    inProgressInquiries,
    recentInquiries,
  ] = await Promise.all([
    prisma.publication.count().catch(() => 0),
    prisma.publication.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    prisma.publication.count({ where: { status: "DRAFT" } }).catch(() => 0),
    prisma.journal.count().catch(() => 0),
    prisma.journalIssue.count().catch(() => 0),
    prisma.author.count().catch(() => 0),
    prisma.adminUser.count({ where: { status: "ACTIVE" } }).catch(() => 1),
    canViewInquiries ? prisma.contactInquiry.count().catch(() => 0) : 0,
    canViewInquiries ? prisma.contactInquiry.count({ where: { status: InquiryStatus.NEW } }).catch(() => 0) : 0,
    canViewInquiries ? prisma.contactInquiry.count({ where: { status: InquiryStatus.IN_PROGRESS } }).catch(() => 0) : 0,
    canViewInquiries
      ? prisma.contactInquiry.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            referenceNumber: true,
            fullName: true,
            email: true,
            inquiryType: true,
            status: true,
            createdAt: true,
          },
        }).catch(() => [])
      : [],
  ]);

  const activeModuleCount =
    (canManagePubs ? 1 : 0) +
    (canManageJournals ? 1 : 0) +
    (canManageAuthors ? 1 : 0) +
    (canViewMedia ? 1 : 0) +
    (canViewInquiries ? 1 : 0);

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case AdminRole.SUPER_ADMIN:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B09C4B]/15 text-[#6D5D25] border border-[#B09C4B]/40 text-xs font-sans font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B09C4B]" />
            Super Administrator
          </span>
        );
      case AdminRole.EDITOR:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D2C49]/10 text-[#0D2C49] border border-[#0D2C49]/20 text-xs font-sans font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D2C49]" />
            Editor
          </span>
        );
      case AdminRole.INQUIRY_MANAGER:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-sans font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Inquiry Manager
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            New
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold uppercase tracking-wider">
            In Progress
          </span>
        );
      case "RESOLVED":
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider">
            Resolved
          </span>
        );
      default:
        return <span className="text-[10px] font-semibold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome & Institutional Header */}
      <section className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xs p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-[#B09C4B] font-semibold">
                Athena Institute for Political Praxis
              </span>
              {getRoleBadge(user.role)}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#081D2E] tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#64717C] max-w-2xl font-light leading-relaxed">
              Executive CMS Console and central administrative operations. Manage institutional publications, 
              journal issues, and incoming public inquiries with full audit logging.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#D9DEE2]/60">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Active Database Session</span>
            </div>
            <span className="text-[11px] font-sans text-[#64717C]">
              Signed in as: <strong className="text-[#081D2E] font-medium">{user.email}</strong>
            </span>
            <span className="text-[10px] font-sans text-[#64717C]">
              Active Administrators: <strong className="text-[#081D2E] font-medium">{totalActiveAdmins}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Operational Quick Access (Implemented CMS Modules) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-normal text-[#081D2E]">
              Operational Modules
            </h2>
            <p className="text-xs font-sans text-[#64717C] font-light">
              Active administrative modules with live database persistence.
            </p>
          </div>
          <span className="text-[11px] font-sans text-emerald-700 font-medium px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            {activeModuleCount} Modules Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Requests & Inquiries (Visible to Super Admin & Inquiry Manager) */}
          {canViewInquiries && (
            <div className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xs p-5 sm:p-6 flex flex-col justify-between hover:border-[#0D2C49]/40 transition-colors">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 rounded-xl bg-[#0D2C49]/5 border border-[#0D2C49]/10 text-[#0D2C49]">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
                    Phase 3 Active
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-[#081D2E]">
                    Requests &amp; Inquiries
                  </h3>
                  <p className="text-xs font-sans text-[#64717C] mt-1 leading-relaxed font-light">
                    Public contact submissions, partnership requests, and diplomatic applications.
                  </p>
                </div>

                {/* Real DB Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2]/60 text-center">
                  <div>
                    <span className="block text-base sm:text-lg font-serif font-semibold text-[#081D2E]">
                      {totalInquiries}
                    </span>
                    <span className="text-[10px] font-sans text-[#64717C] uppercase tracking-wider">
                      Total
                    </span>
                  </div>
                  <div>
                    <span className="block text-base sm:text-lg font-serif font-semibold text-amber-600">
                      {newInquiries}
                    </span>
                    <span className="text-[10px] font-sans text-[#64717C] uppercase tracking-wider">
                      New
                    </span>
                  </div>
                  <div>
                    <span className="block text-base sm:text-lg font-serif font-semibold text-blue-600">
                      {inProgressInquiries}
                    </span>
                    <span className="text-[10px] font-sans text-[#64717C] uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#D9DEE2]/60">
                <Link
                  href="/admin/inquiries"
                  className="w-full px-4 py-2 rounded-lg bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-sans font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>Manage Inquiries</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Card 2: Research Publications (Visible to Super Admin & Editor) */}
          <div className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xs p-5 sm:p-6 flex flex-col justify-between hover:border-[#0D2C49]/40 transition-colors">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="p-3 rounded-xl bg-[#0D2C49]/5 border border-[#0D2C49]/10 text-[#0D2C49]">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
                  Active CMS
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-medium text-[#081D2E]">
                  Research &amp; Publications
                </h3>
                <p className="text-xs font-sans text-[#64717C] mt-1 leading-relaxed font-light">
                  Peer-reviewed papers, policy briefs, institutional reports, and research archives.
                </p>
              </div>

              {/* Real DB Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2]/60 text-center">
                <div>
                  <span className="block text-base sm:text-lg font-serif font-semibold text-[#081D2E]">
                    {totalPublications}
                  </span>
                  <span className="text-[10px] font-sans text-[#64717C] uppercase tracking-wider">
                    Total
                  </span>
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-serif font-semibold text-emerald-700">
                    {publishedPublications}
                  </span>
                  <span className="text-[10px] font-sans text-[#64717C] uppercase tracking-wider">
                    Published
                  </span>
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-serif font-semibold text-amber-700">
                    {draftPublications}
                  </span>
                  <span className="text-[10px] font-sans text-[#64717C] uppercase tracking-wider">
                    Drafts
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#D9DEE2]/60 flex items-center gap-2">
              {canManagePubs ? (
                <>
                  <Link
                    href="/admin/publications"
                    className="flex-1 px-4 py-2 rounded-lg bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-sans font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/admin/publications/new"
                    className="px-3 py-2 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#081D2E] text-xs font-sans font-medium transition-colors flex items-center justify-center gap-1"
                    title="Add new publication"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New</span>
                  </Link>
                </>
              ) : (
                <span className="text-xs text-[#64717C] italic">
                  Restricted to Editors &amp; Super Administrators
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Journals & Issues (Visible to Super Admin & Editor) */}
          <div className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xs p-5 sm:p-6 flex flex-col justify-between hover:border-[#0D2C49]/40 transition-colors">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="p-3 rounded-xl bg-[#0D2C49]/5 border border-[#0D2C49]/10 text-[#0D2C49]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
                  Active CMS
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-medium text-[#081D2E]">
                  Journals &amp; Issues
                </h3>
                <p className="text-xs font-sans text-[#64717C] mt-1 leading-relaxed font-light">
                  Institutional journals, volume compilations, tables of contents, and publication issues.
                </p>
              </div>

              {/* Real DB Metrics */}
              <div className="grid grid-cols-2 gap-2.5 py-3 px-3.5 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2]/60 text-center">
                <div>
                  <span className="block text-base sm:text-lg font-serif font-semibold text-[#081D2E]">
                    {totalJournals}
                  </span>
                  <span className="text-[10px] font-sans text-[#64717C] uppercase tracking-wider">
                    Journals
                  </span>
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-serif font-semibold text-[#081D2E]">
                    {totalIssues}
                  </span>
                  <span className="text-[10px] font-sans text-[#64717C] uppercase tracking-wider">
                    Compiled Issues
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#D9DEE2]/60 flex items-center gap-2">
              {canManageJournals ? (
                <>
                  <Link
                    href="/admin/journals"
                    className="flex-1 px-4 py-2 rounded-lg bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-sans font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/admin/journals/new"
                    className="px-3 py-2 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#081D2E] text-xs font-sans font-medium transition-colors flex items-center justify-center gap-1"
                    title="Add new journal"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New</span>
                  </Link>
                  <Link
                    href="/journals"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#081D2E] text-xs font-sans font-medium transition-colors flex items-center justify-center gap-1"
                    title="View public journal archive"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <span className="text-xs text-[#64717C] italic">
                  Restricted to Editors &amp; Super Administrators
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xs p-5 sm:p-6 flex flex-col justify-between hover:border-[#0D2C49]/40 transition-colors">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="p-3 rounded-xl bg-[#0D2C49]/5 border border-[#0D2C49]/10 text-[#0D2C49]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans font-semibold uppercase tracking-wider">
                  Active CMS
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-medium text-[#081D2E]">
                  Authors &amp; Scholars
                </h3>
                <p className="text-xs font-sans text-[#64717C] mt-1 leading-relaxed font-light">
                  Institutional fellows, researchers, visiting scholars, and attributed paper authors.
                </p>
              </div>

              <div className="grid grid-cols-1 py-3 px-3.5 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2]/60 text-center">
                <div>
                  <span className="block text-base sm:text-lg font-serif font-semibold text-[#081D2E]">
                    {totalAuthors}
                  </span>
                  <span className="text-[10px] font-sans text-[#64717C] uppercase tracking-wider">
                    Total Scholars
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#D9DEE2]/60 flex items-center gap-2">
              {canManageAuthors ? (
                <>
                  <Link
                    href="/admin/authors"
                    className="flex-1 px-4 py-2 rounded-lg bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-sans font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/admin/authors/new"
                    className="px-3 py-2 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#081D2E] text-xs font-sans font-medium transition-colors flex items-center justify-center gap-1"
                    title="Add new author"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New</span>
                  </Link>
                </>
              ) : (
                <span className="text-xs text-[#64717C] italic">
                  Restricted to Editors &amp; Super Administrators
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Recent Inquiries Feed (For authorized users with inquiries permission) */}
      {canViewInquiries && recentInquiries.length > 0 && (
        <section className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#081D2E]">
                Recent Inquiries Feed
              </h2>
              <p className="text-xs font-sans text-[#64717C] font-light">
                Latest submissions from public website portals requiring Secretariat attention.
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs text-[#0D2C49] hover:underline font-medium flex items-center gap-1"
            >
              <span>View All Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#D9DEE2] text-[#64717C] uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 font-semibold">Reference</th>
                  <th className="py-2.5 px-3 font-semibold">Submitter</th>
                  <th className="py-2.5 px-3 font-semibold">Inquiry Type</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Received</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE2]/60 text-[#081D2E]">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono font-medium text-[11px] text-[#0D2C49]">
                      <Link href={`/admin/inquiries/${inq.id}`} className="hover:underline">
                        {inq.referenceNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-[#081D2E] truncate max-w-[160px]">
                        {inq.fullName}
                      </div>
                      <div className="text-[10px] text-[#64717C] truncate max-w-[160px]">
                        {inq.email}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 truncate max-w-[180px]">
                      {inq.inquiryType}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getStatusBadge(inq.status)}
                    </td>
                    <td className="py-2.5 px-3 text-[#64717C] text-[11px] whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
                        className="text-xs text-[#0D2C49] hover:underline font-medium"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. Module Status Matrix (Real Development Status) */}
      <section className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xs p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-normal text-[#081D2E]">
            System Architecture &amp; Module Implementation Matrix
          </h2>
          <p className="text-xs font-sans text-[#64717C] font-light mt-0.5">
            Real implementation status across the 9 core institutional administrative modules.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-[#D9DEE2] text-[#64717C] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 font-semibold">Module</th>
                <th className="py-3 px-3 font-semibold">Implementation Status</th>
                <th className="py-3 px-3 font-semibold">Development Phase</th>
                <th className="py-3 px-3 font-semibold">Authorized Roles</th>
                <th className="py-3 px-3 font-semibold text-right">Action / Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE2]/60 text-[#081D2E]">
              {/* 1. Dashboard */}
              <tr className="hover:bg-[#F7F7F7]/60">
                <td className="py-3 px-3 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Dashboard Console
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider">
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64717C]">Phase 2 (Active)</td>
                <td className="py-3 px-3 text-[#64717C]">All Roles</td>
                <td className="py-3 px-3 text-right">
                  <span className="text-[#0D2C49] font-medium">Current Page</span>
                </td>
              </tr>

              {/* 2. Research & Publications */}
              <tr className="hover:bg-[#F7F7F7]/60">
                <td className="py-3 px-3 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Research &amp; Publications
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider">
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64717C]">Phase 1</td>
                <td className="py-3 px-3 text-[#64717C]">Super Admin, Editor</td>
                <td className="py-3 px-3 text-right">
                  <Link
                    href="/admin/publications"
                    className="text-[#0D2C49] hover:underline font-medium"
                  >
                    Open CMS →
                  </Link>
                </td>
              </tr>

              {/* 3. Journals */}
              <tr className="hover:bg-[#F7F7F7]/60">
                <td className="py-3 px-3 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Journals &amp; Issues
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider">
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64717C]">Phase 1</td>
                <td className="py-3 px-3 text-[#64717C]">Super Admin, Editor</td>
                <td className="py-3 px-3 text-right">
                  <Link
                    href="/admin/journals"
                    className="text-[#0D2C49] hover:underline font-medium"
                  >
                    Open CMS →
                  </Link>
                </td>
              </tr>

              {/* 4. Requests & Inquiries (NOW OPERATIONAL IN PHASE 3!) */}
              <tr className="hover:bg-[#F7F7F7]/60">
                <td className="py-3 px-3 font-medium flex items-center gap-2 text-[#081D2E]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Requests &amp; Inquiries
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider">
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64717C]">Phase 3 (Active)</td>
                <td className="py-3 px-3 text-[#64717C]">Super Admin, Inquiry Mgr</td>
                <td className="py-3 px-3 text-right">
                  {canViewInquiries ? (
                    <Link
                      href="/admin/inquiries"
                      className="text-[#0D2C49] hover:underline font-medium"
                    >
                      Open Module →
                    </Link>
                  ) : (
                    <span className="text-slate-400 italic">Restricted</span>
                  )}
                </td>
              </tr>

              {/* 5. Blogs & Perspectives */}
              <tr className="hover:bg-[#F7F7F7]/60">
                <td className="py-3 px-3 font-medium flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Blogs &amp; Perspectives
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold uppercase tracking-wider">
                    Roadmap
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64717C]">Phase 4+</td>
                <td className="py-3 px-3 text-[#64717C]">Super Admin, Editor</td>
                <td className="py-3 px-3 text-right text-slate-400 italic">
                  Planned Module
                </td>
              </tr>

              {/* 6. Programs */}
              <tr className="hover:bg-[#F7F7F7]/60">
                <td className="py-3 px-3 font-medium flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Programs CMS
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold uppercase tracking-wider">
                    Roadmap
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64717C]">Phase 4+</td>
                <td className="py-3 px-3 text-[#64717C]">Super Admin, Editor</td>
                <td className="py-3 px-3 text-right text-slate-400 italic">
                  Planned Module
                </td>
              </tr>

              {/* 7. Media Library */}
              <tr className="hover:bg-[#F7F7F7]/60">
                <td className="py-3 px-3 font-medium flex items-center gap-2 text-[#081D2E]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Media Library (Cloudinary)
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider">
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64717C]">Phase 7 (Active)</td>
                <td className="py-3 px-3 text-[#64717C]">Super Admin, Editor</td>
                <td className="py-3 px-3 text-right">
                  {canViewMedia ? (
                    <Link
                      href="/admin/media"
                      className="text-[#0D2C49] hover:underline font-medium"
                    >
                      Open Library →
                    </Link>
                  ) : (
                    <span className="text-slate-400 italic">Restricted</span>
                  )}
                </td>
              </tr>

              {/* 8. Email & Newsletter */}
              <tr className="hover:bg-[#F7F7F7]/60">
                <td className="py-3 px-3 font-medium flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Email &amp; Newsletter
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold uppercase tracking-wider">
                    Roadmap
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64717C]">Phase 4+</td>
                <td className="py-3 px-3 text-[#64717C]">Super Admin</td>
                <td className="py-3 px-3 text-right text-slate-400 italic">
                  Planned Module
                </td>
              </tr>

              {/* 9. Admin Settings */}
              <tr className="hover:bg-[#F7F7F7]/60">
                <td className="py-3 px-3 font-medium flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Admin Settings &amp; Security
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold uppercase tracking-wider">
                    Roadmap
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64717C]">Phase 4+</td>
                <td className="py-3 px-3 text-[#64717C]">Super Admin</td>
                <td className="py-3 px-3 text-right text-slate-400 italic">
                  Planned Module
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Upcoming Functionality Briefing & Authorization Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upcoming Functionality Briefing */}
        <section className="lg:col-span-2 bg-white rounded-2xl border border-[#D9DEE2] shadow-xs p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#B09C4B]" />
            <h2 className="font-serif text-lg font-medium text-[#081D2E]">
              Upcoming Functionality Roadmap
            </h2>
          </div>
          <p className="text-xs font-sans text-[#64717C] font-light leading-relaxed">
            The following modules are planned for subsequent development phases. They remain represented in the navigation shell 
            as non-operational placeholders:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2]/60 space-y-1">
              <div className="flex items-center gap-2 text-[#081D2E] font-medium text-xs">
                <Mail className="w-3.5 h-3.5 text-[#0D2C49]" />
                <span>Email &amp; Newsletter</span>
              </div>
              <p className="text-[11px] text-[#64717C] font-light leading-relaxed">
                SMTP email delivery, newsletter subscriber list management, and institutional communique dispatch.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2]/60 space-y-1">
              <div className="flex items-center gap-2 text-[#081D2E] font-medium text-xs">
                <ImageIcon className="w-3.5 h-3.5 text-[#0D2C49]" />
                <span>Media Library</span>
              </div>
              <p className="text-[11px] text-[#64717C] font-light leading-relaxed">
                Centralized Cloudinary asset management for publication covers, documents, and event photo archives.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2]/60 space-y-1">
              <div className="flex items-center gap-2 text-[#081D2E] font-medium text-xs">
                <Layers className="w-3.5 h-3.5 text-[#0D2C49]" />
                <span>Programs &amp; Initiatives</span>
              </div>
              <p className="text-[11px] text-[#64717C] font-light leading-relaxed">
                Leadership simulation workshops, diplomatic praxis fellowships, and summit schedules.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2]/60 space-y-1">
              <div className="flex items-center gap-2 text-[#081D2E] font-medium text-xs">
                <FileText className="w-3.5 h-3.5 text-[#0D2C49]" />
                <span>Blogs &amp; Perspectives CMS</span>
              </div>
              <p className="text-[11px] text-[#64717C] font-light leading-relaxed">
                Editorial commentary, op-eds, insights, and thought leadership articles.
              </p>
            </div>
          </div>
        </section>

        {/* Right: Administrator Authorization Profile */}
        <section className="bg-white rounded-2xl border border-[#D9DEE2] shadow-xs p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-[#081D2E]">
            <ShieldCheck className="w-4 h-4 text-[#0D2C49]" />
            <h2 className="font-serif text-lg font-medium">
              Your Permission Profile
            </h2>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2]/60 space-y-1 text-xs">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#64717C]">
              Active Role
            </span>
            <p className="font-medium text-[#081D2E]">
              {user.role.replace("_", " ")}
            </p>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between py-1 border-b border-[#D9DEE2]/50">
              <span className="text-[#64717C]">Manage Requests &amp; Inquiries</span>
              {canManageInquiries ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="text-slate-400 italic">Prohibited</span>
              )}
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#D9DEE2]/50">
              <span className="text-[#64717C]">Manage Publications</span>
              {canManagePubs ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="text-slate-400 italic">Prohibited</span>
              )}
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#D9DEE2]/50">
              <span className="text-[#64717C]">Manage Journals</span>
              {canManageJournals ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="text-slate-400 italic">Prohibited</span>
              )}
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#D9DEE2]/50">
              <span className="text-[#64717C]">Upload File Assets</span>
              {canUpload ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="text-slate-400 italic">Prohibited</span>
              )}
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#64717C]">Security &amp; Admin Users</span>
              {canManageUsers ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="text-slate-400 italic">Prohibited</span>
              )}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#64717C] leading-normal font-light">
            Backend authorization is authoritative and enforced at every API route and server action.
          </div>
        </section>
      </div>
    </div>
  );
}
