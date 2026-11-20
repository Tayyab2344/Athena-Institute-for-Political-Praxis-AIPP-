import type { CatalogAssetItem } from "@/lib/media/catalog";
import {
  OperationalUploadFolder,
  isAssociableMediaFolder
} from "@/lib/media/folders";

export type MediaFieldTarget =
  | "publication_cover"
  | "publication_pdf"
  | "journal_cover"
  | "journal_issue_cover"
  | "journal_issue_pdf"
  | "author_photo";

export interface MediaFieldConfig {
  field: MediaFieldTarget;
  label: string;
  allowedMediaType: "IMAGE" | "DOCUMENT";
  defaultUploadFolder: OperationalUploadFolder;
}

export const MEDIA_FIELD_CONFIGS: Record<MediaFieldTarget, MediaFieldConfig> = {
  publication_cover: {
    field: "publication_cover",
    label: "Publication Cover Image",
    allowedMediaType: "IMAGE",
    defaultUploadFolder: "aipp/publications/covers"
  },
  publication_pdf: {
    field: "publication_pdf",
    label: "Publication PDF Document",
    allowedMediaType: "DOCUMENT",
    defaultUploadFolder: "aipp/publications/documents"
  },
  journal_cover: {
    field: "journal_cover",
    label: "Journal Cover Image",
    allowedMediaType: "IMAGE",
    defaultUploadFolder: "aipp/journals/covers"
  },
  journal_issue_cover: {
    field: "journal_issue_cover",
    label: "Journal Issue Cover Image",
    allowedMediaType: "IMAGE",
    defaultUploadFolder: "aipp/journals/covers"
  },
  journal_issue_pdf: {
    field: "journal_issue_pdf",
    label: "Journal Issue PDF Document",
    allowedMediaType: "DOCUMENT",
    defaultUploadFolder: "aipp/journals/documents"
  },
  author_photo: {
    field: "author_photo",
    label: "Author Portrait Photograph",
    allowedMediaType: "IMAGE",
    defaultUploadFolder: "aipp/authors/avatars"
  }
};

export interface SelectedMediaAsset {
  id: string;
  publicId: string;
  mediaType: "IMAGE" | "DOCUMENT";
  secureUrl: string;
  originalFilename: string;
  format: string;
  mimeType: string;
  bytes: number;
  width: number | null;
  height: number | null;
  pages: number | null;
  folder: string;
}

export interface AssetEligibilityResult {
  selectable: boolean;
  reason: string | null;
}

export function getAssetSelectionEligibility(
  asset: Pick<CatalogAssetItem, "mediaType" | "storedStatus" | "folder">,
  allowedMediaType: "IMAGE" | "DOCUMENT"
): AssetEligibilityResult {
  if (asset.mediaType !== allowedMediaType) {
    return {
      selectable: false,
      reason:
        allowedMediaType === "IMAGE"
          ? "Incompatible type: requires an IMAGE asset. PDF documents cannot be selected for image fields."
          : "Incompatible type: requires a DOCUMENT (PDF) asset. Images cannot be selected for PDF fields."
    };
  }

  if (asset.storedStatus !== "UPLOADED" && asset.storedStatus !== "ATTACHED") {
    return {
      selectable: false,
      reason: `Unavailable status (${asset.storedStatus}): only UPLOADED or ATTACHED assets can be selected.`
    };
  }

  if (!isAssociableMediaFolder(asset.folder)) {
    return {
      selectable: false,
      reason: `Unapproved folder (${asset.folder}): asset is outside approved AIPP media folders.`
    };
  }

  return {
    selectable: true,
    reason: null
  };
}

