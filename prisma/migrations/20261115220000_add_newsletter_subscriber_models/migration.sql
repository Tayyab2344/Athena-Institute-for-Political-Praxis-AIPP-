CREATE TYPE "SubscriberStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'UNSUBSCRIBED', 'SUPPRESSED');

CREATE TYPE "SubscriptionTokenType" AS ENUM ('VERIFICATION', 'UNSUBSCRIBE');

CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "status" "SubscriberStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "source" TEXT NOT NULL DEFAULT 'FOOTER',
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "suppressedAt" TIMESTAMP(3),
    "suppressionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NewsletterSubscriptionToken" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "type" "SubscriptionTokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriptionToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NewsletterConsent" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL DEFAULT 'NEWSLETTER_SUBSCRIPTION',
    "consentText" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL DEFAULT 'v1.0',
    "ipHash" TEXT,
    "userAgent" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterConsent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SubscriberActivity" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "adminUserId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriberActivity_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsletterSubscriber_normalizedEmail_key" ON "NewsletterSubscriber"("normalizedEmail");

CREATE INDEX "NewsletterSubscriber_status_idx" ON "NewsletterSubscriber"("status");

CREATE INDEX "NewsletterSubscriber_createdAt_idx" ON "NewsletterSubscriber"("createdAt");

CREATE INDEX "NewsletterSubscriber_status_createdAt_idx" ON "NewsletterSubscriber"("status", "createdAt");

CREATE INDEX "NewsletterSubscriber_normalizedEmail_idx" ON "NewsletterSubscriber"("normalizedEmail");

CREATE UNIQUE INDEX "NewsletterSubscriptionToken_tokenHash_key" ON "NewsletterSubscriptionToken"("tokenHash");

CREATE INDEX "NewsletterSubscriptionToken_tokenHash_idx" ON "NewsletterSubscriptionToken"("tokenHash");

CREATE INDEX "NewsletterSubscriptionToken_subscriberId_type_idx" ON "NewsletterSubscriptionToken"("subscriberId", "type");

CREATE INDEX "NewsletterSubscriptionToken_expiresAt_idx" ON "NewsletterSubscriptionToken"("expiresAt");

CREATE INDEX "NewsletterConsent_subscriberId_idx" ON "NewsletterConsent"("subscriberId");

CREATE INDEX "NewsletterConsent_createdAt_idx" ON "NewsletterConsent"("createdAt");

CREATE INDEX "SubscriberActivity_subscriberId_idx" ON "SubscriberActivity"("subscriberId");

CREATE INDEX "SubscriberActivity_adminUserId_idx" ON "SubscriberActivity"("adminUserId");

CREATE INDEX "SubscriberActivity_action_idx" ON "SubscriberActivity"("action");

CREATE INDEX "SubscriberActivity_createdAt_idx" ON "SubscriberActivity"("createdAt");

ALTER TABLE "NewsletterSubscriptionToken" ADD CONSTRAINT "NewsletterSubscriptionToken_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "NewsletterConsent" ADD CONSTRAINT "NewsletterConsent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SubscriberActivity" ADD CONSTRAINT "SubscriberActivity_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SubscriberActivity" ADD CONSTRAINT "SubscriberActivity_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

