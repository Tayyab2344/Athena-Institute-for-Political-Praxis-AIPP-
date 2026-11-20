import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { adminInquiryNoteSchema } from "@/lib/validations/contact";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Origin check
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  // 2. Authorization check
  const auth = await requireAdminAuth(request, "manage_inquiries");
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;

  try {
    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id },
      select: { id: true, referenceNumber: true },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const body = await request.json();
    const result = adminInquiryNoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues?.[0]?.message || "Invalid note content." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const { content } = result.data;

    // Transaction to create note and activity record
    const note = await prisma.$transaction(async (tx) => {
      const createdNote = await tx.inquiryNote.create({
        data: {
          inquiryId: id,
          adminUserId: auth.user.id,
          content,
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
        },
      });

      await tx.inquiryActivity.create({
        data: {
          inquiryId: id,
          adminUserId: auth.user.id,
          action: "NOTE_ADDED",
          details: JSON.stringify({
            noteId: createdNote.id,
            authorName: auth.user.name,
          }),
        },
      });

      return createdNote;
    });

    return NextResponse.json({ note }, { status: 201, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("[API Inquiry Add Note Error]:", error);
    return NextResponse.json(
      { error: "Failed to add internal note." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

