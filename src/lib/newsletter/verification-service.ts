import { prisma } from "@/lib/prisma";
import { Prisma, SubscriberStatus, SubscriptionTokenType } from "@prisma/client";
import {
  generateVerificationToken,
  hashVerificationToken,
  validateTokenFormat,
  getVerificationExpiryDate,
  isWithinCooldown,
  obfuscateEmail,
  RESEND_COOLDOWN_SECONDS,
} from "./tokens";
import { renderNewsletterVerificationEmail } from "@/lib/email/templates/newsletter-verification";
import { enqueueEmail, buildEventIdempotencyKey } from "@/lib/email/enqueue-service";
import { hashClientIdentifier } from "@/lib/auth/rate-limiter";

export interface EnqueueVerificationParams {
  subscriber: {
    id: string;
    email: string;
  };
  ipHash?: string | null;
  userAgent?: string | null;
  baseUrl?: string;
}

export interface EnqueueVerificationResult {
  tokenRecordId: string;
  outboxId: string;
  isDuplicate: boolean;
}

export interface VerificationPreviewResult {
  valid: boolean;
  state: "READY" | "EXPIRED" | "ALREADY_VERIFIED" | "ALREADY_USED" | "INVALID" | "SUPPRESSED" | "UNSUBSCRIBED";
  message?: string;
  error?: string;
  obfuscatedEmail?: string;
  expiresAt?: string;
}

export interface VerificationConfirmationResult {
  success: boolean;
  code:
    | "VERIFIED"
    | "ALREADY_ACTIVE"
    | "ALREADY_VERIFIED"
    | "INVALID_TOKEN"
    | "TOKEN_ALREADY_USED"
    | "TOKEN_EXPIRED"
    | "SUBSCRIBER_SUPPRESSED"
    | "SUBSCRIBER_UNSUBSCRIBED"
    | "CONCURRENT_CLAIM"
    | "ERROR";
  message?: string;
  error?: string;
}

export interface GenericResendResult {
  success: boolean;
  message: string;
}

const GENERIC_RESEND_RESPONSE: GenericResendResult = {
  success: true,
  message:
    "If this email address is registered and awaiting verification, a new verification link has been sent.",
};

export async function createAndEnqueueVerification(
  params: EnqueueVerificationParams,
  tx?: Prisma.TransactionClient
): Promise<EnqueueVerificationResult> {
  const db = tx || prisma;
  const rawToken = generateVerificationToken();
  const tokenHash = hashVerificationToken(rawToken);
  const expiresAt = getVerificationExpiryDate();

  const tokenRecord = await db.newsletterSubscriptionToken.create({
    data: {
      subscriberId: params.subscriber.id,
      tokenHash,
      type: SubscriptionTokenType.VERIFICATION,
      expiresAt,
      ipHash: params.ipHash || null,
      userAgent: params.userAgent?.slice(0, 500) || null,
    },
  });

  const emailContent = renderNewsletterVerificationEmail({
    recipientEmail: params.subscriber.email,
    rawToken,
    baseUrl: params.baseUrl,
  });

  const idempotencyKey = buildEventIdempotencyKey(
    "newsletter-verify",
    params.subscriber.id,
    tokenRecord.id
  );

  const enqueueResult = await enqueueEmail(
    {
      recipientEmail: params.subscriber.email,
      subject: emailContent.subject,
      textBody: emailContent.textBody,
      htmlBody: emailContent.htmlBody,
      category: "NEWSLETTER_VERIFICATION",
      idempotencyKey,
    },
    db
  );

  await db.subscriberActivity.create({
    data: {
      subscriberId: params.subscriber.id,
      action: "VERIFICATION_EMAIL_ENQUEUED",
      details: JSON.stringify({
        tokenId: tokenRecord.id,
        outboxId: enqueueResult.email.id,
        isDuplicate: enqueueResult.isDuplicate,
        expiresAt: expiresAt.toISOString(),
        timestamp: new Date().toISOString(),
      }),
    },
  });

  return {
    tokenRecordId: tokenRecord.id,
    outboxId: enqueueResult.email.id,
    isDuplicate: enqueueResult.isDuplicate,
  };
}

