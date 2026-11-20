import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { SubscriberStatus } from "@prisma/client";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "X-Content-Type-Options": "nosniff",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdminAuth(request, "manage_subscribers");
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request payload." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const reason = (body as Record<string, unknown>)?.reason;
  if (typeof reason !== "string" || reason.trim().length < 3 || reason.trim().length > 500) {
    return NextResponse.json(
      { error: "Suppression reason is required and must be between 3 and 500 characters." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { id },
  });

  if (!subscriber) {
    return NextResponse.json(
      { error: "Subscriber not found." },
      { status: 404, headers: NO_CACHE_HEADERS }
    );
  }

  const now = new Date();
  const trimmedReason = reason.trim();

  await prisma.$transaction(async (tx) => {
    await tx.newsletterSubscriber.update({
      where: { id },
      data: {
        status: SubscriberStatus.SUPPRESSED,
        suppressedAt: now,
        suppressionReason: trimmedReason,
      },
    });

    await tx.newsletterSubscriptionToken.updateMany({
      where: {
        subscriberId: id,
        usedAt: null,
      },
      data: {
        usedAt: now,
      },
    });

    await tx.subscriberActivity.create({
      data: {
        subscriberId: id,
        adminUserId: authCheck.user.id,
        action: "SUBSCRIBER_MANUALLY_SUPPRESSED",
        details: JSON.stringify({
          reason: trimmedReason,
          adminEmail: authCheck.user.email,
          previousStatus: subscriber.status,
          timestamp: now.toISOString(),
        }),
      },
    });
  });

  return NextResponse.json(
    {
      success: true,
      message: "Subscriber has been suppressed successfully.",
    },
    {
      status: 200,
      headers: NO_CACHE_HEADERS,
    }
  );
}

