import { prisma } from "@/lib/prisma";
import { MediaAssetStatus, MediaAssetType, MediaProvider } from "@prisma/client";
import { getMediaFolderLabel } from "@/lib/media/folders";

export type CatalogReferenceClassification =
  | "UPLOADED"
  | "ATTACHED"
  | "STATUS_MISMATCH"
  | "ARCHIVED"
  | "DELETED";

export type CatalogSortOption = "newest" | "oldest" | "largest" | "name";

export interface CatalogAssetItem {
  id: string;
  publicId: string;
  mediaType: MediaAssetType;
  provider: MediaProvider;
  secureUrl: string;
  originalFilename: string;
  format: string;
  mimeType: string;
  bytes: number;
  width: number | null;
  height: number | null;
  pages: number | null;
  folder: string;
  folderLabel: string;
  storedStatus: MediaAssetStatus;
  expectedStatus: MediaAssetStatus;
  referenceClassification: CatalogReferenceClassification;
  totalReferences: number;
  referencesByModel: {
    publications: number;
    journals: number;
    journalIssues: number;
    authors: number;
  };
  uploadedBy: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  ageHours: number;
  ageDays: number;
}

export interface MediaCatalogSummary {
  totalRegistered: number;
  images: number;
  documents: number;
  attached: number;
  unreferenced: number;
  statusMismatches: number;
  archived: number;
  deleted: number;
  byFolder: Record<string, number>;
}

