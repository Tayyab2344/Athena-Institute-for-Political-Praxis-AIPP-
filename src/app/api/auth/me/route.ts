import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache"
};

export async function GET(request: Request) {
  const sessionData = await getAdminSessionFromRequest(request);

  if (!sessionData) {
    return NextResponse.json(
      { error: "Unauthenticated." },
      {
        status: 401,
        headers: NO_CACHE_HEADERS
      }
    );
  }

  const role = sessionData.user.role;

  return NextResponse.json(
    {
      user: sessionData.user,
      permissions: {
        view_media: hasPermission(role, "view_media"),
        upload_files: hasPermission(role, "upload_files"),
        manage_publications: hasPermission(role, "manage_publications"),
        manage_journals: hasPermission(role, "manage_journals"),
        manage_authors: hasPermission(role, "manage_authors"),
        manage_security: hasPermission(role, "manage_security")
      }
    },
    {
      headers: NO_CACHE_HEADERS
    }
  );
}
