import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicationSchema } from "@/lib/validations/publication";
import { PublicationStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    const publication = await prisma.publication.findFirst({
      where: {
        OR: [{ slug }, { id: slug }]
      },
      include: {
        category: true,
        journalIssue: {
          include: {
            journal: true
          }
        },
        authors: {
          orderBy: { order: "asc" },
          include: {
            author: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!publication) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    if (!isAdmin && publication.status !== PublicationStatus.PUBLISHED) {
      return NextResponse.json({ error: "Publication not available" }, { status: 404 });
    }

    await prisma.publication.update({
      where: { id: publication.id },
      data: { downloadCount: { increment: 1 } }
    }).catch(() => {});

    return NextResponse.json({
      ...publication,
      authors: publication.authors.map((a: any) => a.author),
      tags: publication.tags.map((t: any) => t.tag)
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch publication" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const validated = publicationSchema.parse(body);

    const existing = await prisma.publication.findFirst({
      where: { OR: [{ slug }, { id: slug }] }
    });

    if (!existing) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    await prisma.publicationAuthor.deleteMany({
      where: { publicationId: existing.id }
    });

    const isNowPublished = validated.status === PublicationStatus.PUBLISHED;
    const updated = await prisma.publication.update({
      where: { id: existing.id },
      data: {
        title: validated.title,
        abstract: validated.abstract,
        description: validated.description,
        type: validated.type,
        status: validated.status,
        publicationDate: validated.publicationDate ? new Date(validated.publicationDate) : existing.publicationDate,
        publishedAt: isNowPublished ? existing.publishedAt || new Date() : null,
        year: validated.year || existing.year,
        coverImageUrl: validated.coverImageUrl,
        pdfUrl: validated.pdfUrl,
        pdfFileName: validated.pdfFileName,
        pdfFileSize: validated.pdfFileSize,
        pdfMimeType: validated.pdfMimeType,
        doi: validated.doi,
        categoryId: validated.categoryId || null,
        journalIssueId: validated.journalIssueId || null,
        authors: {
          create: validated.authorIds.map((authorId, idx) => ({
            authorId,
            order: idx
          }))
        }
      },
      include: {
        category: true,
        authors: { include: { author: true } }
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update publication" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const existing = await prisma.publication.findFirst({
      where: { OR: [{ slug }, { id: slug }] }
    });

    if (!existing) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    await prisma.publication.delete({
      where: { id: existing.id }
    });

    return NextResponse.json({ success: true, message: "Publication deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete publication" }, { status: 500 });
  }
}