export interface MediaCatalogResponse {
  summary: MediaCatalogSummary;
  items: CatalogAssetItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface MediaAssetReferenceDetail {
  model: "Publication" | "Journal" | "JournalIssue" | "Author";
  id: string;
  title: string;
  subtitle: string | null;
  slug: string | null;
  status: string | null;
  field: "coverImageAssetId" | "pdfAssetId" | "photoAssetId";
  fieldLabel: "Cover Image" | "PDF Document" | "Author Portrait";
  adminHref: string | null;
  publicHref: string | null;
}

export interface MediaAssetDetailResponse extends CatalogAssetItem {
  checksumSha256: string | null;
  references: MediaAssetReferenceDetail[];
}

function computeStatusClassification(
  storedStatus: MediaAssetStatus,
  totalReferences: number
): {
  expectedStatus: MediaAssetStatus;
  referenceClassification: CatalogReferenceClassification;
} {
  if (totalReferences > 0) {
    return {
      expectedStatus: MediaAssetStatus.ATTACHED,
      referenceClassification:
        storedStatus === MediaAssetStatus.ATTACHED ? "ATTACHED" : "STATUS_MISMATCH"
    };
  }

  if (storedStatus === MediaAssetStatus.ARCHIVED) {
    return {
      expectedStatus: MediaAssetStatus.ARCHIVED,
      referenceClassification: "ARCHIVED"
    };
  }

  if (storedStatus === MediaAssetStatus.DELETED) {
    return {
      expectedStatus: MediaAssetStatus.DELETED,
      referenceClassification: "DELETED"
    };
  }

  if (storedStatus === MediaAssetStatus.UPLOADED) {
    return {
      expectedStatus: MediaAssetStatus.UPLOADED,
      referenceClassification: "UPLOADED"
    };
  }

  return {
    expectedStatus: MediaAssetStatus.UPLOADED,
    referenceClassification: "STATUS_MISMATCH"
  };
}

function computeAgeMetrics(createdAt: Date, nowMs: number): { ageHours: number; ageDays: number } {
  const ageMs = Math.max(0, nowMs - createdAt.getTime());
  return {
    ageHours: Math.round((ageMs / (1000 * 60 * 60)) * 10) / 10,
    ageDays: Math.round((ageMs / (1000 * 60 * 60 * 24)) * 10) / 10
  };
}

export async function listMediaCatalog(options?: {
  page?: number;
  limit?: number;
  search?: string;
  mediaType?: MediaAssetType;
  status?: MediaAssetStatus;
  folder?: string;
  referenceClassification?: CatalogReferenceClassification;
  sort?: CatalogSortOption;
  selectableOnly?: boolean;
}): Promise<MediaCatalogResponse> {
  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 24));
  const sort: CatalogSortOption = options?.sort || "newest";
  const normalizedSearch = options?.search?.trim().toLowerCase() || "";

  const rows = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true
        }
      },
      _count: {
        select: {
          publicationCovers: true,
          publicationPdfs: true,
          journalCovers: true,
          journalIssueCovers: true,
          journalIssuePdfs: true,
          authorPhotos: true
        }
      }
    }
  });

  const nowMs = Date.now();

  const summary: MediaCatalogSummary = {
    totalRegistered: rows.length,
    images: 0,
    documents: 0,
    attached: 0,
    unreferenced: 0,
    statusMismatches: 0,
    archived: 0,
    deleted: 0,
    byFolder: {}
  };

  const catalogItems: CatalogAssetItem[] = rows.map((asset) => {
    const pubCount = asset._count.publicationCovers + asset._count.publicationPdfs;
    const journalCount = asset._count.journalCovers;
    const issueCount = asset._count.journalIssueCovers + asset._count.journalIssuePdfs;
    const authorCount = asset._count.authorPhotos;
    const totalReferences = pubCount + journalCount + issueCount + authorCount;

    const { expectedStatus, referenceClassification } = computeStatusClassification(
      asset.status,
      totalReferences
    );

    if (asset.mediaType === MediaAssetType.IMAGE) {
      summary.images++;
    } else if (asset.mediaType === MediaAssetType.DOCUMENT) {
      summary.documents++;
    }

    summary.byFolder[asset.folder] = (summary.byFolder[asset.folder] || 0) + 1;

    if (referenceClassification === "ATTACHED") {
      summary.attached++;
    } else if (referenceClassification === "UPLOADED") {
      summary.unreferenced++;
    } else if (referenceClassification === "STATUS_MISMATCH") {
      summary.statusMismatches++;
    } else if (referenceClassification === "ARCHIVED") {
      summary.archived++;
    } else if (referenceClassification === "DELETED") {
      summary.deleted++;
    }

    const { ageHours, ageDays } = computeAgeMetrics(asset.createdAt, nowMs);

    return {
      id: asset.id,
      publicId: asset.publicId,
      mediaType: asset.mediaType,
      provider: asset.provider,
      secureUrl: asset.secureUrl,
      originalFilename: asset.originalFilename,
      format: asset.format,
      mimeType: asset.mimeType,
      bytes: asset.bytes,
      width: asset.width,
      height: asset.height,
      pages: asset.pages,
      folder: asset.folder,
      folderLabel: getMediaFolderLabel(asset.folder),
      storedStatus: asset.status,
      expectedStatus,
      referenceClassification,
      totalReferences,
      referencesByModel: {
        publications: pubCount,
        journals: journalCount,
        journalIssues: issueCount,
        authors: authorCount
      },
      uploadedBy: asset.uploadedBy
        ? { id: asset.uploadedBy.id, name: asset.uploadedBy.name }
        : null,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
      ageHours,
      ageDays
    };
  });

  let filtered = catalogItems;

  if (options?.selectableOnly) {
    filtered = filtered.filter(
      (item) =>
        item.storedStatus === MediaAssetStatus.UPLOADED ||
        item.storedStatus === MediaAssetStatus.ATTACHED
    );
  }

  if (normalizedSearch) {
    filtered = filtered.filter(
      (item) =>
        item.originalFilename.toLowerCase().includes(normalizedSearch) ||
        item.publicId.toLowerCase().includes(normalizedSearch)
    );
  }

  if (options?.mediaType) {
    filtered = filtered.filter((item) => item.mediaType === options.mediaType);
  }

  if (options?.status) {
    filtered = filtered.filter((item) => item.storedStatus === options.status);
  }

  if (options?.folder) {
    filtered = filtered.filter((item) => item.folder === options.folder);
  }

  if (options?.referenceClassification) {
    filtered = filtered.filter(
      (item) => item.referenceClassification === options.referenceClassification
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
      case "largest":
        return b.bytes - a.bytes;
      case "name":
        return a.originalFilename.localeCompare(b.originalFilename, undefined, {
          sensitivity: "base"
        });
      case "newest":
      default:
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }
  });

  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const skip = (page - 1) * limit;
  const paginatedItems = sorted.slice(skip, skip + limit);

  return {
    summary,
    items: paginatedItems,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages
    }
  };
}

