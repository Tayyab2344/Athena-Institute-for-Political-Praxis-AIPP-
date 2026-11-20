"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Search,
  LayoutGrid,
  List,
  Upload,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Ban,
  Check,
  ExternalLink,
  RefreshCw,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import type {
  CatalogAssetItem,
  CatalogSortOption,
  MediaAssetDetailResponse,
  MediaCatalogResponse
} from "@/lib/media/catalog";
import { APPROVED_MEDIA_FOLDERS, getMediaFolderLabel } from "@/lib/media/folders";
import {
  formatArchiveDate,
  formatArchiveDateTime,
  formatFileSize,
  getClassificationBadge,
  isSafeCloudinaryUrl
} from "@/lib/media/preview";
import {
  MEDIA_FIELD_CONFIGS,
  MediaFieldTarget,
  SelectedMediaAsset,
  getAssetSelectionEligibility
} from "@/lib/media/selection";
import MediaPreviewThumb from "./MediaPreviewThumb";
import MediaUploadModal from "./MediaUploadModal";

interface MediaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: MediaFieldTarget;
  currentAssetId?: string | null;
  canUpload: boolean;
  onSelect: (asset: SelectedMediaAsset) => void;
}

type ViewMode = "grid" | "list";
type MediaTypeFilter = "ALL" | "IMAGE" | "DOCUMENT";
type StatusFilter = "ALL" | "UPLOADED" | "ATTACHED" | "ARCHIVED" | "DELETED";

