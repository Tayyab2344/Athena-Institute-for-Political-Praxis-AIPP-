import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { InquiryStatus, InquiryPriority, Prisma } from "@prisma/client";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

export async function GET(request: Request) {
  const auth = await requireAdminAuth(request, "view_inquiries");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const statusParam = searchParams.get("status")?.trim();
    const typeParam = searchParams.get("inquiryType")?.trim();
    const priorityParam = searchParams.get("priority")?.trim();
    const assignedToParam = searchParams.get("assignedTo")?.trim();
    const dateFromParam = searchParams.get("dateFrom")?.trim();
    const dateToParam = searchParams.get("dateTo")?.trim();
    const sortParam = searchParams.get("sort") || "newest";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ContactInquiryWhereInput = {};

    // 1. Status Filter
    if (statusParam && statusParam !== "ALL") {
      if (Object.values(InquiryStatus).includes(statusParam as InquiryStatus)) {
        where.status = statusParam as InquiryStatus;
      }
    }

    // 2. Type Filter
    if (typeParam && typeParam !== "ALL") {
      where.inquiryType = typeParam;
    }

    // 3. Priority Filter
    if (priorityParam && priorityParam !== "ALL") {
      if (Object.values(InquiryPriority).includes(priorityParam as InquiryPriority)) {
        where.priority = priorityParam as InquiryPriority;
      }
    }

    // 4. Assigned Administrator Filter
    if (assignedToParam && assignedToParam !== "ALL") {
      if (assignedToParam === "UNASSIGNED") {
        where.assignedToId = null;
      } else {
        where.assignedToId = assignedToParam;
      }
    }

    // 5. Date Range Filter
    if (dateFromParam || dateToParam) {
      where.createdAt = {};
      if (dateFromParam) {
        const fromDate = new Date(dateFromParam);
        if (!isNaN(fromDate.getTime())) {
          where.createdAt.gte = fromDate;
        }
      }
      if (dateToParam) {
        const toDate = new Date(dateToParam);
        if (!isNaN(toDate.getTime())) {
          // Set to end of day if only date is passed
          toDate.setHours(23, 59, 59, 999);
          where.createdAt.lte = toDate;
        }
      }
    }

    // 6. Search Filter
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { referenceNumber: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { organization: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.ContactInquiryOrderByWithRelationInput =
      sortParam === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    // Parallel fetch: inquiries, total count, and status breakdown counts
    const [inquiries, total, statusCountsRaw] = await Promise.all([
      prisma.contactInquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              notes: true,
            },
          },
        },
      }),
      prisma.contactInquiry.count({ where }),
      prisma.contactInquiry.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    const statusCounts = {
      total: 0,
      new: 0,
      inProgress: 0,
      awaitingResponse: 0,
      resolved: 0,
      spam: 0,
      archived: 0,
    };

    statusCountsRaw.forEach((sc) => {
      const count = sc._count._all;
      statusCounts.total += count;
      switch (sc.status) {
        case InquiryStatus.NEW:
          statusCounts.new = count;
          break;
        case InquiryStatus.IN_PROGRESS:
          statusCounts.inProgress = count;
          break;
        case InquiryStatus.AWAITING_RESPONSE:
          statusCounts.awaitingResponse = count;
          break;
        case InquiryStatus.RESOLVED:
          statusCounts.resolved = count;
          break;
        case InquiryStatus.SPAM:
          statusCounts.spam = count;
          break;
        case InquiryStatus.ARCHIVED:
          statusCounts.archived = count;
          break;
      }
    });

    return NextResponse.json(
      {
        inquiries,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
        statusCounts,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("[API Inquiries GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve inquiries." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

