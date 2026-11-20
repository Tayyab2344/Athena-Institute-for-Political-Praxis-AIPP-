import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
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
  resolveIssuePublishedAtOnUpdate
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

  try {
    const journal = effectiveAdminView
      ? await prisma.journal.findFirst({
          where: { OR: [{ id }, { slug: id }] },
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
      : await prisma.journal.findFirst({
          where: {
            AND: [{ OR: [{ id }, { slug: id }] }, { status: JournalStatus.PUBLISHED }]
          },
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
        });

    if (journal) {
      return NextResponse.json(journal, responseInit);
    }

    const issue = effectiveAdminView
      ? await prisma.journalIssue.findUnique({
          where: { id },
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
            id,
            status: JournalStatus.PUBLISHED,
            journal: { status: JournalStatus.PUBLISHED }
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

    if (issue) {
      return NextResponse.json(issue, responseInit);
    }

    return NextResponse.json(
      { error: "Journal or issue not found" },
      { status: 404, headers: responseHeaders }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch journal or issue" },
      { status: 500, headers: responseHeaders }
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

  const auth = await requireAdminAuth(request, "manage_journals");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();

    const updated = await prisma.$transaction(
      async (tx) => {
        const existingIssue = await tx.journalIssue.findUnique({
          where: { id }
        });

        if (existingIssue) {
          const validated = journalIssueUpdateSchema.parse(body);
          const targetJournalId = validated.journalId ?? existingIssue.journalId;
          const targetStatus: JournalStatus = validated.status ?? existingIssue.status;

          const parentJournal = await lockParentJournalForUpdate(tx, targetJournalId);
          if (!parentJournal) {
            return { found: false as const };
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
              coverTouched ? existingIssue.coverImageAssetId : null,
              pdfTouched ? existingIssue.pdfAssetId : null,
              validated.coverImageAssetId,
              validated.pdfAssetId
            ]);
          }

          let finalCoverAssetId = existingIssue.coverImageAssetId;
          let finalCoverUrl = existingIssue.coverImageUrl;
          let finalPdfAssetId = existingIssue.pdfAssetId;
          let finalPdfUrl = existingIssue.pdfUrl;

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
            existingStatus: existingIssue.status,
            targetStatus,
            existingPublishedAt: existingIssue.publishedAt,
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
              coverTouched ? existingIssue.coverImageAssetId : null,
              pdfTouched ? existingIssue.pdfAssetId : null,
              coverTouched ? finalCoverAssetId : null,
              pdfTouched ? finalPdfAssetId : null
            ]);
          }

          return { found: true as const, data: res };
        }

        const existingJournal = await tx.journal.findFirst({
          where: { OR: [{ id }, { slug: id }] }
        });

        if (existingJournal) {
          const validated = journalUpdateSchema.parse(body);
          const normalizedSlug =
            validated.slug !== undefined ? normalizeSlug(validated.slug) : undefined;
          if (validated.slug !== undefined && !normalizedSlug) {
            throw new Error("Slug must contain alphanumeric characters.");
          }

          await lockParentJournalForUpdate(tx, existingJournal.id);

          const coverTouched =
            validated.coverImageAssetId !== undefined || validated.coverImageUrl !== undefined;

          if (coverTouched) {
            await lockMediaAssets(tx, [
              existingJournal.coverImageAssetId,
              validated.coverImageAssetId
            ]);
          }

          let finalCoverAssetId = existingJournal.coverImageAssetId;
          let finalCoverUrl = existingJournal.coverImageUrl;

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
            where: { id: existingJournal.id },
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
            await syncMediaAssetStatuses(tx, [
              existingJournal.coverImageAssetId,
              finalCoverAssetId
            ]);
          }

          return { found: true as const, data: res };
        }

        return { found: false as const };
      },
      { maxWait: 20000, timeout: 45000 }
    );

    if (!updated.found) {
      return NextResponse.json(
        { error: "Journal or issue not found" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(updated.data, { headers: PRIVATE_NO_STORE_HEADERS });
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

export async function DELETE(
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

  const { searchParams } = new URL(request.url);
  const restrictIfHasIssues = searchParams.get("restrictIfHasIssues") === "true";
  const restrictIfHasPublications = searchParams.get("restrictIfHasPublications") === "true";

  try {
    const outcome = await prisma.$transaction(
      async (tx) => {
        const existingIssue = await tx.journalIssue.findUnique({
          where: { id },
          include: {
            _count: { select: { publications: true } }
          }
        });

        if (existingIssue) {
          if (restrictIfHasPublications && existingIssue._count.publications > 0) {
            return {
              status: "IN_USE_ISSUE" as const,
              publicationCount: existingIssue._count.publications
            };
          }

          const affected = [existingIssue.coverImageAssetId, existingIssue.pdfAssetId];
          await lockMediaAssets(tx, affected);

          await tx.journalIssue.delete({
            where: { id: existingIssue.id }
          });

          await syncMediaAssetStatuses(tx, affected);

          return {
            status: "DELETED" as const,
            type: "issue" as const,
            detachedPublications: existingIssue._count.publications
          };
        }

        const existingJournal = await tx.journal.findFirst({
          where: { OR: [{ id }, { slug: id }] },
          include: {
            issues: {
              select: {
                id: true,
                coverImageAssetId: true,
                pdfAssetId: true
              }
            }
          }
        });

        if (existingJournal) {
          await lockParentJournalForUpdate(tx, existingJournal.id);

          if (restrictIfHasIssues && existingJournal.issues.length > 0) {
            return {
              status: "IN_USE_JOURNAL" as const,
              issueCount: existingJournal.issues.length
            };
          }

          const affected = [
            existingJournal.coverImageAssetId,
            ...existingJournal.issues.map((i) => i.coverImageAssetId),
            ...existingJournal.issues.map((i) => i.pdfAssetId)
          ];

          await lockMediaAssets(tx, affected);

          await tx.journal.delete({
            where: { id: existingJournal.id }
          });

          await syncMediaAssetStatuses(tx, affected);

          return {
            status: "DELETED" as const,
            type: "journal" as const,
            deletedIssueCount: existingJournal.issues.length
          };
        }

        return { status: "NOT_FOUND" as const };
      },
      { maxWait: 20000, timeout: 45000 }
    );

    if (outcome.status === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Journal or issue not found" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    if (outcome.status === "IN_USE_JOURNAL") {
      return NextResponse.json(
        {
          error: `Cannot delete journal while it contains ${outcome.issueCount} issue${outcome.issueCount === 1 ? "" : "s"}. Remove or archive all issues first.`,
          issueCount: outcome.issueCount
        },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    if (outcome.status === "IN_USE_ISSUE") {
      return NextResponse.json(
        {
          error: `Cannot delete journal issue while ${outcome.publicationCount} publication${outcome.publicationCount === 1 ? "" : "s"} reference it. Reassign or detach those publications first.`,
          publicationCount: outcome.publicationCount
        },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, type: outcome.type },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to delete journal or issue" },
      { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}