export async function getMediaAssetDetail(id: string): Promise<MediaAssetDetailResponse | null> {
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true
        }
      },
      publicationCovers: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true
        }
      },
      publicationPdfs: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true
        }
      },
      journalCovers: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true
        }
      },
      journalIssueCovers: {
        select: {
          id: true,
          journalId: true,
          title: true,
          volume: true,
          issue: true,
          status: true,
          journal: {
            select: {
              title: true,
              slug: true,
              status: true
            }
          }
        }
      },
      journalIssuePdfs: {
        select: {
          id: true,
          journalId: true,
          title: true,
          volume: true,
          issue: true,
          status: true,
          journal: {
            select: {
              title: true,
              slug: true,
              status: true
            }
          }
        }
      },
      authorPhotos: {
        select: {
          id: true,
          name: true,
          slug: true,
          affiliation: true
        }
      }
    }
  });

  if (!asset) {
    return null;
  }

  const references: MediaAssetReferenceDetail[] = [];

  for (const pub of asset.publicationCovers) {
    references.push({
      model: "Publication",
      id: pub.id,
      title: pub.title,
      subtitle: pub.status,
      slug: pub.slug,
      status: pub.status,
      field: "coverImageAssetId",
      fieldLabel: "Cover Image",
      adminHref: `/admin/publications/${pub.id}/edit`,
      publicHref: pub.status === "PUBLISHED" ? `/research/${pub.slug}` : null
    });
  }

  for (const pub of asset.publicationPdfs) {
    references.push({
      model: "Publication",
      id: pub.id,
      title: pub.title,
      subtitle: pub.status,
      slug: pub.slug,
      status: pub.status,
      field: "pdfAssetId",
      fieldLabel: "PDF Document",
      adminHref: `/admin/publications/${pub.id}/edit`,
      publicHref: pub.status === "PUBLISHED" ? `/research/${pub.slug}` : null
    });
  }

  for (const journal of asset.journalCovers) {
    references.push({
      model: "Journal",
      id: journal.id,
      title: journal.title,
      subtitle: journal.status,
      slug: journal.slug,
      status: journal.status,
      field: "coverImageAssetId",
      fieldLabel: "Cover Image",
      adminHref: `/admin/journals/${journal.id}/edit`,
      publicHref: journal.status === "PUBLISHED" ? `/journals/${journal.slug}` : null
    });
  }

  for (const issue of asset.journalIssueCovers) {
    const isPubliclyVisible =
      issue.status === "PUBLISHED" && issue.journal.status === "PUBLISHED";
    references.push({
      model: "JournalIssue",
      id: issue.id,
      title: issue.title,
      subtitle: `Vol. ${issue.volume}, Issue ${issue.issue} · ${issue.journal.title}`,
      slug: issue.journal.slug,
      status: issue.status,
      field: "coverImageAssetId",
      fieldLabel: "Cover Image",
      adminHref: `/admin/journals/${issue.journalId}/issues/${issue.id}/edit`,
      publicHref: isPubliclyVisible ? `/journals/${issue.journal.slug}` : null
    });
  }

  for (const issue of asset.journalIssuePdfs) {
    const isPubliclyVisible =
      issue.status === "PUBLISHED" && issue.journal.status === "PUBLISHED";
    references.push({
      model: "JournalIssue",
      id: issue.id,
      title: issue.title,
      subtitle: `Vol. ${issue.volume}, Issue ${issue.issue} · ${issue.journal.title}`,
      slug: issue.journal.slug,
      status: issue.status,
      field: "pdfAssetId",
      fieldLabel: "PDF Document",
      adminHref: `/admin/journals/${issue.journalId}/issues/${issue.id}/edit`,
      publicHref: isPubliclyVisible ? `/journals/${issue.journal.slug}` : null
    });
  }

  for (const author of asset.authorPhotos) {
    references.push({
      model: "Author",
      id: author.id,
      title: author.name,
      subtitle: author.affiliation || null,
      slug: author.slug,
      status: null,
      field: "photoAssetId",
      fieldLabel: "Author Portrait",
      adminHref: `/admin/authors/${author.id}/edit`,
      publicHref: null
    });
  }

  const totalReferences = references.length;
  const { expectedStatus, referenceClassification } = computeStatusClassification(
    asset.status,
    totalReferences
  );
  const { ageHours, ageDays } = computeAgeMetrics(asset.createdAt, Date.now());

  return {
    id: asset.id,
    publicId: asset.publicId,
    mediaType: asset.mediaType,
    provider: asset.provider,
    secureUrl: asset.secureUrl,
    originalFilename: asset.originalFilename,
    format: asset.format,
    mimeType: asset.mimeType,
    bytes: asset.bytes,
    width: asset.width,
    height: asset.height,
    pages: asset.pages,
    checksumSha256: asset.checksumSha256,
    folder: asset.folder,
    folderLabel: getMediaFolderLabel(asset.folder),
    storedStatus: asset.status,
    expectedStatus,
    referenceClassification,
    totalReferences,
    referencesByModel: {
      publications: asset.publicationCovers.length + asset.publicationPdfs.length,
      journals: asset.journalCovers.length,
      journalIssues: asset.journalIssueCovers.length + asset.journalIssuePdfs.length,
      authors: asset.authorPhotos.length
    },
    references,
    uploadedBy: asset.uploadedBy
      ? { id: asset.uploadedBy.id, name: asset.uploadedBy.name }
      : null,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
    ageHours,
    ageDays
  };
}

