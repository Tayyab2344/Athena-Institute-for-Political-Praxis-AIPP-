ALTER TABLE "InquiryReply" DROP CONSTRAINT IF EXISTS "InquiryReply_inquiryId_fkey";

ALTER TABLE "InquiryReply"
ADD CONSTRAINT "InquiryReply_inquiryId_fkey"
FOREIGN KEY ("inquiryId") REFERENCES "ContactInquiry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

