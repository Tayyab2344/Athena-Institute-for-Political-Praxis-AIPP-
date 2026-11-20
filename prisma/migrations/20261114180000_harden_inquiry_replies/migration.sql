ALTER TABLE "InquiryReply" ADD COLUMN IF NOT EXISTS "authorName" TEXT;
ALTER TABLE "InquiryReply" ADD COLUMN IF NOT EXISTS "authorEmail" TEXT;
ALTER TABLE "InquiryReply" ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT;

UPDATE "InquiryReply" SET "idempotencyKey" = 'inquiry-reply:' || "id" WHERE "idempotencyKey" IS NULL;

ALTER TABLE "InquiryReply" ALTER COLUMN "idempotencyKey" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "InquiryReply_idempotencyKey_key" ON "InquiryReply"("idempotencyKey");

ALTER TABLE "InquiryReply" DROP CONSTRAINT IF EXISTS "InquiryReply_adminUserId_fkey";

ALTER TABLE "InquiryReply" ALTER COLUMN "adminUserId" DROP NOT NULL;

ALTER TABLE "InquiryReply" ADD CONSTRAINT "InquiryReply_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

