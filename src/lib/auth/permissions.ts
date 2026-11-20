import { NextResponse } from "next/server";
import { AdminRole, AdminStatus } from "@prisma/client";
import { getAdminSessionFromRequest, SafeAdminUser } from "./session";

export type AdminAction =
  | "manage_publications"
  | "manage_authors"
  | "manage_categories"
  | "manage_journals"
  | "upload_files"
  | "view_media"
  | "manage_users"
  | "manage_security"
  | "view_inquiries"
  | "manage_inquiries"
  | "export_inquiries"
  | "reply_inquiries"
  | "view_subscribers"
  | "manage_subscribers";

/**
 * Check whether a given role is allowed to perform an administrative action.
 */
export function hasPermission(role: AdminRole, action: AdminAction): boolean {
  switch (role) {
    case AdminRole.SUPER_ADMIN:
      // SUPER_ADMIN has unrestricted administrative rights
      return true;

    case AdminRole.EDITOR:
      // EDITOR can manage CMS content and upload media, but cannot manage inquiries, users or security
      return (
        action === "manage_publications" ||
        action === "manage_authors" ||
        action === "manage_categories" ||
        action === "manage_journals" ||
        action === "upload_files" ||
        action === "view_media"
      );

    case AdminRole.INQUIRY_MANAGER:
      // INQUIRY_MANAGER manages incoming requests, inquiries, notes, and exports
      return (
        action === "view_inquiries" ||
        action === "manage_inquiries" ||
        action === "export_inquiries" ||
        action === "reply_inquiries" ||
        action === "view_subscribers" ||
        action === "manage_subscribers"
      );

    default:
      return false;
  }
}

export type AuthCheckResult =
  | {
      authorized: true;
      user: SafeAdminUser;
    }
  | {
      authorized: false;
      response: NextResponse;
    };

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

/**
 * Server-side guard for API Route Handlers.
 * Verifies the database-backed session and checks role permission.
 * Returns either { authorized: true, user } or a pre-formatted { authorized: false, response: NextResponse }.
 */
export async function requireAdminAuth(
  request: Request,
  action?: AdminAction
): Promise<AuthCheckResult> {
  const sessionData = await getAdminSessionFromRequest(request);

  if (!sessionData) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401, headers: NO_CACHE_HEADERS }
      ),
    };
  }

  const { user } = sessionData;

  if (user.status !== AdminStatus.ACTIVE) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Administrator account is suspended." },
        { status: 403, headers: NO_CACHE_HEADERS }
      ),
    };
  }

  if (action && !hasPermission(user.role, action)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: `Permission denied. Your role (${user.role}) is not authorized for this action.`,
        },
        { status: 403, headers: NO_CACHE_HEADERS }
      ),
    };
  }

  return {
    authorized: true,
    user,
  };
}

