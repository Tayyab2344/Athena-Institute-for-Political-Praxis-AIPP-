"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  LayoutGrid,
  List,
  Upload,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  SlidersHorizontal,
  X,
  Image as ImageIcon,
  FileText,
  RefreshCw,
  FolderOpen,
  ShieldCheck
} from "lucide-react";
import type {
  CatalogAssetItem,
  CatalogReferenceClassification,
  CatalogSortOption,
  MediaAssetDetailResponse,
  MediaCatalogResponse
} from "@/lib/media/catalog";
import { APPROVED_MEDIA_FOLDERS, getMediaFolderLabel } from "@/lib/media/folders";
import {
  formatArchiveDate,
  formatFileSize,
  getClassificationBadge
} from "@/lib/media/preview";
import MediaPreviewThumb from "./MediaPreviewThumb";
import MediaInspectorPanel from "./MediaInspectorPanel";
import MediaUploadModal from "./MediaUploadModal";
import MediaReconciliationPanel from "./MediaReconciliationPanel";

interface MediaLibraryClientProps {
  canUpload: boolean;
  canReconcile?: boolean;
}

type WorkspaceTab = "library" | "reconciliation";
type ViewMode = "grid" | "list";
type MediaTypeFilter = "ALL" | "IMAGE" | "DOCUMENT";
type StatusFilter = "ALL" | "UPLOADED" | "ATTACHED" | "ARCHIVED" | "DELETED";
type RefClassFilter = "ALL" | CatalogReferenceClassification;

