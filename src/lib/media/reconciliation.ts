import { prisma } from "@/lib/prisma";
import { MediaAssetType, MediaAssetStatus, MediaProvider } from "@prisma/client";
import {
  ALLOWED_FOLDERS,
  listCloudinaryResources,
  CloudinaryResourceSummary
} from "@/lib/cloudinary";

export type ReferenceClassification =
  | "UPLOADED"
  | "ATTACHED"
  | "STATUS_MISMATCH"
  | "ARCHIVED"
  | "DELETED";

export type CloudinaryClassification =
  | "REGISTERED_AND_PRESENT"
  | "REGISTERED_BUT_MISSING_IN_CLOUDINARY"
  | "CLOUDINARY_UNREGISTERED"
  | "RESOURCE_TYPE_MISMATCH"
  | "METADATA_DIFFERENCE"
  | "CLOUDINARY_UNAVAILABLE";

export type OrphanFlag =
  | "UPLOADED_UNREFERENCED"
  | "INCONSISTENT_STATUS_UNREFERENCED"
  | "REFERENCED_BUT_MARKED_INCORRECTLY"
  | "DB_RECORD_MISSING_IN_CLOUDINARY";

export type EnumerationCompleteness = "COMPLETE" | "CAPPED" | "PARTIAL" | "FAILED";

export interface CloudinaryEnumerationStatus {
  completeness: EnumerationCompleteness;
  isComplete: boolean;
  capped: boolean;
  maxPagesPerResourceType: number;
  pagesFetched: {
    image: number;
    raw: number;
  };
  truncatedResourceTypes: Array<"image" | "raw">;
  failedResourceTypes: Array<"image" | "raw">;
  note?: string;
}

export interface ReconciliationCacheMetadata {
  hit: boolean;
  coalesced: boolean;
  ttlSeconds: number;
  cachedAt: string;
  expiresAt: string;
  lastSuccessfulAt: string | null;
}

export interface AssetReferenceInfo {
  model: "Publication" | "Journal" | "JournalIssue" | "Author";
  id: string;
  title?: string;
  field: "coverImageAssetId" | "pdfAssetId" | "photoAssetId";
}

export interface UnregisteredCloudinaryItem extends CloudinaryResourceSummary {
  classification: "CLOUDINARY_UNREGISTERED";
  ageHours: number;
  ageDays: number;
}

export interface ReconciledAsset {
  id: string;
  publicId: string;
  originalFilename: string;
  mediaType: MediaAssetType;
  provider: MediaProvider;
  format: string;
  mimeType: string;
  bytes: number;
  width: number | null;
  height: number | null;
  pages: number | null;
  folder: string;
  secureUrl: string;
  createdAt: Date;
  ageHours: number;
  ageDays: number;
  storedStatus: MediaAssetStatus;
  expectedStatus: MediaAssetStatus;
  referenceClassification: ReferenceClassification;
  orphanFlags: OrphanFlag[];
  totalReferences: number;
  referencesByModel: {
    publications: number;
    journals: number;
    journalIssues: number;
    authors: number;
  };
  references: AssetReferenceInfo[];
  cloudinaryStatus: {
    classification: CloudinaryClassification;
    existsInCloudinary: boolean;
    cloudinaryFormat?: string;
    cloudinaryResourceType?: string;
    cloudinaryBytes?: number;
    cloudinarySecureUrl?: string;
    metadataDifferences?: string[];
  };
}

