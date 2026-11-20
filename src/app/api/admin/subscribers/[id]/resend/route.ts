import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { SubscriberStatus, SubscriptionTokenType } from "@prisma/client";
import { isWithinCooldown, RESEND_COOLDOWN_SECONDS } from "@/lib/newsletter/tokens";
import { createAndEnqueueVerification } from "@/lib/newsletter/verification-service";

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

  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { id },
  });

  if (!subscriber) {
    return NextResponse.json(
      { error: "Subscriber not found." },
      { status: 404, headers: NO_CACHE_HEADERS }
    );
  }

  if (subscriber.status !== SubscriberStatus.PENDING_VERIFICATION) {
    return NextResponse.json(
      {
        error: `Verification email can only be resent to subscribers pending verification (current status: ${subscriber.status}).`,
      },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const latestToken = await prisma.newsletterSubscriptionToken.findFirst({
    where: {
      subscriberId: id,
      type: SubscriptionTokenType.VERIFICATION,
    },
    orderBy: { createdAt: "desc" },
  });

  if (latestToken && isWithinCooldown(latestToken.createdAt, RESEND_COOLDOWN_SECONDS)) {
    return NextResponse.json(
      {
        error: `A verification email was sent recently. Please wait before requesting another (cooldown: ${RESEND_COOLDOWN_SECONDS}s).`,
      },
      { status: 429, headers: NO_CACHE_HEADERS }
    );
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.newsletterSubscriptionToken.updateMany({
      where: {
        subscriberId: id,
        type: SubscriptionTokenType.VERIFICATION,
        usedAt: null,
      },
      data: {
        usedAt: now,
      },
    });

    await createAndEnqueueVerification(
      {
        subscriber: { id: subscriber.id, email: subscriber.email },
        userAgent: "AIPP Admin Console",
      },
      tx
    );

    await tx.subscriberActivity.create({
      data: {
        subscriberId: id,
        adminUserId: authCheck.user.id,
        action: "ADMIN_TRIGGERED_RESEND",
        details: JSON.stringify({
          adminEmail: authCheck.user.email,
          timestamp: now.toISOString(),
        }),
      },
    });
  });

  return NextResponse.json(
    {
      success: true,
      message: "Verification email enqueued successfully.",
    },
    {
      status: 200,
      headers: NO_CACHE_HEADERS,
    }
  );
}

