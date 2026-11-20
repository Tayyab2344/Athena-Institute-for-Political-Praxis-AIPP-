import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { getMediaAssetDetail } from "@/lib/media/catalog";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache"
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request, "view_media");
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  const trimmedId = id?.trim();

  if (!trimmedId || trimmedId.length > 100) {
    return NextResponse.json(
      { error: "Invalid media asset identifier." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const detail = await getMediaAssetDetail(trimmedId);
    if (!detail) {
      return NextResponse.json(
        { error: "Media asset not found." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(detail, {
      status: 200,
      headers: NO_CACHE_HEADERS
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load media asset details." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