export interface ReconciliationReport {
  generatedAt: string;
  cloudinaryApi: {
    status: "AVAILABLE" | "UNAVAILABLE";
    approvedFolders: readonly string[];
    scannedResourcesInApprovedFolders: number;
    limitation?: string;
    enumeration: CloudinaryEnumerationStatus;
  };
  summary: {
    totalRegistered: number;
    totalReferenced: number;
    totalUnreferenced: number;
    statusMismatches: number;
    missingInCloudinary: number;
    unregisteredInCloudinary: number;
    resourceTypeMismatches: number;
    metadataDifferences: number;
    byMediaType: Record<string, number>;
    byFolder: Record<string, number>;
    byStatus: Record<string, number>;
    orphanBreakdown: {
      uploadedUnreferenced: number;
      inconsistentStatusUnreferenced: number;
      referencedButMarkedIncorrectly: number;
      dbMissingInCloudinary: number;
      cloudinaryUnregistered: number;
    };
  };
  unregisteredCloudinaryResources: UnregisteredCloudinaryItem[];
  items: ReconciledAsset[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  cache?: ReconciliationCacheMetadata;
}

export interface ReconciliationSnapshot {
  generatedAt: string;
  cloudinaryApi: ReconciliationReport["cloudinaryApi"];
  summary: ReconciliationReport["summary"];
  unregisteredCloudinaryResources: UnregisteredCloudinaryItem[];
  allItems: ReconciledAsset[];
}

export interface ReconciliationFilterOptions {
  page?: number;
  limit?: number;
  folder?: string;
  mediaType?: MediaAssetType;
  referenceClassification?: ReferenceClassification;
  cloudinaryClassification?: CloudinaryClassification;
  status?: MediaAssetStatus;
}

export interface ReconciliationRunOptions extends ReconciliationFilterOptions {
  cloudinaryResourcesOverride?: CloudinaryResourceSummary[];
  listResourcesFn?: typeof listCloudinaryResources;
  maxCloudinaryPages?: number;
}

export const DEFAULT_MAX_CLOUDINARY_PAGES = 10;

function isWithinApprovedFolder(publicId: string): boolean {
  return ALLOWED_FOLDERS.some((folder) => publicId.startsWith(`${folder}/`));
}

async function fetchPaginatedCloudinaryResources(
  resourceType: "image" | "raw",
  listFn: typeof listCloudinaryResources,
  maxPages: number
): Promise<{
  resources: CloudinaryResourceSummary[];
  pagesFetched: number;
  capped: boolean;
}> {
  const collected: CloudinaryResourceSummary[] = [];
  let nextCursor: string | undefined = undefined;
  let pagesFetched = 0;
  let capped = false;

  while (pagesFetched < maxPages) {
    const response = await listFn({
      prefix: "aipp/",
      resourceType,
      maxResults: 500,
      nextCursor
    });
    collected.push(...response.resources);
    pagesFetched++;

    if (!response.next_cursor) {
      nextCursor = undefined;
      break;
    }

    nextCursor = response.next_cursor;
    if (pagesFetched >= maxPages) {
      capped = true;
    }
  }

  return {
    resources: collected,
    pagesFetched,
    capped
  };
}

export async function collectReconciliationSnapshot(options?: {
  cloudinaryResourcesOverride?: CloudinaryResourceSummary[];
  listResourcesFn?: typeof listCloudinaryResources;
  maxCloudinaryPages?: number;
}): Promise<ReconciliationSnapshot> {
  const maxPages = Math.max(1, options?.maxCloudinaryPages ?? DEFAULT_MAX_CLOUDINARY_PAGES);
  const listFn = options?.listResourcesFn ?? listCloudinaryResources;

  const allAssets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" }
  });
  const allPubs = await prisma.publication.findMany({
    select: { id: true, title: true, coverImageAssetId: true, pdfAssetId: true }
  });
  const allJournals = await prisma.journal.findMany({
    select: { id: true, title: true, coverImageAssetId: true }
  });
  const allIssues = await prisma.journalIssue.findMany({
    select: { id: true, title: true, coverImageAssetId: true, pdfAssetId: true }
  });
  const allAuthors = await prisma.author.findMany({
    select: { id: true, name: true, photoAssetId: true }
  });

  let cloudinaryResources: CloudinaryResourceSummary[] = [];
  let cloudinaryAvailable = true;
  let cloudinaryLimitation: string | undefined = undefined;
  const truncatedResourceTypes: Array<"image" | "raw"> = [];
  const failedResourceTypes: Array<"image" | "raw"> = [];
  const pagesFetched = { image: 0, raw: 0 };

  if (options?.cloudinaryResourcesOverride) {
    cloudinaryResources = options.cloudinaryResourcesOverride.filter((res) =>
      isWithinApprovedFolder(res.public_id)
    );
    pagesFetched.image = 1;
    pagesFetched.raw = 1;
  } else {
    const collectedAll: CloudinaryResourceSummary[] = [];

    try {
      const imageScan = await fetchPaginatedCloudinaryResources("image", listFn, maxPages);
      collectedAll.push(...imageScan.resources);
      pagesFetched.image = imageScan.pagesFetched;
      if (imageScan.capped) {
        truncatedResourceTypes.push("image");
      }
    } catch {
      failedResourceTypes.push("image");
    }

    try {
      const rawScan = await fetchPaginatedCloudinaryResources("raw", listFn, maxPages);
      collectedAll.push(...rawScan.resources);
      pagesFetched.raw = rawScan.pagesFetched;
      if (rawScan.capped) {
        truncatedResourceTypes.push("raw");
      }
    } catch {
      failedResourceTypes.push("raw");
    }

    if (failedResourceTypes.length === 2) {
      cloudinaryAvailable = false;
      cloudinaryLimitation = "Cloudinary Admin API resource listing is unavailable or restricted.";
      cloudinaryResources = [];
    } else {
      cloudinaryResources = collectedAll.filter((res) => isWithinApprovedFolder(res.public_id));
      if (failedResourceTypes.length > 0 && truncatedResourceTypes.length > 0) {
        cloudinaryLimitation = `Partial and capped Cloudinary scan: failed for ${failedResourceTypes.join(", ")} and reached ${maxPages}-page cap for ${truncatedResourceTypes.join(", ")}.`;
      } else if (failedResourceTypes.length > 0) {
        cloudinaryLimitation = `Partial Cloudinary scan: resource listing failed for ${failedResourceTypes.join(", ")}.`;
      } else if (truncatedResourceTypes.length > 0) {
        cloudinaryLimitation = `Cloudinary enumeration reached the ${maxPages}-page safety cap for ${truncatedResourceTypes.join(", ")}. Results are incomplete.`;
      }
    }
  }

  let completeness: EnumerationCompleteness = "COMPLETE";
  if (!cloudinaryAvailable || failedResourceTypes.length === 2) {
    completeness = "FAILED";
  } else if (failedResourceTypes.length > 0) {
    completeness = "PARTIAL";
  } else if (truncatedResourceTypes.length > 0) {
    completeness = "CAPPED";
  }

  const enumeration: CloudinaryEnumerationStatus = {
    completeness,
    isComplete: completeness === "COMPLETE",
    capped: truncatedResourceTypes.length > 0,
    maxPagesPerResourceType: maxPages,
    pagesFetched,
    truncatedResourceTypes,
    failedResourceTypes,
    note: cloudinaryLimitation
  };

  const cloudinaryMap = new Map<string, CloudinaryResourceSummary>();
  for (const res of cloudinaryResources) {
    if (!cloudinaryMap.has(res.public_id) || res.resource_type === "image") {
      cloudinaryMap.set(res.public_id, res);
    }
  }

  const now = Date.now();
  const dbPublicIdSet = new Set(allAssets.map((a) => a.publicId));
  const unregisteredCloudinaryResources: UnregisteredCloudinaryItem[] = cloudinaryResources
    .filter((res) => !dbPublicIdSet.has(res.public_id))
    .map((res) => {
      const createdMs = Date.parse(res.created_at);
      const ageMs = isNaN(createdMs) ? 0 : Math.max(0, now - createdMs);
      return {
        ...res,
        classification: "CLOUDINARY_UNREGISTERED",
        ageHours: Math.round((ageMs / (1000 * 60 * 60)) * 10) / 10,
        ageDays: Math.round((ageMs / (1000 * 60 * 60 * 24)) * 10) / 10
      };
    });

  const reconciledItems: ReconciledAsset[] = [];

  const summary = {
    totalRegistered: allAssets.length,
    totalReferenced: 0,
    totalUnreferenced: 0,
    statusMismatches: 0,
    missingInCloudinary: 0,
    unregisteredInCloudinary: unregisteredCloudinaryResources.length,
    resourceTypeMismatches: 0,
    metadataDifferences: 0,
    byMediaType: {
      IMAGE: 0,
      DOCUMENT: 0
    } as Record<string, number>,
    byFolder: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    orphanBreakdown: {
      uploadedUnreferenced: 0,
      inconsistentStatusUnreferenced: 0,
      referencedButMarkedIncorrectly: 0,
      dbMissingInCloudinary: 0,
      cloudinaryUnregistered: unregisteredCloudinaryResources.length
    }
  };

  for (const asset of allAssets) {
    summary.byMediaType[asset.mediaType] = (summary.byMediaType[asset.mediaType] || 0) + 1;
    summary.byFolder[asset.folder] = (summary.byFolder[asset.folder] || 0) + 1;
    summary.byStatus[asset.status] = (summary.byStatus[asset.status] || 0) + 1;

    const references: AssetReferenceInfo[] = [];

    for (const pub of allPubs) {
      if (pub.coverImageAssetId === asset.id) {
        references.push({
          model: "Publication",
          id: pub.id,
          title: pub.title,
          field: "coverImageAssetId"
        });
      }
      if (pub.pdfAssetId === asset.id) {
        references.push({
          model: "Publication",
          id: pub.id,
          title: pub.title,
          field: "pdfAssetId"
        });
      }
    }

    for (const journal of allJournals) {
      if (journal.coverImageAssetId === asset.id) {
        references.push({
          model: "Journal",
          id: journal.id,
          title: journal.title,
          field: "coverImageAssetId"
        });
      }
    }

    for (const issue of allIssues) {
      if (issue.coverImageAssetId === asset.id) {
        references.push({
          model: "JournalIssue",
          id: issue.id,
          title: issue.title,
          field: "coverImageAssetId"
        });
      }
      if (issue.pdfAssetId === asset.id) {
        references.push({
          model: "JournalIssue",
          id: issue.id,
          title: issue.title,
          field: "pdfAssetId"
        });
      }
    }

    for (const author of allAuthors) {
      if (author.photoAssetId === asset.id) {
        references.push({
          model: "Author",
          id: author.id,
          title: author.name,
          field: "photoAssetId"
        });
      }
    }

    const totalRefs = references.length;
    if (totalRefs > 0) {
      summary.totalReferenced++;
    } else {
      summary.totalUnreferenced++;
    }

    const orphanFlags: OrphanFlag[] = [];
    let expectedStatus: MediaAssetStatus = MediaAssetStatus.UPLOADED;
    let refClassification: ReferenceClassification = "UPLOADED";

    if (totalRefs > 0) {
      expectedStatus = MediaAssetStatus.ATTACHED;
      if (asset.status === MediaAssetStatus.ATTACHED) {
        refClassification = "ATTACHED";
      } else {
        refClassification = "STATUS_MISMATCH";
        summary.statusMismatches++;
        summary.orphanBreakdown.referencedButMarkedIncorrectly++;
        orphanFlags.push("REFERENCED_BUT_MARKED_INCORRECTLY");
      }
    } else {
      if (asset.status === MediaAssetStatus.ARCHIVED) {
        expectedStatus = MediaAssetStatus.ARCHIVED;
        refClassification = "ARCHIVED";
      } else if (asset.status === MediaAssetStatus.DELETED) {
        expectedStatus = MediaAssetStatus.DELETED;
        refClassification = "DELETED";
      } else if (asset.status === MediaAssetStatus.UPLOADED) {
        expectedStatus = MediaAssetStatus.UPLOADED;
        refClassification = "UPLOADED";
        summary.orphanBreakdown.uploadedUnreferenced++;
        orphanFlags.push("UPLOADED_UNREFERENCED");
      } else {
        expectedStatus = MediaAssetStatus.UPLOADED;
        refClassification = "STATUS_MISMATCH";
        summary.statusMismatches++;
        summary.orphanBreakdown.inconsistentStatusUnreferenced++;
        orphanFlags.push("INCONSISTENT_STATUS_UNREFERENCED");
      }
    }

    const cldResource = cloudinaryMap.get(asset.publicId);
    let cldClassification: CloudinaryClassification = "REGISTERED_AND_PRESENT";
    const metadataDifferences: string[] = [];

    if (!cloudinaryAvailable) {
      cldClassification = "CLOUDINARY_UNAVAILABLE";
    } else if (!cldResource) {
      if (failedResourceTypes.includes("image")) {
        cldClassification = "CLOUDINARY_UNAVAILABLE";
      } else {
        cldClassification = "REGISTERED_BUT_MISSING_IN_CLOUDINARY";
        summary.missingInCloudinary++;
        summary.orphanBreakdown.dbMissingInCloudinary++;
        orphanFlags.push("DB_RECORD_MISSING_IN_CLOUDINARY");
      }
    } else {
      const expectedCloudinaryType = "image";
      if (cldResource.resource_type !== expectedCloudinaryType) {
        cldClassification = "RESOURCE_TYPE_MISMATCH";
        summary.resourceTypeMismatches++;
      } else {
        if (asset.format.toLowerCase() !== (cldResource.format || "").toLowerCase()) {
          metadataDifferences.push(
            `Format difference: DB '${asset.format}' vs Cloudinary '${cldResource.format}'`
          );
        }
        if (asset.secureUrl !== cldResource.secure_url) {
          metadataDifferences.push("Delivery URL mismatch between DB and Cloudinary");
        }
        if (asset.bytes !== cldResource.bytes) {
          metadataDifferences.push(
            `Byte size difference: DB ${asset.bytes} vs Cloudinary ${cldResource.bytes}`
          );
        }
        if (metadataDifferences.length > 0) {
          cldClassification = "METADATA_DIFFERENCE";
          summary.metadataDifferences++;
        }
      }
    }

    const ageMs = Math.max(0, now - new Date(asset.createdAt).getTime());
    const ageHours = Math.round((ageMs / (1000 * 60 * 60)) * 10) / 10;
    const ageDays = Math.round((ageMs / (1000 * 60 * 60 * 24)) * 10) / 10;

    reconciledItems.push({
      id: asset.id,
      publicId: asset.publicId,
      originalFilename: asset.originalFilename,
      mediaType: asset.mediaType,
      provider: asset.provider,
      format: asset.format,
      mimeType: asset.mimeType,
      bytes: asset.bytes,
      width: asset.width,
      height: asset.height,
      pages: asset.pages,
      folder: asset.folder,
      secureUrl: asset.secureUrl,
      createdAt: asset.createdAt,
      ageHours,
      ageDays,
      storedStatus: asset.status,
      expectedStatus,
      referenceClassification: refClassification,
      orphanFlags,
      totalReferences: totalRefs,
      referencesByModel: {
        publications: references.filter((r) => r.model === "Publication").length,
        journals: references.filter((r) => r.model === "Journal").length,
        journalIssues: references.filter((r) => r.model === "JournalIssue").length,
        authors: references.filter((r) => r.model === "Author").length
      },
      references,
      cloudinaryStatus: {
        classification: cldClassification,
        existsInCloudinary: !!cldResource,
        cloudinaryFormat: cldResource?.format,
        cloudinaryResourceType: cldResource?.resource_type,
        cloudinaryBytes: cldResource?.bytes,
        cloudinarySecureUrl: cldResource?.secure_url,
        metadataDifferences: metadataDifferences.length > 0 ? metadataDifferences : undefined
      }
    });
  }

  return {
    generatedAt: new Date(now).toISOString(),
    cloudinaryApi: {
      status: cloudinaryAvailable ? "AVAILABLE" : "UNAVAILABLE",
      approvedFolders: ALLOWED_FOLDERS,
      scannedResourcesInApprovedFolders: cloudinaryResources.length,
      limitation: cloudinaryLimitation,
      enumeration
    },
    summary,
    unregisteredCloudinaryResources,
    allItems: reconciledItems
  };
}

