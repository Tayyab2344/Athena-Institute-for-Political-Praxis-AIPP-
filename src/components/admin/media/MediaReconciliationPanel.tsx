"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  CloudOff,
  Database,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Info,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import type {
  CloudinaryClassification,
  EnumerationCompleteness,
  ReconciledAsset,
  ReconciliationReport,
  ReferenceClassification
} from "@/lib/media/reconciliation";
import { APPROVED_MEDIA_FOLDERS, getMediaFolderLabel } from "@/lib/media/folders";
import { formatArchiveDate, formatFileSize } from "@/lib/media/preview";

type MediaTypeFilter = "ALL" | "IMAGE" | "DOCUMENT";
type StatusFilter = "ALL" | "UPLOADED" | "ATTACHED" | "ARCHIVED" | "DELETED";
type RefClassFilter = "ALL" | ReferenceClassification;
type CldClassFilter = "ALL" | CloudinaryClassification;

function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return "Not yet recorded";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Not yet recorded";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function formatAge(ageHours: number, ageDays: number): string {
  if (ageHours < 1) {
    return "< 1 hr";
  }
  if (ageHours < 24) {
    return `${ageHours} hr${ageHours === 1 ? "" : "s"}`;
  }
  return `${ageDays} day${ageDays === 1 ? "" : "s"}`;
}

function extractFolderFromPublicId(publicId: string): string {
  const idx = publicId.lastIndexOf("/");
  return idx > 0 ? publicId.slice(0, idx) : "—";
}

function getCompletenessMeta(completeness: EnumerationCompleteness): {
  title: string;
  containerClass: string;
  badgeClass: string;
  badgeText: string;
} {
  switch (completeness) {
    case "COMPLETE":
      return {
        title: "Complete Enumeration",
        containerClass: "bg-emerald-50/70 border-emerald-200 text-emerald-950",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        badgeText: "COMPLETE"
      };
    case "CAPPED":
      return {
        title: "Incomplete / Capped Enumeration",
        containerClass: "bg-amber-50 border-amber-300 text-amber-950",
        badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
        badgeText: "CAPPED"
      };
    case "PARTIAL":
      return {
        title: "Partial Results",
        containerClass: "bg-orange-50 border-orange-300 text-orange-950",
        badgeClass: "bg-orange-100 text-orange-900 border-orange-300",
        badgeText: "PARTIAL"
      };
    case "FAILED":
      return {
        title: "Failed Enumeration",
        containerClass: "bg-rose-50 border-rose-300 text-rose-950",
        badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
        badgeText: "FAILED"
      };
  }
}

function getCloudinaryBadge(classification: CloudinaryClassification): {
  label: string;
  className: string;
} {
  switch (classification) {
    case "REGISTERED_AND_PRESENT":
      return {
        label: "Present in Cloudinary",
        className: "bg-emerald-50 text-emerald-800 border-emerald-200"
      };
    case "REGISTERED_BUT_MISSING_IN_CLOUDINARY":
      return {
        label: "Missing in Cloudinary",
        className: "bg-rose-50 text-rose-800 border-rose-200"
      };
    case "METADATA_DIFFERENCE":
      return {
        label: "Metadata Mismatch",
        className: "bg-amber-50 text-amber-900 border-amber-300"
      };
    case "RESOURCE_TYPE_MISMATCH":
      return {
        label: "Resource Type Mismatch",
        className: "bg-rose-50 text-rose-900 border-rose-300"
      };
    case "CLOUDINARY_UNREGISTERED":
      return {
        label: "Unregistered in DB",
        className: "bg-indigo-50 text-indigo-800 border-indigo-200"
      };
    case "CLOUDINARY_UNAVAILABLE":
      return {
        label: "Cloudinary Unavailable",
        className: "bg-slate-100 text-slate-700 border-slate-300"
      };
  }
}

