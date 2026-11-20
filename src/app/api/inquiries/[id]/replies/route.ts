import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { adminInquiryReplySchema } from "@/lib/validations/contact";
import { enqueueEmail } from "@/lib/email/enqueue-service";
import {
  isInquiryRepliesEnabled,
  renderInquiryReplyEmail,
  sanitizeReplyDeliveryError,
} from "@/lib/email/inquiry-replies";
import { InquiryStatus, EmailStatus } from "@prisma/client";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request, "view_inquiries");
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;

  try {
    const replies = await prisma.inquiryReply.findMany({
      where: { inquiryId: id },
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
        outbox: {
          select: {
            id: true,
            status: true,
            attemptCount: true,
            acceptedAt: true,
            failedAt: true,
            lastError: true,
            createdAt: true,
          },
        },
      },
    });

    const sanitizedReplies = replies.map((r) => {
      const sanitized = sanitizeReplyDeliveryError(r.outbox?.lastError);
      return {
        id: r.id,
        inquiryId: r.inquiryId,
        adminUserId: r.adminUserId,
        authorName: r.authorName || r.adminUser?.name || "Administrator",
        authorEmail: r.authorEmail || r.adminUser?.email || null,
        recipientEmail: r.recipientEmail,
        subject: r.subject,
        content: r.content,
        idempotencyKey: r.idempotencyKey,
        status: r.outbox?.status ?? r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        adminUser: r.adminUser,
        outbox: r.outbox
          ? {
              id: r.outbox.id,
              status: r.outbox.status,
              attemptCount: r.outbox.attemptCount,
              acceptedAt: r.outbox.acceptedAt,
              failedAt: r.outbox.failedAt,
              errorCategory: sanitized ? sanitized.category : null,
              errorExplanation: sanitized ? sanitized.explanation : null,
              createdAt: r.outbox.createdAt,
            }
          : null,
      };
    });

    return NextResponse.json({ replies: sanitizedReplies }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("[API Inquiry Replies GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve inquiry replies." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "reply_inquiries");
  if (!auth.authorized) {
    return auth.response;
  }

  if (!isInquiryRepliesEnabled()) {
    return NextResponse.json(
      { error: "Inquiry reply feature is currently disabled." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  const { id } = await params;

  try {
    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id },
      select: {
        id: true,
        referenceNumber: true,
        fullName: true,
        email: true,
        subject: true,
        message: true,
        status: true,
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry record not found." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    if (inquiry.status === InquiryStatus.SPAM) {
      return NextResponse.json(
        { error: "Cannot send replies to inquiries classified as spam." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const body = await request.json();

    const parseResult = adminInquiryReplySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues?.[0]?.message || "Invalid reply content." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    if (parseResult.data.action === "retry") {
      const { replyId } = parseResult.data;
      const existingReply = await prisma.inquiryReply.findUnique({
        where: { id: replyId },
        include: { outbox: true },
      });

      if (!existingReply || existingReply.inquiryId !== inquiry.id) {
        return NextResponse.json(
          { error: "Reply record not found for this inquiry." },
          { status: 404, headers: NO_CACHE_HEADERS }
        );
      }

      if (!existingReply.outboxId) {
        return NextResponse.json(
          { error: "No outbox queue job associated with this reply." },
          { status: 400, headers: NO_CACHE_HEADERS }
        );
      }

      const retriedRecord = await prisma.$transaction(
        async (tx) => {
          await tx.emailOutbox.update({
            where: { id: existingReply.outboxId! },
            data: {
              status: EmailStatus.PENDING,
              attemptCount: 0,
              nextRetryAt: new Date(),
              lockedAt: null,
              lockedBy: null,
              claimToken: null,
              lastError: null,
            },
          });

          const updatedReply = await tx.inquiryReply.update({
            where: { id: existingReply.id },
            data: {
              status: EmailStatus.PENDING,
            },
            include: {
              adminUser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
              outbox: {
                select: {
                  id: true,
                  status: true,
                  attemptCount: true,
                  acceptedAt: true,
                  failedAt: true,
                  lastError: true,
                  createdAt: true,
                },
              },
            },
          });

          await tx.inquiryActivity.create({
            data: {
              inquiryId: inquiry.id,
              adminUserId: auth.user.id,
              action: "REPLY_RETRY_REQUESTED",
              details: JSON.stringify({
                replyId: existingReply.id,
                outboxId: existingReply.outboxId,
                adminName: auth.user.name,
                requestedAt: new Date().toISOString(),
              }),
            },
          });

          return updatedReply;
        },
        {
          maxWait: 20000,
          timeout: 35000,
          isolationLevel: "ReadCommitted",
        }
      );

      return NextResponse.json(
        { success: true, reply: retriedRecord },
        { status: 200, headers: NO_CACHE_HEADERS }
      );
    }

    const { content, subject: subjectOverride, clientToken, preview } = parseResult.data;

    if (preview === true) {
      const previewRender = renderInquiryReplyEmail({
        inquiryId: inquiry.id,
        referenceNumber: inquiry.referenceNumber,
        fullName: inquiry.fullName,
        email: inquiry.email,
        originalSubject: inquiry.subject,
        originalMessage: inquiry.message,
        replyContent: content!,
        adminName: auth.user.name,
        subjectOverride,
      });

      return NextResponse.json(
        {
          preview: true,
          subject: previewRender.subject,
          textBody: previewRender.textBody,
          htmlBody: previewRender.htmlBody,
          recipientEmail: inquiry.email,
          recipientName: inquiry.fullName,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const cleanToken = clientToken ? clientToken.trim() : "";
    if (!cleanToken || cleanToken.length !== 36 || !UUID_V4_REGEX.test(cleanToken)) {
      return NextResponse.json(
        { error: "Client idempotency token must be a valid RFC 4122 UUID v4.", code: "INVALID_IDEMPOTENCY_TOKEN" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const normalizedToken = cleanToken.toLowerCase();

    const tokenLockHash = crypto
      .createHash("sha256")
      .update(`reply-token-lock:${normalizedToken}`)
      .digest();
    const tokenLockKey = tokenLockHash.readBigInt64BE(0);

    const lockHash = crypto
      .createHash("sha256")
      .update(`reply-concurrency:${inquiry.id}:${auth.user.id}:${content!.trim()}`)
      .digest();
    const lockKey = lockHash.readBigInt64BE(0);

    const idempotencyKey = `reply-token:${normalizedToken}`;

    const effectiveSubject = subjectOverride?.trim() || `AIPP Secretariat Response | ${inquiry.referenceNumber}`;
    const normalizedContent = content!.trim();

    const rendered = renderInquiryReplyEmail({
      inquiryId: inquiry.id,
      referenceNumber: inquiry.referenceNumber,
      fullName: inquiry.fullName,
      email: inquiry.email,
      originalSubject: inquiry.subject,
      originalMessage: inquiry.message,
      replyContent: content!,
      adminName: auth.user.name,
      subjectOverride,
    });

    const replyResult = await prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${tokenLockKey})`;
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;

        const inqCheck = await tx.$queryRaw<Array<{ id: string; status: string }>>`
          SELECT id, status FROM "ContactInquiry" WHERE id = ${inquiry.id} FOR SHARE
        `;
        if (!inqCheck || inqCheck.length === 0) {
          return {
            errorStatus: 404,
            errorMessage: "Inquiry record no longer exists or was removed.",
            errorCode: "INQUIRY_NOT_FOUND",
          };
        }

        const existingByIdempotency = await tx.inquiryReply.findUnique({
          where: { idempotencyKey },
          include: {
            adminUser: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            outbox: {
              select: {
                id: true,
                status: true,
                attemptCount: true,
                acceptedAt: true,
                failedAt: true,
                lastError: true,
                createdAt: true,
              },
            },
          },
        });

        if (existingByIdempotency) {
          if (existingByIdempotency.adminUserId !== auth.user.id) {
            return {
              errorStatus: 409,
              errorMessage: "Idempotency token has already been used by a different administrator.",
              errorCode: "IDEMPOTENCY_KEY_REUSED_BY_DIFFERENT_ADMIN",
            };
          }

          if (existingByIdempotency.inquiryId !== inquiry.id) {
            return {
              errorStatus: 409,
              errorMessage: "Idempotency token has already been used for a different inquiry.",
              errorCode: "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_INQUIRY",
            };
          }

          if (
            existingByIdempotency.subject !== effectiveSubject ||
            existingByIdempotency.content !== normalizedContent
          ) {
            return {
              errorStatus: 409,
              errorMessage: "Idempotency token has already been used with different reply content or payload (subject or body).",
              errorCode: "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD",
            };
          }

          return {
            reply: existingByIdempotency,
            isIdempotentReplay: true,
          };
        }

        const recentDuplicate = await tx.inquiryReply.findFirst({
          where: {
            inquiryId: inquiry.id,
            adminUserId: auth.user.id,
            content: content!.trim(),
            createdAt: { gte: new Date(Date.now() - 60 * 1000) },
          },
          include: {
            adminUser: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            outbox: {
              select: {
                id: true,
                status: true,
                attemptCount: true,
                acceptedAt: true,
                failedAt: true,
                lastError: true,
                createdAt: true,
              },
            },
          },
        });

        if (recentDuplicate) {
          return {
            errorStatus: 409,
            errorMessage: "A reply with identical content was submitted less than 60 seconds ago.",
            errorCode: "DUPLICATE_REPLY",
          };
        }

        const outboxResult = await enqueueEmail(
          {
            recipientEmail: inquiry.email,
            recipientName: inquiry.fullName,
            subject: rendered.subject,
            textBody: rendered.textBody,
            htmlBody: rendered.htmlBody,
            category: "INQUIRY_REPLY",
            idempotencyKey: `inquiry-reply-outbox:${cleanToken}`,
            maxAttempts: 5,
          },
          tx
        );

        const createdReply = await tx.inquiryReply.create({
          data: {
            inquiryId: inquiry.id,
            adminUserId: auth.user.id,
            authorName: auth.user.name,
            authorEmail: auth.user.email,
            recipientEmail: inquiry.email,
            subject: rendered.subject,
            content: content!.trim(),
            outboxId: outboxResult.email.id,
            idempotencyKey,
            status: outboxResult.email.status,
          },
          include: {
            adminUser: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            outbox: {
              select: {
                id: true,
                status: true,
                attemptCount: true,
                acceptedAt: true,
                failedAt: true,
                lastError: true,
                createdAt: true,
              },
            },
          },
        });

        await tx.inquiryActivity.create({
          data: {
            inquiryId: inquiry.id,
            adminUserId: auth.user.id,
            action: "REPLY_QUEUED",
            details: JSON.stringify({
              replyId: createdReply.id,
              outboxId: outboxResult.email.id,
              recipient: inquiry.email,
              subject: rendered.subject,
              idempotencyKey,
            }),
          },
        });

        if (inquiry.status === InquiryStatus.NEW) {
          await tx.contactInquiry.update({
            where: { id: inquiry.id },
            data: { status: InquiryStatus.AWAITING_RESPONSE },
          });
        }

        return {
          reply: createdReply,
          isNew: true,
        };
      },
      {
        maxWait: 20000,
        timeout: 35000,
        isolationLevel: "ReadCommitted",
      }
    );

    if ("errorStatus" in replyResult && replyResult.errorStatus) {
      return NextResponse.json(
        { error: replyResult.errorMessage, code: replyResult.errorCode },
        { status: replyResult.errorStatus, headers: NO_CACHE_HEADERS }
      );
    }

    if ("isIdempotentReplay" in replyResult && replyResult.isIdempotentReplay) {
      return NextResponse.json(
        { success: true, reply: replyResult.reply, idempotent: true },
        { status: 200, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, reply: replyResult.reply },
      { status: 201, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const errObj = error as { code?: string; message?: string };
    if (errObj && (errObj.code === "P2002" || String(errObj.message).includes("Unique constraint failed"))) {
      const bodyData = await request.clone().json().catch(() => ({}));
      const rawToken = typeof bodyData.clientToken === "string" ? bodyData.clientToken.trim() : "";
      const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const fallbackKey = rawToken && UUID_V4_REGEX.test(rawToken) ? `reply-token:${rawToken.toLowerCase()}` : "";
      if (fallbackKey) {
        const conflictingReply = await prisma.inquiryReply.findUnique({
          where: { idempotencyKey: fallbackKey },
          include: {
            adminUser: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            outbox: {
              select: {
                id: true,
                status: true,
                attemptCount: true,
                acceptedAt: true,
                failedAt: true,
                lastError: true,
                createdAt: true,
              },
            },
          },
        });

        if (conflictingReply) {
          const inq = await prisma.contactInquiry.findUnique({
            where: { id },
            select: { referenceNumber: true },
          });
          const reqSubjectOverride = typeof bodyData.subject === "string" && bodyData.subject.trim() ? bodyData.subject.trim() : undefined;
          const reqEffectiveSubject = reqSubjectOverride || (inq ? `AIPP Secretariat Response | ${inq.referenceNumber}` : "");
          const reqContent = String(bodyData.content || "").trim();

          if (conflictingReply.adminUserId !== auth.user.id) {
            return NextResponse.json(
              {
                error: "Idempotency token has already been used by a different administrator.",
                code: "IDEMPOTENCY_KEY_REUSED_BY_DIFFERENT_ADMIN",
              },
              { status: 409, headers: NO_CACHE_HEADERS }
            );
          }
          if (conflictingReply.inquiryId !== id) {
            return NextResponse.json(
              {
                error: "Idempotency token has already been used for a different inquiry.",
                code: "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_INQUIRY",
              },
              { status: 409, headers: NO_CACHE_HEADERS }
            );
          }
          if (
            conflictingReply.subject !== reqEffectiveSubject ||
            conflictingReply.content !== reqContent
          ) {
            return NextResponse.json(
              {
                error: "Idempotency token has already been used with different reply content or payload (subject or body).",
                code: "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD",
              },
              { status: 409, headers: NO_CACHE_HEADERS }
            );
          }
          return NextResponse.json(
            { success: true, reply: conflictingReply, idempotent: true },
            { status: 200, headers: NO_CACHE_HEADERS }
          );
        }
      }

      return NextResponse.json(
        {
          error: "Concurrent request conflict on idempotency token.",
          code: "IDEMPOTENCY_TOKEN_CONFLICT",
        },
        { status: 409, headers: NO_CACHE_HEADERS }
      );
    }

    if (errObj && (errObj.code === "P2003" || String(errObj.message).includes("Foreign key constraint"))) {
      return NextResponse.json(
        {
          error: "Cannot add reply because the inquiry was deleted or does not exist.",
          code: "INQUIRY_NOT_FOUND",
        },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    console.error("[API Inquiry Reply POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to send inquiry reply." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
