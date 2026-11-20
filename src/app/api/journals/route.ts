import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  journalSchema,
  journalIssueSchema,
  journalUpdateSchema,
  journalIssueUpdateSchema
} from "@/lib/validations/publication";
import { getAdminSessionFromRequest } from "@/lib/auth/session";
import { hasPermission, requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import {
  AdminStatus,
  JournalStatus,
  MediaAssetType,
  Prisma,
  PublicationStatus
} from "@prisma/client";
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
import {
  DETERMINISTIC_ISSUE_ORDER_BY,
  IssueParentUnpublishedError,
  lockParentJournalForUpdate,
  parseJournalStatusFilter,
  resolveIssuePublishedAtOnCreate,
  resolveIssuePublishedAtOnUpdate
} from "@/lib/media/journalLifecycle";

export async function GET(request: Request) {
  const sessionData = await getAdminSessionFromRequest(request);
  const isAuthorizedAdmin = !!(
    sessionData &&
    sessionData.user.status === AdminStatus.ACTIVE &&
    hasPermission(sessionData.user.role, "manage_journals")
  );

  const { searchParams } = new URL(request.url);
  const publicOnlyRequested = searchParams.get("publicOnly") === "true";
  const effectiveAdminView = isAuthorizedAdmin && !publicOnlyRequested;
  const responseHeaders = effectiveAdminView ? PRIVATE_NO_STORE_HEADERS : undefined;

  const parsedStatus = parseJournalStatusFilter(searchParams.get("status"));
  if (!parsedStatus.ok) {
    return NextResponse.json(
      { error: parsedStatus.error },
      { status: 400, headers: responseHeaders }
    );
  }

  const search = searchParams.get("search")?.trim() || undefined;
  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");
  const wantPaginated = searchParams.get("paginated") === "true" || rawPage !== null;

  const page = rawPage ? parseInt(rawPage, 10) : 1;
  const limit = rawLimit ? parseInt(rawLimit, 10) : 20;

  if (wantPaginated && (isNaN(page) || page < 1)) {
    return NextResponse.json(
      { error: "Invalid page parameter. Must be a positive integer." },
      { status: 400, headers: responseHeaders }
    );
  }

  if (wantPaginated && (isNaN(limit) || limit < 1 || limit > 100)) {
    return NextResponse.json(
      { error: "Invalid limit parameter. Must be an integer between 1 and 100." },
      { status: 400, headers: responseHeaders }
    );
  }

  if (!effectiveAdminView && parsedStatus.status && parsedStatus.status !== JournalStatus.PUBLISHED) {
    if (wantPaginated) {
      return NextResponse.json({
        journals: [],
        pagination: { total: 0, page, limit, totalPages: 1 }
      });
    }
    return NextResponse.json([]);
  }

  const where: Prisma.JournalWhereInput = {};

  if (!effectiveAdminView) {
    where.status = JournalStatus.PUBLISHED;
  } else if (parsedStatus.status) {
    where.status = parsedStatus.status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      {
        issues: {
          some: {
            ...(effectiveAdminView ? {} : { status: JournalStatus.PUBLISHED }),
            title: { contains: search, mode: "insensitive" }
          }
        }
      }
    ];
  }

  try {
    const queryOptions = {
      where,
      orderBy: { updatedAt: "desc" as const },
      ...(wantPaginated ? { skip: (page - 1) * limit, take: limit } : {})
    };

    const [total, journals] = await Promise.all([
      wantPaginated ? prisma.journal.count({ where }) : Promise.resolve(0),
      effectiveAdminView
        ? prisma.journal.findMany({
            ...queryOptions,
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              status: true,
              coverImageUrl: true,
              coverImageAssetId: true,
              createdAt: true,
              updatedAt: true,
              coverImageAsset: { select: SAFE_ADMIN_ASSET_SELECT },
              issues: {
                orderBy: DETERMINISTIC_ISSUE_ORDER_BY,
                select: {
                  id: true,
                  journalId: true,
                  volume: true,
                  issue: true,
                  title: true,
                  description: true,
                  status: true,
                  coverImageUrl: true,
                  coverImageAssetId: true,
                  pdfUrl: true,
                  pdfAssetId: true,
                  publishedAt: true,
                  createdAt: true,
                  updatedAt: true,
                  coverImageAsset: { select: SAFE_ADMIN_ASSET_SELECT },
                  pdfAsset: { select: SAFE_ADMIN_ASSET_SELECT },
                  publications: {
                    orderBy: { updatedAt: "desc" },
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                      type: true,
                      status: true,
                      abstract: true
                    }
                  }
                }
              }
            }
          })
        : prisma.journal.findMany({
            ...queryOptions,
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              status: true,
              coverImageUrl: true,
              createdAt: true,
              updatedAt: true,
              issues: {
                where: { status: JournalStatus.PUBLISHED },
                orderBy: DETERMINISTIC_ISSUE_ORDER_BY,
                select: {
                  id: true,
                  journalId: true,
                  volume: true,
                  issue: true,
                  title: true,
                  description: true,
                  status: true,
                  coverImageUrl: true,
                  pdfUrl: true,
                  publishedAt: true,
                  createdAt: true,
                  updatedAt: true,
                  publications: {
                    where: { status: PublicationStatus.PUBLISHED },
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                      type: true,
                      abstract: true
                    }
                  }
                }
              }
            }
          })
    ]);

    const responseInit = responseHeaders ? { headers: responseHeaders } : undefined;

    if (wantPaginated) {
      return NextResponse.json(
        {
          journals,
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

    return NextResponse.json(journals, responseInit);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch journals" },
      { status: 500, headers: responseHeaders }
    );
  }
}

