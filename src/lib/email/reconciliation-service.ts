import { prisma } from "@/lib/prisma";
import { EmailStatus } from "@prisma/client";
import { buildEventIdempotencyKey, enqueueEmail } from "./enqueue-service";
import {
  renderInquiryAcknowledgement,
  renderInquiryAdminNotification,
  getCanonicalAppUrl,
  getInquiryNotificationEmail,
  isInquiryEmailEnabled,
} from "./inquiry-emails";
import { recoverStaleProcessingEmails, sanitizeErrorMessage } from "./email-worker";

if (typeof window !== "undefined") {
  throw new Error("Reconciliation service must never be imported in browser environments.");
}

export function getRolloutCutoffTimestamp(): Date | null {
  const rawEnv = process.env.AIPP_EMAIL_ROLLOUT_TIMESTAMP?.trim();
  if (!rawEnv) {
    return null;
  }
  const parsed = new Date(rawEnv);
  if (isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

export interface ReconciliationOptions {
  dryRun?: boolean;
  cutoffTimestamp?: Date;
  inquiryId?: string;
  batchSize?: number;
  staleLeaseMinutes?: number;
  retryFailed?: boolean;
  allowAmbiguousRetry?: boolean;
  adminUserId?: string;
  adminUserEmail?: string;
}

export interface ReconciliationDetail {
  inquiryId: string;
  referenceNumber: string;
  category: "INQUIRY_ACKNOWLEDGEMENT" | "INQUIRY_ADMIN_NOTIFICATION" | "QUEUE_RECOVERY";
  action: "REPAIRED" | "DETECTED" | "SKIPPED" | "ERROR";
  reason: string;
}

export interface ReconciliationReport {
  executedAt: string;
  dryRun: boolean;
  cutoffTimestamp: string;
  boundaryConfigured: boolean;
  reconciliationDisabled: boolean;
  reconciliationDisabledReason?: string;
  inquiriesScanned: number;
  eligibleInquiries: number;
  historicalInquiriesSkipped: number;
  spamInquiriesSkipped: number;
  missingAcknowledgementsDetected: number;
  missingAdminNotificationsDetected: number;
  acknowledgementsRepaired: number;
  adminNotificationsRepaired: number;
  staleProcessingRecovered: number;
  staleProcessingDetected: number;
  failedEmailsFound: number;
  ambiguousDeliveriesFound: number;
  ambiguousDeliveriesRepaired: number;
  ambiguousDeliveriesSkipped: number;
  permanentFailuresSkipped: number;
  details: ReconciliationDetail[];
}

export interface QueueOverviewStats {
  total: number;
  pending: number;
  processing: number;
  accepted: number;
  failed: number;
  ambiguousDeliveryCount: number;
  permanentFailureCount: number;
  cancelled: number;
  staleProcessing: number;
  eligibleInquiriesCount: number;
  historicalInquiriesCount: number;
  cutoffTimestamp: string;
  rolloutConfigured: boolean;
}

export async function getQueueOverviewStats(
  staleLeaseMinutes = 5
): Promise<QueueOverviewStats> {
  const staleThreshold = new Date(Date.now() - staleLeaseMinutes * 60 * 1000);
  const cutoff = getRolloutCutoffTimestamp();
  const rolloutConfigured = cutoff !== null;

  const [
    total,
    pending,
    processing,
    accepted,
    failed,
    ambiguousDeliveryCount,
    permanentFailureCount,
    cancelled,
    staleProcessing,
    eligibleInquiriesCount,
    historicalInquiriesCount,
  ] = await Promise.all([
    prisma.emailOutbox.count(),
    prisma.emailOutbox.count({ where: { status: EmailStatus.PENDING } }),
    prisma.emailOutbox.count({ where: { status: EmailStatus.PROCESSING } }),
    prisma.emailOutbox.count({ where: { status: EmailStatus.ACCEPTED_BY_SMTP } }),
    prisma.emailOutbox.count({ where: { status: EmailStatus.FAILED } }),
    prisma.emailOutbox.count({
      where: {
        status: EmailStatus.FAILED,
        lastError: { startsWith: "AMBIGUOUS_DELIVERY" },
      },
    }),
    prisma.emailOutbox.count({
      where: {
        status: EmailStatus.FAILED,
        lastError: { startsWith: "Permanent delivery failure" },
      },
    }),
    prisma.emailOutbox.count({ where: { status: EmailStatus.CANCELLED } }),
    prisma.emailOutbox.count({
      where: {
        status: EmailStatus.PROCESSING,
        lockedAt: { lt: staleThreshold },
      },
    }),
    rolloutConfigured
      ? prisma.contactInquiry.count({
          where: {
            createdAt: { gte: cutoff },
            status: { not: "SPAM" },
            activities: { some: { action: "TRANSACTIONAL_EMAIL_ELIGIBLE" } },
          },
        })
      : Promise.resolve(0),
    rolloutConfigured
      ? prisma.contactInquiry.count({
          where: {
            OR: [
              { createdAt: { lt: cutoff } },
              { activities: { none: { action: "TRANSACTIONAL_EMAIL_ELIGIBLE" } } },
            ],
          },
        })
      : prisma.contactInquiry.count(),
  ]);

  return {
    total,
    pending,
    processing,
    accepted,
    failed,
    ambiguousDeliveryCount,
    permanentFailureCount,
    cancelled,
    staleProcessing,
    eligibleInquiriesCount,
    historicalInquiriesCount,
    cutoffTimestamp: cutoff ? cutoff.toISOString() : "NOT_CONFIGURED (FAIL-CLOSED)",
    rolloutConfigured,
  };
}

export async function reconcileInquiryEmails(
  options: ReconciliationOptions = {}
): Promise<ReconciliationReport> {
  const dryRun = options.dryRun ?? true;
  const isProd = process.env.NODE_ENV === "production";
  const serverCutoff = getRolloutCutoffTimestamp();

  let effectiveCutoff: Date | null = serverCutoff;
  if (!isProd && !effectiveCutoff && options.cutoffTimestamp) {
    effectiveCutoff = options.cutoffTimestamp;
  }

  const staleLeaseMinutes = Math.max(1, Math.min(60, options.staleLeaseMinutes ?? 5));
  const batchSize = Math.max(1, Math.min(200, options.batchSize ?? 100));

  const report: ReconciliationReport = {
    executedAt: new Date().toISOString(),
    dryRun,
    cutoffTimestamp: effectiveCutoff ? effectiveCutoff.toISOString() : "NOT_CONFIGURED (FAIL-CLOSED)",
    boundaryConfigured: effectiveCutoff !== null,
    reconciliationDisabled: effectiveCutoff === null,
    reconciliationDisabledReason:
      effectiveCutoff === null
        ? "Production rollout boundary (AIPP_EMAIL_ROLLOUT_TIMESTAMP) is missing or invalid. Reconciliation is disabled to protect historical inquiries."
        : undefined,
    inquiriesScanned: 0,
    eligibleInquiries: 0,
    historicalInquiriesSkipped: 0,
    spamInquiriesSkipped: 0,
    missingAcknowledgementsDetected: 0,
    missingAdminNotificationsDetected: 0,
    acknowledgementsRepaired: 0,
    adminNotificationsRepaired: 0,
    staleProcessingRecovered: 0,
    staleProcessingDetected: 0,
    failedEmailsFound: 0,
    ambiguousDeliveriesFound: 0,
    ambiguousDeliveriesRepaired: 0,
    ambiguousDeliveriesSkipped: 0,
    permanentFailuresSkipped: 0,
    details: [],
  };

  if (!dryRun && !isInquiryEmailEnabled()) {
    report.reconciliationDisabled = true;
    report.reconciliationDisabledReason =
      "Transactional emails are globally disabled (AIPP_INQUIRY_EMAILS_ENABLED is false). Live reconciliation is refused.";
    report.details.push({
      inquiryId: "SYSTEM",
      referenceNumber: "SYSTEM",
      category: "QUEUE_RECOVERY",
      action: "SKIPPED",
      reason: report.reconciliationDisabledReason,
    });
    return report;
  }

  if (!effectiveCutoff) {
    report.details.push({
      inquiryId: "SYSTEM",
      referenceNumber: "SYSTEM",
      category: "QUEUE_RECOVERY",
      action: "ERROR",
      reason: report.reconciliationDisabledReason || "Rollout boundary missing.",
    });
    return report;
  }

  const staleThreshold = new Date(Date.now() - staleLeaseMinutes * 60 * 1000);
  const staleCount = await prisma.emailOutbox.count({
    where: {
      status: EmailStatus.PROCESSING,
      lockedAt: { lt: staleThreshold },
    },
  });

  report.staleProcessingDetected = staleCount;
  if (!dryRun && staleCount > 0) {
    const recovered = await recoverStaleProcessingEmails(staleLeaseMinutes);
    report.staleProcessingRecovered = recovered;
  }

  const failedCount = await prisma.emailOutbox.count({
    where: { status: EmailStatus.FAILED },
  });
  report.failedEmailsFound = failedCount;

  const inquiryWhere: Record<string, unknown> = {};
  if (options.inquiryId) {
    inquiryWhere.id = options.inquiryId;
  }

  const inquiries = await prisma.contactInquiry.findMany({
    where: inquiryWhere,
    orderBy: { createdAt: "desc" },
    take: batchSize,
    select: {
      id: true,
      referenceNumber: true,
      fullName: true,
      email: true,
      subject: true,
      organization: true,
      status: true,
      createdAt: true,
      activities: {
        where: { action: "TRANSACTIONAL_EMAIL_ELIGIBLE" },
        select: { id: true, createdAt: true },
      },
    },
  });

  report.inquiriesScanned = inquiries.length;

  const adminNotificationEmail = getInquiryNotificationEmail();
  const baseUrl = getCanonicalAppUrl();

  for (const inquiry of inquiries) {
    if (inquiry.createdAt < effectiveCutoff) {
      report.historicalInquiriesSkipped++;
      continue;
    }

    if (inquiry.status === "SPAM") {
      report.spamInquiriesSkipped++;
      continue;
    }

    const isMarkedEligible = Boolean(
      (inquiry.activities && inquiry.activities.length > 0) ||
      (inquiry as Record<string, unknown>).emailEligible
    );
    if (!isMarkedEligible) {
      report.historicalInquiriesSkipped++;
      continue;
    }

    report.eligibleInquiries++;

    const ackKey = buildEventIdempotencyKey("inquiry-acknowledgement", inquiry.id);
    const adminKey = buildEventIdempotencyKey("inquiry-admin-notification", inquiry.id);

    const existingOutbox = await prisma.emailOutbox.findMany({
      where: {
        idempotencyKey: { in: [ackKey, adminKey] },
      },
      select: {
        id: true,
        idempotencyKey: true,
        status: true,
        category: true,
        lastError: true,
        attemptCount: true,
      },
    });

    const ackRecord = existingOutbox.find((o) => o.idempotencyKey === ackKey);
    const adminRecord = existingOutbox.find((o) => o.idempotencyKey === adminKey);

    if (!ackRecord) {
      report.missingAcknowledgementsDetected++;
      if (dryRun) {
        report.details.push({
          inquiryId: inquiry.id,
          referenceNumber: inquiry.referenceNumber,
          category: "INQUIRY_ACKNOWLEDGEMENT",
          action: "DETECTED",
          reason: "Acknowledgement outbox record is missing for eligible inquiry.",
        });
      } else {
        try {
          const ackTemplate = renderInquiryAcknowledgement(inquiry, { baseUrl });
          await enqueueEmail({
            recipientEmail: inquiry.email,
            recipientName: inquiry.fullName,
            subject: ackTemplate.subject,
            textBody: ackTemplate.textBody,
            htmlBody: ackTemplate.htmlBody,
            category: "INQUIRY_ACKNOWLEDGEMENT",
            idempotencyKey: ackKey,
            maxAttempts: 3,
          });
          report.acknowledgementsRepaired++;
          report.details.push({
            inquiryId: inquiry.id,
            referenceNumber: inquiry.referenceNumber,
            category: "INQUIRY_ACKNOWLEDGEMENT",
            action: "REPAIRED",
            reason: "Queued missing acknowledgement outbox record.",
          });
        } catch (enqueueErr: unknown) {
          report.details.push({
            inquiryId: inquiry.id,
            referenceNumber: inquiry.referenceNumber,
            category: "INQUIRY_ACKNOWLEDGEMENT",
            action: "ERROR",
            reason: `Failed to enqueue missing acknowledgement: ${sanitizeErrorMessage(enqueueErr)}`,
          });
        }
      }
    } else if (ackRecord.status === EmailStatus.FAILED) {
      const isAmbiguous = Boolean(ackRecord.lastError?.startsWith("AMBIGUOUS_DELIVERY"));
      const isPermanent = Boolean(ackRecord.lastError?.startsWith("Permanent delivery failure"));

      if (isAmbiguous) {
        report.ambiguousDeliveriesFound++;
      }

      if (options.retryFailed) {
        if (isPermanent) {
          report.permanentFailuresSkipped++;
          report.details.push({
            inquiryId: inquiry.id,
            referenceNumber: inquiry.referenceNumber,
            category: "INQUIRY_ACKNOWLEDGEMENT",
            action: "SKIPPED",
            reason: "Permanent SMTP failure cannot be retried.",
          });
        } else if (isAmbiguous && !options.allowAmbiguousRetry) {
          report.ambiguousDeliveriesSkipped++;
          report.details.push({
            inquiryId: inquiry.id,
            referenceNumber: inquiry.referenceNumber,
            category: "INQUIRY_ACKNOWLEDGEMENT",
            action: "SKIPPED",
            reason: "Ambiguous delivery requires explicit allowAmbiguousRetry confirmation due to potential duplicate-send risk.",
          });
        } else if (dryRun) {
          report.details.push({
            inquiryId: inquiry.id,
            referenceNumber: inquiry.referenceNumber,
            category: "INQUIRY_ACKNOWLEDGEMENT",
            action: "DETECTED",
            reason: isAmbiguous
              ? "Ambiguous delivery record detected for authorized manual retry."
              : "Failed acknowledgement record detected for authorized manual retry.",
          });
        } else {
          const prevAttemptCount = ackRecord.attemptCount;
          const prevLastError = ackRecord.lastError || "No prior error recorded";
          const adminEmail = options.adminUserEmail || "SUPER_ADMIN";
          const authorizedAt = new Date().toISOString();

          const retryUpdate = await prisma.emailOutbox.updateMany({
            where: {
              id: ackRecord.id,
              status: EmailStatus.FAILED,
            },
            data: {
              status: EmailStatus.PENDING,
              attemptCount: 0,
              lockedAt: null,
              lockedBy: null,
              claimToken: null,
              nextRetryAt: new Date(),
              lastError: isAmbiguous
                ? `MANUAL_RETRY_AUTHORIZED by ${adminEmail} at ${authorizedAt}; previousAttempts=${prevAttemptCount}; previousError=${prevLastError}`
                : `MANUAL_RETRY_SCHEDULED by ${adminEmail} at ${authorizedAt}; previousAttempts=${prevAttemptCount}`,
            },
          });
          if (retryUpdate.count === 0) {
            continue;
          }
          if (isAmbiguous) {
            report.ambiguousDeliveriesRepaired++;
            if (options.adminUserId) {
              try {
                await prisma.inquiryActivity.create({
                  data: {
                    inquiryId: inquiry.id,
                    adminUserId: options.adminUserId,
                    action: "AMBIGUOUS_EMAIL_RETRY_AUTHORIZED",
                    details: JSON.stringify({
                      outboxId: ackRecord.id,
                      category: ackRecord.category,
                      recipient: inquiry.email,
                      previousAttempts: prevAttemptCount,
                      previousLastError: prevLastError,
                      authorizedBy: adminEmail,
                      authorizedAt,
                      duplicateWarningAcknowledged: true,
                    }),
                  },
                });
              } catch {
              }
            }
          }
          report.details.push({
            inquiryId: inquiry.id,
            referenceNumber: inquiry.referenceNumber,
            category: "INQUIRY_ACKNOWLEDGEMENT",
            action: "REPAIRED",
            reason: isAmbiguous
              ? "Reset AMBIGUOUS_DELIVERY acknowledgement record to PENDING with duplicate-risk acknowledgment and audit activity logged."
              : "Reset FAILED acknowledgement record to PENDING for retry.",
          });
        }
      }
    }

    if (adminNotificationEmail) {
      if (!adminRecord) {
        report.missingAdminNotificationsDetected++;
        if (dryRun) {
          report.details.push({
            inquiryId: inquiry.id,
            referenceNumber: inquiry.referenceNumber,
            category: "INQUIRY_ADMIN_NOTIFICATION",
            action: "DETECTED",
            reason: "Admin notification outbox record is missing for eligible inquiry.",
          });
        } else {
          try {
            const adminTemplate = renderInquiryAdminNotification(inquiry, { baseUrl });
            await enqueueEmail({
              recipientEmail: adminNotificationEmail,
              recipientName: "AIPP Administration",
              subject: adminTemplate.subject,
              textBody: adminTemplate.textBody,
              htmlBody: adminTemplate.htmlBody,
              category: "INQUIRY_ADMIN_NOTIFICATION",
              idempotencyKey: adminKey,
              maxAttempts: 3,
            });
            report.adminNotificationsRepaired++;
            report.details.push({
              inquiryId: inquiry.id,
              referenceNumber: inquiry.referenceNumber,
              category: "INQUIRY_ADMIN_NOTIFICATION",
              action: "REPAIRED",
              reason: "Queued missing admin notification outbox record.",
            });
          } catch (enqueueErr: unknown) {
            report.details.push({
              inquiryId: inquiry.id,
              referenceNumber: inquiry.referenceNumber,
              category: "INQUIRY_ADMIN_NOTIFICATION",
              action: "ERROR",
              reason: `Failed to enqueue missing admin notification: ${sanitizeErrorMessage(enqueueErr)}`,
            });
          }
        }
      } else if (adminRecord.status === EmailStatus.FAILED) {
        const isAmbiguous = Boolean(adminRecord.lastError?.startsWith("AMBIGUOUS_DELIVERY"));
        const isPermanent = Boolean(adminRecord.lastError?.startsWith("Permanent delivery failure"));

        if (isAmbiguous) {
          report.ambiguousDeliveriesFound++;
        }

        if (options.retryFailed) {
          if (isPermanent) {
            report.permanentFailuresSkipped++;
            report.details.push({
              inquiryId: inquiry.id,
              referenceNumber: inquiry.referenceNumber,
              category: "INQUIRY_ADMIN_NOTIFICATION",
              action: "SKIPPED",
              reason: "Permanent SMTP failure cannot be retried.",
            });
          } else if (isAmbiguous && !options.allowAmbiguousRetry) {
            report.ambiguousDeliveriesSkipped++;
            report.details.push({
              inquiryId: inquiry.id,
              referenceNumber: inquiry.referenceNumber,
              category: "INQUIRY_ADMIN_NOTIFICATION",
              action: "SKIPPED",
              reason: "Ambiguous delivery requires explicit allowAmbiguousRetry confirmation due to potential duplicate-send risk.",
            });
          } else if (dryRun) {
            report.details.push({
              inquiryId: inquiry.id,
              referenceNumber: inquiry.referenceNumber,
              category: "INQUIRY_ADMIN_NOTIFICATION",
              action: "DETECTED",
              reason: isAmbiguous
                ? "Ambiguous delivery record detected for authorized manual retry."
                : "Failed admin notification record detected for authorized manual retry.",
            });
          } else {
            const prevAttemptCount = adminRecord.attemptCount;
            const prevLastError = adminRecord.lastError || "No prior error recorded";
            const adminEmail = options.adminUserEmail || "SUPER_ADMIN";
            const authorizedAt = new Date().toISOString();

            const adminRetryUpdate = await prisma.emailOutbox.updateMany({
              where: {
                id: adminRecord.id,
                status: EmailStatus.FAILED,
              },
              data: {
                status: EmailStatus.PENDING,
                attemptCount: 0,
                lockedAt: null,
                lockedBy: null,
                claimToken: null,
                nextRetryAt: new Date(),
                lastError: isAmbiguous
                  ? `MANUAL_RETRY_AUTHORIZED by ${adminEmail} at ${authorizedAt}; previousAttempts=${prevAttemptCount}; previousError=${prevLastError}`
                  : `MANUAL_RETRY_SCHEDULED by ${adminEmail} at ${authorizedAt}; previousAttempts=${prevAttemptCount}`,
              },
            });
            if (adminRetryUpdate.count === 0) {
              continue;
            }
            if (isAmbiguous) {
              report.ambiguousDeliveriesRepaired++;
              if (options.adminUserId) {
                try {
                  await prisma.inquiryActivity.create({
                    data: {
                      inquiryId: inquiry.id,
                      adminUserId: options.adminUserId,
                      action: "AMBIGUOUS_EMAIL_RETRY_AUTHORIZED",
                      details: JSON.stringify({
                        outboxId: adminRecord.id,
                        category: adminRecord.category,
                        recipient: adminNotificationEmail,
                        previousAttempts: prevAttemptCount,
                        previousLastError: prevLastError,
                        authorizedBy: adminEmail,
                        authorizedAt,
                        duplicateWarningAcknowledged: true,
                      }),
                    },
                  });
                } catch {
                }
              }
            }
            report.details.push({
              inquiryId: inquiry.id,
              referenceNumber: inquiry.referenceNumber,
              category: "INQUIRY_ADMIN_NOTIFICATION",
              action: "REPAIRED",
              reason: isAmbiguous
                ? "Reset AMBIGUOUS_DELIVERY admin notification record to PENDING with duplicate-risk acknowledgment and audit activity logged."
                : "Reset FAILED admin notification record to PENDING for retry.",
            });
          }
        }
      }
    }
  }

  return report;
}
