import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdminAuth(request, "view_subscribers");
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  const { id } = await params;

  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { id },
    include: {
      consents: {
        orderBy: { createdAt: "desc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        include: {
          adminUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      tokens: {
        select: {
          id: true,
          type: true,
          expiresAt: true,
          usedAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!subscriber) {
    return NextResponse.json(
      { error: "Subscriber not found." },
      { status: 404, headers: NO_CACHE_HEADERS }
    );
  }

  return NextResponse.json(
    {
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
        source: subscriber.source,
        subscribedAt: subscriber.subscribedAt.toISOString(),
        verifiedAt: subscriber.verifiedAt ? subscriber.verifiedAt.toISOString() : null,
        unsubscribedAt: subscriber.unsubscribedAt ? subscriber.unsubscribedAt.toISOString() : null,
        suppressedAt: subscriber.suppressedAt ? subscriber.suppressedAt.toISOString() : null,
        suppressionReason: subscriber.suppressionReason,
        createdAt: subscriber.createdAt.toISOString(),
        updatedAt: subscriber.updatedAt.toISOString(),
        consents: subscriber.consents.map((c) => ({
          id: c.id,
          consentType: c.consentType,
          consentText: c.consentText,
          policyVersion: c.policyVersion,
          ipHash: c.ipHash,
          userAgent: c.userAgent,
          sourceUrl: c.sourceUrl,
          createdAt: c.createdAt.toISOString(),
        })),
        activities: subscriber.activities.map((a) => ({
          id: a.id,
          action: a.action,
          details: a.details,
          createdAt: a.createdAt.toISOString(),
          adminUser: a.adminUser
            ? {
                id: a.adminUser.id,
                name: a.adminUser.name,
                email: a.adminUser.email,
                role: a.adminUser.role,
              }
            : null,
        })),
        tokens: subscriber.tokens.map((t) => ({
          id: t.id,
          type: t.type,
          expiresAt: t.expiresAt.toISOString(),
          usedAt: t.usedAt ? t.usedAt.toISOString() : null,
          createdAt: t.createdAt.toISOString(),
        })),
      },
    },
    {
      status: 200,
      headers: NO_CACHE_HEADERS,
    }
  );
}

