import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorUpdateSchema } from "@/lib/validations/publication";
import { getAdminSessionFromRequest } from "@/lib/auth/session";
import { hasPermission, requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { AdminStatus, MediaAssetType, PublicationStatus } from "@prisma/client";
import {
  lockMediaAssets,
  syncMediaAssetStatuses,
  validateMediaAsset
} from "@/lib/media/assetRef";
import {
  extractUniqueConstraintConflict,
  normalizeSlug,
  PRIVATE_NO_STORE_HEADERS,
  SAFE_ADMIN_ASSET_SELECT
} from "@/lib/media/slug";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const sessionData = await getAdminSessionFromRequest(request);
  const isAuthorizedAdmin = !!(
    sessionData &&
    sessionData.user.status === AdminStatus.ACTIVE &&
    hasPermission(sessionData.user.role, "manage_authors")
  );

  try {
    const author = isAuthorizedAdmin
      ? await prisma.author.findFirst({
          where: { OR: [{ id }, { slug: id }] },
          select: {
            id: true,
            name: true,
            slug: true,
            biography: true,
            affiliation: true,
            position: true,
            photoUrl: true,
            photoAssetId: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            photoAsset: { select: SAFE_ADMIN_ASSET_SELECT },
            publications: {
              orderBy: { publication: { updatedAt: "desc" } },
              include: {
                publication: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    type: true,
                    status: true,
                    year: true,
                    publishedAt: true
                  }
                }
              }
            }
          }
        })
      : await prisma.author.findFirst({
          where: { OR: [{ id }, { slug: id }] },
          select: {
            id: true,
            name: true,
            slug: true,
            biography: true,
            affiliation: true,
            position: true,
            photoUrl: true,
            createdAt: true,
            updatedAt: true,
            publications: {
              where: {
                publication: { status: PublicationStatus.PUBLISHED }
              },
              orderBy: { publication: { publicationDate: "desc" } },
              include: {
                publication: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    abstract: true,
                    type: true,
                    year: true,
                    publicationDate: true,
                    coverImageUrl: true
                  }
                }
              }
            }
          }
        });

    if (!author) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404, headers: isAuthorizedAdmin ? PRIVATE_NO_STORE_HEADERS : undefined }
      );
    }

    return NextResponse.json(
      author,
      isAuthorizedAdmin ? { headers: PRIVATE_NO_STORE_HEADERS } : undefined
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch author" },
      { status: 500, headers: isAuthorizedAdmin ? PRIVATE_NO_STORE_HEADERS : undefined }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_authors");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const validated = authorUpdateSchema.parse(body);
    const normalizedSlug = validated.slug !== undefined ? normalizeSlug(validated.slug) : undefined;
    if (validated.slug !== undefined && !normalizedSlug) {
      return NextResponse.json(
        { error: "Slug must contain alphanumeric characters." },
        { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    const updated = await prisma.$transaction(
      async (tx) => {
        const existing = await tx.author.findFirst({
          where: { OR: [{ id }, { slug: id }] }
        });

        if (!existing) {
          return null;
        }

        const photoTouched =
          validated.photoAssetId !== undefined || validated.photoUrl !== undefined;

        if (photoTouched) {
          await lockMediaAssets(tx, [existing.photoAssetId, validated.photoAssetId]);
        }

        let finalPhotoAssetId = existing.photoAssetId;
        let finalPhotoUrl = existing.photoUrl;

        if (validated.photoAssetId !== undefined) {
          if (validated.photoAssetId === null || validated.photoAssetId === "") {
            finalPhotoAssetId = null;
            finalPhotoUrl = null;
          } else {
            const valRes = await validateMediaAsset(
              tx,
              validated.photoAssetId,
              MediaAssetType.IMAGE
            );
            if (!valRes.valid) throw new Error(valRes.error);
            finalPhotoAssetId = valRes.asset.id;
            finalPhotoUrl = valRes.asset.secureUrl;
          }
        } else if (validated.photoUrl !== undefined) {
          finalPhotoAssetId = null;
          finalPhotoUrl = validated.photoUrl || null;
        }

        const res = await tx.author.update({
          where: { id: existing.id },
          data: {
            ...(validated.name ? { name: validated.name.trim() } : {}),
            ...(normalizedSlug ? { slug: normalizedSlug } : {}),
            ...(validated.biography !== undefined
              ? { biography: validated.biography || null }
              : {}),
            ...(validated.affiliation !== undefined
              ? { affiliation: validated.affiliation || null }
              : {}),
            ...(validated.position !== undefined ? { position: validated.position || null } : {}),
            ...(validated.email !== undefined ? { email: validated.email || null } : {}),
            photoUrl: finalPhotoUrl,
            photoAssetId: finalPhotoAssetId
          },
          include: {
            photoAsset: { select: SAFE_ADMIN_ASSET_SELECT }
          }
        });

        if (photoTouched) {
          await syncMediaAssetStatuses(tx, [existing.photoAssetId, finalPhotoAssetId]);
        }

        return res;
      },
      { maxWait: 20000, timeout: 45000 }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(updated, { headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error: unknown) {
    const conflict = extractUniqueConstraintConflict(error);
    if (conflict.isUnique) {
      return NextResponse.json(
        { error: "An author with this slug already exists. Please choose a different slug." },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to update author" },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_authors");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const outcome = await prisma.$transaction(
      async (tx) => {
        const existing = await tx.author.findFirst({
          where: { OR: [{ id }, { slug: id }] },
          include: {
            _count: {
              select: { publications: true }
            }
          }
        });

        if (!existing) {
          return { status: "NOT_FOUND" as const };
        }

        if (existing._count.publications > 0) {
          return {
            status: "IN_USE" as const,
            publicationCount: existing._count.publications
          };
        }

        const affected = [existing.photoAssetId];
        await lockMediaAssets(tx, affected);

        await tx.author.delete({
          where: { id: existing.id }
        });

        await syncMediaAssetStatuses(tx, affected);

        return { status: "DELETED" as const };
      },
      { maxWait: 20000, timeout: 45000 }
    );

    if (outcome.status === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    if (outcome.status === "IN_USE") {
      return NextResponse.json(
        {
          error: `Cannot delete author while attributed to ${outcome.publicationCount} publication${outcome.publicationCount === 1 ? "" : "s"}. Reassign or detach those publications first.`,
          publicationCount: outcome.publicationCount
        },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    return NextResponse.json({ success: true }, { headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to delete author" },
      { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}
