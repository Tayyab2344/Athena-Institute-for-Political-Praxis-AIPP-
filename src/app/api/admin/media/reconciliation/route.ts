import { NextResponse } from "next/server";
import { AdminRole, MediaAssetStatus, MediaAssetType } from "@prisma/client";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { getClientIp } from "@/lib/auth/rate-limiter";
import { isAllowedFolder } from "@/lib/cloudinary";
import {
  ReferenceClassification,
  CloudinaryClassification,
  ReconciliationFilterOptions
} from "@/lib/media/reconciliation";
import { getOrRefreshMediaReconciliation } from "@/lib/media/reconciliation-cache";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache"
};

const VALID_STATUSES = new Set<string>(Object.values(MediaAssetStatus));
const VALID_MEDIA_TYPES = new Set<string>(Object.values(MediaAssetType));

const VALID_REF_CLASSIFICATIONS = new Set<ReferenceClassification>([
  "UPLOADED",
  "ATTACHED",
  "STATUS_MISMATCH",
  "ARCHIVED",
  "DELETED"
]);

const VALID_CLD_CLASSIFICATIONS = new Set<CloudinaryClassification>([
  "REGISTERED_AND_PRESENT",
  "REGISTERED_BUT_MISSING_IN_CLOUDINARY",
  "CLOUDINARY_UNREGISTERED",
  "RESOURCE_TYPE_MISMATCH",
  "METADATA_DIFFERENCE",
  "CLOUDINARY_UNAVAILABLE"
]);

type ParsedParamsResult =
  | { ok: true; filters: ReconciliationFilterOptions }
  | { ok: false; error: string };

function parseReconciliationParams(searchParams: URLSearchParams): ParsedParamsResult {
  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");
  const folder = searchParams.get("folder") || undefined;
  const rawMediaType = searchParams.get("mediaType") || undefined;
  const rawStatus = searchParams.get("status") || undefined;
  const rawRefClass = searchParams.get("referenceClassification") || undefined;
  const rawCldClass = searchParams.get("cloudinaryClassification") || undefined;

  const page = rawPage ? parseInt(rawPage, 10) : 1;
  const limit = rawLimit ? parseInt(rawLimit, 10) : 20;

  if (isNaN(page) || page < 1) {
    return { ok: false, error: "Invalid page parameter. Must be a positive integer." };
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    return { ok: false, error: "Invalid limit parameter. Must be an integer between 1 and 100." };
  }

  if (folder && !isAllowedFolder(folder)) {
    return { ok: false, error: "Invalid folder filter. Must be an approved AIPP media folder." };
  }

  if (rawMediaType && !VALID_MEDIA_TYPES.has(rawMediaType)) {
    return { ok: false, error: "Invalid mediaType filter. Must be IMAGE or DOCUMENT." };
  }

  if (rawStatus && !VALID_STATUSES.has(rawStatus)) {
    return { ok: false, error: "Invalid status filter." };
  }

  if (rawRefClass && !VALID_REF_CLASSIFICATIONS.has(rawRefClass as ReferenceClassification)) {
    return { ok: false, error: "Invalid referenceClassification filter." };
  }

  if (rawCldClass && !VALID_CLD_CLASSIFICATIONS.has(rawCldClass as CloudinaryClassification)) {
    return { ok: false, error: "Invalid cloudinaryClassification filter." };
  }

  return {
    ok: true,
    filters: {
      page,
      limit,
      folder,
      mediaType: rawMediaType as MediaAssetType | undefined,
      status: rawStatus as MediaAssetStatus | undefined,
      referenceClassification: rawRefClass as ReferenceClassification | undefined,
      cloudinaryClassification: rawCldClass as CloudinaryClassification | undefined
    }
  };
}

async function handleReconciliationRequest(
  request: Request,
  forceRefresh: boolean
): Promise<NextResponse> {
  if (forceRefresh) {
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid && originCheck.response) {
      return originCheck.response;
    }
  }

  const auth = await requireAdminAuth(request, "manage_security");
  if (!auth.authorized) {
    return auth.response;
  }

  if (auth.user.role !== AdminRole.SUPER_ADMIN) {
    return NextResponse.json(
      { error: "Forbidden: Media reconciliation is restricted to SUPER_ADMIN accounts." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  const { searchParams } = new URL(request.url);
  const parsed = parseReconciliationParams(searchParams);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: parsed.error },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const clientIp = getClientIp(request);

  try {
    const result = await getOrRefreshMediaReconciliation({
      adminUserId: auth.user.id,
      clientIp,
      forceRefresh,
      filters: parsed.filters
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          retryAfterSeconds: result.retryAfterSeconds,
          lastSuccessfulAt: result.lastSuccessfulAt
        },
        {
          status: 429,
          headers: {
            ...NO_CACHE_HEADERS,
            "Retry-After": String(result.retryAfterSeconds)
          }
        }
      );
    }

    return NextResponse.json(result.report, {
      status: 200,
      headers: NO_CACHE_HEADERS
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate media reconciliation report" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function GET(request: Request) {
  return handleReconciliationRequest(request, false);
}

export async function POST(request: Request) {
  return handleReconciliationRequest(request, true);
}
