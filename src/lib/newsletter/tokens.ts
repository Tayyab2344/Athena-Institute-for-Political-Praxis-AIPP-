import crypto from "crypto";

export const RESEND_COOLDOWN_SECONDS = 300;
export const VERIFICATION_EXPIRY_HOURS = 24;

const TOKEN_HEX_REGEX = /^[0-9a-fA-F]{64}$/;

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashVerificationToken(rawToken: string): string {
  return crypto
    .createHash("sha256")
    .update(rawToken.trim().toLowerCase())
    .digest("hex");
}

export function validateTokenFormat(rawToken: unknown): rawToken is string {
  if (typeof rawToken !== "string") {
    return false;
  }
  return TOKEN_HEX_REGEX.test(rawToken.trim());
}

export function getVerificationExpiryDate(hours = VERIFICATION_EXPIRY_HOURS): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export function isWithinCooldown(lastSentAt: Date, cooldownSeconds = RESEND_COOLDOWN_SECONDS): boolean {
  const elapsed = (Date.now() - lastSentAt.getTime()) / 1000;
  return elapsed < cooldownSeconds;
}

export function obfuscateEmail(email: string): string {
  const parts = email.trim().split("@");
  if (parts.length !== 2) return "e***@domain.local";
  const [local, domain] = parts;
  const visible = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : `${local[0]}***`;
  return `${visible}@${domain}`;
}