export async function previewVerificationToken(
  rawToken: unknown
): Promise<VerificationPreviewResult> {
  if (!validateTokenFormat(rawToken)) {
    return {
      valid: false,
      state: "INVALID",
      error: "The verification link is invalid or malformed.",
    };
  }

  const tokenHash = hashVerificationToken(rawToken);

  const token = await prisma.newsletterSubscriptionToken.findUnique({
    where: { tokenHash },
    include: { subscriber: true },
  });

  if (!token) {
    return {
      valid: false,
      state: "INVALID",
      error: "The verification link is invalid or malformed.",
    };
  }

  if (token.type !== SubscriptionTokenType.VERIFICATION) {
    return {
      valid: false,
      state: "INVALID",
      error: "Invalid token type.",
    };
  }

  const obfuscated = obfuscateEmail(token.subscriber.email);

  if (token.subscriber.status === SubscriberStatus.ACTIVE) {
    return {
      valid: false,
      state: "ALREADY_VERIFIED",
      message: "This email address is already verified and subscribed.",
      obfuscatedEmail: obfuscated,
    };
  }

  if (token.usedAt !== null) {
    return {
      valid: false,
      state: "ALREADY_USED",
      error: "This verification link has already been used.",
      obfuscatedEmail: obfuscated,
    };
  }

  if (token.expiresAt < new Date()) {
    return {
      valid: false,
      state: "EXPIRED",
      error:
        "This verification link has expired (links are valid for 24 hours). Please request a new verification email.",
      obfuscatedEmail: obfuscated,
    };
  }

  if (token.subscriber.status === SubscriberStatus.SUPPRESSED) {
    return {
      valid: false,
      state: "SUPPRESSED",
      error: "This subscription cannot be activated.",
    };
  }

  if (token.subscriber.status === SubscriberStatus.UNSUBSCRIBED) {
    return {
      valid: false,
      state: "UNSUBSCRIBED",
      error: "This subscription is currently unsubscribed.",
    };
  }

  return {
    valid: true,
    state: "READY",
    obfuscatedEmail: obfuscated,
    expiresAt: token.expiresAt.toISOString(),
  };
}

export async function confirmSubscriptionVerification(
  rawToken: unknown,
  options: { ip?: string; userAgent?: string } = {}
): Promise<VerificationConfirmationResult> {
  if (!validateTokenFormat(rawToken)) {
    return {
      success: false,
      code: "INVALID_TOKEN",
      error: "The verification link is invalid or malformed.",
    };
  }

  const tokenHash = hashVerificationToken(rawToken);
  const now = new Date();

  return await prisma.$transaction(async (tx) => {
    const token = await tx.newsletterSubscriptionToken.findUnique({
      where: { tokenHash },
      include: { subscriber: true },
    });

    if (!token) {
      return {
        success: false,
        code: "INVALID_TOKEN",
        error: "The verification link is invalid or malformed.",
      };
    }

    if (token.type !== SubscriptionTokenType.VERIFICATION) {
      return {
        success: false,
        code: "INVALID_TOKEN",
        error: "Invalid token type.",
      };
    }

    if (token.subscriber.status === SubscriberStatus.ACTIVE) {
      if (token.usedAt === null) {
        await tx.newsletterSubscriptionToken.update({
          where: { id: token.id },
          data: { usedAt: now },
        });
      }
      return {
        success: true,
        code: "ALREADY_ACTIVE",
        message: "This email address is already verified and active.",
      };
    }

    if (token.usedAt !== null) {
      return {
        success: false,
        code: "TOKEN_ALREADY_USED",
        error: "This verification link has already been used.",
      };
    }

    if (token.expiresAt < now) {
      return {
        success: false,
        code: "TOKEN_EXPIRED",
        error:
          "This verification link has expired. Please request a new verification link.",
      };
    }

    if (token.subscriber.status === SubscriberStatus.SUPPRESSED) {
      return {
        success: false,
        code: "SUBSCRIBER_SUPPRESSED",
        error: "This subscription cannot be activated.",
      };
    }

    if (token.subscriber.status === SubscriberStatus.UNSUBSCRIBED) {
      return {
        success: false,
        code: "SUBSCRIBER_UNSUBSCRIBED",
        error:
          "This subscription is currently unsubscribed and cannot be verified via this token.",
      };
    }

    const claimResult = await tx.newsletterSubscriptionToken.updateMany({
      where: {
        id: token.id,
        usedAt: null,
      },
      data: {
        usedAt: now,
      },
    });

    if (claimResult.count === 0) {
      return {
        success: false,
        code: "CONCURRENT_CLAIM",
        error: "This verification link was already processed.",
      };
    }

    await tx.newsletterSubscriber.update({
      where: { id: token.subscriber.id },
      data: {
        status: SubscriberStatus.ACTIVE,
        verifiedAt: now,
      },
    });

    await tx.newsletterSubscriptionToken.updateMany({
      where: {
        subscriberId: token.subscriber.id,
        type: SubscriptionTokenType.VERIFICATION,
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
        action: "SUBSCRIPTION_VERIFIED",
        details: JSON.stringify({
          tokenId: token.id,
          ipHash,
          userAgent,
          verifiedAt: now.toISOString(),
        }),
      },
    });

    return {
      success: true,
      code: "VERIFIED",
      message:
        "Your subscription has been verified successfully. Welcome to the Athena Institute for Political Praxis.",
    };
  });
}

