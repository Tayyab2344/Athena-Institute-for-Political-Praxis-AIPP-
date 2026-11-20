import { prisma } from "@/lib/prisma";
import { Prisma, SubscriberStatus, SubscriptionTokenType } from "@prisma/client";
import {
  generateVerificationToken,
  hashVerificationToken,
  validateTokenFormat,
  obfuscateEmail,
} from "./tokens";
import { hashClientIdentifier } from "@/lib/auth/rate-limiter";

export const UNSUBSCRIBE_EXPIRY_DAYS = 30;

export interface UnsubscribePreviewResult {
  valid: boolean;
  state:
    | "READY"
    | "ALREADY_UNSUBSCRIBED"
    | "EXPIRED"
    | "INVALID"
    | "SUPPRESSED";
  message?: string;
  error?: string;
  obfuscatedEmail?: string;
  expiresAt?: string;
}

export interface UnsubscribeConfirmationResult {
  success: boolean;
  code:
    | "UNSUBSCRIBED"
    | "ALREADY_UNSUBSCRIBED"
    | "INVALID_TOKEN"
    | "TOKEN_EXPIRED"
    | "SUBSCRIBER_SUPPRESSED"
    | "ERROR";
  message?: string;
  error?: string;
}

export async function createUnsubscribeToken(
  subscriberId: string,
  tx?: Prisma.TransactionClient
): Promise<{ rawToken: string; tokenRecordId: string }> {
  const db = tx || prisma;
  const rawToken = generateVerificationToken();
  const tokenHash = hashVerificationToken(rawToken);
  const expiresAt = new Date(Date.now() + UNSUBSCRIBE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  const record = await db.newsletterSubscriptionToken.create({
    data: {
      subscriberId,
      tokenHash,
      type: SubscriptionTokenType.UNSUBSCRIBE,
      expiresAt,
    },
  });

  return {
    rawToken,
    tokenRecordId: record.id,
  };
}

export async function previewUnsubscribeToken(
  rawToken: unknown
): Promise<UnsubscribePreviewResult> {
  if (!validateTokenFormat(rawToken)) {
    return {
      valid: false,
      state: "INVALID",
      error: "The unsubscribe link is invalid or malformed.",
    };
  }

  const tokenHash = hashVerificationToken(rawToken);

  const token = await prisma.newsletterSubscriptionToken.findUnique({
    where: { tokenHash },
    include: { subscriber: true },
  });

  if (!token || token.type !== SubscriptionTokenType.UNSUBSCRIBE) {
    return {
      valid: false,
      state: "INVALID",
      error: "The unsubscribe link is invalid or malformed.",
    };
  }

  const obfuscated = obfuscateEmail(token.subscriber.email);

  if (token.subscriber.status === SubscriberStatus.SUPPRESSED) {
    return {
      valid: false,
      state: "SUPPRESSED",
      error: "This subscription is suppressed and cannot be modified.",
      obfuscatedEmail: obfuscated,
    };
  }

  if (token.subscriber.status === SubscriberStatus.UNSUBSCRIBED) {
    return {
      valid: false,
      state: "ALREADY_UNSUBSCRIBED",
      message: "This email address is already unsubscribed.",
      obfuscatedEmail: obfuscated,
    };
  }

  if (token.expiresAt < new Date()) {
    return {
      valid: false,
      state: "EXPIRED",
      error: "This unsubscribe link has expired.",
      obfuscatedEmail: obfuscated,
    };
  }

  return {
    valid: true,
    state: "READY",
    obfuscatedEmail: obfuscated,
    expiresAt: token.expiresAt.toISOString(),
  };
}

export async function confirmUnsubscribe(
  rawToken: unknown,
  options: { ip?: string; userAgent?: string; oneClick?: boolean } = {}
): Promise<UnsubscribeConfirmationResult> {
  if (!validateTokenFormat(rawToken)) {
    return {
      success: false,
      code: "INVALID_TOKEN",
      error: "The unsubscribe link is invalid or malformed.",
    };
  }

  const tokenHash = hashVerificationToken(rawToken);
  const now = new Date();

  return await prisma.$transaction(
    async (tx) => {
      const token = await tx.newsletterSubscriptionToken.findUnique({
        where: { tokenHash },
        include: { subscriber: true },
      });

      if (!token || token.type !== SubscriptionTokenType.UNSUBSCRIBE) {
        return {
          success: false,
          code: "INVALID_TOKEN",
          error: "The unsubscribe link is invalid or malformed.",
        };
      }

      if (token.subscriber.status === SubscriberStatus.SUPPRESSED) {
        return {
          success: false,
          code: "SUBSCRIBER_SUPPRESSED",
          error: "This subscription is suppressed and cannot be modified.",
        };
      }

      if (token.subscriber.status === SubscriberStatus.UNSUBSCRIBED) {
        if (token.usedAt === null) {
          await tx.newsletterSubscriptionToken.update({
            where: { id: token.id },
            data: { usedAt: now },
          });
        }
        return {
          success: true,
          code: "ALREADY_UNSUBSCRIBED",
          message: "You are already unsubscribed from our newsletter.",
        };
      }

      if (token.expiresAt < now) {
        return {
          success: false,
          code: "TOKEN_EXPIRED",
          error: "This unsubscribe link has expired.",
        };
      }

      const updated = await tx.newsletterSubscriber.updateMany({
        where: {
          id: token.subscriber.id,
          status: { not: SubscriberStatus.UNSUBSCRIBED },
        },
        data: {
          status: SubscriberStatus.UNSUBSCRIBED,
          unsubscribedAt: now,
        },
      });

      if (updated.count === 0) {
        if (token.usedAt === null) {
          await tx.newsletterSubscriptionToken.update({
            where: { id: token.id },
            data: { usedAt: now },
          });
        }
        return {
          success: true,
          code: "ALREADY_UNSUBSCRIBED",
          message: "You are already unsubscribed from our newsletter.",
        };
      }

      await tx.newsletterSubscriptionToken.updateMany({
        where: {
          subscriberId: token.subscriber.id,
          usedAt: null,
        },
        data: {
          usedAt: now,
        },
      });

      const ipHash = options.ip ? hashClientIdentifier(options.ip) : null;
      const userAgent = options.userAgent?.slice(0, 500) || null;

      await tx.subscriberActivity.create({
        data: {
          subscriberId: token.subscriber.id,
          action: options.oneClick ? "UNSUBSCRIBED_ONE_CLICK" : "SUBSCRIPTION_UNSUBSCRIBED",
          details: JSON.stringify({
            tokenId: token.id,
            ipHash,
            userAgent,
            oneClick: options.oneClick ?? false,
            timestamp: now.toISOString(),
          }),
        },
      });

      return {
        success: true,
        code: "UNSUBSCRIBED",
        message: "You have been successfully unsubscribed from the Athena Institute newsletter.",
      };
    },
    { maxWait: 15000, timeout: 30000 }
  );
}
