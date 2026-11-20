import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { adminInquiryUpdateSchema } from "@/lib/validations/contact";
import { sanitizeReplyDeliveryError } from "@/lib/email/inquiry-replies";
import { InquiryStatus, InquiryPriority, AdminStatus, AdminRole } from "@prisma/client";

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
    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        notes: {
          orderBy: { createdAt: "asc" },
          include: {
            adminUser: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          include: {
            adminUser: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
        replies: {
          orderBy: { createdAt: "desc" },
          include: {
            adminUser: {
              select: {
                id: true,
                name: true,
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
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const sanitizedReplies = inquiry.replies.map((r) => {
      const sanitized = sanitizeReplyDeliveryError(r.outbox?.lastError);
      return {
        id: r.id,
        inquiryId: r.inquiryId,
        adminUserId: r.adminUserId,
        authorName: r.authorName || r.adminUser?.name || "Administrator",
        authorEmail: r.authorEmail || null,
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

    return NextResponse.json(
      { inquiry: { ...inquiry, replies: sanitizedReplies } },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("[API Inquiry GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve inquiry detail." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_inquiries");
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const result = adminInquiryUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid update payload.", fieldErrors: result.error.flatten().fieldErrors },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const currentInquiry = await prisma.contactInquiry.findUnique({
      where: { id },
      include: { assignedTo: true },
    });

    if (!currentInquiry) {
      return NextResponse.json(
        { error: "Inquiry not found." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const { status, priority, assignedToId } = result.data;
    const activitiesToCreate: Array<{ action: string; adminUserId: string; details: string }> = [];

    const updateData: {
      status?: InquiryStatus;
      priority?: InquiryPriority;
      assignedToId?: string | null;
      resolvedAt?: Date | null;
    } = {};

    if (status && status !== currentInquiry.status) {
      updateData.status = status;
      if (status === InquiryStatus.RESOLVED) {
        updateData.resolvedAt = new Date();
      } else if (currentInquiry.status === InquiryStatus.RESOLVED) {
        updateData.resolvedAt = null;
      }

      activitiesToCreate.push({
        action: "STATUS_CHANGED",
        adminUserId: auth.user.id,
        details: JSON.stringify({
          from: currentInquiry.status,
          to: status,
          actor: auth.user.name,
        }),
      });
    }

    if (priority && priority !== currentInquiry.priority) {
      updateData.priority = priority;
      activitiesToCreate.push({
        action: "PRIORITY_CHANGED",
        adminUserId: auth.user.id,
        details: JSON.stringify({
          from: currentInquiry.priority,
          to: priority,
          actor: auth.user.name,
        }),
      });
    }

    if (assignedToId !== undefined && assignedToId !== currentInquiry.assignedToId) {
      if (assignedToId !== null) {
        const targetAdmin = await prisma.adminUser.findUnique({
          where: { id: assignedToId },
        });
        if (
          !targetAdmin ||
          targetAdmin.status !== AdminStatus.ACTIVE ||
          (targetAdmin.role !== AdminRole.SUPER_ADMIN && targetAdmin.role !== AdminRole.INQUIRY_MANAGER)
        ) {
          return NextResponse.json(
            {
              error:
                "Assigned administrator does not exist, is suspended, or is not eligible for inquiry assignment.",
            },
            { status: 400, headers: NO_CACHE_HEADERS }
          );
        }
        updateData.assignedToId = assignedToId;
        activitiesToCreate.push({
          action: "ASSIGNED",
          adminUserId: auth.user.id,
          details: JSON.stringify({
            assignedToId: targetAdmin.id,
            assignedToName: targetAdmin.name,
            actor: auth.user.name,
          }),
        });
      } else {
        updateData.assignedToId = null;
        activitiesToCreate.push({
          action: "UNASSIGNED",
          adminUserId: auth.user.id,
          details: JSON.stringify({
            previouslyAssignedTo: currentInquiry.assignedTo?.name || "Unknown",
            actor: auth.user.name,
          }),
        });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const inq = await tx.contactInquiry.update({
        where: { id },
        data: updateData,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      for (const act of activitiesToCreate) {
        await tx.inquiryActivity.create({
          data: {
            inquiryId: id,
            adminUserId: act.adminUserId,
            action: act.action,
            details: act.details,
          },
        });
      }

      return inq;
    });

    return NextResponse.json({ inquiry: updated }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("[API Inquiry PATCH Error]:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_inquiries");
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;

  try {
    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            replies: true,
            activities: true,
            notes: true,
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const searchParams = new URL(request.url).searchParams;
    const forceHardDelete = searchParams.get("hard") === "true";

    if (forceHardDelete) {
      if (inquiry._count.replies > 0) {
        return NextResponse.json(
          {
            error: "Cannot permanently delete inquiry with associated official replies. Archival required to preserve audit history.",
            code: "INQUIRY_HAS_REPLIES",
            replyCount: inquiry._count.replies,
          },
          { status: 409, headers: NO_CACHE_HEADERS }
        );
      }

      const deleteResult = await prisma.$transaction(
        async (tx) => {
          const lockedInquiry = await tx.$queryRaw<Array<{ id: string; status: string }>>`
            SELECT id, status FROM "ContactInquiry" WHERE id = ${id} FOR UPDATE
          `;

          if (!lockedInquiry || lockedInquiry.length === 0) {
            return {
              errorStatus: 404,
              errorMessage: "Inquiry not found.",
            };
          }

          const currentReplyCount = await tx.inquiryReply.count({
            where: { inquiryId: id },
          });

          if (currentReplyCount > 0) {
            return {
              errorStatus: 409,
              errorMessage: "Cannot permanently delete inquiry with associated official replies. Archival required to preserve audit history.",
              errorCode: "INQUIRY_HAS_REPLIES",
              replyCount: currentReplyCount,
            };
          }

          await tx.inquiryNote.deleteMany({ where: { inquiryId: id } });
          await tx.inquiryActivity.deleteMany({ where: { inquiryId: id } });
          await tx.contactInquiry.delete({ where: { id } });

          return { deleted: true };
        },
        {
          maxWait: 20000,
          timeout: 35000,
          isolationLevel: "ReadCommitted",
        }
      );

      if ("errorStatus" in deleteResult && deleteResult.errorStatus) {
        return NextResponse.json(
          { error: deleteResult.errorMessage, code: deleteResult.errorCode, replyCount: deleteResult.replyCount },
          { status: deleteResult.errorStatus, headers: NO_CACHE_HEADERS }
        );
      }

      return NextResponse.json(
        {
          success: true,
          deleted: true,
          message: "Inquiry without replies successfully deleted.",
        },
        { status: 200, headers: NO_CACHE_HEADERS }
      );
    }

    const archived = await prisma.$transaction(async (tx) => {
      const updated = await tx.contactInquiry.update({
        where: { id },
        data: { status: InquiryStatus.ARCHIVED },
      });

      await tx.inquiryActivity.create({
        data: {
          inquiryId: id,
          adminUserId: auth.user.id,
          action: "STATUS_CHANGED",
          details: JSON.stringify({
            from: inquiry.status,
            to: InquiryStatus.ARCHIVED,
            reason: "Archived via deletion endpoint",
            actor: auth.user.name,
          }),
        },
      });

      return updated;
    });

    return NextResponse.json(
      {
        success: true,
        archived: true,
        message: "Inquiry successfully archived to preserve historical audit trail.",
        inquiry: archived,
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const errCode = (error as { code?: string })?.code;
    const errMsg = String((error as { message?: string })?.message || "").toLowerCase();
    if (
      errCode === "P2003" ||
      errCode === "23001" ||
      errMsg.includes("violates restrict setting") ||
      errMsg.includes("foreign key constraint")
    ) {
      return NextResponse.json(
        {
          error: "Cannot permanently delete inquiry with associated official replies. Archival required to preserve audit history.",
          code: "INQUIRY_HAS_REPLIES",
        },
        { status: 409, headers: NO_CACHE_HEADERS }
      );
    }
    console.error("[API Inquiry DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete or archive inquiry." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