export default function MediaLibraryClient({
  canUpload,
  canReconcile = false
}: MediaLibraryClientProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("library");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mediaType, setMediaType] = useState<MediaTypeFilter>("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [folder, setFolder] = useState<string>("ALL");
  const [refClass, setRefClass] = useState<RefClassFilter>("ALL");
  const [sort, setSort] = useState<CatalogSortOption>("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);

  const [catalogState, setCatalogState] = useState<{
    key: string;
    data: MediaCatalogResponse | null;
    error: string | null;
  }>({
    key: "",
    data: null,
    error: null
  });

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [detailReloadTick, setDetailReloadTick] = useState(0);
  const [detailState, setDetailState] = useState<{
    key: string;
    data: MediaAssetDetailResponse | null;
    error: string | null;
  }>({
    key: "",
    data: null,
    error: null
  });

  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim();
      setDebouncedSearch((prev) => {
        if (prev !== next) {
          setPage(1);
        }
        return next;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch) count++;
    if (mediaType !== "ALL") count++;
    if (status !== "ALL") count++;
    if (folder !== "ALL") count++;
    if (refClass !== "ALL") count++;
    return count;
  }, [debouncedSearch, mediaType, status, folder, refClass]);

  const hasActiveFilters = activeFilterCount > 0 || sort !== "newest";

  const catalogQueryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sort", sort);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (mediaType !== "ALL") params.set("mediaType", mediaType);
    if (status !== "ALL") params.set("status", status);
    if (folder !== "ALL") params.set("folder", folder);
    if (refClass !== "ALL") params.set("referenceClassification", refClass);
    return params.toString();
  }, [page, limit, sort, debouncedSearch, mediaType, status, folder, refClass]);

  const catalogRequestKey = `${catalogQueryString}:${reloadTick}`;
  const loading = catalogState.key !== catalogRequestKey;
  const catalog = catalogState.data;
  const error = catalogState.key === catalogRequestKey ? catalogState.error : null;

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const res = await fetch(`/api/admin/media?${catalogQueryString}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache"
          }
        });

        const payload = (await res.json()) as MediaCatalogResponse & { error?: string };

        if (controller.signal.aborted) return;

        if (!res.ok) {
          setCatalogState((prev) => ({
            key: catalogRequestKey,
            data: prev.data,
            error: payload.error || `Failed to load media catalog (HTTP ${res.status}).`
          }));
          return;
        }

        setCatalogState({
          key: catalogRequestKey,
          data: payload,
          error: null
        });
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setCatalogState((prev) => ({
          key: catalogRequestKey,
          data: prev.data,
          error: "Network error while loading the media archive. Please retry."
        }));
      }
    }

    loadCatalog();

    return () => {
      controller.abort();
    };
  }, [catalogQueryString, catalogRequestKey]);

  const detailRequestKey = selectedAssetId ? `${selectedAssetId}:${detailReloadTick}` : "";
  const detailLoading = Boolean(selectedAssetId) && detailState.key !== detailRequestKey;
  const detail =
    selectedAssetId && detailState.key === detailRequestKey ? detailState.data : null;
  const detailError =
    selectedAssetId && detailState.key === detailRequestKey ? detailState.error : null;

  useEffect(() => {
    if (!selectedAssetId) {
      return;
    }

    const controller = new AbortController();
    const activeKey = detailRequestKey;

    async function loadDetail() {
      try {
        const res = await fetch(`/api/admin/media/${encodeURIComponent(selectedAssetId || "")}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache"
          }
        });

        const payload = (await res.json()) as MediaAssetDetailResponse & { error?: string };

        if (controller.signal.aborted) return;

        if (!res.ok) {
          setDetailState({
            key: activeKey,
            data: null,
            error: payload.error || `Failed to load asset details (HTTP ${res.status}).`
          });
          return;
        }

        setDetailState({
          key: activeKey,
          data: payload,
          error: null
        });
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setDetailState({
          key: activeKey,
          data: null,
          error: "Network error while loading asset details."
        });
      }
    }

    loadDetail();

    return () => {
      controller.abort();
    };
  }, [selectedAssetId, detailRequestKey]);

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setMediaType("ALL");
    setStatus("ALL");
    setFolder("ALL");
    setRefClass("ALL");
    setSort("newest");
    setPage(1);
  };

  const handleUploadSuccess = (newAssetId: string) => {
    setPage(1);
    setReloadTick((t) => t + 1);
    setSelectedAssetId(newAssetId);
  };

  const summary = catalog?.summary;
  const items = catalog?.items ?? [];
  const pagination = catalog?.pagination;

  const rangeStart =
    pagination && pagination.totalItems > 0
      ? (pagination.page - 1) * pagination.limit + 1
      : 0;
  const rangeEnd = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.totalItems)
    : 0;

  const renderGridSkeleton = () => (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${
        selectedAssetId ? "xl:grid-cols-3" : "md:grid-cols-3 xl:grid-cols-4"
      } gap-4`}
    >
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-[#D9DEE2] overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-[#F7F7F7]" />
          <div className="p-3.5 space-y-2">
            <div className="h-3.5 w-3/4 rounded bg-[#F7F7F7]" />
            <div className="h-3 w-1/2 rounded bg-[#F7F7F7]" />
            <div className="h-5 w-24 rounded-full bg-[#F7F7F7]" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderListSkeleton = () => (
    <div className="bg-white rounded-xl border border-[#D9DEE2] divide-y divide-[#D9DEE2] animate-pulse">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#F7F7F7] shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3.5 w-1/2 rounded bg-[#F7F7F7]" />
            <div className="h-3 w-1/3 rounded bg-[#F7F7F7]" />
          </div>
          <div className="hidden sm:block h-5 w-20 rounded-full bg-[#F7F7F7]" />
        </div>
      ))}
    </div>
  );

  const renderGridItem = (item: CatalogAssetItem) => {
    const isSelected = selectedAssetId === item.id;
    const badge = getClassificationBadge(item.referenceClassification);

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setSelectedAssetId(item.id)}
        aria-pressed={isSelected}
        className={`group text-left bg-white rounded-xl border overflow-hidden transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B] cursor-pointer flex flex-col ${
          isSelected
            ? "border-[#0D2C49] ring-2 ring-[#B09C4B]/80"
            : "border-[#D9DEE2] hover:border-[#0D2C49]/45"
        }`}
      >
        <div className="border-b border-[#D9DEE2]/70 w-full">
          <MediaPreviewThumb
            mediaType={item.mediaType}
            secureUrl={item.secureUrl}
            originalFilename={item.originalFilename}
            format={item.format}
            pages={item.pages}
            width={item.width}
            height={item.height}
            variant="card"
          />
        </div>

        <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between w-full min-w-0">
          <div className="space-y-1 min-w-0">
            <p
              className="text-xs font-sans font-medium text-[#081D2E] truncate"
              title={item.originalFilename}
            >
              {item.originalFilename}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#64717C] flex-wrap">
              <span className="font-mono uppercase text-[10px] text-[#0D2C49]">
                {item.mediaType === "DOCUMENT" ? "PDF" : item.format}
              </span>
              <span className="text-[#D9DEE2]">·</span>
              <span>{formatFileSize(item.bytes)}</span>
              <span className="text-[#D9DEE2]">·</span>
              <span>{formatArchiveDate(item.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-sans font-medium ${badge.className}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClassName}`} />
              <span>{badge.label}</span>
            </span>
            <span className="text-[10px] font-mono text-[#64717C]">
              {item.totalReferences} {item.totalReferences === 1 ? "ref" : "refs"}
            </span>
          </div>
        </div>
      </button>
    );
  };

  const renderListView = () => (
    <div className="bg-white rounded-xl border border-[#D9DEE2] overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F7F7] border-b border-[#D9DEE2] text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-[#64717C]">
              <th className="py-3 pl-5 pr-3">Asset</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Size</th>
              <th className="py-3 px-3">Uploaded</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 pl-3 pr-5 text-right">Refs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9DEE2]/70 text-xs font-sans">
            {items.map((item) => {
              const isSelected = selectedAssetId === item.id;
              const badge = getClassificationBadge(item.referenceClassification);
              return (
                <tr
                  key={item.id}
                  onClick={() => setSelectedAssetId(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedAssetId(item.id);
                    }
                  }}
                  tabIndex={0}
                  className={`cursor-pointer transition-colors focus:outline-none focus-visible:bg-[#0D2C49]/5 ${
                    isSelected
                      ? "bg-[#0D2C49]/5"
                      : "hover:bg-[#F7F7F7]/80"
                  }`}
                >
                  <td className="py-3 pl-5 pr-3 max-w-[280px]">
                    <div className="flex items-center gap-3 min-w-0">
                      <MediaPreviewThumb
                        mediaType={item.mediaType}
                        secureUrl={item.secureUrl}
                        originalFilename={item.originalFilename}
                        format={item.format}
                        variant="row"
                      />
                      <div className="min-w-0">
                        <p
                          className="font-medium text-[#081D2E] truncate"
                          title={item.originalFilename}
                        >
                          {item.originalFilename}
                        </p>
                        <p className="text-[11px] text-[#64717C] truncate">
                          {item.folderLabel}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase text-[#0D2C49]">
                      {item.mediaType === "DOCUMENT" ? (
                        <FileText className="w-3.5 h-3.5 text-[#64717C]" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-[#64717C]" />
                      )}
                      <span>{item.mediaType === "DOCUMENT" ? "PDF" : item.format}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-[#64717C]">
                    {formatFileSize(item.bytes)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-[#64717C]">
                    {formatArchiveDate(item.createdAt)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${badge.className}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClassName}`} />
                      <span>{badge.label}</span>
                    </span>
                  </td>
                  <td className="py-3 pl-3 pr-5 text-right font-mono text-[#081D2E] whitespace-nowrap">
                    {item.totalReferences}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-[#D9DEE2]/70">
        {items.map((item) => {
          const isSelected = selectedAssetId === item.id;
          const badge = getClassificationBadge(item.referenceClassification);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedAssetId(item.id)}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                isSelected ? "bg-[#0D2C49]/5" : "hover:bg-[#F7F7F7]/80"
              }`}
            >
              <MediaPreviewThumb
                mediaType={item.mediaType}
                secureUrl={item.secureUrl}
                originalFilename={item.originalFilename}
                format={item.format}
                variant="row"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs font-medium text-[#081D2E] truncate">
                  {item.originalFilename}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#64717C] flex-wrap">
                  <span className="font-mono uppercase text-[10px] text-[#0D2C49]">
                    {item.mediaType === "DOCUMENT" ? "PDF" : item.format}
                  </span>
                  <span className="text-[#D9DEE2]">·</span>
                  <span>{formatFileSize(item.bytes)}</span>
                  <span className="text-[#D9DEE2]">·</span>
                  <span>{formatArchiveDate(item.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium ${badge.className}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClassName}`} />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#64717C]">
                    {item.totalReferences} {item.totalReferences === 1 ? "ref" : "refs"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 min-w-0">
      <header className="bg-white rounded-xl border border-[#D9DEE2] overflow-hidden">
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <span className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#B09C4B] font-semibold">
              Institutional Digital Archive
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#081D2E]">
              Media Library
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#64717C] max-w-2xl leading-relaxed">
              Manage the images and documents used across AIPP&apos;s publications, journals, research, and institutional content.
            </p>
          </div>

          {canUpload && activeTab === "library" && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Media</span>
              </button>
            </div>
          )}
        </div>

        {canReconcile && (
          <div
            role="tablist"
            aria-label="Media Library workspace views"
            className="border-t border-[#D9DEE2] bg-[#F7F7F7]/80 px-5 sm:px-6 flex items-center gap-2 overflow-x-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "library"}
              onClick={() => setActiveTab("library")}
              className={`inline-flex items-center gap-2 px-3.5 py-3 text-xs font-sans font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "library"
                  ? "border-[#0D2C49] text-[#081D2E]"
                  : "border-transparent text-[#64717C] hover:text-[#081D2E]"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "reconciliation"}
              onClick={() => setActiveTab("reconciliation")}
              className={`inline-flex items-center gap-2 px-3.5 py-3 text-xs font-sans font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "reconciliation"
                  ? "border-[#0D2C49] text-[#081D2E]"
                  : "border-transparent text-[#64717C] hover:text-[#081D2E]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Reconciliation</span>
              <span className="px-1.5 py-0.5 rounded bg-[#0D2C49]/10 text-[9px] font-mono uppercase tracking-wider text-[#0D2C49]">
                External Audit
              </span>
            </button>
          </div>
        )}

        {activeTab === "library" && (
          <div className="border-t border-[#D9DEE2] bg-[#F7F7F7]/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#D9DEE2]">
            <div className="px-5 py-3.5">
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Total Assets
              </span>
              <span className="mt-0.5 block font-serif text-xl font-medium text-[#081D2E]">
                {summary ? summary.totalRegistered : "—"}
              </span>
            </div>
            <div className="px-5 py-3.5">
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Images
              </span>
              <span className="mt-0.5 block font-serif text-xl font-medium text-[#081D2E]">
                {summary ? summary.images : "—"}
              </span>
            </div>
            <div className="px-5 py-3.5">
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Documents
              </span>
              <span className="mt-0.5 block font-serif text-xl font-medium text-[#081D2E]">
                {summary ? summary.documents : "—"}
              </span>
            </div>
            <div className="px-5 py-3.5">
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Attached
              </span>
              <span className="mt-0.5 block font-serif text-xl font-medium text-[#0D2C49]">
                {summary ? summary.attached : "—"}
              </span>
            </div>
            <div className="px-5 py-3.5 col-span-2 sm:col-span-1">
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Unreferenced
              </span>
              <span className="mt-0.5 block font-serif text-xl font-medium text-[#64717C]">
                {summary ? summary.unreferenced : "—"}
              </span>
            </div>
          </div>
        )}
      </header>

      {activeTab === "reconciliation" && canReconcile ? (
        <MediaReconciliationPanel />
      ) : (
        <>
      <section
        aria-label="Search and filter media"
        className="bg-white rounded-xl border border-[#D9DEE2] p-4 space-y-3"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#64717C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by filename or public ID..."
              aria-label="Search media assets by filename"
              className="w-full min-h-[42px] pl-10 pr-9 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] placeholder:text-[#64717C] focus:outline-none focus:border-[#0D2C49]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64717C] hover:text-[#081D2E] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              aria-expanded={mobileFiltersOpen}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 min-h-[42px] rounded-lg border border-[#D9DEE2] bg-[#F7F7F7] text-xs font-sans font-medium text-[#081D2E] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0D2C49]" />
              <span>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}</span>
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="media-sort-select" className="sr-only">
                Sort order
              </label>
              <select
                id="media-sort-select"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as CatalogSortOption);
                  setPage(1);
                }}
                className="min-h-[42px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="largest">Largest size</option>
                <option value="name">Filename (A–Z)</option>
              </select>

              <div
                role="group"
                aria-label="Asset browser layout"
                className="inline-flex rounded-lg border border-[#D9DEE2] bg-[#F7F7F7] p-0.5 shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#0D2C49] text-white"
                      : "text-[#64717C] hover:text-[#081D2E]"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[#0D2C49] text-white"
                      : "text-[#64717C] hover:text-[#081D2E]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${
            mobileFiltersOpen ? "grid" : "hidden md:grid"
          } grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-[#D9DEE2]/70`}
        >
          <select
            aria-label="Filter by media type"
            value={mediaType}
            onChange={(e) => {
              setMediaType(e.target.value as MediaTypeFilter);
              setPage(1);
            }}
            className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
          >
            <option value="ALL">All Media Types</option>
            <option value="IMAGE">Images</option>
            <option value="DOCUMENT">Documents (PDF)</option>
          </select>

          <select
            aria-label="Filter by stored status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ATTACHED">Attached</option>
            <option value="UPLOADED">Uploaded</option>
            <option value="ARCHIVED">Archived</option>
            <option value="DELETED">Deleted</option>
          </select>

          <select
            aria-label="Filter by folder"
            value={folder}
            onChange={(e) => {
              setFolder(e.target.value);
              setPage(1);
            }}
            className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
          >
            <option value="ALL">All Folders</option>
            {APPROVED_MEDIA_FOLDERS.map((f) => (
              <option key={f} value={f}>
                {getMediaFolderLabel(f)}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by reference classification"
            value={refClass}
            onChange={(e) => {
              setRefClass(e.target.value as RefClassFilter);
              setPage(1);
            }}
            className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
          >
            <option value="ALL">All Usage States</option>
            <option value="ATTACHED">Attached (In Use)</option>
            <option value="UPLOADED">Unreferenced Uploads</option>
            <option value="STATUS_MISMATCH">Status Mismatch</option>
            <option value="ARCHIVED">Archived</option>
            <option value="DELETED">Deleted</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#D9DEE2]/60 text-xs font-sans">
            <span className="text-[#64717C]">
              {loading
                ? "Filtering archive..."
                : `${pagination?.totalItems ?? 0} matching ${
                    pagination?.totalItems === 1 ? "asset" : "assets"
                  }`}
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D2C49] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          </div>
        )}
      </section>

      <div className="flex items-start gap-6 min-w-0">
        <div className="flex-1 min-w-0 space-y-5">
          {loading ? (
            viewMode === "grid" ? renderGridSkeleton() : renderListSkeleton()
          ) : error ? (
            <div
              role="alert"
              className="bg-white rounded-xl border border-[#D9DEE2] p-10 text-center space-y-3"
            >
              <AlertTriangle className="w-7 h-7 text-[#B09C4B] mx-auto" />
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#081D2E]">
                  Unable to load media archive
                </h2>
                <p className="text-xs font-sans text-[#64717C] max-w-md mx-auto">
                  {error}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReloadTick((t) => t + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : summary && summary.totalRegistered === 0 && !hasActiveFilters ? (
            <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center space-y-4">
              <ImageIcon className="w-8 h-8 text-[#0D2C49]/35 mx-auto" />
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#081D2E]">
                  The Media Library is empty
                </h2>
                <p className="text-xs font-sans text-[#64717C] max-w-md mx-auto">
                  Upload publication covers, PDF monographs, journal imagery, or author portraits to begin building the institutional archive.
                </p>
              </div>
              {canUpload && (
                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload First Asset</span>
                </button>
              )}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#D9DEE2] p-12 text-center space-y-3">
              <Search className="w-7 h-7 text-[#64717C]/50 mx-auto" />
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#081D2E]">
                  No matching assets found
                </h2>
                <p className="text-xs font-sans text-[#64717C] max-w-md mx-auto">
                  Try broadening your filename search or clearing one or more active filters.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#D9DEE2] bg-white text-xs font-sans font-medium text-[#081D2E] hover:border-[#0D2C49] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear all filters</span>
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                selectedAssetId ? "xl:grid-cols-3" : "md:grid-cols-3 xl:grid-cols-4"
              } gap-4`}
            >
              {items.map(renderGridItem)}
            </div>
          ) : (
            renderListView()
          )}

          {pagination && pagination.totalItems > 0 && !error && (
            <nav
              aria-label="Media library pagination"
              className="bg-white rounded-xl border border-[#D9DEE2] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans"
            >
              <div className="flex items-center gap-3 flex-wrap text-[#64717C]">
                <span>
                  Showing <strong className="text-[#081D2E] font-medium">{rangeStart}–{rangeEnd}</strong> of{" "}
                  <strong className="text-[#081D2E] font-medium">{pagination.totalItems}</strong>{" "}
                  {pagination.totalItems === 1 ? "asset" : "assets"}
                </span>

                <label className="inline-flex items-center gap-1.5">
                  <span className="text-[11px]">Per page:</span>
                  <select
                    aria-label="Items per page"
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value, 10));
                      setPage(1);
                    }}
                    className="px-2 py-1 rounded border border-[#D9DEE2] bg-[#F7F7F7] text-xs text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
                  >
                    <option value={8}>8</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg border border-[#D9DEE2] bg-white text-[#081D2E] hover:border-[#0D2C49] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <span className="px-2 font-mono text-[11px] text-[#64717C]">
                  Page {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg border border-[#D9DEE2] bg-white text-[#081D2E] hover:border-[#0D2C49] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </nav>
          )}
        </div>

        <MediaInspectorPanel
          assetId={selectedAssetId}
          detail={detail}
          loading={detailLoading}
          error={detailError}
          onClose={() => setSelectedAssetId(null)}
          onRetry={() => setDetailReloadTick((t) => t + 1)}
        />
      </div>
        </>
      )}

      {canUpload && uploadOpen && (
        <MediaUploadModal
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}