function getDiagnosticCallout(item: ReconciledAsset): {
  label: string;
  className: string;
} {
  if (item.orphanFlags.includes("REFERENCED_BUT_MARKED_INCORRECTLY")) {
    return {
      label: "Referenced · Marked Incorrectly",
      className: "bg-amber-50 text-amber-900 border-amber-300"
    };
  }
  if (item.orphanFlags.includes("INCONSISTENT_STATUS_UNREFERENCED")) {
    return {
      label: "Unreferenced · Marked Attached",
      className: "bg-amber-50 text-amber-900 border-amber-300"
    };
  }
  if (item.orphanFlags.includes("UPLOADED_UNREFERENCED")) {
    return {
      label: "Uploaded · Unreferenced",
      className: "bg-[#F7F7F7] text-[#4C5863] border-[#D9DEE2]"
    };
  }
  if (item.referenceClassification === "ATTACHED") {
    return {
      label: "Attached · Consistent",
      className: "bg-[#0D2C49]/8 text-[#0D2C49] border-[#0D2C49]/20"
    };
  }
  if (item.referenceClassification === "ARCHIVED") {
    return {
      label: "Archived",
      className: "bg-slate-100 text-slate-700 border-slate-300"
    };
  }
  return {
    label: "Deleted",
    className: "bg-rose-50 text-rose-800 border-rose-200"
  };
}