export function sliceReconciliationSnapshot(
  snapshot: ReconciliationSnapshot,
  options?: ReconciliationFilterOptions,
  cache?: ReconciliationCacheMetadata
): ReconciliationReport {
  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(100, Math.max(1, options?.limit || 20));

  let filtered = snapshot.allItems;

  if (options?.folder) {
    filtered = filtered.filter((item) => item.folder === options.folder);
  }
  if (options?.mediaType) {
    filtered = filtered.filter((item) => item.mediaType === options.mediaType);
  }
  if (options?.status) {
    filtered = filtered.filter((item) => item.storedStatus === options.status);
  }
  if (options?.referenceClassification) {
    filtered = filtered.filter(
      (item) => item.referenceClassification === options.referenceClassification
    );
  }
  if (options?.cloudinaryClassification) {
    filtered = filtered.filter(
      (item) => item.cloudinaryStatus.classification === options.cloudinaryClassification
    );
  }

  let filteredUnregistered = snapshot.unregisteredCloudinaryResources;
  if (options?.folder) {
    filteredUnregistered = filteredUnregistered.filter((res) =>
      res.public_id.startsWith(`${options.folder}/`)
    );
  }
  if (options?.mediaType) {
    filteredUnregistered = filteredUnregistered.filter((res) => {
      const isPdf = (res.format || "").toLowerCase() === "pdf";
      return options.mediaType === MediaAssetType.DOCUMENT ? isPdf : !isPdf;
    });
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const skip = (page - 1) * limit;
  const paginatedItems = filtered.slice(skip, skip + limit);

  return {
    generatedAt: snapshot.generatedAt,
    cloudinaryApi: snapshot.cloudinaryApi,
    summary: snapshot.summary,
    unregisteredCloudinaryResources: filteredUnregistered,
    items: paginatedItems,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages
    },
    ...(cache ? { cache } : {})
  };
}

export async function runMediaReconciliation(
  options?: ReconciliationRunOptions
): Promise<ReconciliationReport> {
  const snapshot = await collectReconciliationSnapshot({
    cloudinaryResourcesOverride: options?.cloudinaryResourcesOverride,
    listResourcesFn: options?.listResourcesFn,
    maxCloudinaryPages: options?.maxCloudinaryPages
  });

  return sliceReconciliationSnapshot(snapshot, {
    page: options?.page,
    limit: options?.limit,
    folder: options?.folder,
    mediaType: options?.mediaType,
    status: options?.status,
    referenceClassification: options?.referenceClassification,
    cloudinaryClassification: options?.cloudinaryClassification
  });
}
