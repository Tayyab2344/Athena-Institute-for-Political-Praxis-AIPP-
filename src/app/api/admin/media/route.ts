import { NextResponse } from "next/server";
import { MediaAssetStatus, MediaAssetType } from "@prisma/client";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { isApprovedMediaFolder } from "@/lib/media/folders";
import {
  listMediaCatalog,
  CatalogReferenceClassification,
  CatalogSortOption
} from "@/lib/media/catalog";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache"
};

const VALID_MEDIA_TYPES = new Set<string>(Object.values(MediaAssetType));
const VALID_STATUSES = new Set<string>(Object.values(MediaAssetStatus));
const VALID_REF_CLASSIFICATIONS = new Set<CatalogReferenceClassification>([
  "UPLOADED",
  "ATTACHED",
  "STATUS_MISMATCH",
  "ARCHIVED",
  "DELETED"
]);
const VALID_SORT_OPTIONS = new Set<CatalogSortOption>([
  "newest",
  "oldest",
  "largest",
  "name"
]);

export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "view_media");
  if (!auth.authorized) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);

  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");
  const rawSearch = searchParams.get("search") || undefined;
  const rawMediaType = searchParams.get("mediaType") || undefined;
  const rawStatus = searchParams.get("status") || undefined;
  const rawFolder = searchParams.get("folder") || undefined;
  const rawRefClass = searchParams.get("referenceClassification") || undefined;
  const rawSort = searchParams.get("sort") || undefined;
  const rawSelectableOnly = searchParams.get("selectableOnly");

  const page = rawPage ? parseInt(rawPage, 10) : 1;
  const limit = rawLimit ? parseInt(rawLimit, 10) : 24;

  if (isNaN(page) || page < 1) {
    return NextResponse.json(
      { error: "Invalid page parameter. Must be a positive integer." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: "Invalid limit parameter. Must be an integer between 1 and 100." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (rawSearch && rawSearch.length > 200) {
    return NextResponse.json(
      { error: "Search query is too long. Maximum 200 characters." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (rawMediaType && !VALID_MEDIA_TYPES.has(rawMediaType)) {
    return NextResponse.json(
      { error: "Invalid mediaType filter. Must be IMAGE or DOCUMENT." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (rawStatus && !VALID_STATUSES.has(rawStatus)) {
    return NextResponse.json(
      { error: "Invalid status filter." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (rawFolder && !isApprovedMediaFolder(rawFolder)) {
    return NextResponse.json(
      { error: "Invalid folder filter. Must be an approved AIPP media folder." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (
    rawRefClass &&
    !VALID_REF_CLASSIFICATIONS.has(rawRefClass as CatalogReferenceClassification)
  ) {
    return NextResponse.json(
      { error: "Invalid referenceClassification filter." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (rawSort && !VALID_SORT_OPTIONS.has(rawSort as CatalogSortOption)) {
    return NextResponse.json(
      { error: "Invalid sort parameter. Must be newest, oldest, largest, or name." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (
    rawSelectableOnly !== null &&
    rawSelectableOnly !== "true" &&
    rawSelectableOnly !== "false"
  ) {
    return NextResponse.json(
      { error: "Invalid selectableOnly parameter. Must be true or false." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const catalog = await listMediaCatalog({
      page,
      limit,
      search: rawSearch,
      mediaType: rawMediaType as MediaAssetType | undefined,
      status: rawStatus as MediaAssetStatus | undefined,
      folder: rawFolder,
      referenceClassification: rawRefClass as CatalogReferenceClassification | undefined,
      sort: (rawSort as CatalogSortOption | undefined) || "newest",
      selectableOnly: rawSelectableOnly === "true"
    });

    return NextResponse.json(catalog, {
      status: 200,
      headers: NO_CACHE_HEADERS
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load media catalog." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

