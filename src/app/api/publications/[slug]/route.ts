import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicationUpdateSchema } from "@/lib/validations/publication";
import { PublicationStatus, AdminStatus, MediaAssetType } from "@prisma/client";
import { PUBLICATIONS_DATA } from "@/data/mockData";
import { getAdminSessionFromRequest } from "@/lib/auth/session";
import { requireAdminAuth, hasPermission } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { lockMediaAssets, syncMediaAssetStatuses, validateMediaAsset } from "@/lib/media/assetRef";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const sessionData = await getAdminSessionFromRequest(request);
  const isAuthorizedAdmin = !!(
    sessionData &&
    sessionData.user.status === AdminStatus.ACTIVE &&
    hasPermission(sessionData.user.role, "manage_publications")
  );

  try {
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

    if (publication) {
      if (!isAuthorizedAdmin && publication.status !== PublicationStatus.PUBLISHED) {
        return NextResponse.json(
          { error: "Publication not available" },
          {
            status: 404,
            headers: {
              "Cache-Control": "private, no-store, no-cache, must-revalidate",
              "Pragma": "no-cache",
            },
          }
        );
      }

      if (!isAuthorizedAdmin) {
        await prisma.publication.update({
          where: { id: publication.id },
          data: { downloadCount: { increment: 1 } }
        }).catch(() => {});
      }

      const responseHeaders = isAuthorizedAdmin || publication.status !== PublicationStatus.PUBLISHED
        ? {
            "Cache-Control": "private, no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
          }
        : undefined;

      return NextResponse.json(
        {
          ...publication,
          authors: publication.authors.map((a) => a.author),
          tags: publication.tags.map((t) => t.tag)
        },
        responseHeaders ? { headers: responseHeaders } : undefined
      );
    }
  } catch (error) {
  }

  const fallback = PUBLICATIONS_DATA.find((p) => p.slug === slug || p.id === slug);
  if (fallback) {
    return NextResponse.json({
      ...fallback,
      slug: fallback.slug || fallback.id,
      abstract: fallback.abstract || fallback.excerpt,
      description: fallback.description || fallback.excerpt,
      authors: (fallback.authors && fallback.authors.length > 0)
        ? fallback.authors
        : (fallback.author ? [{ id: "auth-1", name: fallback.author, role: fallback.role }] : [])
    });
  }

  return NextResponse.json({ error: "Publication not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_publications");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const validated = publicationUpdateSchema.parse(body);

    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.publication.findFirst({
        where: { OR: [{ slug }, { id: slug }] }
      });

      if (!existing) {
        return null;
      }

      const coverTouched =
        validated.coverImageAssetId !== undefined || validated.coverImageUrl !== undefined;
      const pdfTouched =
        validated.pdfAssetId !== undefined || validated.pdfUrl !== undefined;

      if (coverTouched || pdfTouched) {
        await lockMediaAssets(tx, [
          coverTouched ? existing.coverImageAssetId : null,
          pdfTouched ? existing.pdfAssetId : null,
          validated.coverImageAssetId,
          validated.pdfAssetId
        ]);
      }

      let newCoverAssetId = existing.coverImageAssetId;
      let newCoverImageUrl = existing.coverImageUrl;

      if (validated.coverImageAssetId !== undefined) {
        if (validated.coverImageAssetId === null || validated.coverImageAssetId === "") {
          newCoverAssetId = null;
          newCoverImageUrl = null;
        } else {
          const valRes = await validateMediaAsset(tx, validated.coverImageAssetId, MediaAssetType.IMAGE);
          if (!valRes.valid) {
            throw new Error(valRes.error);
          }
          newCoverAssetId = valRes.asset.id;
          newCoverImageUrl = valRes.asset.secureUrl;
        }
      } else if (validated.coverImageUrl !== undefined) {
        if (validated.coverImageUrl === null || validated.coverImageUrl === "") {
          newCoverAssetId = null;
          newCoverImageUrl = null;
        } else {
          newCoverAssetId = null;
          newCoverImageUrl = validated.coverImageUrl;
        }
      }

      let newPdfAssetId = existing.pdfAssetId;
      let newPdfUrl = existing.pdfUrl;
      let newPdfFileName = existing.pdfFileName;
      let newPdfFileSize = existing.pdfFileSize;
      let newPdfMimeType = existing.pdfMimeType;

      if (validated.pdfAssetId !== undefined) {
        if (validated.pdfAssetId === null || validated.pdfAssetId === "") {
          newPdfAssetId = null;
          newPdfUrl = null;
          newPdfFileName = null;
          newPdfFileSize = null;
          newPdfMimeType = null;
        } else {
          const valRes = await validateMediaAsset(tx, validated.pdfAssetId, MediaAssetType.DOCUMENT);
          if (!valRes.valid) {
            throw new Error(valRes.error);
          }
          newPdfAssetId = valRes.asset.id;
          newPdfUrl = valRes.asset.secureUrl;
          newPdfFileName = valRes.asset.originalFilename;
          newPdfFileSize = valRes.asset.bytes;
          newPdfMimeType = valRes.asset.mimeType;
        }
      } else if (validated.pdfUrl !== undefined) {
        if (validated.pdfUrl === null || validated.pdfUrl === "") {
          newPdfAssetId = null;
          newPdfUrl = null;
          newPdfFileName = null;
          newPdfFileSize = null;
          newPdfMimeType = null;
        } else {
          newPdfAssetId = null;
          newPdfUrl = validated.pdfUrl;
          newPdfFileName = validated.pdfFileName !== undefined ? validated.pdfFileName : existing.pdfFileName;
          newPdfFileSize = validated.pdfFileSize !== undefined ? validated.pdfFileSize : existing.pdfFileSize;
          newPdfMimeType = validated.pdfMimeType !== undefined ? validated.pdfMimeType : existing.pdfMimeType;
        }
      }

      if (validated.authorIds) {
        await tx.publicationAuthor.deleteMany({
          where: { publicationId: existing.id }
        });
      }

      const targetStatus = validated.status ?? existing.status;
      const isNowPublished = targetStatus === PublicationStatus.PUBLISHED;
      const finalPublishedAt = isNowPublished && !existing.publishedAt ? new Date() : existing.publishedAt;

      const updatedPub = await tx.publication.update({
        where: { id: existing.id },
        data: {
          title: validated.title ?? existing.title,
          slug: validated.slug || existing.slug,
          abstract: validated.abstract ?? existing.abstract,
          description: validated.description !== undefined ? validated.description : existing.description,
          type: validated.type ?? existing.type,
          status: targetStatus,
          publicationDate: validated.publicationDate ? new Date(validated.publicationDate) : existing.publicationDate,
          year: validated.year !== undefined ? validated.year : existing.year,
          coverImageAssetId: newCoverAssetId,
          coverImageUrl: newCoverImageUrl,
          pdfAssetId: newPdfAssetId,
          pdfUrl: newPdfUrl,
          pdfFileName: newPdfFileName,
          pdfFileSize: newPdfFileSize,
          pdfMimeType: newPdfMimeType,
          doi: validated.doi !== undefined ? validated.doi : existing.doi,
          categoryId: validated.categoryId !== undefined ? (validated.categoryId || null) : existing.categoryId,
          journalIssueId: validated.journalIssueId !== undefined ? (validated.journalIssueId || null) : existing.journalIssueId,
          publishedAt: finalPublishedAt,
          ...(validated.authorIds ? {
            authors: {
              create: validated.authorIds.map((authorId, index) => ({
                authorId,
                order: index
              }))
            }
          } : {})
        },
        include: {
          category: true,
          authors: { include: { author: true } },
          tags: { include: { tag: true } },
          coverImageAsset: true,
          pdfAsset: true
        }
      });

      if (coverTouched || pdfTouched) {
        await syncMediaAssetStatuses(tx, [
          coverTouched ? existing.coverImageAssetId : null,
          pdfTouched ? existing.pdfAssetId : null,
          coverTouched ? newCoverAssetId : null,
          pdfTouched ? newPdfAssetId : null
        ]);
      }

      return updatedPub;
    }, { maxWait: 20000, timeout: 45000 });

    if (!updated) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to update publication" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_publications");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { slug } = await params;
    const deleted = await prisma.$transaction(async (tx) => {
      const existing = await tx.publication.findFirst({
        where: { OR: [{ slug }, { id: slug }] }
      });

      if (!existing) {
        return null;
      }

      const lockedAssetIds = await lockMediaAssets(tx, [
        existing.coverImageAssetId,
        existing.pdfAssetId
      ]);

      await tx.publication.delete({
        where: { id: existing.id }
      });

      await syncMediaAssetStatuses(tx, lockedAssetIds);

      return true;
    }, { maxWait: 20000, timeout: 45000 });

    if (!deleted) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Publication deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete publication" }, { status: 500 });
  }
}
