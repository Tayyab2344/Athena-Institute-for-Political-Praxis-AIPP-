import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { AdminRole, AdminStatus } from "@prisma/client";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "manage_inquiries");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const assignees = await prisma.adminUser.findMany({
      where: {
        status: AdminStatus.ACTIVE,
        role: {
          in: [AdminRole.SUPER_ADMIN, AdminRole.INQUIRY_MANAGER],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ assignees }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("[API Inquiries Assignees GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve assignees list." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