export async function POST(request: Request) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_journals");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();

    if (body.journalId) {
      const validated = journalIssueSchema.parse(body);
      const targetStatus: JournalStatus = validated.status ?? JournalStatus.DRAFT;

      const issue = await prisma.$transaction(
        async (tx) => {
          const parentJournal = await lockParentJournalForUpdate(tx, validated.journalId);
          if (!parentJournal) {
            return null;
          }

          if (
            targetStatus === JournalStatus.PUBLISHED &&
            parentJournal.status !== JournalStatus.PUBLISHED
          ) {
            throw new IssueParentUnpublishedError(parentJournal.status);
          }

          const finalCoverAssetId = validated.coverImageAssetId || null;
          let finalCoverUrl = validated.coverImageUrl || null;
          const finalPdfAssetId = validated.pdfAssetId || null;
          let finalPdfUrl = validated.pdfUrl || null;

          const assetsToLock = [finalCoverAssetId, finalPdfAssetId];
          await lockMediaAssets(tx, assetsToLock);

          if (finalCoverAssetId) {
            const valRes = await validateMediaAsset(tx, finalCoverAssetId, MediaAssetType.IMAGE);
            if (!valRes.valid) {
              throw new Error(valRes.error);
            }
            finalCoverUrl = valRes.asset.secureUrl;
          }

          if (finalPdfAssetId) {
            const valRes = await validateMediaAsset(tx, finalPdfAssetId, MediaAssetType.DOCUMENT);
            if (!valRes.valid) {
              throw new Error(valRes.error);
            }
            finalPdfUrl = valRes.asset.secureUrl;
          }

          const resolvedPublishedAt = resolveIssuePublishedAtOnCreate({
            requestedPublishedAt: validated.publishedAt,
            targetStatus,
            preserveLegacyDefaultDate: true
          });

          const createdIssue = await tx.journalIssue.create({
            data: {
              journalId: validated.journalId,
              volume: validated.volume,
              issue: validated.issue,
              title: validated.title.trim(),
              description: validated.description || null,
              status: targetStatus,
              coverImageUrl: finalCoverUrl,
              coverImageAssetId: finalCoverAssetId,
              pdfUrl: finalPdfUrl,
              pdfAssetId: finalPdfAssetId,
              publishedAt: resolvedPublishedAt
            },
            include: {
              coverImageAsset: { select: SAFE_ADMIN_ASSET_SELECT },
              pdfAsset: { select: SAFE_ADMIN_ASSET_SELECT }
            }
          });

          await syncMediaAssetStatuses(tx, assetsToLock);

          return createdIssue;
        },
        { maxWait: 20000, timeout: 45000 }
      );

      if (!issue) {
        return NextResponse.json(
          { error: "Parent journal not found" },
          { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
        );
      }

      return NextResponse.json(issue, { status: 201, headers: PRIVATE_NO_STORE_HEADERS });
    }

    const validated = journalSchema.parse(body);
    const slug = normalizeSlug(validated.slug || validated.title);
    if (!slug) {
      return NextResponse.json(
        { error: "A valid journal title or slug is required." },
        { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    const targetStatus: JournalStatus = validated.status ?? JournalStatus.DRAFT;

    const journal = await prisma.$transaction(
      async (tx) => {
        const finalCoverAssetId = validated.coverImageAssetId || null;
        let finalCoverUrl = validated.coverImageUrl || null;

        await lockMediaAssets(tx, [finalCoverAssetId]);

        if (finalCoverAssetId) {
          const valRes = await validateMediaAsset(tx, finalCoverAssetId, MediaAssetType.IMAGE);
          if (!valRes.valid) {
            throw new Error(valRes.error);
          }
          finalCoverUrl = valRes.asset.secureUrl;
        }

        const createdJournal = await tx.journal.create({
          data: {
            title: validated.title.trim(),
            slug,
            description: validated.description || null,
            status: targetStatus,
            coverImageUrl: finalCoverUrl,
            coverImageAssetId: finalCoverAssetId
          },
          include: {
            coverImageAsset: { select: SAFE_ADMIN_ASSET_SELECT }
          }
        });

        await syncMediaAssetStatuses(tx, [finalCoverAssetId]);

        return createdJournal;
      },
      { maxWait: 20000, timeout: 45000 }
    );

    return NextResponse.json(journal, { status: 201, headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error: unknown) {
    if (error instanceof IssueParentUnpublishedError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }
    const conflict = extractUniqueConstraintConflict(error);
    if (conflict.isUnique) {
      const isVolumeIssue =
        conflict.targets.includes("volume") || conflict.targets.includes("issue");
      return NextResponse.json(
        {
          error: isVolumeIssue
            ? "An issue with this volume and issue number already exists in this journal."
            : "A journal with this slug already exists. Please choose a different slug."
        },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to create journal or issue" },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}

export async function PUT(request: Request) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_journals");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const id = body.id || body.issueId;

    if (!id) {
      return NextResponse.json(
        { error: "Missing journal or issue id" },
        { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    const isIssue = body.type === "issue" || !!body.journalId || !!body.issueId;

    if (isIssue) {
      const validated = journalIssueUpdateSchema.parse(body);

      const updated = await prisma.$transaction(
        async (tx) => {
          const existing = await tx.journalIssue.findUnique({
            where: { id }
          });

          if (!existing) {
            return null;
          }

          const targetJournalId = validated.journalId ?? existing.journalId;
          const targetStatus: JournalStatus = validated.status ?? existing.status;

          const parentJournal = await lockParentJournalForUpdate(tx, targetJournalId);
          if (!parentJournal) {
            return null;
          }

          if (
            targetStatus === JournalStatus.PUBLISHED &&
            parentJournal.status !== JournalStatus.PUBLISHED
          ) {
            throw new IssueParentUnpublishedError(parentJournal.status);
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

          let finalCoverAssetId = existing.coverImageAssetId;
          let finalCoverUrl = existing.coverImageUrl;
          let finalPdfAssetId = existing.pdfAssetId;
          let finalPdfUrl = existing.pdfUrl;

          if (validated.coverImageAssetId !== undefined) {
            if (validated.coverImageAssetId === null || validated.coverImageAssetId === "") {
              finalCoverAssetId = null;
              finalCoverUrl = null;
            } else {
              const valRes = await validateMediaAsset(
                tx,
                validated.coverImageAssetId,
                MediaAssetType.IMAGE
              );
              if (!valRes.valid) throw new Error(valRes.error);
              finalCoverAssetId = valRes.asset.id;
              finalCoverUrl = valRes.asset.secureUrl;
            }
          } else if (validated.coverImageUrl !== undefined) {
            finalCoverAssetId = null;
            finalCoverUrl = validated.coverImageUrl || null;
          }

          if (validated.pdfAssetId !== undefined) {
            if (validated.pdfAssetId === null || validated.pdfAssetId === "") {
              finalPdfAssetId = null;
              finalPdfUrl = null;
            } else {
              const valRes = await validateMediaAsset(
                tx,
                validated.pdfAssetId,
                MediaAssetType.DOCUMENT
              );
              if (!valRes.valid) throw new Error(valRes.error);
              finalPdfAssetId = valRes.asset.id;
              finalPdfUrl = valRes.asset.secureUrl;
            }
          } else if (validated.pdfUrl !== undefined) {
            finalPdfAssetId = null;
            finalPdfUrl = validated.pdfUrl || null;
          }

          const finalPublishedAt = resolveIssuePublishedAtOnUpdate({
            existingStatus: existing.status,
            targetStatus,
            existingPublishedAt: existing.publishedAt,
            requestedPublishedAt: validated.publishedAt
          });

          const res = await tx.journalIssue.update({
            where: { id },
            data: {
              ...(validated.journalId ? { journalId: validated.journalId } : {}),
              ...(validated.volume !== undefined ? { volume: validated.volume } : {}),
              ...(validated.issue !== undefined ? { issue: validated.issue } : {}),
              ...(validated.title ? { title: validated.title.trim() } : {}),
              ...(validated.description !== undefined
                ? { description: validated.description || null }
                : {}),
              status: targetStatus,
              coverImageUrl: finalCoverUrl,
              coverImageAssetId: finalCoverAssetId,
              pdfUrl: finalPdfUrl,
              pdfAssetId: finalPdfAssetId,
              publishedAt: finalPublishedAt
            },
            include: {
              coverImageAsset: { select: SAFE_ADMIN_ASSET_SELECT },
              pdfAsset: { select: SAFE_ADMIN_ASSET_SELECT }
            }
          });

          if (coverTouched || pdfTouched) {
            await syncMediaAssetStatuses(tx, [
              coverTouched ? existing.coverImageAssetId : null,
              pdfTouched ? existing.pdfAssetId : null,
              coverTouched ? finalCoverAssetId : null,
              pdfTouched ? finalPdfAssetId : null
            ]);
          }

          return res;
        },
        { maxWait: 20000, timeout: 45000 }
      );

      if (!updated) {
        return NextResponse.json(
          { error: "Journal issue not found" },
          { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
        );
      }

      return NextResponse.json(updated, { headers: PRIVATE_NO_STORE_HEADERS });
    }

    const validated = journalUpdateSchema.parse(body);
    const normalizedSlug = validated.slug !== undefined ? normalizeSlug(validated.slug) : undefined;
    if (validated.slug !== undefined && !normalizedSlug) {
      return NextResponse.json(
        { error: "Slug must contain alphanumeric characters." },
        { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    const updated = await prisma.$transaction(
      async (tx) => {
        const existing = await tx.journal.findFirst({
          where: { OR: [{ id }, { slug: id }] }
        });

        if (!existing) {
          return null;
        }

        await lockParentJournalForUpdate(tx, existing.id);

        const coverTouched =
          validated.coverImageAssetId !== undefined || validated.coverImageUrl !== undefined;

        if (coverTouched) {
          await lockMediaAssets(tx, [existing.coverImageAssetId, validated.coverImageAssetId]);
        }

        let finalCoverAssetId = existing.coverImageAssetId;
        let finalCoverUrl = existing.coverImageUrl;

        if (validated.coverImageAssetId !== undefined) {
          if (validated.coverImageAssetId === null || validated.coverImageAssetId === "") {
            finalCoverAssetId = null;
            finalCoverUrl = null;
          } else {
            const valRes = await validateMediaAsset(
              tx,
              validated.coverImageAssetId,
              MediaAssetType.IMAGE
            );
            if (!valRes.valid) throw new Error(valRes.error);
            finalCoverAssetId = valRes.asset.id;
            finalCoverUrl = valRes.asset.secureUrl;
          }
        } else if (validated.coverImageUrl !== undefined) {
          finalCoverAssetId = null;
          finalCoverUrl = validated.coverImageUrl || null;
        }

        const res = await tx.journal.update({
          where: { id: existing.id },
          data: {
            ...(validated.title ? { title: validated.title.trim() } : {}),
            ...(normalizedSlug ? { slug: normalizedSlug } : {}),
            ...(validated.description !== undefined
              ? { description: validated.description || null }
              : {}),
            ...(validated.status !== undefined ? { status: validated.status } : {}),
            coverImageUrl: finalCoverUrl,
            coverImageAssetId: finalCoverAssetId
          },
          include: {
            coverImageAsset: { select: SAFE_ADMIN_ASSET_SELECT }
          }
        });

        if (coverTouched) {
          await syncMediaAssetStatuses(tx, [existing.coverImageAssetId, finalCoverAssetId]);
        }

        return res;
      },
      { maxWait: 20000, timeout: 45000 }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Journal not found" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(updated, { headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error: unknown) {
    if (error instanceof IssueParentUnpublishedError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }
    const conflict = extractUniqueConstraintConflict(error);
    if (conflict.isUnique) {
      const isVolumeIssue =
        conflict.targets.includes("volume") || conflict.targets.includes("issue");
      return NextResponse.json(
        {
          error: isVolumeIssue
            ? "An issue with this volume and issue number already exists in this journal."
            : "A journal with this slug already exists. Please choose a different slug."
        },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to update journal or issue" },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}
