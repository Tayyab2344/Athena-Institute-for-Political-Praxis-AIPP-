"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  FileText,
  FolderOpen,
  Trash2,
  ExternalLink,
  Link2
} from "lucide-react";
import {
  MEDIA_FIELD_CONFIGS,
  MediaFieldTarget,
  SelectedMediaAsset
} from "@/lib/media/selection";
import { formatFileSize, isSafeCloudinaryUrl } from "@/lib/media/preview";
import MediaPreviewThumb from "./MediaPreviewThumb";
import MediaSelectorModal from "./MediaSelectorModal";

interface MediaAssetFieldProps {
  field: MediaFieldTarget;
  label?: string;
  helperText?: string;
  assetId: string | null;
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  canViewMedia: boolean;
  canUpload: boolean;
  onSelectAsset: (asset: SelectedMediaAsset) => void;
  onClear: () => void;
  onLegacyUrlChange?: (url: string) => void;
}

export default function MediaAssetField({
  field,
  label,
  helperText,
  assetId,
  url,
  fileName,
  fileSize,
  mimeType,
  canViewMedia,
  canUpload,
  onSelectAsset,
  onClear,
  onLegacyUrlChange
}: MediaAssetFieldProps) {
  const fieldConfig = MEDIA_FIELD_CONFIGS[field];
  const isPdf = fieldConfig.allowedMediaType === "DOCUMENT";

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [showLegacyInput, setShowLegacyInput] = useState(false);

  const hasMedia = Boolean(assetId || url.trim());
  const isTrackedAsset = Boolean(assetId);
  const displayName = fileName || (url ? url.split("/").pop() || url : "");
  const formatHint = isPdf
    ? "pdf"
    : mimeType?.includes("png")
      ? "png"
      : mimeType?.includes("webp")
        ? "webp"
        : "jpg";

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E]">
          {label || fieldConfig.label}
        </label>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#64717C]">
          {fieldConfig.allowedMediaType}
        </span>
      </div>

      {hasMedia ? (
        <div className="rounded-xl border border-[#D9DEE2] bg-[#F7F7F7] p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row items-start gap-3.5">
            <div className="w-full sm:w-36 rounded-lg border border-[#D9DEE2] overflow-hidden bg-white shrink-0">
              <MediaPreviewThumb
                mediaType={fieldConfig.allowedMediaType}
                secureUrl={url}
                originalFilename={displayName || fieldConfig.label}
                format={formatHint}
                variant="card"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                {isTrackedAsset ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0D2C49]/10 border border-[#0D2C49]/20 text-[10px] font-sans font-semibold text-[#0D2C49]">
                    Media Library Asset
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B09C4B]/15 border border-[#B09C4B]/35 text-[10px] font-sans font-semibold text-[#6D5D25]">
                    Legacy External URL
                  </span>
                )}
              </div>

              <p
                className="text-xs font-sans font-medium text-[#081D2E] break-all"
                title={displayName || url}
              >
                {displayName || url}
              </p>

              <div className="flex items-center gap-2 flex-wrap text-[11px] font-sans text-[#64717C]">
                {fileSize && fileSize > 0 ? <span>{formatFileSize(fileSize)}</span> : null}
                {mimeType ? (
                  <>
                    {fileSize && fileSize > 0 ? <span className="text-[#D9DEE2]">·</span> : null}
                    <span className="font-mono text-[10px]">{mimeType}</span>
                  </>
                ) : null}
              </div>

              {url && (isSafeCloudinaryUrl(url) || url.startsWith("https://")) && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-[#0D2C49] hover:underline pt-0.5"
                >
                  <span>{isPdf ? "Open PDF Preview" : "Open Full Image"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D9DEE2]/80">
            <button
              type="button"
              disabled={!canViewMedia}
              onClick={() => setSelectorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Replace from Media Library</span>
            </button>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg border border-rose-200 bg-white text-rose-700 text-xs font-sans font-medium hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isPdf ? "Remove PDF" : "Remove Image"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#D9DEE2] bg-[#F7F7F7] p-5 text-center space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#D9DEE2] mx-auto flex items-center justify-center text-[#0D2C49]">
            {isPdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-sans font-medium text-[#081D2E]">
              No {isPdf ? "PDF document" : "image"} attached
            </p>
            <p className="text-[11px] font-sans text-[#64717C]">
              {helperText ||
                (isPdf
                  ? "Select an existing PDF from the Media Library or upload a new document (up to 25 MB)."
                  : "Select an existing image from the Media Library or upload a new JPEG, PNG, or WebP (up to 10 MB).")}
            </p>
          </div>

          <div className="pt-1 flex items-center justify-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={!canViewMedia}
              onClick={() => setSelectorOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Choose from Media Library</span>
            </button>
          </div>

          {!canViewMedia && (
            <p className="text-[11px] font-sans text-[#6D5D25]">
              Media Library access requires the view_media permission.
            </p>
          )}
        </div>
      )}

      {onLegacyUrlChange && (
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setShowLegacyInput((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-sans text-[#64717C] hover:text-[#0D2C49] cursor-pointer"
          >
            <Link2 className="w-3 h-3" />
            <span>
              {showLegacyInput
                ? "Hide external URL input"
                : "Or specify external URL (legacy)"}
            </span>
          </button>

          {showLegacyInput && (
            <input
              type="text"
              value={isTrackedAsset ? "" : url}
              onChange={(e) => onLegacyUrlChange(e.target.value)}
              placeholder="https://..."
              aria-label={`Legacy external URL for ${label || fieldConfig.label}`}
              className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
            />
          )}
        </div>
      )}

      {selectorOpen && canViewMedia && (
        <MediaSelectorModal
          isOpen={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          field={field}
          currentAssetId={assetId}
          canUpload={canUpload}
          onSelect={onSelectAsset}
        />
      )}
    </div>
  );
}