export async function resendVerificationEmail(
  email: string,
  options: { ip: string; userAgent?: string }
): Promise<GenericResendResult> {
  const normalized = email.trim().toLowerCase();
  const ipHash = hashClientIdentifier(options.ip);
  const now = new Date();

  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { normalizedEmail: normalized },
  });

  if (!subscriber) {
    return GENERIC_RESEND_RESPONSE;
  }

  if (subscriber.status === SubscriberStatus.ACTIVE) {
    await prisma.subscriberActivity.create({
      data: {
        subscriberId: subscriber.id,
        action: "RESEND_REQUESTED_WHILE_ACTIVE",
        details: JSON.stringify({
          ipHash,
          timestamp: now.toISOString(),
        }),
      },
    });
    return GENERIC_RESEND_RESPONSE;
  }

  if (subscriber.status === SubscriberStatus.SUPPRESSED) {
    await prisma.subscriberActivity.create({
      data: {
        subscriberId: subscriber.id,
        action: "RESEND_REQUESTED_WHILE_SUPPRESSED",
        details: JSON.stringify({
          ipHash,
          timestamp: now.toISOString(),
        }),
      },
    });
    return GENERIC_RESEND_RESPONSE;
  }

  if (subscriber.status === SubscriberStatus.UNSUBSCRIBED) {
    return GENERIC_RESEND_RESPONSE;
  }

  const latestToken = await prisma.newsletterSubscriptionToken.findFirst({
    where: {
      subscriberId: subscriber.id,
      type: SubscriptionTokenType.VERIFICATION,
    },
    orderBy: { createdAt: "desc" },
  });

  if (latestToken && isWithinCooldown(latestToken.createdAt, RESEND_COOLDOWN_SECONDS)) {
    await prisma.subscriberActivity.create({
      data: {
        subscriberId: subscriber.id,
        action: "RESEND_THROTTLED_BY_COOLDOWN",
        details: JSON.stringify({
          latestTokenId: latestToken.id,
          createdAt: latestToken.createdAt.toISOString(),
          cooldownSeconds: RESEND_COOLDOWN_SECONDS,
          timestamp: now.toISOString(),
        }),
      },
    });
    return GENERIC_RESEND_RESPONSE;
  }

  await prisma.$transaction(async (tx) => {
    await tx.newsletterSubscriptionToken.updateMany({
      where: {
        subscriberId: subscriber.id,
        type: SubscriptionTokenType.VERIFICATION,
        usedAt: null,
      },
      data: {
        usedAt: now,
      },
    });

    await createAndEnqueueVerification(
      {
        subscriber: { id: subscriber.id, email: subscriber.email },
        ipHash,
        userAgent: options.userAgent,
      },
      tx
    );

    await tx.subscriberActivity.create({
      data: {
        subscriberId: subscriber.id,
        action: "VERIFICATION_EMAIL_RESENT",
        details: JSON.stringify({
          ipHash,
          timestamp: now.toISOString(),
        }),
      },
    });
  });

  return GENERIC_RESEND_RESPONSE;
}

