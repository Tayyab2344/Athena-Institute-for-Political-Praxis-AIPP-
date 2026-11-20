export const CANONICAL_CONSENT_TEXT =
  "I consent to receive research publications, policy briefs, and institutional announcements from the Athena Institute for Political Praxis.";

export const CANONICAL_POLICY_VERSION = "v1.0";

export const SUPPORTED_POLICY_VERSIONS = ["v1.0"] as const;

export interface CanonicalConsentRecord {
  consentText: string;
  policyVersion: string;
  consentType: string;
}

export function getCanonicalConsent(): CanonicalConsentRecord {
  return {
    consentText: CANONICAL_CONSENT_TEXT,
    policyVersion: CANONICAL_POLICY_VERSION,
    consentType: "NEWSLETTER_SUBSCRIPTION",
  };
}

export function generateAnonymizedEmail(subscriberId: string): string {
  return `anonymized-${subscriberId}@deleted.local`;
}

