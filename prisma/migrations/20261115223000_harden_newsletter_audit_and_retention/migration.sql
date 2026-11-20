ALTER TABLE "NewsletterSubscriber" ADD COLUMN "deletedAt" TIMESTAMP(3);

ALTER TABLE "NewsletterSubscriber" ADD COLUMN "anonymizedAt" TIMESTAMP(3);

ALTER TABLE "NewsletterConsent" DROP CONSTRAINT IF EXISTS "NewsletterConsent_subscriberId_fkey";

ALTER TABLE "NewsletterConsent" ADD CONSTRAINT "NewsletterConsent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SubscriberActivity" DROP CONSTRAINT IF EXISTS "SubscriberActivity_subscriberId_fkey";

ALTER TABLE "SubscriberActivity" ADD CONSTRAINT "SubscriberActivity_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

