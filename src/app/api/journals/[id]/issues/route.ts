import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { journalIssueSchema } from "@/lib/validations/publication";
import { getAdminSessionFromRequest } from "@/lib/auth/session";
import { hasPermission, requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import {
  AdminStatus,
  JournalStatus,
  MediaAssetType,
  PublicationStatus
} from "@prisma/client";
import {
  lockMediaAssets,
  syncMediaAssetStatuses,
  validateMediaAsset
} from "@/lib/media/assetRef";
import {
  extractUniqueConstraintConflict,
  PRIVATE_NO_STORE_HEADERS,
  SAFE_ADMIN_ASSET_SELECT
} from "@/lib/media/slug";
import {
  DETERMINISTIC_ISSUE_ORDER_BY,
  IssueParentUnpublishedError,
  lockParentJournalForUpdate,
  parseJournalStatusFilter,
  resolveIssuePublishedAtOnCreate
} from "@/lib/media/journalLifecycle";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const sessionData = await getAdminSessionFromRequest(request);
  const isAuthorizedAdmin = !!(
    sessionData &&
    sessionData.user.status === AdminStatus.ACTIVE &&
    hasPermission(sessionData.user.role, "manage_journals")
  );
  const { searchParams } = new URL(request.url);
  const effectiveAdminView = isAuthorizedAdmin && searchParams.get("publicOnly") !== "true";
  const responseHeaders = effectiveAdminView ? PRIVATE_NO_STORE_HEADERS : undefined;
  const responseInit = responseHeaders ? { headers: responseHeaders } : undefined;

  const parsedStatus = parseJournalStatusFilter(searchParams.get("status"));
  if (!parsedStatus.ok) {
    return NextResponse.json(
      { error: parsedStatus.error },
      { status: 400, headers: responseHeaders }
    );
  }

  try {
    const journal = await prisma.journal.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true
      }
    });

    if (!journal || (!effectiveAdminView && journal.status !== JournalStatus.PUBLISHED)) {
      return NextResponse.json(
        { error: "Journal not found" },
        { status: 404, headers: responseHeaders }
      );
    }

    if (!effectiveAdminView && parsedStatus.status && parsedStatus.status !== JournalStatus.PUBLISHED) {
      return NextResponse.json({ journal, issues: [] });
    }

    const issueWhere = effectiveAdminView
      ? {
          journalId: journal.id,
          ...(parsedStatus.status ? { status: parsedStatus.status } : {})
        }
      : {
          journalId: journal.id,
          status: JournalStatus.PUBLISHED
        };

    const issues = effectiveAdminView
      ? await prisma.journalIssue.findMany({
          where: issueWhere,
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
                status: true
              }
            }
          }
        })
      : await prisma.journalIssue.findMany({
          where: issueWhere,
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
        });

    return NextResponse.json({ journal, issues }, responseInit);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch journal issues" },
      { status: 500, headers: responseHeaders }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

    const result = await prisma.$transaction(
      async (tx) => {
        const foundJournal = await tx.journal.findFirst({
          where: { OR: [{ id }, { slug: id }] },
          select: { id: true }
        });

        if (!foundJournal) {
          return null;
        }

        const parentJournal = await lockParentJournalForUpdate(tx, foundJournal.id);
        if (!parentJournal) {
          return null;
        }

        const validated = journalIssueSchema.parse({
          ...body,
          journalId: parentJournal.id
        });
        const targetStatus: JournalStatus = validated.status ?? JournalStatus.DRAFT;

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
          preserveLegacyDefaultDate: false
        });

        const createdIssue = await tx.journalIssue.create({
          data: {
            journalId: parentJournal.id,
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

    if (!result) {
      return NextResponse.json(
        { error: "Journal not found" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(result, { status: 201, headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error: unknown) {
    if (error instanceof IssueParentUnpublishedError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }
    const conflict = extractUniqueConstraintConflict(error);
    if (conflict.isUnique) {
      return NextResponse.json(
        { error: "An issue with this volume and issue number already exists in this journal." },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to create journal issue" },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}
