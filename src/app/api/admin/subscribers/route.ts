import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { SubscriberStatus, Prisma } from "@prisma/client";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(request: Request) {
  const authCheck = await requireAdminAuth(request, "view_subscribers");
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const statusParam = searchParams.get("status")?.trim().toUpperCase() || "ALL";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));
  const skip = (page - 1) * limit;

  const [total, active, pending, unsubscribed, suppressed] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { status: SubscriberStatus.ACTIVE } }),
    prisma.newsletterSubscriber.count({ where: { status: SubscriberStatus.PENDING_VERIFICATION } }),
    prisma.newsletterSubscriber.count({ where: { status: SubscriberStatus.UNSUBSCRIBED } }),
    prisma.newsletterSubscriber.count({ where: { status: SubscriberStatus.SUPPRESSED } }),
  ]);

  const where: Prisma.NewsletterSubscriberWhereInput = {};

  if (statusParam !== "ALL" && Object.values(SubscriberStatus).includes(statusParam as SubscriberStatus)) {
    where.status = statusParam as SubscriberStatus;
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { normalizedEmail: { contains: search.toLowerCase() } },
    ];
  }

  const [filteredCount, subscribers] = await Promise.all([
    prisma.newsletterSubscriber.count({ where }),
    prisma.newsletterSubscriber.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        status: true,
        source: true,
        subscribedAt: true,
        verifiedAt: true,
        unsubscribedAt: true,
        suppressedAt: true,
        suppressionReason: true,
        createdAt: true,
        activities: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            action: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(filteredCount / limit) || 1;

  return NextResponse.json(
    {
      stats: {
        total,
        active,
        pending,
        unsubscribed,
        suppressed,
      },
      subscribers: subscribers.map((sub) => ({
        id: sub.id,
        email: sub.email,
        status: sub.status,
        source: sub.source,
        subscribedAt: sub.subscribedAt.toISOString(),
        verifiedAt: sub.verifiedAt ? sub.verifiedAt.toISOString() : null,
        unsubscribedAt: sub.unsubscribedAt ? sub.unsubscribedAt.toISOString() : null,
        suppressedAt: sub.suppressedAt ? sub.suppressedAt.toISOString() : null,
        suppressionReason: sub.suppressionReason,
        createdAt: sub.createdAt.toISOString(),
        latestActivity: sub.activities[0]
          ? {
              action: sub.activities[0].action,
              createdAt: sub.activities[0].createdAt.toISOString(),
            }
          : null,
      })),
      pagination: {
        total: filteredCount,
        page,
        limit,
        totalPages,
      },
    },
    {
      status: 200,
      headers: NO_CACHE_HEADERS,
    }
  );
}

