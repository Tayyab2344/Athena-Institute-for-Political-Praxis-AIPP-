ALTER TABLE "Author" ADD COLUMN "photoAssetId" TEXT;

ALTER TABLE "Journal" ADD COLUMN "coverImageAssetId" TEXT;

ALTER TABLE "JournalIssue" ADD COLUMN "coverImageAssetId" TEXT,
ADD COLUMN "pdfAssetId" TEXT;

ALTER TABLE "Author" ADD CONSTRAINT "Author_photoAssetId_fkey" FOREIGN KEY ("photoAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Journal" ADD CONSTRAINT "Journal_coverImageAssetId_fkey" FOREIGN KEY ("coverImageAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "JournalIssue" ADD CONSTRAINT "JournalIssue_coverImageAssetId_fkey" FOREIGN KEY ("coverImageAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "JournalIssue" ADD CONSTRAINT "JournalIssue_pdfAssetId_fkey" FOREIGN KEY ("pdfAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

