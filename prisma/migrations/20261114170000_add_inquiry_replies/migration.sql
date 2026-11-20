CREATE TABLE "InquiryReply" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "outboxId" TEXT,
    "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InquiryReply_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InquiryReply_outboxId_key" ON "InquiryReply"("outboxId");
CREATE INDEX "InquiryReply_inquiryId_idx" ON "InquiryReply"("inquiryId");
CREATE INDEX "InquiryReply_adminUserId_idx" ON "InquiryReply"("adminUserId");
CREATE INDEX "InquiryReply_createdAt_idx" ON "InquiryReply"("createdAt");
CREATE INDEX "InquiryReply_status_idx" ON "InquiryReply"("status");

ALTER TABLE "InquiryReply" ADD CONSTRAINT "InquiryReply_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "ContactInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InquiryReply" ADD CONSTRAINT "InquiryReply_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InquiryReply" ADD CONSTRAINT "InquiryReply_outboxId_fkey" FOREIGN KEY ("outboxId") REFERENCES "EmailOutbox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

