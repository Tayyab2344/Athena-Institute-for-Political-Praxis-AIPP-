import type { CatalogReferenceClassification } from "@/lib/media/catalog";

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  const decimals = unitIndex === 0 ? 0 : value >= 100 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

export function formatArchiveDate(iso: string): string {
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) {
    return "Unknown date";
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function formatArchiveDateTime(iso: string): string {
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) {
    return "Unknown date";
  }
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function isSafeCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export function getCloudinaryPdfThumbnailUrl(secureUrl: string): string | null {
  if (!isSafeCloudinaryUrl(secureUrl)) {
    return null;
  }
  const marker = "/image/upload/";
  const idx = secureUrl.indexOf(marker);
  if (idx === -1) {
    return null;
  }
  const prefix = secureUrl.slice(0, idx + marker.length);
  const rest = secureUrl.slice(idx + marker.length);
  const transformedRest = rest.replace(/\.pdf(\?.*)?$/i, ".jpg$1");
  return `${prefix}pg_1,w_480,c_limit,f_jpg,q_auto/${transformedRest}`;
}

export function getCloudinaryImageThumbnailUrl(
  secureUrl: string,
  width = 480
): string | null {
  if (!isSafeCloudinaryUrl(secureUrl)) {
    return null;
  }
  const marker = "/image/upload/";
  const idx = secureUrl.indexOf(marker);
  if (idx === -1) {
    return secureUrl;
  }
  const prefix = secureUrl.slice(0, idx + marker.length);
  const rest = secureUrl.slice(idx + marker.length);
  return `${prefix}w_${width},c_limit,f_auto,q_auto/${rest}`;
}

export interface ClassificationBadgeStyle {
  label: string;
  className: string;
  dotClassName: string;
}

export function getClassificationBadge(
  classification: CatalogReferenceClassification
): ClassificationBadgeStyle {
  switch (classification) {
    case "ATTACHED":
      return {
        label: "Attached",
        className: "bg-[#0D2C49]/8 text-[#0D2C49] border-[#0D2C49]/20",
        dotClassName: "bg-[#0D2C49]"
      };
    case "UPLOADED":
      return {
        label: "Unreferenced",
        className: "bg-[#F7F7F7] text-[#64717C] border-[#D9DEE2]",
        dotClassName: "bg-[#64717C]/60"
      };
    case "STATUS_MISMATCH":
      return {
        label: "Status Mismatch",
        className: "bg-[#B09C4B]/15 text-[#6D5D25] border-[#B09C4B]/40",
        dotClassName: "bg-[#B09C4B]"
      };
    case "ARCHIVED":
      return {
        label: "Archived",
        className: "bg-slate-100 text-slate-600 border-slate-200",
        dotClassName: "bg-slate-400"
      };
    case "DELETED":
      return {
        label: "Deleted",
        className: "bg-rose-50 text-rose-800 border-rose-200",
        dotClassName: "bg-rose-600"
      };
  }
}

