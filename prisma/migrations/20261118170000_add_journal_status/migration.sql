CREATE TYPE "JournalStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

ALTER TABLE "Journal" ADD COLUMN "status" "JournalStatus" NOT NULL DEFAULT 'DRAFT';

ALTER TABLE "JournalIssue" ADD COLUMN "status" "JournalStatus" NOT NULL DEFAULT 'DRAFT';

CREATE INDEX "Journal_status_idx" ON "Journal"("status");

CREATE INDEX "JournalIssue_journalId_status_idx" ON "JournalIssue"("journalId", "status");

CREATE INDEX "JournalIssue_publishedAt_idx" ON "JournalIssue"("publishedAt");

