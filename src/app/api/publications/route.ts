import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicationSchema } from "@/lib/validations/publication";
import { PublicationStatus, PublicationType, Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const type = searchParams.get("type") as PublicationType | null;
    const category = searchParams.get("category");
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : null;
    const search = searchParams.get("search");
    const authorSlug = searchParams.get("author");
    const isAdmin = searchParams.get("admin") === "true";

    const where: Prisma.PublicationWhereInput = {};

    if (!isAdmin) {
      where.status = PublicationStatus.PUBLISHED;
    } else if (searchParams.get("status")) {
      where.status = searchParams.get("status") as PublicationStatus;
    }

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = {
        slug: category
      };
    }

    if (year) {
      where.year = year;
    }

    if (authorSlug) {
      where.authors = {
        some: {
          author: {
            slug: authorSlug
          }
        }
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { abstract: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          authors: {
            some: {
              author: {
                name: { contains: search, mode: "insensitive" }
              }
            }
          }
        }
      ];
    }

    const [publications, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
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
      }),
      prisma.publication.count({ where })
    ]);

    const formatted = publications.map((pub) => ({
      id: pub.id,
      title: pub.title,
      slug: pub.slug,
      abstract: pub.abstract,
      description: pub.description,
      type: pub.type,
      status: pub.status,
      publicationDate: pub.publicationDate?.toISOString() || null,
      publishedAt: pub.publishedAt?.toISOString() || null,
      year: pub.year,
      coverImageUrl: pub.coverImageUrl,
      pdfUrl: pub.pdfUrl,
      pdfFileName: pub.pdfFileName,
      pdfFileSize: pub.pdfFileSize,
      pdfMimeType: pub.pdfMimeType,
      doi: pub.doi,
      downloadCount: pub.downloadCount,
      category: pub.category,
      journalIssue: pub.journalIssue,
      authors: pub.authors.map((a) => a.author),
      tags: pub.tags.map((t) => t.tag)
    }));

    return NextResponse.json({
      publications: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = publicationSchema.parse(body);

    const generatedSlug = validated.slug
      ? validated.slug
      : validated.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

    let existingSlug = await prisma.publication.findUnique({
      where: { slug: generatedSlug }
    });

    let finalSlug = generatedSlug;
    if (existingSlug) {
      finalSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
    }

    const publication = await prisma.publication.create({
      data: {
        title: validated.title,
        slug: finalSlug,
        abstract: validated.abstract,
        description: validated.description,
        type: validated.type,
        status: validated.status,
        publicationDate: validated.publicationDate ? new Date(validated.publicationDate) : new Date(),
        publishedAt: validated.status === PublicationStatus.PUBLISHED ? new Date() : null,
        year: validated.year || new Date().getFullYear(),
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

    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create publication. Check fields and validation rules." },
      { status: 400 }
    );
  }
}
