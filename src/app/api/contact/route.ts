import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validations/contact";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { getClientIp, checkRateLimit } from "@/lib/auth/rate-limiter";
import { InquiryStatus, InquiryPriority } from "@prisma/client";
import { handleInquiryCreatedEmails, isInquiryEmailEnabled } from "@/lib/email/inquiry-emails";
import { getRolloutCutoffTimestamp } from "@/lib/email/reconciliation-service";

export async function POST(request: Request) {
  // 1. Origin verification for state-changing browser submissions
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  // 2. Validate content type
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { success: false, error: "Invalid content type. Expected application/json." },
      { status: 415 }
    );
  }

  // 3. Trusted Client IP and Rate Limiting
  const clientIp = getClientIp(request);
  const ipRate = await checkRateLimit(`contact:ip:${clientIp}`, 10, 15 * 60);
  if (!ipRate.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many inquiry submissions from this connection. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(ipRate.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const rawBody = await request.json();
    const result = contactFormSchema.safeParse(rawBody);

    if (!result.success) {
      const flattened = result.error.flatten();
      return NextResponse.json(
        {
          success: false,
          error: "Please correct the errors in the form.",
          fieldErrors: flattened.fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      subject,
      organization,
      phone,
      message,
      sourceForm,
      hp_website,
    } = result.data;

    // 4. Rate Limiting: IP-scoped email submissions to prevent third-party Denial-of-Service attacks.
    // Notice: Binding unauthenticated public submissions to a purely global email key creates an easy DoS
    // where an attacker submits a victim's email repeatedly to lock out the victim from another IP.
    // Using a compound key `contact:ip_email:${clientIp}:${email}` ensures abusers cannot lock out legitimate users.
    const compoundRate = await checkRateLimit(
      `contact:ip_email:${clientIp}:${email.toLowerCase()}`,
      5,
      15 * 60
    );
    if (!compoundRate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many inquiry submissions from this connection for this email address. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(compoundRate.retryAfterSeconds),
          },
        }
      );
    }

    // Check honeypot field: if populated, mark as SPAM silently
    const isBotSpam = !!(hp_website && hp_website.trim().length > 0);

    // 5. Concurrency-Safe Idempotent Persistence (Phase 5.2.1 Hardening)
    // To prevent concurrent duplicate submissions (e.g. rapid double-clicks or parallel automated requests)
    // from racing through the 5-minute duplicate check and creating multiple ContactInquiry and EmailOutbox records,
    // we serialize submissions for the same email and message using a PostgreSQL transaction-scoped advisory lock.
    const lockHash = crypto
      .createHash("sha256")
      .update(`inquiry-lock:${email.toLowerCase().trim()}:${message.trim()}`)
      .digest();
    const lockKey = lockHash.readBigInt64BE(0);

    const { isDuplicate, inquiry: savedInquiry } = await prisma.$transaction(
      async (tx) => {
        // Acquire transactional advisory lock.
        // Automatically released when this transaction commits or rolls back.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;

        // Re-check for an existing inquiry within the 5-minute deduplication window
        const recentDuplicate = await tx.contactInquiry.findFirst({
          where: {
            email: email.toLowerCase(),
            message,
            createdAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000),
            },
          },
          select: {
            id: true,
            referenceNumber: true,
            fullName: true,
            email: true,
            subject: true,
            organization: true,
            status: true,
            createdAt: true,
          },
        });

        if (recentDuplicate) {
          return { isDuplicate: true, inquiry: recentDuplicate };
        }

        // Generate unique institutional reference number: e.g. AIPP-INQ-2026-F9B4D2
        const currentYear = new Date().getFullYear();
        const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
        const referenceNumber = `AIPP-INQ-${currentYear}-${randomSuffix}`;

        const created = await tx.contactInquiry.create({
          data: {
            referenceNumber,
            inquiryType: subject,
            fullName: name,
            email: email.toLowerCase(),
            phone: phone || null,
            organization: organization || null,
            subject,
            message,
            sourceForm: sourceForm || "CONTACT_PAGE",
            status: isBotSpam ? InquiryStatus.SPAM : InquiryStatus.NEW,
            priority: isBotSpam ? InquiryPriority.LOW : InquiryPriority.MEDIUM,
            activities: {
              create: {
                action: isBotSpam ? "MARKED_SPAM" : "INQUIRY_RECEIVED",
                details: JSON.stringify({
                  sourceForm: sourceForm || "CONTACT_PAGE",
                  originIp: clientIp,
                  honeypotTriggered: isBotSpam,
                }),
              },
            },
          },
        });

        const rolloutCutoff = getRolloutCutoffTimestamp();
        const canQueueEmails =
          !isBotSpam &&
          isInquiryEmailEnabled() &&
          rolloutCutoff !== null &&
          created.createdAt >= rolloutCutoff;

        if (canQueueEmails) {
          await tx.inquiryActivity.create({
            data: {
              inquiryId: created.id,
              action: "TRANSACTIONAL_EMAIL_ELIGIBLE",
              details: JSON.stringify({
                rolloutCutoff: rolloutCutoff.toISOString(),
                queuedAt: new Date().toISOString(),
              }),
            },
          });
          await handleInquiryCreatedEmails(created, { tx });
        }

        return { isDuplicate: false, inquiry: created };
      },
      {
        maxWait: 15000,
        timeout: 20000,
        isolationLevel: "ReadCommitted",
      }
    );

    if (isDuplicate) {
      return NextResponse.json(
        {
          success: true,
          referenceId: savedInquiry.referenceNumber,
          message:
            "Thank you for contacting the Athena Institute for Political Praxis. Your inquiry has been received and routed to the Secretariat.",
          data: {
            referenceId: savedInquiry.referenceNumber,
            name: savedInquiry.fullName,
            email: savedInquiry.email,
            subject: savedInquiry.subject,
            receivedAt: savedInquiry.createdAt.toISOString(),
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        referenceId: savedInquiry.referenceNumber,
        message:
          "Thank you for contacting the Athena Institute for Political Praxis. Your inquiry has been formally logged and routed to the Secretariat.",
        data: {
          referenceId: savedInquiry.referenceNumber,
          name: savedInquiry.fullName,
          email: savedInquiry.email,
          subject: savedInquiry.subject,
          receivedAt: savedInquiry.createdAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AIPP Contact API Persistence Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "An unexpected server error occurred while recording your inquiry. Please reach out to contact@aipp-praxis.org directly.",
      },
      { status: 500 }
    );
  }
}