export default function MediaReconciliationPanel() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [refClassFilter, setRefClassFilter] = useState<RefClassFilter>("ALL");
  const [cldClassFilter, setCldClassFilter] = useState<CldClassFilter>("ALL");
  const [folderFilter, setFolderFilter] = useState<string>("ALL");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaTypeFilter>("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [report, setReport] = useState<ReconciliationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitNotice, setRateLimitNotice] = useState<{
    message: string;
    retryAfterSeconds: number;
  } | null>(null);

  const inFlightRefreshRef = useRef(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (refClassFilter !== "ALL") params.set("referenceClassification", refClassFilter);
    if (cldClassFilter !== "ALL") params.set("cloudinaryClassification", cldClassFilter);
    if (folderFilter !== "ALL") params.set("folder", folderFilter);
    if (mediaTypeFilter !== "ALL") params.set("mediaType", mediaTypeFilter);
    return params.toString();
  }, [page, limit, statusFilter, refClassFilter, cldClassFilter, folderFilter, mediaTypeFilter]);

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    refClassFilter !== "ALL" ||
    cldClassFilter !== "ALL" ||
    folderFilter !== "ALL" ||
    mediaTypeFilter !== "ALL";

  useEffect(() => {
    const controller = new AbortController();

    async function loadSnapshot() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/admin/media/reconciliation?${queryString}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache"
          }
        });

        const payload = (await res.json()) as ReconciliationReport & {
          error?: string;
          retryAfterSeconds?: number;
        };

        if (controller.signal.aborted) return;

        if (res.status === 429) {
          setRateLimitNotice({
            message:
              payload.error ||
              "Reconciliation refresh is temporarily rate-limited. Please wait before retrying.",
            retryAfterSeconds: payload.retryAfterSeconds ?? 60
          });
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setError(payload.error || `Failed to load reconciliation report (HTTP ${res.status}).`);
          setLoading(false);
          return;
        }

        setRateLimitNotice(null);
        setReport(payload);
        setLoading(false);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Network error while loading reconciliation diagnostics. Please retry.");
        setLoading(false);
      }
    }

    loadSnapshot();

    return () => {
      controller.abort();
    };
  }, [queryString]);

  const handleManualRefresh = useCallback(async () => {
    if (inFlightRefreshRef.current) return;
    inFlightRefreshRef.current = true;
    setRefreshing(true);
    setError(null);
    setRateLimitNotice(null);

    try {
      const res = await fetch(`/api/admin/media/reconciliation?${queryString}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        }
      });

      const payload = (await res.json()) as ReconciliationReport & {
        error?: string;
        retryAfterSeconds?: number;
      };

      if (res.status === 429) {
        setRateLimitNotice({
          message:
            payload.error ||
            "Rate limit reached for external Cloudinary inventory refreshes.",
          retryAfterSeconds: payload.retryAfterSeconds ?? 60
        });
        return;
      }

      if (!res.ok) {
        setError(payload.error || `Manual refresh failed (HTTP ${res.status}).`);
        return;
      }

      setReport(payload);
    } catch {
      setError("Network error while refreshing external Cloudinary inventory.");
    } finally {
      inFlightRefreshRef.current = false;
      setRefreshing(false);
    }
  }, [queryString]);

  const handleClearFilters = () => {
    setStatusFilter("ALL");
    setRefClassFilter("ALL");
    setCldClassFilter("ALL");
    setFolderFilter("ALL");
    setMediaTypeFilter("ALL");
    setPage(1);
  };

  const summary = report?.summary;
  const enumeration = report?.cloudinaryApi.enumeration;
  const completenessMeta = enumeration ? getCompletenessMeta(enumeration.completeness) : null;
  const items = report?.items ?? [];
  const unregistered = report?.unregisteredCloudinaryResources ?? [];
  const pagination = report?.pagination;

  const showUnregisteredOnly = cldClassFilter === "CLOUDINARY_UNREGISTERED";

  return (
    <div className="space-y-6 min-w-0">
      <section
        aria-label="Reconciliation audit header and controls"
        className="bg-white rounded-xl border border-[#D9DEE2] overflow-hidden"
      >
        <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0D2C49]/8 border border-[#0D2C49]/20 text-[10px] font-mono uppercase tracking-[0.12em] text-[#0D2C49] font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>SUPER_ADMIN · Read-Only Audit</span>
              </span>
              {report?.cache && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F7F7F7] border border-[#D9DEE2] text-[10px] font-mono text-[#64717C]">
                  <Clock className="w-3 h-3" />
                  <span>
                    {report.cache.hit
                      ? `Cached snapshot (${report.cache.ttlSeconds}s TTL)`
                      : report.cache.coalesced
                        ? "Coalesced live scan"
                        : "Fresh live scan"}
                  </span>
                </span>
              )}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#081D2E]">
              Media Inventory Reconciliation
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#64717C] max-w-3xl leading-relaxed">
              Performs an external Cloudinary Admin API inventory check across approved AIPP folders and compares results against PostgreSQL <span className="font-mono text-[#081D2E]">MediaAsset</span> records and content references. Strictly observational — no database or Cloudinary records are modified.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Refreshing Inventory..." : "Refresh External Inventory"}</span>
            </button>
            <span className="text-[11px] font-sans text-[#64717C] text-left sm:text-right">
              Last successful scan:{" "}
              <span className="font-mono text-[#081D2E]">
                {formatTimestamp(report?.cache?.lastSuccessfulAt ?? (report?.cloudinaryApi.status === "AVAILABLE" ? report.generatedAt : null))}
              </span>
            </span>
          </div>
        </div>

        <div className="border-t border-[#D9DEE2] bg-[#F7F7F7]/70 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans text-[#64717C]">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#0D2C49] shrink-0" />
            <span>
              Normal Media Library browsing queries PostgreSQL only. Manual refreshes are rate-limited per administrator to protect external Cloudinary API quotas.
            </span>
          </div>
          {report?.cache?.expiresAt && report.cloudinaryApi.status === "AVAILABLE" && (
            <span className="font-mono text-[10px] text-[#64717C]">
              Snapshot expires: {formatTimestamp(report.cache.expiresAt)}
            </span>
          )}
        </div>
      </section>

      {rateLimitNotice && (
        <div
          role="alert"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3 text-amber-950"
        >
          <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 min-w-0">
            <p className="text-xs sm:text-sm font-sans font-semibold">
              External Refresh Rate-Limited (HTTP 429)
            </p>
            <p className="text-xs font-sans leading-relaxed">
              {rateLimitNotice.message} Retry available in approximately{" "}
              <span className="font-mono font-semibold">{rateLimitNotice.retryAfterSeconds}s</span>.
              {report ? " Displaying the last loaded reconciliation snapshot below." : ""}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-300 bg-rose-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-rose-950"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-sans font-semibold">Reconciliation Request Failed</p>
              <p className="text-xs font-sans text-rose-900">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-800 text-white text-xs font-sans font-medium hover:bg-rose-900 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {loading && !report ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 rounded-xl bg-white border border-[#D9DEE2]" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-white border border-[#D9DEE2]" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-white border border-[#D9DEE2]" />
        </div>
      ) : report && summary && enumeration && completenessMeta ? (
        <>
          <section
            aria-label="Cloudinary enumeration completeness status"
            className={`rounded-xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-3 ${completenessMeta.containerClass}`}
          >
            <div className="flex items-start gap-3 min-w-0">
              {enumeration.completeness === "COMPLETE" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : enumeration.completeness === "FAILED" ? (
                <CloudOff className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-sans font-semibold">
                    {completenessMeta.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${completenessMeta.badgeClass}`}
                  >
                    {completenessMeta.badgeText}
                  </span>
                </div>
                <p className="text-xs font-sans leading-relaxed opacity-90">
                  {enumeration.completeness === "COMPLETE"
                    ? `All approved AIPP Cloudinary folders were enumerated without hitting the ${enumeration.maxPagesPerResourceType}-page safety cap. Scanned ${report.cloudinaryApi.scannedResourcesInApprovedFolders} resource(s) across ${enumeration.pagesFetched.image} image page(s) and ${enumeration.pagesFetched.raw} raw page(s).`
                    : enumeration.completeness === "CAPPED"
                      ? `Enumeration reached the ${enumeration.maxPagesPerResourceType}-page cap for ${enumeration.truncatedResourceTypes.join(", ")} resources. Missing-in-Cloudinary and unregistered resource figures are partial and must NOT be treated as a complete synchronization report.`
                      : enumeration.completeness === "PARTIAL"
                        ? `Enumeration failed for ${enumeration.failedResourceTypes.join(", ")} resources while succeeding for the remaining resource type. Inventory comparisons are partial and incomplete.`
                        : enumeration.note ||
                        "Cloudinary Admin API enumeration failed. Database reference integrity checks remain available below, but external Cloudinary presence cannot be verified."}
                </p>
              </div>
            </div>
            <div className="text-[11px] font-mono shrink-0 md:text-right opacity-80 space-y-0.5">
              <div>Scanned: {report.cloudinaryApi.scannedResourcesInApprovedFolders}</div>
              <div>
                Pages: img {enumeration.pagesFetched.image}/{enumeration.maxPagesPerResourceType} · raw{" "}
                {enumeration.pagesFetched.raw}/{enumeration.maxPagesPerResourceType}
              </div>
            </div>
          </section>

          <section aria-label="Reconciliation overview metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-left bg-white rounded-xl border border-[#D9DEE2] hover:border-[#0D2C49]/50 p-4 transition-colors cursor-pointer"
            >
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Total Registered Assets
              </span>
              <span className="mt-1 block font-serif text-2xl font-medium text-[#081D2E]">
                {summary.totalRegistered}
              </span>
              <span className="mt-1 block text-[11px] font-sans text-[#64717C]">
                {summary.byMediaType.IMAGE ?? 0} images · {summary.byMediaType.DOCUMENT ?? 0} documents
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRefClassFilter("ATTACHED");
                setCldClassFilter("ALL");
                setPage(1);
              }}
              className="text-left bg-white rounded-xl border border-[#D9DEE2] hover:border-[#0D2C49]/50 p-4 transition-colors cursor-pointer"
            >
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Attached Assets
              </span>
              <span className="mt-1 block font-serif text-2xl font-medium text-[#0D2C49]">
                {summary.totalReferenced}
              </span>
              <span className="mt-1 block text-[11px] font-sans text-[#64717C]">
                Actively referenced in CMS models
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRefClassFilter("UPLOADED");
                setCldClassFilter("ALL");
                setPage(1);
              }}
              className="text-left bg-white rounded-xl border border-[#D9DEE2] hover:border-[#0D2C49]/50 p-4 transition-colors cursor-pointer"
            >
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Unreferenced Uploads
              </span>
              <span className="mt-1 block font-serif text-2xl font-medium text-[#4C5863]">
                {summary.orphanBreakdown.uploadedUnreferenced}
              </span>
              <span className="mt-1 block text-[11px] font-sans text-[#64717C]">
                0 DB refs · may be pending drafts
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRefClassFilter("STATUS_MISMATCH");
                setCldClassFilter("ALL");
                setPage(1);
              }}
              className="text-left bg-white rounded-xl border border-[#D9DEE2] hover:border-amber-400 p-4 transition-colors cursor-pointer"
            >
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Status Mismatches
              </span>
              <span
                className={`mt-1 block font-serif text-2xl font-medium ${summary.statusMismatches > 0 ? "text-amber-800" : "text-[#081D2E]"
                  }`}
              >
                {summary.statusMismatches}
              </span>
              <span className="mt-1 block text-[11px] font-sans text-[#64717C]">
                Stored status differs from references
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRefClassFilter("ALL");
                setCldClassFilter("REGISTERED_BUT_MISSING_IN_CLOUDINARY");
                setPage(1);
              }}
              className="text-left bg-white rounded-xl border border-[#D9DEE2] hover:border-rose-300 p-4 transition-colors cursor-pointer"
            >
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Missing in Cloudinary
              </span>
              <span
                className={`mt-1 block font-serif text-2xl font-medium ${summary.missingInCloudinary > 0 ? "text-rose-800" : "text-[#081D2E]"
                  }`}
              >
                {enumeration.completeness === "FAILED" ? "—" : summary.missingInCloudinary}
              </span>
              <span className="mt-1 block text-[11px] font-sans text-[#64717C]">
                {enumeration.isComplete
                  ? "DB record absent externally"
                  : enumeration.completeness === "FAILED"
                    ? "Unavailable (scan failed)"
                    : "Partial (scan incomplete)"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRefClassFilter("ALL");
                setCldClassFilter("CLOUDINARY_UNREGISTERED");
                setPage(1);
              }}
              className="text-left bg-white rounded-xl border border-[#D9DEE2] hover:border-indigo-300 p-4 transition-colors cursor-pointer"
            >
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Unregistered Cloudinary
              </span>
              <span
                className={`mt-1 block font-serif text-2xl font-medium ${summary.unregisteredInCloudinary > 0 ? "text-indigo-800" : "text-[#081D2E]"
                  }`}
              >
                {enumeration.completeness === "FAILED" ? "—" : summary.unregisteredInCloudinary}
              </span>
              <span className="mt-1 block text-[11px] font-sans text-[#64717C]">
                External files without DB record
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRefClassFilter("ALL");
                setCldClassFilter("METADATA_DIFFERENCE");
                setPage(1);
              }}
              className="text-left bg-white rounded-xl border border-[#D9DEE2] hover:border-amber-400 p-4 transition-colors cursor-pointer"
            >
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Metadata Differences
              </span>
              <span
                className={`mt-1 block font-serif text-2xl font-medium ${summary.metadataDifferences > 0 ? "text-amber-800" : "text-[#081D2E]"
                  }`}
              >
                {enumeration.completeness === "FAILED" ? "—" : summary.metadataDifferences}
              </span>
              <span className="mt-1 block text-[11px] font-sans text-[#64717C]">
                Format, URL, or byte-size drift
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRefClassFilter("ALL");
                setCldClassFilter("RESOURCE_TYPE_MISMATCH");
                setPage(1);
              }}
              className="text-left bg-white rounded-xl border border-[#D9DEE2] hover:border-rose-300 p-4 transition-colors cursor-pointer"
            >
              <span className="block text-[10px] font-sans uppercase tracking-[0.12em] text-[#64717C]">
                Resource Type Mismatches
              </span>
              <span
                className={`mt-1 block font-serif text-2xl font-medium ${summary.resourceTypeMismatches > 0 ? "text-rose-800" : "text-[#081D2E]"
                  }`}
              >
                {enumeration.completeness === "FAILED" ? "—" : summary.resourceTypeMismatches}
              </span>
              <span className="mt-1 block text-[11px] font-sans text-[#64717C]">
                Unexpected Cloudinary delivery type
              </span>
            </button>
          </section>

          <section
            aria-label="Anomaly explorer filters"
            className="bg-white rounded-xl border border-[#D9DEE2] p-4 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#081D2E]">Anomaly Explorer</h3>
                <p className="text-[11px] font-sans text-[#64717C]">
                  Inspect registered assets and external Cloudinary resources. Unreferenced uploads are informational and are not automatically marked safe to delete.
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#0D2C49] hover:underline cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-[#D9DEE2]/70">
              <select
                aria-label="Filter reconciliation by database status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setPage(1);
                }}
                className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="ALL">All DB Statuses</option>
                <option value="ATTACHED">ATTACHED</option>
                <option value="UPLOADED">UPLOADED</option>
                <option value="ARCHIVED">ARCHIVED</option>
                <option value="DELETED">DELETED</option>
              </select>

              <select
                aria-label="Filter reconciliation by reference classification"
                value={refClassFilter}
                onChange={(e) => {
                  setRefClassFilter(e.target.value as RefClassFilter);
                  setPage(1);
                }}
                className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="ALL">All Reference States</option>
                <option value="ATTACHED">Attached (Consistent)</option>
                <option value="UPLOADED">Uploaded (Unreferenced)</option>
                <option value="STATUS_MISMATCH">Status Mismatch</option>
                <option value="ARCHIVED">Archived</option>
                <option value="DELETED">Deleted</option>
              </select>

              <select
                aria-label="Filter reconciliation by Cloudinary classification"
                value={cldClassFilter}
                onChange={(e) => {
                  setCldClassFilter(e.target.value as CldClassFilter);
                  setPage(1);
                }}
                className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="ALL">All Cloudinary States</option>
                <option value="REGISTERED_AND_PRESENT">Present in Cloudinary</option>
                <option value="REGISTERED_BUT_MISSING_IN_CLOUDINARY">Missing in Cloudinary</option>
                <option value="CLOUDINARY_UNREGISTERED">Unregistered in DB</option>
                <option value="METADATA_DIFFERENCE">Metadata Mismatch</option>
                <option value="RESOURCE_TYPE_MISMATCH">Resource Type Mismatch</option>
                <option value="CLOUDINARY_UNAVAILABLE">Cloudinary Unavailable</option>
              </select>

              <select
                aria-label="Filter reconciliation by folder"
                value={folderFilter}
                onChange={(e) => {
                  setFolderFilter(e.target.value);
                  setPage(1);
                }}
                className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="ALL">All Approved Folders</option>
                {APPROVED_MEDIA_FOLDERS.map((f) => (
                  <option key={f} value={f}>
                    {getMediaFolderLabel(f)}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter reconciliation by media type"
                value={mediaTypeFilter}
                onChange={(e) => {
                  setMediaTypeFilter(e.target.value as MediaTypeFilter);
                  setPage(1);
                }}
                className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
              >
                <option value="ALL">All Media Types</option>
                <option value="IMAGE">Images</option>
                <option value="DOCUMENT">Documents (PDF)</option>
              </select>
            </div>
          </section>

          {!showUnregisteredOnly && (
            <section
              aria-label="Registered MediaAsset reconciliation findings"
              className="bg-white rounded-xl border border-[#D9DEE2] overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-[#D9DEE2] bg-[#F7F7F7]/60 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#0D2C49]" />
                  <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E]">
                    Registered PostgreSQL Assets ({pagination?.totalItems ?? items.length})
                  </h3>
                </div>
                {loading && (
                  <span className="text-[11px] font-sans text-[#64717C]">Updating view...</span>
                )}
              </div>

              {items.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <p className="font-serif text-lg text-[#081D2E]">
                    No registered assets match these filters
                  </p>
                  <p className="text-xs font-sans text-[#64717C]">
                    Adjust or clear the Anomaly Explorer filters above to inspect other asset states.
                  </p>
                </div>
              ) : (
                <>
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F7F7F7] border-b border-[#D9DEE2] text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-[#64717C]">
                          <th className="py-3 pl-5 pr-3">Filename &amp; Public ID</th>
                          <th className="py-3 px-3">DB Status</th>
                          <th className="py-3 px-3">References</th>
                          <th className="py-3 px-3">Cloudinary Presence</th>
                          <th className="py-3 px-3">Metadata Differences</th>
                          <th className="py-3 pl-3 pr-5 text-right">Upload Age</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9DEE2]/70 text-xs font-sans">
                        {items.map((item) => {
                          const cldBadge = getCloudinaryBadge(item.cloudinaryStatus.classification);
                          const diagBadge = getDiagnosticCallout(item);
                          return (
                            <tr key={item.id} className="hover:bg-[#F7F7F7]/60 align-top">
                              <td className="py-3.5 pl-5 pr-3 max-w-[290px]">
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <span className="mt-0.5 p-1.5 rounded-md bg-[#F7F7F7] border border-[#D9DEE2] shrink-0 text-[#0D2C49]">
                                    {item.mediaType === "DOCUMENT" ? (
                                      <FileText className="w-3.5 h-3.5" />
                                    ) : (
                                      <ImageIcon className="w-3.5 h-3.5" />
                                    )}
                                  </span>
                                  <div className="min-w-0 space-y-0.5">
                                    <p
                                      className="font-medium text-[#081D2E] truncate"
                                      title={item.originalFilename}
                                    >
                                      {item.originalFilename}
                                    </p>
                                    <p
                                      className="font-mono text-[10px] text-[#64717C] truncate"
                                      title={item.publicId}
                                    >
                                      {item.publicId}
                                    </p>
                                    <p className="text-[10px] text-[#64717C]">
                                      {getMediaFolderLabel(item.folder)} · {item.format.toUpperCase()} ·{" "}
                                      {formatFileSize(item.bytes)}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-3 whitespace-nowrap space-y-1.5">
                                <div className="font-mono text-[11px] font-semibold text-[#081D2E]">
                                  {item.storedStatus}
                                </div>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium ${diagBadge.className}`}
                                >
                                  {diagBadge.label}
                                </span>
                                {item.storedStatus !== item.expectedStatus && (
                                  <div className="text-[10px] font-mono text-amber-800">
                                    Expected: {item.expectedStatus}
                                  </div>
                                )}
                              </td>

                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <div className="font-mono text-xs font-semibold text-[#081D2E]">
                                  {item.totalReferences}
                                </div>
                                {item.totalReferences > 0 ? (
                                  <div className="text-[10px] text-[#64717C] mt-0.5 space-y-0.5">
                                    {item.referencesByModel.publications > 0 && (
                                      <div>Pubs: {item.referencesByModel.publications}</div>
                                    )}
                                    {item.referencesByModel.journals > 0 && (
                                      <div>Journals: {item.referencesByModel.journals}</div>
                                    )}
                                    {item.referencesByModel.journalIssues > 0 && (
                                      <div>Issues: {item.referencesByModel.journalIssues}</div>
                                    )}
                                    {item.referencesByModel.authors > 0 && (
                                      <div>Authors: {item.referencesByModel.authors}</div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-[#64717C] mt-0.5">No content refs</div>
                                )}
                              </td>

                              <td className="py-3.5 px-3 whitespace-nowrap space-y-1">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${cldBadge.className}`}
                                >
                                  {cldBadge.label}
                                </span>
                                {item.cloudinaryStatus.cloudinaryResourceType && (
                                  <div className="text-[10px] font-mono text-[#64717C]">
                                    type: {item.cloudinaryStatus.cloudinaryResourceType}
                                  </div>
                                )}
                              </td>

                              <td className="py-3.5 px-3 max-w-[240px]">
                                {item.cloudinaryStatus.metadataDifferences &&
                                  item.cloudinaryStatus.metadataDifferences.length > 0 ? (
                                  <ul className="space-y-1 text-[11px] text-amber-900">
                                    {item.cloudinaryStatus.metadataDifferences.map((diff, idx) => (
                                      <li key={idx} className="leading-snug">
                                        {diff}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span className="text-[11px] text-[#64717C]">None</span>
                                )}
                              </td>

                              <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                                <div className="font-mono text-xs text-[#081D2E]">
                                  {formatAge(item.ageHours, item.ageDays)}
                                </div>
                                <div className="text-[10px] text-[#64717C] mt-0.5">
                                  {formatArchiveDate(
                                    typeof item.createdAt === "string"
                                      ? item.createdAt
                                      : item.createdAt.toISOString()
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="lg:hidden divide-y divide-[#D9DEE2]/70">
                    {items.map((item) => {
                      const cldBadge = getCloudinaryBadge(item.cloudinaryStatus.classification);
                      const diagBadge = getDiagnosticCallout(item);
                      return (
                        <div key={item.id} className="p-4 space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-sans font-medium text-[#081D2E] break-all">
                                {item.originalFilename}
                              </p>
                              <p className="text-[10px] font-mono text-[#64717C] break-all mt-0.5">
                                {item.publicId}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-[#64717C] shrink-0">
                              {formatAge(item.ageHours, item.ageDays)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-[#F7F7F7] border border-[#D9DEE2] font-mono text-[10px] text-[#081D2E]">
                              DB: {item.storedStatus}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium ${diagBadge.className}`}
                            >
                              {diagBadge.label}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium ${cldBadge.className}`}
                            >
                              {cldBadge.label}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 text-[11px] text-[#64717C]">
                            <span>{getMediaFolderLabel(item.folder)}</span>
                            <span className="font-mono text-[#081D2E]">
                              {item.totalReferences} {item.totalReferences === 1 ? "ref" : "refs"}
                            </span>
                          </div>

                          {item.storedStatus !== item.expectedStatus && (
                            <p className="text-[11px] font-mono text-amber-800">
                              Expected DB status: {item.expectedStatus}
                            </p>
                          )}

                          {item.cloudinaryStatus.metadataDifferences &&
                            item.cloudinaryStatus.metadataDifferences.length > 0 && (
                              <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 space-y-1">
                                <p className="text-[10px] font-mono uppercase text-amber-900 font-semibold">
                                  Metadata Differences
                                </p>
                                {item.cloudinaryStatus.metadataDifferences.map((diff, idx) => (
                                  <p key={idx} className="text-[11px] text-amber-950">
                                    {diff}
                                  </p>
                                ))}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="px-5 py-3 border-t border-[#D9DEE2] bg-[#F7F7F7]/50 flex items-center justify-between gap-2">
                      <span className="text-xs font-sans text-[#64717C]">
                        Page <span className="font-mono text-[#081D2E]">{pagination.page}</span> of{" "}
                        <span className="font-mono text-[#081D2E]">{pagination.totalPages}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={pagination.page <= 1}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9DEE2] bg-white text-xs font-sans text-[#081D2E] disabled:opacity-40 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Previous</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                          disabled={pagination.page >= pagination.totalPages}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D9DEE2] bg-white text-xs font-sans text-[#081D2E] disabled:opacity-40 cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {(unregistered.length > 0 || showUnregisteredOnly) && (
            <section
              aria-label="Unregistered Cloudinary resources"
              className="bg-white rounded-xl border border-[#D9DEE2] overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-[#D9DEE2] bg-indigo-50/50 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-indigo-800" />
                  <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.12em] text-indigo-950">
                    Cloudinary Resources Without Database Records ({unregistered.length})
                  </h3>
                </div>
                <span className="text-[11px] font-sans text-indigo-900">
                  Approved AIPP folders only · Read-only observation
                </span>
              </div>

              {unregistered.length === 0 ? (
                <div className="p-8 text-center text-xs font-sans text-[#64717C]">
                  No unregistered Cloudinary resources match the active folder and media type filters.
                </div>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F7F7F7] border-b border-[#D9DEE2] text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-[#64717C]">
                          <th className="py-3 pl-5 pr-3">Public ID &amp; Folder</th>
                          <th className="py-3 px-3">Type / Format</th>
                          <th className="py-3 px-3">Size</th>
                          <th className="py-3 px-3">Classification</th>
                          <th className="py-3 px-3">Upload Age</th>
                          <th className="py-3 pl-3 pr-5 text-right">Inspect</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9DEE2]/70 text-xs font-sans">
                        {unregistered.map((res) => {
                          const resFolder = extractFolderFromPublicId(res.public_id);
                          return (
                            <tr key={`${res.resource_type}:${res.public_id}`} className="hover:bg-[#F7F7F7]/60">
                              <td className="py-3 pl-5 pr-3 max-w-[340px]">
                                <p className="font-mono text-[11px] text-[#081D2E] truncate" title={res.public_id}>
                                  {res.public_id}
                                </p>
                                <p className="text-[10px] text-[#64717C]">
                                  {getMediaFolderLabel(resFolder)}
                                </p>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-[#0D2C49]">
                                {res.resource_type} / {(res.format || "unknown").toUpperCase()}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap text-[#64717C]">
                                {formatFileSize(res.bytes)}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-medium bg-indigo-50 text-indigo-800 border-indigo-200">
                                  No DB Record
                                </span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-[#081D2E]">
                                {formatAge(res.ageHours, res.ageDays)}
                              </td>
                              <td className="py-3 pl-3 pr-5 text-right whitespace-nowrap">
                                <a
                                  href={res.secure_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0D2C49] hover:underline"
                                >
                                  <span>Open</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden divide-y divide-[#D9DEE2]/70">
                    {unregistered.map((res) => {
                      const resFolder = extractFolderFromPublicId(res.public_id);
                      return (
                        <div key={`${res.resource_type}:${res.public_id}`} className="p-4 space-y-2">
                          <p className="font-mono text-[11px] text-[#081D2E] break-all">
                            {res.public_id}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64717C]">
                            <span>{getMediaFolderLabel(resFolder)}</span>
                            <span>·</span>
                            <span className="font-mono uppercase">{res.format || "unknown"}</span>
                            <span>·</span>
                            <span>{formatFileSize(res.bytes)}</span>
                            <span>·</span>
                            <span className="font-mono">{formatAge(res.ageHours, res.ageDays)}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium bg-indigo-50 text-indigo-800 border-indigo-200">
                              Cloudinary Only · No DB Record
                            </span>
                            <a
                              href={res.secure_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#0D2C49] hover:underline"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          )}
        </>
      ) : null}
    </div>
  );
}
