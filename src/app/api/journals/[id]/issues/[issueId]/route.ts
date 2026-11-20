import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { journalIssueUpdateSchema } from "@/lib/validations/publication";
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
  IssueParentUnpublishedError,
  lockParentJournalForUpdate,
  resolveIssuePublishedAtOnUpdate
} from "@/lib/media/journalLifecycle";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  const { id, issueId } = await params;

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

  try {
    const journal = await prisma.journal.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, status: true }
    });

    if (!journal || (!effectiveAdminView && journal.status !== JournalStatus.PUBLISHED)) {
      return NextResponse.json(
        { error: "Journal issue not found" },
        { status: 404, headers: responseHeaders }
      );
    }

    const issue = effectiveAdminView
      ? await prisma.journalIssue.findFirst({
        where: { id: issueId, journalId: journal.id },
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
          journal: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true
            }
          },
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
      })
      : await prisma.journalIssue.findFirst({
        where: {
          id: issueId,
          journalId: journal.id,
          status: JournalStatus.PUBLISHED
        },
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
          journal: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true
            }
          },
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

    if (!issue) {
      return NextResponse.json(
        { error: "Journal issue not found" },
        { status: 404, headers: responseHeaders }
      );
    }

    return NextResponse.json(issue, responseInit);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch journal issue" },
      { status: 500, headers: responseHeaders }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  const { id, issueId } = await params;

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
    const validated = journalIssueUpdateSchema.parse(body);

    const updated = await prisma.$transaction(
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

        const existing = await tx.journalIssue.findFirst({
          where: { id: issueId, journalId: parentJournal.id }
        });

        if (!existing) {
          return null;
        }

        const targetStatus: JournalStatus = validated.status ?? existing.status;

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
          where: { id: existing.id },
          data: {
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
      { error: err.message || "Failed to update journal issue" },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  const { id, issueId } = await params;

  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "manage_journals");
  if (!auth.authorized) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const restrictIfHasPublications = searchParams.get("restrictIfHasPublications") === "true";

  try {
    const outcome = await prisma.$transaction(
      async (tx) => {
        const journal = await tx.journal.findFirst({
          where: { OR: [{ id }, { slug: id }] },
          select: { id: true }
        });

        if (!journal) {
          return { status: "NOT_FOUND" as const };
        }

        const existing = await tx.journalIssue.findFirst({
          where: { id: issueId, journalId: journal.id },
          include: {
            _count: { select: { publications: true } }
          }
        });

        if (!existing) {
          return { status: "NOT_FOUND" as const };
        }

        if (restrictIfHasPublications && existing._count.publications > 0) {
          return {
            status: "IN_USE" as const,
            publicationCount: existing._count.publications
          };
        }

        const affected = [existing.coverImageAssetId, existing.pdfAssetId];
        await lockMediaAssets(tx, affected);

        await tx.journalIssue.delete({
          where: { id: existing.id }
        });

        await syncMediaAssetStatuses(tx, affected);

        return {
          status: "DELETED" as const,
          detachedPublications: existing._count.publications
        };
      },
      { maxWait: 20000, timeout: 45000 }
    );

    if (outcome.status === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Journal issue not found" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    if (outcome.status === "IN_USE") {
      return NextResponse.json(
        {
          error: `Cannot delete journal issue while ${outcome.publicationCount} publication${outcome.publicationCount === 1 ? "" : "s"} reference it. Reassign or detach those publications first.`,
          publicationCount: outcome.publicationCount
        },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, detachedPublications: outcome.detachedPublications },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to delete journal issue" },
      { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}
