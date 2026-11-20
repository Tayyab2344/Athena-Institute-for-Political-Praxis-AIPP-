import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { checkRateLimit, getClientIp, hashClientIdentifier } from "@/lib/auth/rate-limiter";
import { newsletterSubscribeSchema, normalizeEmail } from "@/lib/validations/newsletter";
import { getCanonicalConsent } from "@/lib/newsletter/consent";
import { SubscriberStatus, SubscriptionTokenType } from "@prisma/client";
import { createAndEnqueueVerification } from "@/lib/newsletter/verification-service";
import { isWithinCooldown, RESEND_COOLDOWN_SECONDS } from "@/lib/newsletter/tokens";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

const GENERIC_SUCCESS_RESPONSE = {
  success: true,
  message: "Thank you. If this email address is eligible for our communications, you will receive further instructions.",
};

export async function POST(request: Request) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const maxPoints = Math.max(
    1,
    parseInt(process.env.AIPP_NEWSLETTER_RATE_LIMIT_POINTS || "5", 10)
  );
  const windowSeconds = Math.max(
    60,
    parseInt(process.env.AIPP_NEWSLETTER_RATE_LIMIT_WINDOW_SECONDS || "600", 10)
  );

  const clientIp = getClientIp(request);
  const rateLimitKey = `newsletter-sub:${clientIp}`;
  const rateLimitResult = await checkRateLimit(
    rateLimitKey,
    maxPoints,
    windowSeconds
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many subscription attempts. Please try again later." },
      {
        status: 429,
        headers: {
          ...NO_CACHE_HEADERS,
          "Retry-After": String(rateLimitResult.retryAfterSeconds || 60),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request payload." },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const parseResult = newsletterSubscribeSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: parseResult.error.issues?.[0]?.message || "Invalid subscription details.",
      },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const { email, source, hp_organization, hp_website } = parseResult.data;

  if (hp_organization || hp_website) {
    return NextResponse.json(GENERIC_SUCCESS_RESPONSE, {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  }

  const normalized = normalizeEmail(email);
  const ipHash = hashClientIdentifier(clientIp);
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) || null;
  const sourceUrl = request.headers.get("referer")?.slice(0, 500) || null;
  const canonicalConsent = getCanonicalConsent();

  try {
    await prisma.$transaction(
      async (tx) => {
        const existing = await tx.newsletterSubscriber.findUnique({
          where: { normalizedEmail: normalized },
        });

        if (!existing) {
          const newSubscriber = await tx.newsletterSubscriber.create({
            data: {
              email: email.trim(),
              normalizedEmail: normalized,
              status: SubscriberStatus.PENDING_VERIFICATION,
              source: source || "FOOTER",
              subscribedAt: new Date(),
            },
          });

          await tx.newsletterConsent.create({
            data: {
              subscriberId: newSubscriber.id,
              consentType: canonicalConsent.consentType,
              consentText: canonicalConsent.consentText,
              policyVersion: canonicalConsent.policyVersion,
              ipHash,
              userAgent,
              sourceUrl,
            },
          });

          await tx.subscriberActivity.create({
            data: {
              subscriberId: newSubscriber.id,
              action: "SUBSCRIPTION_REQUESTED",
              details: JSON.stringify({
                source: source || "FOOTER",
                ipHash,
                policyVersion: canonicalConsent.policyVersion,
                timestamp: new Date().toISOString(),
              }),
            },
          });

          await createAndEnqueueVerification(
            {
              subscriber: { id: newSubscriber.id, email: newSubscriber.email },
              ipHash,
              userAgent,
            },
            tx
          );

          return;
        }

        if (existing.status === SubscriberStatus.ACTIVE) {
          await tx.subscriberActivity.create({
            data: {
              subscriberId: existing.id,
              action: "SUBSCRIPTION_ATTEMPTED_WHILE_ACTIVE",
              details: JSON.stringify({
                source: source || "FOOTER",
                ipHash,
                timestamp: new Date().toISOString(),
              }),
            },
          });
          return;
        }

        if (existing.status === SubscriberStatus.PENDING_VERIFICATION) {
          await tx.newsletterConsent.create({
            data: {
              subscriberId: existing.id,
              consentType: canonicalConsent.consentType,
              consentText: canonicalConsent.consentText,
              policyVersion: canonicalConsent.policyVersion,
              ipHash,
              userAgent,
              sourceUrl,
            },
          });

          const latestToken = await tx.newsletterSubscriptionToken.findFirst({
            where: {
              subscriberId: existing.id,
              type: SubscriptionTokenType.VERIFICATION,
            },
            orderBy: { createdAt: "desc" },
          });

          if (latestToken && isWithinCooldown(latestToken.createdAt, RESEND_COOLDOWN_SECONDS)) {
            await tx.subscriberActivity.create({
              data: {
                subscriberId: existing.id,
                action: "SUBSCRIPTION_REQUEST_REPEATED_COOLDOWN",
                details: JSON.stringify({
                  source: source || "FOOTER",
                  ipHash,
                  policyVersion: canonicalConsent.policyVersion,
                  latestTokenId: latestToken.id,
                  timestamp: new Date().toISOString(),
                }),
              },
            });
            return;
          }

          await tx.newsletterSubscriptionToken.updateMany({
            where: {
              subscriberId: existing.id,
              type: SubscriptionTokenType.VERIFICATION,
              usedAt: null,
            },
            data: {
              usedAt: new Date(),
            },
          });

          await createAndEnqueueVerification(
            {
              subscriber: { id: existing.id, email: existing.email },
              ipHash,
              userAgent,
            },
            tx
          );

          await tx.subscriberActivity.create({
            data: {
              subscriberId: existing.id,
              action: "SUBSCRIPTION_REQUEST_REPEATED",
              details: JSON.stringify({
                source: source || "FOOTER",
                ipHash,
                policyVersion: canonicalConsent.policyVersion,
                timestamp: new Date().toISOString(),
              }),
            },
          });
          return;
        }

        if (existing.status === SubscriberStatus.UNSUBSCRIBED) {
          await tx.newsletterConsent.create({
            data: {
              subscriberId: existing.id,
              consentType: canonicalConsent.consentType,
              consentText: canonicalConsent.consentText,
              policyVersion: canonicalConsent.policyVersion,
              ipHash,
              userAgent,
              sourceUrl,
            },
          });

          await tx.newsletterSubscriber.update({
            where: { id: existing.id },
            data: {
              source: source || existing.source,
              updatedAt: new Date(),
            },
          });

          await tx.subscriberActivity.create({
            data: {
              subscriberId: existing.id,
              action: "RESUBSCRIPTION_CONSENT_RECORDED",
              details: JSON.stringify({
                source: source || "FOOTER",
                ipHash,
                policyVersion: canonicalConsent.policyVersion,
                timestamp: new Date().toISOString(),
              }),
            },
          });
          return;
        }

        if (existing.status === SubscriberStatus.SUPPRESSED) {
          await tx.subscriberActivity.create({
            data: {
              subscriberId: existing.id,
              action: "SUBSCRIPTION_ATTEMPTED_WHILE_SUPPRESSED",
              details: JSON.stringify({
                source: source || "FOOTER",
                ipHash,
                timestamp: new Date().toISOString(),
              }),
            },
          });
          return;
        }
      },
      {
        isolationLevel: "ReadCommitted",
        timeout: 10000,
      }
    );

    return NextResponse.json(GENERIC_SUCCESS_RESPONSE, {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  } catch (err: unknown) {
    console.error("[Newsletter Subscribe Error]:", err);
    return NextResponse.json(
      { error: "An error occurred while processing your subscription. Please try again later." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
