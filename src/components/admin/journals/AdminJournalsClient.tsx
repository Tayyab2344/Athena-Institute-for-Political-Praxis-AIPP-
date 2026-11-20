"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Search,
  X,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileText,
  FileCheck2,
  ArrowRight,
  Layers,
  CheckCircle2
} from "lucide-react";

type JournalStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface JournalIssuePublication {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  abstract?: string;
}

interface JournalIssueItem {
  id: string;
  journalId: string;
  volume: number;
  issue: number;
  title: string;
  description?: string | null;
  status: JournalStatusValue;
  coverImageUrl?: string | null;
  coverImageAssetId?: string | null;
  pdfUrl?: string | null;
  pdfAssetId?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  coverImageAsset?: {
    originalFilename?: string;
    secureUrl?: string;
  } | null;
  pdfAsset?: {
    originalFilename?: string;
    bytes?: number;
    secureUrl?: string;
  } | null;
  publications: JournalIssuePublication[];
}

interface JournalItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status: JournalStatusValue;
  coverImageUrl?: string | null;
  coverImageAssetId?: string | null;
  createdAt: string;
  updatedAt: string;
  coverImageAsset?: {
    originalFilename?: string;
    secureUrl?: string;
  } | null;
  issues: JournalIssueItem[];
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function getStatusBadgeClasses(status: JournalStatusValue): string {
  switch (status) {
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "ARCHIVED":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "DRAFT":
    default:
      return "bg-amber-50 text-amber-900 border-amber-200";
  }
}

function formatNumberPad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "Unpublished date";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return iso;
  }
}