export default function MediaSelectorModal({
  isOpen,
  onClose,
  field,
  currentAssetId,
  canUpload,
  onSelect
}: MediaSelectorModalProps) {
  const fieldConfig = MEDIA_FIELD_CONFIGS[field];
  const requiredType = fieldConfig.allowedMediaType;

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaTypeFilter>(requiredType);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [folderFilter, setFolderFilter] = useState<string>("ALL");
  const [sort, setSort] = useState<CatalogSortOption>("newest");
  const [page, setPage] = useState(1);
  const [reloadTick, setReloadTick] = useState(0);

  const [highlightedId, setHighlightedId] = useState<string | null>(currentAssetId || null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [catalogState, setCatalogState] = useState<{
    key: string;
    data: MediaCatalogResponse | null;
    error: string | null;
  }>({
    key: "",
    data: null,
    error: null
  });

  const [detailState, setDetailState] = useState<{
    key: string;
    data: MediaAssetDetailResponse | null;
    error: string | null;
  }>({
    key: "",
    data: null,
    error: null
  });

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

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !uploadOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, uploadOpen, onClose]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "12");
    params.set("sort", sort);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (mediaTypeFilter !== "ALL") params.set("mediaType", mediaTypeFilter);
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (folderFilter !== "ALL") params.set("folder", folderFilter);
    return params.toString();
  }, [page, sort, debouncedSearch, mediaTypeFilter, statusFilter, folderFilter]);

  const catalogRequestKey = `${queryString}:${reloadTick}`;
  const loading = catalogState.key !== catalogRequestKey;
  const catalog = catalogState.data;
  const error = catalogState.key === catalogRequestKey ? catalogState.error : null;

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const res = await fetch(`/api/admin/media?${queryString}`, {
          method: "GET",
          signal: controller.signal,
          headers: { "Cache-Control": "no-cache" }
        });
        const payload = (await res.json()) as MediaCatalogResponse & { error?: string };
        if (controller.signal.aborted) return;

        if (!res.ok) {
          setCatalogState((prev) => ({
            key: catalogRequestKey,
            data: prev.data,
            error: payload.error || `Failed to load media library (HTTP ${res.status}).`
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
          error: "Network error while loading the media library."
        }));
      }
    }

    loadCatalog();

    return () => {
      controller.abort();
    };
  }, [isOpen, queryString, catalogRequestKey]);

  const detailRequestKey = highlightedId ? `${highlightedId}:${reloadTick}` : "";
  const detailLoading = Boolean(highlightedId) && detailState.key !== detailRequestKey;
  const detail =
    highlightedId && detailState.key === detailRequestKey ? detailState.data : null;
  const detailError =
    highlightedId && detailState.key === detailRequestKey ? detailState.error : null;

  useEffect(() => {
    if (!isOpen || !highlightedId) return;
    const controller = new AbortController();
    const activeKey = detailRequestKey;

    async function loadDetail() {
      try {
        const res = await fetch(`/api/admin/media/${encodeURIComponent(highlightedId || "")}`, {
          method: "GET",
          signal: controller.signal,
          headers: { "Cache-Control": "no-cache" }
        });
        const payload = (await res.json()) as MediaAssetDetailResponse & { error?: string };
        if (controller.signal.aborted) return;

        if (!res.ok) {
          setDetailState({
            key: activeKey,
            data: null,
            error: payload.error || `Failed to load asset metadata (HTTP ${res.status}).`
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
          error: "Network error while loading asset metadata."
        });
      }
    }

    loadDetail();

    return () => {
      controller.abort();
    };
  }, [isOpen, highlightedId, detailRequestKey]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const items = catalog?.items ?? [];
  const pagination = catalog?.pagination;

  const highlightedFromList = items.find((i) => i.id === highlightedId) || null;
  const activeAsset: CatalogAssetItem | MediaAssetDetailResponse | null =
    detail || highlightedFromList;

  const activeEligibility = activeAsset
    ? getAssetSelectionEligibility(activeAsset, requiredType)
    : null;

  const hasCustomFilters =
    Boolean(debouncedSearch) ||
    mediaTypeFilter !== requiredType ||
    statusFilter !== "ALL" ||
    folderFilter !== "ALL" ||
    sort !== "newest";

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setMediaTypeFilter(requiredType);
    setStatusFilter("ALL");
    setFolderFilter("ALL");
    setSort("newest");
    setPage(1);
  };

  const handleConfirmSelection = () => {
    if (!activeAsset || !activeEligibility?.selectable) return;
    onSelect({
      id: activeAsset.id,
      publicId: activeAsset.publicId,
      mediaType: activeAsset.mediaType,
      secureUrl: activeAsset.secureUrl,
      originalFilename: activeAsset.originalFilename,
      format: activeAsset.format,
      mimeType: activeAsset.mimeType,
      bytes: activeAsset.bytes,
      width: activeAsset.width,
      height: activeAsset.height,
      pages: activeAsset.pages,
      folder: activeAsset.folder
    });
    onClose();
  };

  const handleUploadSuccess = (newAssetId: string) => {
    setUploadOpen(false);
    setMediaTypeFilter(requiredType);
    setStatusFilter("ALL");
    setFolderFilter("ALL");
    setSearchInput("");
    setDebouncedSearch("");
    setSort("newest");
    setPage(1);
    setHighlightedId(newAssetId);
    setReloadTick((t) => t + 1);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 h-dvh flex items-center justify-center p-0 sm:p-4 lg:p-6">
      <div
        className="fixed inset-0 bg-[#081D2E]/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-selector-title"
        className="relative z-10 w-full h-full sm:h-[90vh] sm:max-w-6xl bg-[#F7F7F7] sm:rounded-xl border border-[#D9DEE2] flex flex-col overflow-hidden"
      >
        <div className="px-4 sm:px-6 py-4 bg-white border-b border-[#D9DEE2] flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                id="media-selector-title"
                className="font-serif text-xl sm:text-2xl font-medium text-[#081D2E] truncate"
              >
                Select {fieldConfig.label}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0D2C49]/8 border border-[#0D2C49]/20 text-[10px] font-mono uppercase tracking-wider text-[#0D2C49]">
                Requires {requiredType}
              </span>
            </div>
            <p className="text-xs font-sans text-[#64717C] mt-0.5">
              Choose an existing compatible asset from the archive or upload a new file.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canUpload && (
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload New</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close media selector"
              className="p-2 rounded-lg text-[#64717C] hover:text-[#081D2E] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 bg-white border-b border-[#D9DEE2] space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-[#64717C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                placeholder="Search by filename or public ID..."
                aria-label="Search selector media assets"
                className="w-full min-h-[38px] pl-9 pr-8 py-1.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#64717C] hover:text-[#081D2E] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <select
                aria-label="Selector media type filter"
                value={mediaTypeFilter}
                onChange={(e) => {
                  setMediaTypeFilter(e.target.value as MediaTypeFilter);
                  setPage(1);
                }}
                className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value={requiredType}>
                  Compatible Only ({requiredType === "IMAGE" ? "Images" : "PDFs"})
                </option>
                <option value="ALL">All Types (Show Incompatible)</option>
                <option value={requiredType === "IMAGE" ? "DOCUMENT" : "IMAGE"}>
                  {requiredType === "IMAGE" ? "Documents (Incompatible)" : "Images (Incompatible)"}
                </option>
              </select>

              <select
                aria-label="Selector folder filter"
                value={folderFilter}
                onChange={(e) => {
                  setFolderFilter(e.target.value);
                  setPage(1);
                }}
                className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="ALL">All Folders</option>
                {APPROVED_MEDIA_FOLDERS.map((f) => (
                  <option key={f} value={f}>
                    {getMediaFolderLabel(f)}
                  </option>
                ))}
              </select>

              <select
                aria-label="Selector status filter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setPage(1);
                }}
                className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="ALL">All Statuses</option>
                <option value="UPLOADED">Uploaded</option>
                <option value="ATTACHED">Attached</option>
                <option value="ARCHIVED">Archived (Unavailable)</option>
                <option value="DELETED">Deleted (Unavailable)</option>
              </select>

              <select
                aria-label="Selector sort order"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as CatalogSortOption);
                  setPage(1);
                }}
                className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="largest">Largest</option>
                <option value="name">Name A–Z</option>
              </select>

              <div
                role="group"
                aria-label="Selector view mode"
                className="inline-flex rounded-lg border border-[#D9DEE2] bg-[#F7F7F7] p-0.5"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Selector grid view"
                  aria-pressed={viewMode === "grid"}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#0D2C49] text-white"
                      : "text-[#64717C] hover:text-[#081D2E]"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="Selector list view"
                  aria-pressed={viewMode === "list"}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[#0D2C49] text-white"
                      : "text-[#64717C] hover:text-[#081D2E]"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {hasCustomFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#0D2C49] hover:underline cursor-pointer px-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-5 space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 animate-pulse">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-[#D9DEE2] overflow-hidden"
                  >
                    <div className="aspect-[4/3] bg-[#F7F7F7]" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-[#F7F7F7]" />
                      <div className="h-2.5 w-1/2 rounded bg-[#F7F7F7]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div
                role="alert"
                className="bg-white rounded-xl border border-[#D9DEE2] p-8 text-center space-y-3"
              >
                <AlertTriangle className="w-6 h-6 text-[#B09C4B] mx-auto" />
                <p className="font-serif text-lg text-[#081D2E]">
                  Unable to load media library
                </p>
                <p className="text-xs font-sans text-[#64717C] max-w-md mx-auto">{error}</p>
                <button
                  type="button"
                  onClick={() => setReloadTick((t) => t + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#D9DEE2] p-10 text-center space-y-3">
                <Search className="w-6 h-6 text-[#64717C]/50 mx-auto" />
                <p className="font-serif text-lg text-[#081D2E]">
                  No assets match the current filter
                </p>
                <p className="text-xs font-sans text-[#64717C] max-w-sm mx-auto">
                  {canUpload
                    ? "Try clearing your filters or upload a new compatible file to the archive."
                    : "Try broadening your search or resetting the active filters."}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {hasCustomFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-3.5 py-2 rounded-lg border border-[#D9DEE2] bg-white text-xs font-sans font-medium text-[#081D2E] hover:border-[#0D2C49] cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                  {canUpload && (
                    <button
                      type="button"
                      onClick={() => setUploadOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New</span>
                    </button>
                  )}
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {items.map((item) => {
                  const eligibility = getAssetSelectionEligibility(item, requiredType);
                  const isHighlighted = highlightedId === item.id;
                  const isCurrent = currentAssetId === item.id;
                  const badge = getClassificationBadge(item.referenceClassification);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setHighlightedId(item.id)}
                      aria-pressed={isHighlighted}
                      title={eligibility.reason || item.originalFilename}
                      className={`group text-left rounded-xl border overflow-hidden transition-colors flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B] ${
                        !eligibility.selectable
                          ? isHighlighted
                            ? "bg-[#F7F7F7] border-[#B09C4B] ring-2 ring-[#B09C4B]/50 opacity-85"
                            : "bg-[#F7F7F7]/80 border-[#D9DEE2] opacity-70 hover:opacity-90"
                          : isHighlighted
                            ? "bg-white border-[#0D2C49] ring-2 ring-[#B09C4B]"
                            : "bg-white border-[#D9DEE2] hover:border-[#0D2C49]/45"
                      }`}
                    >
                      <div className="relative border-b border-[#D9DEE2]/70 w-full">
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
                        {isCurrent && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0D2C49] text-white text-[9px] font-sans font-semibold uppercase tracking-wider">
                            Current
                          </span>
                        )}
                        {!eligibility.selectable && (
                          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#081D2E]/85 text-white text-[9px] font-sans font-semibold uppercase tracking-wider">
                            <Ban className="w-2.5 h-2.5 text-[#B09C4B]" />
                            <span>Unavailable</span>
                          </span>
                        )}
                      </div>

                      <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between w-full min-w-0">
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-xs font-sans font-medium text-[#081D2E] truncate">
                            {item.originalFilename}
                          </p>
                          <p className="text-[10px] font-sans text-[#64717C] truncate">
                            <span className="font-mono uppercase text-[#0D2C49]">
                              {item.mediaType === "DOCUMENT" ? "PDF" : item.format}
                            </span>
                            {" · "}
                            {formatFileSize(item.bytes)}
                            {" · "}
                            {formatArchiveDate(item.createdAt)}
                          </p>
                        </div>

                        {!eligibility.selectable ? (
                          <p className="text-[10px] font-sans text-[#6D5D25] leading-snug line-clamp-2">
                            {eligibility.reason}
                          </p>
                        ) : (
                          <div className="flex items-center justify-between gap-2 pt-0.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-sans font-medium ${badge.className}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClassName}`} />
                              <span>{badge.label}</span>
                            </span>
                            <span className="text-[10px] font-mono text-[#64717C]">
                              {item.totalReferences} {item.totalReferences === 1 ? "ref" : "refs"}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#D9DEE2] divide-y divide-[#D9DEE2]/70">
                {items.map((item) => {
                  const eligibility = getAssetSelectionEligibility(item, requiredType);
                  const isHighlighted = highlightedId === item.id;
                  const isCurrent = currentAssetId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setHighlightedId(item.id)}
                      aria-pressed={isHighlighted}
                      className={`w-full text-left p-3 flex items-center gap-3 transition-colors cursor-pointer ${
                        isHighlighted
                          ? "bg-[#0D2C49]/6"
                          : "hover:bg-[#F7F7F7]/80"
                      } ${!eligibility.selectable ? "opacity-70" : ""}`}
                    >
                      <MediaPreviewThumb
                        mediaType={item.mediaType}
                        secureUrl={item.secureUrl}
                        originalFilename={item.originalFilename}
                        format={item.format}
                        variant="row"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="text-xs font-medium text-[#081D2E] truncate">
                            {item.originalFilename}
                          </p>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-[#0D2C49] text-white text-[9px] font-semibold uppercase shrink-0">
                              Current
                            </span>
                          )}
                          {!eligibility.selectable && (
                            <span className="px-1.5 py-0.5 rounded bg-[#B09C4B]/15 text-[#6D5D25] border border-[#B09C4B]/40 text-[9px] font-semibold uppercase shrink-0">
                              Unavailable
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#64717C] truncate">
                          {item.folderLabel} · {formatFileSize(item.bytes)} ·{" "}
                          {formatArchiveDate(item.createdAt)}
                        </p>
                        {!eligibility.selectable && (
                          <p className="text-[10px] text-[#6D5D25] mt-0.5 truncate">
                            {eligibility.reason}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-[10px] uppercase text-[#0D2C49] shrink-0 inline-flex items-center gap-1">
                        {item.mediaType === "DOCUMENT" ? (
                          <FileText className="w-3.5 h-3.5 text-[#64717C]" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5 text-[#64717C]" />
                        )}
                        {item.mediaType === "DOCUMENT" ? "PDF" : item.format}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {pagination && pagination.totalPages > 1 && !error && (
              <div className="flex items-center justify-between pt-1 text-xs font-sans">
                <span className="text-[#64717C]">
                  Page <strong className="text-[#081D2E]">{pagination.page}</strong> of{" "}
                  <strong className="text-[#081D2E]">{pagination.totalPages}</strong> (
                  {pagination.totalItems} assets)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pagination.page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9DEE2] bg-white text-[#081D2E] hover:border-[#0D2C49] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    disabled={pagination.page >= pagination.totalPages || loading}
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9DEE2] bg-white text-[#081D2E] hover:border-[#0D2C49] disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside
            aria-label="Selected asset preview"
            className="w-full lg:w-[330px] xl:w-[360px] shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-[#D9DEE2] overflow-y-auto max-h-56 lg:max-h-none"
          >
            {!highlightedId ? (
              <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-2 text-[#64717C]">
                <ImageIcon className="w-6 h-6 text-[#0D2C49]/35" />
                <p className="font-serif text-base text-[#081D2E]">Preview Asset</p>
                <p className="text-xs font-sans">
                  Select an item from the archive to inspect its preview, metadata, and compatibility.
                </p>
              </div>
            ) : detailLoading && !activeAsset ? (
              <div className="p-5 space-y-3 animate-pulse">
                <div className="h-36 rounded-lg bg-[#F7F7F7]" />
                <div className="h-4 w-3/4 rounded bg-[#F7F7F7]" />
                <div className="h-3 w-1/2 rounded bg-[#F7F7F7]" />
              </div>
            ) : detailError && !activeAsset ? (
              <div className="p-5 text-center space-y-2">
                <AlertTriangle className="w-5 h-5 text-[#B09C4B] mx-auto" />
                <p className="text-xs text-[#64717C]">{detailError}</p>
              </div>
            ) : activeAsset ? (
              <div className="p-4 sm:p-5 space-y-4">
                <div className="rounded-lg border border-[#D9DEE2] overflow-hidden bg-[#F7F7F7]">
                  <MediaPreviewThumb
                    mediaType={activeAsset.mediaType}
                    secureUrl={activeAsset.secureUrl}
                    originalFilename={activeAsset.originalFilename}
                    format={activeAsset.format}
                    pages={activeAsset.pages}
                    width={activeAsset.width}
                    height={activeAsset.height}
                    variant="inspector"
                  />
                </div>

                {activeEligibility && !activeEligibility.selectable && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-[#B09C4B]/12 border border-[#B09C4B]/45 text-xs font-sans text-[#081D2E] flex items-start gap-2"
                  >
                    <Ban className="w-4 h-4 text-[#8C7B38] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[11px] uppercase tracking-wider text-[#6D5D25]">
                        Cannot Be Selected
                      </p>
                      <p className="text-xs text-[#081D2E] mt-0.5 leading-snug">
                        {activeEligibility.reason}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <h3 className="font-serif text-base font-medium text-[#081D2E] break-all leading-snug">
                    {activeAsset.originalFilename}
                  </h3>
                  {isSafeCloudinaryUrl(activeAsset.secureUrl) && (
                    <a
                      href={activeAsset.secureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-sans text-[#0D2C49] hover:underline"
                    >
                      <span>Open original in new tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <dl className="divide-y divide-[#D9DEE2]/60 text-[11px] font-sans">
                  <div className="py-1.5 flex justify-between gap-3">
                    <dt className="text-[#64717C]">Type</dt>
                    <dd className="font-mono uppercase text-[#081D2E]">
                      {activeAsset.mediaType} · {activeAsset.format}
                    </dd>
                  </div>
                  <div className="py-1.5 flex justify-between gap-3">
                    <dt className="text-[#64717C]">Size</dt>
                    <dd className="text-[#081D2E] font-medium">
                      {formatFileSize(activeAsset.bytes)}
                    </dd>
                  </div>
                  {activeAsset.mediaType === "IMAGE" &&
                    activeAsset.width &&
                    activeAsset.height && (
                      <div className="py-1.5 flex justify-between gap-3">
                        <dt className="text-[#64717C]">Dimensions</dt>
                        <dd className="font-mono text-[#081D2E]">
                          {activeAsset.width}×{activeAsset.height}
                        </dd>
                      </div>
                    )}
                  {activeAsset.mediaType === "DOCUMENT" && activeAsset.pages !== null && (
                    <div className="py-1.5 flex justify-between gap-3">
                      <dt className="text-[#64717C]">Pages</dt>
                      <dd className="text-[#081D2E]">{activeAsset.pages}</dd>
                    </div>
                  )}
                  <div className="py-1.5 flex justify-between gap-3">
                    <dt className="text-[#64717C]">Status</dt>
                    <dd className="font-mono text-[#081D2E]">{activeAsset.storedStatus}</dd>
                  </div>
                  <div className="py-1.5 flex justify-between gap-3">
                    <dt className="text-[#64717C]">References</dt>
                    <dd className="font-mono text-[#081D2E]">{activeAsset.totalReferences}</dd>
                  </div>
                  <div className="py-1.5 flex justify-between gap-3">
                    <dt className="text-[#64717C]">Folder</dt>
                    <dd className="text-right text-[#081D2E] truncate max-w-[180px]" title={activeAsset.folder}>
                      {activeAsset.folderLabel}
                    </dd>
                  </div>
                  <div className="py-1.5 flex justify-between gap-3">
                    <dt className="text-[#64717C]">Uploaded</dt>
                    <dd className="text-right text-[#081D2E]">
                      {formatArchiveDateTime(activeAsset.createdAt)}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </aside>
        </div>

        <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-[#D9DEE2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-sans text-[#64717C] truncate min-w-0">
            {activeAsset ? (
              activeEligibility?.selectable ? (
                <span>
                  Selected:{" "}
                  <strong className="text-[#081D2E] font-medium">
                    {activeAsset.originalFilename}
                  </strong>{" "}
                  ({formatFileSize(activeAsset.bytes)})
                </span>
              ) : (
                <span className="text-[#6D5D25]">
                  Highlighted asset is unavailable for this field.
                </span>
              )
            ) : (
              <span>No asset selected yet. Canceling preserves your current form state.</span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 min-h-[38px] rounded-lg border border-[#D9DEE2] bg-white text-xs font-sans font-medium text-[#081D2E] hover:border-[#0D2C49] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!activeAsset || !activeEligibility?.selectable}
              onClick={handleConfirmSelection}
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Select Asset</span>
            </button>
          </div>
        </div>
      </div>

      {canUpload && uploadOpen && (
        <MediaUploadModal
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
          allowedMediaType={requiredType}
          defaultFolder={fieldConfig.defaultUploadFolder}
        />
      )}
    </div>,
    document.body
  );
}

