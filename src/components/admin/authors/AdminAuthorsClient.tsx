"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Plus,
  Search,
  X,
  Edit,
  Trash2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react";

interface AuthorRow {
  id: string;
  name: string;
  slug: string;
  biography?: string | null;
  affiliation?: string | null;
  position?: string | null;
  photoUrl?: string | null;
  photoAssetId?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
  photoAsset?: {
    originalFilename?: string;
    bytes?: number;
    mimeType?: string;
    secureUrl?: string;
  } | null;
  _count: {
    publications: number;
  };
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AdminAuthorsClientProps {
  canViewMedia?: boolean;
  canUpload?: boolean;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso: string): string {
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

export default function AdminAuthorsClient({}: AdminAuthorsClientProps) {
  const [, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [reloadTick, setReloadTick] = useState(0);

  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 24,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [deleteModalAuthor, setDeleteModalAuthor] = useState<AuthorRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAuthors() {
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

        const res = await fetch(`/api/authors?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal
        });

        if (controller.signal.aborted) return;

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to fetch authors (HTTP ${res.status})`);
        }

        const data = await res.json();
        setAuthors(Array.isArray(data.authors) ? data.authors : []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (err instanceof Error && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Failed to load authors.";
        setError(msg);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAuthors();
    return () => controller.abort();
  }, [appliedSearch, page, limit, reloadTick]);

  async function handleDeleteConfirm() {
    if (!deleteModalAuthor) return;
    setDeleting(true);
    setActionNotice(null);

    try {
      const res = await fetch(`/api/authors/${deleteModalAuthor.id}`, {
        method: "DELETE"
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Failed to delete author (HTTP ${res.status})`);
      }

      setActionNotice({
        type: "success",
        message: `Author "${deleteModalAuthor.name}" was successfully deleted.`
      });
      setDeleteModalAuthor(null);
      setReloadTick((t) => t + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deletion failed.";
      setActionNotice({ type: "error", message: msg });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#D9DEE2]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#081D2E]">
            Authors &amp; Scholars
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#64717C] mt-1 font-light">
            Manage institutional scholars, visiting fellows, research biographies, and attributed publication authors.
          </p>
        </div>

        <Link
          href="/admin/authors/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-sans font-medium transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Author</span>
        </Link>
      </div>

      {actionNotice && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            actionNotice.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {actionNotice.type === "success" ? (
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              ✓
            </div>
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs sm:text-sm font-sans">
            {actionNotice.message}
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#D9DEE2]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64717C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, affiliation, or position..."
            className="w-full min-h-[40px] pl-10 pr-9 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] placeholder:text-[#64717C] focus:outline-none focus:border-[#0D2C49]"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setAppliedSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-sans text-[#64717C]">
          <span>
            Total: <strong className="font-semibold text-[#081D2E]">{pagination.total}</strong> scholar{pagination.total === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={() => setReloadTick((t) => t + 1)}
            disabled={loading}
            className="p-2 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#081D2E] transition-colors"
            title="Refresh directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading && authors.length === 0 && (
        <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center">
          <RefreshCw className="w-6 h-6 text-[#0D2C49] animate-spin mx-auto mb-3" />
          <p className="text-xs sm:text-sm font-sans text-[#64717C]">
            Loading scholars and authors...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
          <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
          <p className="text-xs sm:text-sm font-sans text-red-900 font-medium">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadTick((t) => t + 1)}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-sans font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && authors.length === 0 && (
        <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#0D2C49]/5 border border-[#0D2C49]/10 text-[#0D2C49] flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-[#081D2E]">
              {appliedSearch ? "No scholars found" : "No authors registered"}
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#64717C] max-w-sm mx-auto font-light">
              {appliedSearch
                ? `No authors matched the query "${appliedSearch}". Try searching with a different name or keyword.`
                : "Create an author profile to attribute research publications, policy briefs, and institutional commentaries."}
            </p>
          </div>
          {appliedSearch ? (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setAppliedSearch("");
              }}
              className="px-4 py-2 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-xs font-sans font-medium text-[#081D2E] transition-colors"
            >
              Clear search filter
            </button>
          ) : (
            <Link
              href="/admin/authors/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-sans font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Author</span>
            </Link>
          )}
        </div>
      )}

      {!error && authors.length > 0 && (
        <div className="bg-white rounded-xl border border-[#D9DEE2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D9DEE2] bg-[#F7F7F7] text-[11px] font-sans font-semibold uppercase tracking-wider text-[#64717C]">
                  <th className="py-3.5 px-4 sm:px-6">Scholar</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Position &amp; Affiliation</th>
                  <th className="py-3.5 px-4 text-center">Publications</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Updated</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE2] text-xs font-sans text-[#081D2E]">
                {authors.map((author) => (
                  <tr
                    key={author.id}
                    className="hover:bg-[#F7F7F7]/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-[#0D2C49]/10 border border-[#D9DEE2] overflow-hidden shrink-0 flex items-center justify-center">
                          {author.photoUrl ? (
                            <Image
                              src={author.photoUrl}
                              alt={author.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="font-serif text-xs font-semibold text-[#0D2C49]">
                              {getInitials(author.name)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/authors/${author.id}/edit`}
                            className="font-medium text-[#081D2E] hover:text-[#0D2C49] hover:underline block truncate"
                          >
                            {author.name}
                          </Link>
                          <span className="text-[11px] text-[#64717C] font-mono block truncate">
                            /{author.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="space-y-0.5 max-w-xs">
                        <span className="block font-medium text-[#081D2E] truncate">
                          {author.position || "—"}
                        </span>
                        <span className="block text-[11px] text-[#64717C] truncate">
                          {author.affiliation || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D2C49]/5 border border-[#0D2C49]/15 text-[#0D2C49] font-medium text-xs">
                        <FileText className="w-3 h-3" />
                        {author._count?.publications ?? 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden lg:table-cell text-[#64717C] text-[11px]">
                      {formatDate(author.updatedAt)}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/authors/${author.id}/edit`}
                          className="p-1.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] hover:text-[#0D2C49] text-[#64717C] transition-colors"
                          title="Edit author"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteModalAuthor(author)}
                          className="p-1.5 rounded-lg border border-[#D9DEE2] hover:border-red-600 hover:text-red-600 text-[#64717C] transition-colors"
                          title="Delete author"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-[#D9DEE2] bg-[#F7F7F7]/50 text-xs font-sans text-[#64717C]">
              <span>
                Showing page <strong className="font-semibold text-[#081D2E]">{pagination.page}</strong> of{" "}
                <strong className="font-semibold text-[#081D2E]">{pagination.totalPages}</strong> ({pagination.total} total)
              </span>

              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => startTransition(() => setPage((p) => Math.max(1, p - 1)))}
                  className="px-3 py-1.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#081D2E] disabled:opacity-40 disabled:pointer-events-none transition-colors inline-flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() =>
                    startTransition(() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-[#081D2E] disabled:opacity-40 disabled:pointer-events-none transition-colors inline-flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {deleteModalAuthor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D9DEE2] max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  deleteModalAuthor._count.publications > 0
                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {deleteModalAuthor._count.publications > 0 ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Trash2 className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-medium text-[#081D2E]">
                  {deleteModalAuthor._count.publications > 0
                    ? "Deletion Blocked by Publications"
                    : "Confirm Author Deletion"}
                </h3>
                <p className="text-xs text-[#64717C] leading-relaxed">
                  {deleteModalAuthor._count.publications > 0 ? (
                    <>
                      Cannot delete <strong className="text-[#081D2E]">{deleteModalAuthor.name}</strong> because they are currently attributed to{" "}
                      <strong className="text-[#081D2E]">
                        {deleteModalAuthor._count.publications} publication{deleteModalAuthor._count.publications === 1 ? "" : "s"}
                      </strong>
                      . Reassign or detach those publications before deleting this scholar.
                    </>
                  ) : (
                    <>
                      Are you sure you want to delete <strong className="text-[#081D2E]">{deleteModalAuthor.name}</strong>? Any attached portrait photograph will be detached back to uploaded status. This action cannot be undone.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#D9DEE2]">
              <button
                type="button"
                onClick={() => setDeleteModalAuthor(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-[#D9DEE2] hover:border-[#0D2C49] text-xs font-sans font-medium text-[#081D2E] transition-colors"
              >
                {deleteModalAuthor._count.publications > 0 ? "Close" : "Cancel"}
              </button>

              {deleteModalAuthor._count.publications > 0 ? (
                <Link
                  href={`/admin/publications?search=${encodeURIComponent(deleteModalAuthor.name)}`}
                  className="px-4 py-2 rounded-lg bg-[#0D2C49] text-white hover:bg-[#081D2E] text-xs font-sans font-medium transition-colors"
                >
                  View Attributed Publications
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-sans font-medium transition-colors flex items-center gap-2"
                >
                  {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

