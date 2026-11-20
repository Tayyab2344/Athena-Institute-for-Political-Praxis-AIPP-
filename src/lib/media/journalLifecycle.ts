import { JournalStatus, Prisma } from "@prisma/client";

export const VALID_JOURNAL_STATUSES = new Set<string>(Object.values(JournalStatus));

export class IssueParentUnpublishedError extends Error {
  constructor(parentStatus: JournalStatus) {
    super(
      `Cannot publish journal issue while its parent journal status is ${parentStatus}. Publish the parent journal first.`
    );
    this.name = "IssueParentUnpublishedError";
  }
}

export function parseJournalStatusFilter(
  raw: string | null
): { ok: true; status?: JournalStatus } | { ok: false; error: string } {
  if (!raw || raw.trim() === "" || raw === "ALL") {
    return { ok: true, status: undefined };
  }
  const normalized = raw.trim().toUpperCase();
  if (!VALID_JOURNAL_STATUSES.has(normalized)) {
    return {
      ok: false,
      error: "Invalid status filter. Must be DRAFT, PUBLISHED, or ARCHIVED."
    };
  }
  return { ok: true, status: normalized as JournalStatus };
}

export async function lockParentJournalForUpdate(
  tx: Prisma.TransactionClient,
  journalId: string
): Promise<{ id: string; status: JournalStatus } | null> {
  const rows = await tx.$queryRaw<Array<{ id: string; status: JournalStatus }>>`
    SELECT "id", "status" FROM "Journal"
    WHERE "id" = ${journalId}
    FOR UPDATE
  `;
  return rows[0] ?? null;
}

export function resolveIssuePublishedAtOnCreate(options: {
  requestedPublishedAt: string | null | undefined;
  targetStatus: JournalStatus;
  preserveLegacyDefaultDate: boolean;
}): Date | null {
  if (typeof options.requestedPublishedAt === "string" && options.requestedPublishedAt.trim() !== "") {
    return new Date(options.requestedPublishedAt);
  }
  if (options.targetStatus === JournalStatus.PUBLISHED) {
    return new Date();
  }
  if (options.requestedPublishedAt === null) {
    return null;
  }
  if (options.preserveLegacyDefaultDate) {
    return new Date();
  }
  return null;
}

export function resolveIssuePublishedAtOnUpdate(options: {
  existingStatus: JournalStatus;
  targetStatus: JournalStatus;
  existingPublishedAt: Date | null;
  requestedPublishedAt: string | null | undefined;
}): Date | null {
  let nextPublishedAt: Date | null = options.existingPublishedAt;

  if (options.requestedPublishedAt !== undefined) {
    nextPublishedAt =
      typeof options.requestedPublishedAt === "string" &&
      options.requestedPublishedAt.trim() !== ""
        ? new Date(options.requestedPublishedAt)
        : null;
  }

  const isTransitioningToPublished =
    options.targetStatus === JournalStatus.PUBLISHED &&
    options.existingStatus !== JournalStatus.PUBLISHED;

  if (isTransitioningToPublished && nextPublishedAt === null) {
    return new Date();
  }

  return nextPublishedAt;
}

export const DETERMINISTIC_ISSUE_ORDER_BY: Prisma.JournalIssueOrderByWithRelationInput[] = [
  { publishedAt: { sort: "desc", nulls: "last" } },
  { volume: "desc" },
  { issue: "desc" },
  { createdAt: "desc" },
  { id: "desc" }
];

