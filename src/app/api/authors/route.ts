import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorSchema, authorUpdateSchema } from "@/lib/validations/publication";
import { getAdminSessionFromRequest } from "@/lib/auth/session";
import { hasPermission, requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { AdminStatus, MediaAssetType, Prisma, PublicationStatus } from "@prisma/client";
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

export async function GET(request: Request) {
  const sessionData = await getAdminSessionFromRequest(request);
  const isAuthorizedAdmin = !!(
    sessionData &&
    sessionData.user.status === AdminStatus.ACTIVE &&
    hasPermission(sessionData.user.role, "manage_authors")
  );

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || undefined;
  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");
  const wantPaginated = searchParams.get("paginated") === "true" || rawPage !== null;

  const page = rawPage ? parseInt(rawPage, 10) : 1;
  const limit = rawLimit ? parseInt(rawLimit, 10) : 24;

  if (wantPaginated && (isNaN(page) || page < 1)) {
    return NextResponse.json(
      { error: "Invalid page parameter. Must be a positive integer." },
      { status: 400, headers: isAuthorizedAdmin ? PRIVATE_NO_STORE_HEADERS : undefined }
    );
  }

  if (wantPaginated && (isNaN(limit) || limit < 1 || limit > 100)) {
    return NextResponse.json(
      { error: "Invalid limit parameter. Must be an integer between 1 and 100." },
      { status: 400, headers: isAuthorizedAdmin ? PRIVATE_NO_STORE_HEADERS : undefined }
    );
  }

  const where: Prisma.AuthorWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { affiliation: { contains: search, mode: "insensitive" } },
          { position: { contains: search, mode: "insensitive" } }
        ]
      }
    : {};

  try {
    const queryOptions = {
      where,
      orderBy: { name: "asc" as const },
      ...(wantPaginated ? { skip: (page - 1) * limit, take: limit } : {})
    };

    const [total, authors] = await Promise.all([
      wantPaginated ? prisma.author.count({ where }) : Promise.resolve(0),
      isAuthorizedAdmin
        ? prisma.author.findMany({
            ...queryOptions,
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
              _count: {
                select: { publications: true }
              }
            }
          })
        : prisma.author.findMany({
            ...queryOptions,
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
              _count: {
                select: {
                  publications: {
                    where: {
                      publication: { status: PublicationStatus.PUBLISHED }
                    }
                  }
                }
              }
            }
          })
    ]);

    const responseInit = isAuthorizedAdmin ? { headers: PRIVATE_NO_STORE_HEADERS } : undefined;

    if (wantPaginated) {
      return NextResponse.json(
        {
          authors,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(total / limit))
          }
        },
        responseInit
      );
    }

    return NextResponse.json(authors, responseInit);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500, headers: isAuthorizedAdmin ? PRIVATE_NO_STORE_HEADERS : undefined }
    );
  }
}

export async function POST(request: Request) {
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
    const validated = authorSchema.parse(body);

    const slug = normalizeSlug(validated.slug || validated.name);
    if (!slug) {
      return NextResponse.json(
        { error: "A valid author name or slug is required." },
        { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    const author = await prisma.$transaction(
      async (tx) => {
        const finalPhotoAssetId = validated.photoAssetId || null;
        let finalPhotoUrl = validated.photoUrl || null;

        await lockMediaAssets(tx, [finalPhotoAssetId]);

        if (finalPhotoAssetId) {
          const valRes = await validateMediaAsset(tx, finalPhotoAssetId, MediaAssetType.IMAGE);
          if (!valRes.valid) {
            throw new Error(valRes.error);
          }
          finalPhotoUrl = valRes.asset.secureUrl;
        }

        const created = await tx.author.create({
          data: {
            name: validated.name.trim(),
            slug,
            biography: validated.biography || null,
            affiliation: validated.affiliation || null,
            position: validated.position || null,
            photoUrl: finalPhotoUrl,
            photoAssetId: finalPhotoAssetId,
            email: validated.email || null
          },
          include: {
            photoAsset: { select: SAFE_ADMIN_ASSET_SELECT }
          }
        });

        await syncMediaAssetStatuses(tx, [finalPhotoAssetId]);

        return created;
      },
      { maxWait: 20000, timeout: 45000 }
    );

    return NextResponse.json(author, { status: 201, headers: PRIVATE_NO_STORE_HEADERS });
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
      { error: err.message || "Failed to create author" },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}

export async function PUT(request: Request) {
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
    const id = body.id || body.slug;

    if (!id) {
      return NextResponse.json(
        { error: "Missing author id or slug" },
        { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

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
