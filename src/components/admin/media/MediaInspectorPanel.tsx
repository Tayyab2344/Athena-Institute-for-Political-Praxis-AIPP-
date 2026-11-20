"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  FileText,
  AlertTriangle,
  RefreshCw,
  Link2,
  BookOpen,
  User as UserIcon,
  FileSpreadsheet,
  Eye
} from "lucide-react";
import type { MediaAssetDetailResponse, MediaAssetReferenceDetail } from "@/lib/media/catalog";
import {
  formatArchiveDateTime,
  formatFileSize,
  getClassificationBadge,
  isSafeCloudinaryUrl
} from "@/lib/media/preview";
import MediaPreviewThumb from "./MediaPreviewThumb";

interface MediaInspectorPanelProps {
  assetId: string | null;
  detail: MediaAssetDetailResponse | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

function subscribeDesktopMedia(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getDesktopMediaSnapshot() {
  if (typeof window === "undefined") return true;
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function getDesktopMediaServerSnapshot() {
  return true;
}

export default function MediaInspectorPanel({
  assetId,
  detail,
  loading,
  error,
  onClose,
  onRetry
}: MediaInspectorPanelProps) {
  const isDesktop = useSyncExternalStore(
    subscribeDesktopMedia,
    getDesktopMediaSnapshot,
    getDesktopMediaServerSnapshot
  );
  const [copiedState, setCopiedState] = useState<{ assetId: string; key: string } | null>(null);
  const [pdfReaderAssetId, setPdfReaderAssetId] = useState<string | null>(null);

  const showPdfReader = Boolean(assetId && pdfReaderAssetId === assetId);
  const copiedKey = copiedState && copiedState.assetId === assetId ? copiedState.key : null;

  useEffect(() => {
    if (!assetId) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [assetId, onClose]);

  if (!assetId) {
    return null;
  }

  const handleCopy = async (key: string, value: string) => {
    const activeAssetId = assetId;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedState({ assetId: activeAssetId, key });
      setTimeout(() => {
        setCopiedState((current) =>
          current && current.assetId === activeAssetId && current.key === key ? null : current
        );
      }, 2000);
    } catch {
      setCopiedState(null);
    }
  };

  const getModelIcon = (model: MediaAssetReferenceDetail["model"]) => {
    switch (model) {
      case "Publication":
        return <FileText className="w-3.5 h-3.5 text-[#0D2C49] shrink-0" />;
      case "Journal":
      case "JournalIssue":
        return <BookOpen className="w-3.5 h-3.5 text-[#0D2C49] shrink-0" />;
      case "Author":
        return <UserIcon className="w-3.5 h-3.5 text-[#0D2C49] shrink-0" />;
      default:
        return <FileSpreadsheet className="w-3.5 h-3.5 text-[#0D2C49] shrink-0" />;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-6 space-y-5 animate-pulse">
          <div className="h-44 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2]" />
          <div className="space-y-2">
            <div className="h-5 w-3/4 rounded bg-[#F7F7F7]" />
            <div className="h-3 w-1/2 rounded bg-[#F7F7F7]" />
          </div>
          <div className="space-y-2.5 pt-2 border-t border-[#D9DEE2]">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div key={idx} className="flex justify-between gap-4">
                <div className="h-3 w-24 rounded bg-[#F7F7F7]" />
                <div className="h-3 w-36 rounded bg-[#F7F7F7]" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (error || !detail) {
      return (
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 py-16">
          <AlertTriangle className="w-7 h-7 text-[#B09C4B]" />
          <div className="space-y-1">
            <p className="font-serif text-lg text-[#081D2E]">
              Unable to load asset details
            </p>
            <p className="text-xs font-sans text-[#64717C] max-w-xs">
              {error || "The requested media asset could not be loaded."}
            </p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    const badge = getClassificationBadge(detail.referenceClassification);
    const safeUrl = isSafeCloudinaryUrl(detail.secureUrl);

    return (
      <div className="divide-y divide-[#D9DEE2]">
        <div className="p-5 space-y-3">
          <div className="rounded-lg border border-[#D9DEE2] overflow-hidden bg-[#F7F7F7]">
            {detail.mediaType === "DOCUMENT" && showPdfReader && safeUrl ? (
              <div className="w-full h-80 bg-[#081D2E]">
                <iframe
                  src={detail.secureUrl}
                  title={detail.originalFilename}
                  className="w-full h-full border-none"
                />
              </div>
            ) : (
              <MediaPreviewThumb
                mediaType={detail.mediaType}
                secureUrl={detail.secureUrl}
                originalFilename={detail.originalFilename}
                format={detail.format}
                pages={detail.pages}
                width={detail.width}
                height={detail.height}
                variant="inspector"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {safeUrl && (
              <a
                href={detail.secureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9DEE2] bg-white text-xs font-sans font-medium text-[#081D2E] hover:border-[#0D2C49] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0D2C49]" />
                <span>{detail.mediaType === "DOCUMENT" ? "Open PDF" : "Open Original"}</span>
              </a>
            )}
            {detail.mediaType === "DOCUMENT" && safeUrl && (
              <button
                type="button"
                onClick={() =>
                  setPdfReaderAssetId((prev) => (prev === assetId ? null : assetId))
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9DEE2] bg-white text-xs font-sans font-medium text-[#081D2E] hover:border-[#0D2C49] transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#0D2C49]" />
                <span>{showPdfReader ? "Show Thumbnail" : "Inline Reader"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleCopy("url", detail.secureUrl)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9DEE2] bg-white text-xs font-sans font-medium text-[#64717C] hover:text-[#081D2E] hover:border-[#0D2C49] transition-colors cursor-pointer"
            >
              {copiedKey === "url" ? (
                <Check className="w-3.5 h-3.5 text-emerald-700" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedKey === "url" ? "URL Copied" : "Copy URL"}</span>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-lg font-medium text-[#081D2E] leading-snug break-all">
              {detail.originalFilename}
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-sans font-semibold uppercase tracking-wider shrink-0 ${badge.className}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClassName}`} />
              {badge.label}
            </span>
          </div>

          {detail.referenceClassification === "STATUS_MISMATCH" && (
            <div className="p-3 rounded-lg bg-[#B09C4B]/10 border border-[#B09C4B]/40 text-xs font-sans text-[#081D2E] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B09C4B] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Stored status differs from live references</p>
                <p className="text-[11px] text-[#64717C] mt-0.5">
                  Stored as <span className="font-mono text-[#081D2E]">{detail.storedStatus}</span>; expected{" "}
                  <span className="font-mono text-[#081D2E]">{detail.expectedStatus}</span> based on{" "}
                  {detail.totalReferences} active {detail.totalReferences === 1 ? "reference" : "references"}.
                </p>
              </div>
            </div>
          )}

          <dl className="divide-y divide-[#D9DEE2]/60 text-xs font-sans">
            <div className="py-2 flex items-center justify-between gap-4">
              <dt className="text-[#64717C]">Media Type</dt>
              <dd className="text-[#081D2E] font-medium">
                {detail.mediaType === "IMAGE" ? "Image" : "Document (PDF)"}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-4">
              <dt className="text-[#64717C]">Delivered Format</dt>
              <dd className="font-mono text-[11px] uppercase text-[#081D2E]">{detail.format}</dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-4">
              <dt className="text-[#64717C]">Original MIME Type</dt>
              <dd className="font-mono text-[11px] text-[#081D2E]">{detail.mimeType}</dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-4">
              <dt className="text-[#64717C]">File Size</dt>
              <dd className="text-[#081D2E] font-medium" title={`${detail.bytes.toLocaleString()} bytes`}>
                {formatFileSize(detail.bytes)}
              </dd>
            </div>
            {detail.mediaType === "IMAGE" && detail.width && detail.height && (
              <div className="py-2 flex items-center justify-between gap-4">
                <dt className="text-[#64717C]">Dimensions</dt>
                <dd className="font-mono text-[11px] text-[#081D2E]">
                  {detail.width} × {detail.height} px
                </dd>
              </div>
            )}
            {detail.mediaType === "DOCUMENT" && detail.pages !== null && (
              <div className="py-2 flex items-center justify-between gap-4">
                <dt className="text-[#64717C]">Pages</dt>
                <dd className="text-[#081D2E] font-medium">{detail.pages}</dd>
              </div>
            )}
            <div className="py-2 flex items-center justify-between gap-4">
              <dt className="text-[#64717C]">Stored Status</dt>
              <dd className="font-mono text-[11px] text-[#081D2E]">{detail.storedStatus}</dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-4">
              <dt className="text-[#64717C]">Uploaded</dt>
              <dd className="text-right text-[#081D2E]">
                <div>{formatArchiveDateTime(detail.createdAt)}</div>
                <div className="text-[10px] text-[#64717C]">
                  {detail.ageDays >= 1 ? `${detail.ageDays}d ago` : `${detail.ageHours}h ago`}
                  {detail.uploadedBy ? ` · ${detail.uploadedBy.name}` : ""}
                </div>
              </dd>
            </div>
            <div className="py-2 flex items-start justify-between gap-4">
              <dt className="text-[#64717C] shrink-0">Folder</dt>
              <dd className="text-right min-w-0">
                <div className="text-[#081D2E] font-medium">{detail.folderLabel}</div>
                <div className="font-mono text-[10px] text-[#64717C] break-all">
                  {detail.folder}
                </div>
              </dd>
            </div>
            <div className="py-2 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-[#64717C]">Cloudinary Public ID</dt>
                <button
                  type="button"
                  onClick={() => handleCopy("publicId", detail.publicId)}
                  className="inline-flex items-center gap-1 text-[10px] text-[#0D2C49] hover:underline cursor-pointer"
                >
                  {copiedKey === "publicId" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-700" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <dd className="font-mono text-[11px] text-[#081D2E] bg-[#F7F7F7] px-2.5 py-1.5 rounded border border-[#D9DEE2]/80 break-all">
                {detail.publicId}
              </dd>
            </div>
            {detail.checksumSha256 && (
              <div className="py-2 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-[#64717C]">SHA-256 Checksum</dt>
                  <button
                    type="button"
                    onClick={() => handleCopy("checksum", detail.checksumSha256 || "")}
                    className="inline-flex items-center gap-1 text-[10px] text-[#0D2C49] hover:underline cursor-pointer"
                  >
                    {copiedKey === "checksum" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-700" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <dd
                  className="font-mono text-[11px] text-[#64717C] bg-[#F7F7F7] px-2.5 py-1.5 rounded border border-[#D9DEE2]/80 truncate"
                  title={detail.checksumSha256}
                >
                  {detail.checksumSha256}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-[#64717C] flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#0D2C49]" />
              <span>Content References</span>
            </h4>
            <span className="text-xs font-mono font-medium text-[#081D2E]">
              {detail.totalReferences}
            </span>
          </div>

          {detail.references.length === 0 ? (
            <div className="p-3.5 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2]/80 text-xs font-sans text-[#64717C]">
              Not currently referenced by any publication, journal, issue, or author profile.
            </div>
          ) : (
            <ul className="space-y-2">
              {detail.references.map((ref) => (
                <li
                  key={`${ref.model}-${ref.id}-${ref.field}`}
                  className="p-3 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {getModelIcon(ref.model)}
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#64717C]">
                        {ref.model === "JournalIssue" ? "Journal Issue" : ref.model}
                      </span>
                      <span className="text-[#D9DEE2]">·</span>
                      <span className="text-[10px] font-sans text-[#0D2C49] font-medium">
                        {ref.fieldLabel}
                      </span>
                    </div>
                    {ref.status && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white border border-[#D9DEE2] text-[#64717C] shrink-0">
                        {ref.status}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-[#081D2E] leading-snug break-words">
                    {ref.title}
                  </p>

                  {ref.subtitle && ref.subtitle !== ref.status && (
                    <p className="text-[11px] text-[#64717C] leading-snug">{ref.subtitle}</p>
                  )}

                  <div className="flex items-center gap-3 pt-1 text-[11px] font-sans">
                    {ref.adminHref ? (
                      <Link
                        href={ref.adminHref}
                        className="text-[#0D2C49] font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open in Admin</span>
                      </Link>
                    ) : (
                      <span className="text-[#64717C] italic">No admin editor page yet</span>
                    )}

                    {ref.publicHref && (
                      <Link
                        href={ref.publicHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#64717C] hover:text-[#0D2C49] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Public View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="text-[11px] font-sans text-[#64717C] pt-1 leading-relaxed">
            Asset status updates automatically when attached to or detached from institutional content.
          </p>
        </div>
      </div>
    );
  };

  if (isDesktop) {
    return (
      <aside
        aria-label="Asset detail inspector"
        className="flex flex-col w-[410px] xl:w-[440px] shrink-0 bg-white border border-[#D9DEE2] rounded-xl overflow-hidden sticky top-20 max-h-[calc(100vh-6.5rem)]"
      >
        <div className="h-12 px-5 border-b border-[#D9DEE2] flex items-center justify-between shrink-0 bg-white">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-[#0D2C49]">
            Asset Inspector
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close asset inspector"
            className="p-1.5 rounded-md text-[#64717C] hover:text-[#081D2E] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </aside>
    );
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 h-dvh flex justify-end">
      <div
        className="fixed inset-0 bg-[#081D2E]/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Asset detail inspector"
        className="relative z-10 w-full sm:w-[440px] max-w-full h-full bg-white flex flex-col border-l border-[#D9DEE2]"
      >
        <div className="h-14 px-5 border-b border-[#D9DEE2] flex items-center justify-between shrink-0 bg-white">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-[#0D2C49]">
            Asset Inspector
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close asset inspector"
            className="p-2 rounded-lg text-[#64717C] hover:text-[#081D2E] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
    </div>,
    document.body
  );
}