export default function AdminJournalsClient() {
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | JournalStatusValue>("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [reloadTick, setReloadTick] = useState(0);

  const [journals, setJournals] = useState<JournalItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadJournals() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          paginated: "true",
          page: String(page),
          limit: String(limit)
        });
        if (appliedSearch) {
          params.set("search", appliedSearch);
        }
        if (statusFilter !== "ALL") {
          params.set("status", statusFilter);
        }

        const res = await fetch(`/api/journals?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal
        });
        const data = (await res.json()) as
          | { journals: JournalItem[]; pagination: PaginationMeta }
          | { error: string };

        if (controller.signal.aborted) return;

        if (!res.ok) {
          setError("error" in data ? data.error : "Failed to load journals catalog.");
          return;
        }

        if ("journals" in data && Array.isArray(data.journals)) {
          setJournals(data.journals);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        } else if (Array.isArray(data)) {
          setJournals(data as JournalItem[]);
          setPagination({
            total: (data as JournalItem[]).length,
            page: 1,
            limit: 10,
            totalPages: 1
          });
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Network error while loading journals.");
      } finally {
        setLoading(false);
      }
    }

    loadJournals();

    return () => {
      controller.abort();
    };
  }, [page, limit, appliedSearch, statusFilter, reloadTick]);

  const handleJournalStatusChange = async (journalId: string, nextStatus: JournalStatusValue) => {
    setUpdatingKey(`journal:${journalId}`);
    setActionNotice(null);
    try {
      const res = await fetch(`/api/journals/${encodeURIComponent(journalId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = (await res.json()) as { error?: string; status?: JournalStatusValue };
      if (!res.ok) {
        setActionNotice({
          type: "error",
          message: data.error || `Failed to update journal status (HTTP ${res.status}).`
        });
        return;
      }
      setActionNotice({
        type: "success",
        message: `Journal status updated to ${nextStatus}.`
      });
      setJournals((prev) =>
        prev.map((j) => (j.id === journalId ? { ...j, status: nextStatus } : j))
      );
    } catch {
      setActionNotice({
        type: "error",
        message: "Network error while updating journal status."
      });
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleIssueStatusChange = async (
    journalId: string,
    issueId: string,
    nextStatus: JournalStatusValue
  ) => {
    setUpdatingKey(`issue:${issueId}`);
    setActionNotice(null);
    try {
      const res = await fetch(
        `/api/journals/${encodeURIComponent(journalId)}/issues/${encodeURIComponent(issueId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus })
        }
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setActionNotice({
          type: "error",
          message: data.error || `Failed to update issue status (HTTP ${res.status}).`
        });
        return;
      }
      setActionNotice({
        type: "success",
        message: `Issue status updated to ${nextStatus}.`
      });
      setJournals((prev) =>
        prev.map((j) => {
          if (j.id !== journalId) return j;
          return {
            ...j,
            issues: j.issues.map((iss) => (iss.id === issueId ? { ...iss, status: nextStatus } : iss))
          };
        })
      );
    } catch {
      setActionNotice({
        type: "error",
        message: "Network error while updating issue status."
      });
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      <header className="bg-white rounded-xl border border-[#D9DEE2] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#B09C4B] font-semibold">
              Institutional Series &amp; Volumes
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#0D2C49]/5 text-[#0D2C49] text-[10px] font-mono font-medium border border-[#0D2C49]/10">
              {pagination.total} {pagination.total === 1 ? "Journal" : "Journals"}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#081D2E] font-medium">
            Journals &amp; Issues
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#64717C]">
            Manage academic journal titles, issue volumes, cover media, compiled PDFs, and publication lifecycles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            href="/journals"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[42px] rounded-lg border border-[#D9DEE2] text-[#081D2E] hover:border-[#0D2C49] text-xs font-sans font-medium transition-colors"
          >
            <span>Public Archive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin/journals/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Journal</span>
          </Link>
        </div>
      </header>

      {actionNotice && (
        <div
          role="alert"
          className={`rounded-xl border p-4 flex items-start gap-3 text-xs font-sans ${
            actionNotice.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : "border-amber-300 bg-amber-50 text-amber-950"
          }`}
        >
          {actionNotice.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{actionNotice.message}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#D9DEE2] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64717C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by journal title, slug, description, or issue..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] placeholder-[#64717C] focus:outline-none focus:border-[#0D2C49]"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <label htmlFor="journal-status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="journal-status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "ALL" | JournalStatusValue);
              setPage(1);
            }}
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button
            type="button"
            onClick={() => setReloadTick((t) => t + 1)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-[#D9DEE2] text-[#081D2E] hover:border-[#0D2C49] text-xs font-sans font-medium transition-colors disabled:opacity-50"
            title="Reload journals catalog"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center text-xs font-sans text-[#64717C]">
          Loading journals catalog...
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-[#D9DEE2] p-10 text-center space-y-3">
          <p className="text-xs font-sans text-rose-700">{error}</p>
          <button
            type="button"
            onClick={() => setReloadTick((t) => t + 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : journals.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#0D2C49]/30 mx-auto" />
          <p className="text-sm font-serif text-[#081D2E]">
            {appliedSearch || statusFilter !== "ALL"
              ? "No journals match the current search or status filter."
              : "No institutional journals created yet."}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/journals/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Inaugural Journal</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {journals.map((journal) => {
            const coverImageSrc = journal.coverImageAsset?.secureUrl || journal.coverImageUrl;
            const publishedIssuesCount = journal.issues.filter((i) => i.status === "PUBLISHED").length;
            const totalArticlesCount = journal.issues.reduce((acc, i) => acc + (i.publications?.length || 0), 0);

            return (
              <section
                key={journal.id}
                className="bg-white rounded-xl border border-[#D9DEE2] overflow-hidden shadow-xs hover:border-[#0D2C49]/40 transition-colors"
              >
                <div className="p-5 sm:p-6 border-b border-[#D9DEE2] bg-gradient-to-b from-white to-[#F7F7F7]/30">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg border border-[#D9DEE2] bg-[#0D2C49]/5 overflow-hidden shrink-0 flex items-center justify-center">
                        {coverImageSrc ? (
                          <Image
                            src={coverImageSrc}
                            alt={`${journal.title} cover`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <BookOpen className="w-7 h-7 text-[#0D2C49]/40" />
                        )}
                      </div>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#B09C4B] font-semibold">
                            Institutional Series
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${getStatusBadgeClasses(
                              journal.status
                            )}`}
                          >
                            {journal.status}
                          </span>
                          <span className="text-[11px] font-mono text-[#64717C]">
                            /{journal.slug}
                          </span>
                        </div>

                        <h2 className="font-serif text-xl sm:text-2xl text-[#081D2E] font-medium leading-tight">
                          <Link
                            href={`/admin/journals/${journal.id}/edit`}
                            className="hover:text-[#0D2C49] transition-colors"
                          >
                            {journal.title}
                          </Link>
                        </h2>

                        {journal.description && (
                          <p className="text-xs font-sans text-[#64717C] line-clamp-2 max-w-2xl">
                            {journal.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs font-sans text-[#64717C] pt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 font-medium text-[#081D2E]">
                            <Layers className="w-3.5 h-3.5 text-[#0D2C49]" />
                            {journal.issues.length} {journal.issues.length === 1 ? "Issue" : "Issues"}
                          </span>
                          <span>·</span>
                          <span>{publishedIssuesCount} Published</span>
                          <span>·</span>
                          <span>{totalArticlesCount} Linked {totalArticlesCount === 1 ? "Article" : "Articles"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap lg:self-start">
                      <label className="sr-only" htmlFor={`journal-status-${journal.id}`}>
                        Journal status
                      </label>
                      <select
                        id={`journal-status-${journal.id}`}
                        aria-label={`Change status for ${journal.title}`}
                        value={journal.status}
                        disabled={updatingKey === `journal:${journal.id}`}
                        onChange={(e) =>
                          handleJournalStatusChange(journal.id, e.target.value as JournalStatusValue)
                        }
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>

                      <Link
                        href={`/admin/journals/${journal.id}/issues/new`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-xs font-sans font-medium text-[#081D2E] transition-colors"
                        title="Add compiled issue under this journal"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Issue</span>
                      </Link>

                      <Link
                        href={`/admin/journals/${journal.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-medium transition-colors"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {journal.status === "PUBLISHED" && (
                        <Link
                          href={`/journals/${journal.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-2 min-h-[38px] rounded-lg border border-[#D9DEE2] text-xs font-sans font-medium text-[#64717C] hover:text-[#0D2C49] hover:border-[#0D2C49]"
                          title="Open public archive page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-3.5 bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-serif text-sm sm:text-base text-[#081D2E] font-medium flex items-center gap-2">
                      <span>Compiled Issues</span>
                      <span className="text-xs font-sans text-[#64717C] font-normal">
                        ({journal.issues.length})
                      </span>
                    </h3>

                    {journal.issues.length > 0 && (
                      <Link
                        href={`/admin/journals/${journal.id}/edit`}
                        className="text-xs font-sans text-[#0D2C49] hover:underline font-medium"
                      >
                        Manage All Issues →
                      </Link>
                    )}
                  </div>

                  {journal.issues.length === 0 ? (
                    <div className="p-5 rounded-lg border border-dashed border-[#D9DEE2] bg-[#F7F7F7] text-center space-y-2">
                      <p className="text-xs font-sans text-[#64717C]">
                        No issues created under this journal yet.
                      </p>
                      <Link
                        href={`/admin/journals/${journal.id}/issues/new`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Volume 01 Issue 01</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {journal.issues.map((issue) => {
                        const publiclyVisible =
                          journal.status === "PUBLISHED" && issue.status === "PUBLISHED";
                        const issueCoverSrc = issue.coverImageAsset?.secureUrl || issue.coverImageUrl;

                        return (
                          <div
                            key={issue.id}
                            className="p-3.5 sm:p-4 rounded-xl bg-[#F7F7F7] border border-[#D9DEE2] space-y-3 flex flex-col justify-between hover:border-[#0D2C49]/40 transition-colors"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] font-sans">
                                <span className="px-2 py-0.5 rounded-full bg-[#0D2C49] text-white font-semibold text-[10px]">
                                  Vol. {formatNumberPad(issue.volume)} · Issue {formatNumberPad(issue.issue)}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-mono font-semibold ${getStatusBadgeClasses(
                                    issue.status
                                  )}`}
                                >
                                  {issue.status}
                                </span>
                              </div>

                              <div className="flex items-start gap-2.5 pt-1">
                                {issueCoverSrc ? (
                                  <div className="relative w-10 h-14 rounded border border-[#D9DEE2] bg-white overflow-hidden shrink-0">
                                    <Image
                                      src={issueCoverSrc}
                                      alt={`${issue.title} cover`}
                                      fill
                                      sizes="40px"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-14 rounded border border-[#D9DEE2] bg-white flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4 text-slate-300" />
                                  </div>
                                )}

                                <div className="space-y-1 min-w-0 flex-1">
                                  <h4 className="font-serif text-sm text-[#081D2E] font-medium leading-snug line-clamp-2">
                                    <Link
                                      href={`/admin/journals/${journal.id}/issues/${issue.id}/edit`}
                                      className="hover:text-[#0D2C49] transition-colors"
                                    >
                                      {issue.title}
                                    </Link>
                                  </h4>

                                  <div className="text-[10px] font-sans text-[#64717C] flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    <span>{formatDate(issue.publishedAt)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-[11px] font-sans text-[#64717C] pt-1 flex items-center gap-3">
                                <span>{issue.publications?.length || 0} articles</span>
                                <span>·</span>
                                {issue.pdfUrl || issue.pdfAssetId ? (
                                  <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                                    <FileCheck2 className="w-3 h-3" />
                                    PDF Attached
                                  </span>
                                ) : (
                                  <span className="text-slate-400">No PDF</span>
                                )}
                              </div>
                            </div>

                            <div className="pt-2.5 border-t border-[#D9DEE2] flex items-center justify-between gap-2">
                              <select
                                aria-label={`Change status for ${issue.title}`}
                                value={issue.status}
                                disabled={updatingKey === `issue:${issue.id}`}
                                onChange={(e) =>
                                  handleIssueStatusChange(
                                    journal.id,
                                    issue.id,
                                    e.target.value as JournalStatusValue
                                  )
                                }
                                className="min-h-[30px] px-2 py-0.5 rounded bg-white border border-[#D9DEE2] text-[11px] font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                              >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="ARCHIVED">Archived</option>
                              </select>

                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/journals/${journal.id}/issues/${issue.id}/edit`}
                                  className="text-xs font-sans font-medium text-[#0D2C49] hover:underline"
                                >
                                  Edit
                                </Link>

                                {publiclyVisible && (
                                  <Link
                                    href={`/journals/${journal.slug}?issue=${encodeURIComponent(issue.id)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-[#0D2C49]"
                                    title="Preview on public site"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          })}

          {pagination.totalPages > 1 && (
            <div className="bg-white rounded-xl border border-[#D9DEE2] p-4 flex items-center justify-between gap-4 text-xs font-sans">
              <span className="text-[#64717C]">
                Showing Page <strong className="text-[#081D2E]">{pagination.page}</strong> of{" "}
                <strong className="text-[#081D2E]">{pagination.totalPages}</strong> (
                {pagination.total} total journals)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9DEE2] text-[#081D2E] hover:border-[#0D2C49] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9DEE2] text-[#081D2E] hover:border-[#0D2C49] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}