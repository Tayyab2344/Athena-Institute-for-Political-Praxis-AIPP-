import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicationSchema } from "@/lib/validations/publication";
import { PublicationStatus, PublicationType, Prisma, AdminStatus, MediaAssetType } from "@prisma/client";
import { PUBLICATIONS_DATA } from "@/data/mockData";
import { getAdminSessionFromRequest } from "@/lib/auth/session";
import { requireAdminAuth, hasPermission } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { lockMediaAssets, syncMediaAssetStatuses, validateMediaAsset } from "@/lib/media/assetRef";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
  const skip = (page - 1) * limit;

  const type = searchParams.get("type") as PublicationType | null;
  const category = searchParams.get("category");
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : null;
  const search = searchParams.get("search");
  const authorSlug = searchParams.get("author");

  const sessionData = await getAdminSessionFromRequest(request);
  const isAuthorizedAdmin = !!(
    sessionData &&
    sessionData.user.status === AdminStatus.ACTIVE &&
    hasPermission(sessionData.user.role, "manage_publications")
  );

  const responseHeaders = isAuthorizedAdmin
    ? {
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      }
    : undefined;

  try {
    const where: Prisma.PublicationWhereInput = {};

    if (!isAuthorizedAdmin) {
      where.status = PublicationStatus.PUBLISHED;
    } else {
      const requestedStatus = searchParams.get("status");
      if (requestedStatus && requestedStatus !== "ALL") {
        where.status = requestedStatus as PublicationStatus;
      }
    }

    if (type && (type as string) !== "ALL") {
      where.type = type;
    }

    if (category && category !== "ALL") {
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

    const [total, publications] = await Promise.all([
      prisma.publication.count({ where }),
      prisma.publication.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { publicationDate: "desc" },
          { createdAt: "desc" }
        ],
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
      })
    ]);

    if (total > 0 || publications.length > 0) {
      const formatted = publications.map((pub) => ({
        id: pub.id,
        title: pub.title,
        slug: pub.slug,
        abstract: pub.abstract,
        description: pub.description,
        type: pub.type,
        status: pub.status,
        publicationDate: pub.publicationDate,
        year: pub.year,
        coverImageUrl: pub.coverImageUrl,
        coverImageAssetId: pub.coverImageAssetId,
        pdfUrl: pub.pdfUrl,
        pdfAssetId: pub.pdfAssetId,
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

      return NextResponse.json(
        {
          publications: formatted,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        responseHeaders ? { headers: responseHeaders } : undefined
      );
    }
  } catch (error) {
  }

  let filtered = [...PUBLICATIONS_DATA];

  if (type && (type as string) !== "ALL") {
    const typeMap: Record<string, string> = {
      RESEARCH_PAPER: "Research Paper",
      JOURNAL: "Journal",
      POLICY_BRIEF: "Policy Brief",
      REPORT: "Report"
    };
    const targetCategory = typeMap[type] || type;
    filtered = filtered.filter(p => (p.category === targetCategory) || (p.type === type));
  }

  if (category && category !== "ALL") {
    filtered = filtered.filter(p => {
      const pRecord = p as unknown as Record<string, unknown>;
      const catSlug = (pRecord.categorySlug as string) || (typeof p.category === "object" ? (p.category as { slug?: string })?.slug : typeof p.category === "string" ? p.category.toLowerCase().replace(/[\s&]+/g, "-").replace(/--+/g, "-") : undefined);
      return catSlug === category || (typeof p.category === "string" && p.category.toLowerCase().includes(category.toLowerCase()));
    });
  }

  if (year) {
    filtered = filtered.filter(p => (p.year === year) || (p.date && p.date.includes(String(year))));
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
      (p.abstract && p.abstract.toLowerCase().includes(q)) ||
      (p.author && p.author.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limit);

  return NextResponse.json(
    {
      publications: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    },
    responseHeaders ? { headers: responseHeaders } : undefined
  );
}

export async function POST(request: Request) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_publications");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const validated = publicationSchema.parse(body);

    const baseSlug = validated.slug || validated.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let finalSlug = baseSlug;

    const result = await prisma.$transaction(
      async (tx) => {
        await lockMediaAssets(tx, [validated.coverImageAssetId, validated.pdfAssetId]);

        let finalCoverAssetId: string | null = null;
        let finalCoverImageUrl: string | null = null;

        if (validated.coverImageAssetId) {
          const valRes = await validateMediaAsset(tx, validated.coverImageAssetId, MediaAssetType.IMAGE);
          if (!valRes.valid) {
            throw new Error(valRes.error);
          }
          finalCoverAssetId = valRes.asset.id;
          finalCoverImageUrl = valRes.asset.secureUrl;
        } else if (validated.coverImageUrl) {
          finalCoverAssetId = null;
          finalCoverImageUrl = validated.coverImageUrl;
        }

        let finalPdfAssetId: string | null = null;
        let finalPdfUrl: string | null = null;
        let finalPdfFileName: string | null = null;
        let finalPdfFileSize: number | null = null;
        let finalPdfMimeType: string | null = null;

        if (validated.pdfAssetId) {
          const valRes = await validateMediaAsset(tx, validated.pdfAssetId, MediaAssetType.DOCUMENT);
          if (!valRes.valid) {
            throw new Error(valRes.error);
          }
          finalPdfAssetId = valRes.asset.id;
          finalPdfUrl = valRes.asset.secureUrl;
          finalPdfFileName = valRes.asset.originalFilename;
          finalPdfFileSize = valRes.asset.bytes;
          finalPdfMimeType = valRes.asset.mimeType;
        } else if (validated.pdfUrl) {
          finalPdfAssetId = null;
          finalPdfUrl = validated.pdfUrl;
          finalPdfFileName = validated.pdfFileName || null;
          finalPdfFileSize = validated.pdfFileSize || null;
          finalPdfMimeType = validated.pdfMimeType || null;
        }

      const existing = await tx.publication.findUnique({ where: { slug: finalSlug } });
      if (existing) {
        finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }

      const publication = await tx.publication.create({
        data: {
          title: validated.title,
          slug: finalSlug,
          abstract: validated.abstract,
          description: validated.description || null,
          type: validated.type,
          status: validated.status,
          publicationDate: validated.publicationDate ? new Date(validated.publicationDate) : new Date(),
          year: validated.year || new Date().getFullYear(),
          coverImageAssetId: finalCoverAssetId,
          coverImageUrl: finalCoverImageUrl,
          pdfAssetId: finalPdfAssetId,
          pdfUrl: finalPdfUrl,
          pdfFileName: finalPdfFileName,
          pdfFileSize: finalPdfFileSize,
          pdfMimeType: finalPdfMimeType,
          doi: validated.doi || null,
          categoryId: validated.categoryId || null,
          journalIssueId: validated.journalIssueId || null,
          publishedAt: validated.status === PublicationStatus.PUBLISHED ? new Date() : null,
          authors: {
            create: validated.authorIds.map((authorId, index) => ({
              authorId,
              order: index
            }))
          },
          tags: validated.tagNames && validated.tagNames.length > 0 ? {
            create: await Promise.all(
              validated.tagNames.map(async (name) => {
                const tagSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const tag = await tx.tag.upsert({
                  where: { slug: tagSlug },
                  create: { name, slug: tagSlug },
                  update: {}
                });
                return { tagId: tag.id };
              })
            )
          } : undefined
        },
        include: {
          category: true,
          authors: { include: { author: true } },
          tags: { include: { tag: true } },
          coverImageAsset: true,
          pdfAsset: true
        }
      });

      await syncMediaAssetStatuses(tx, [finalCoverAssetId, finalPdfAssetId]);

      return publication;
    }, { maxWait: 20000, timeout: 45000 });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to create publication" },
      { status: 400 }
    );
  }
}
