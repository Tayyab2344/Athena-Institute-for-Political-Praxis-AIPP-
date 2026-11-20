import { getCanonicalAppUrl } from "../email/inquiry-emails";

export interface ListUnsubscribeHeadersParams {
  rawToken: string;
  baseUrl?: string;
  mailtoAddress?: string;
}

export interface ListUnsubscribeHeadersResult {
  "List-Unsubscribe": string;
  "List-Unsubscribe-Post": string;
}

export function buildListUnsubscribeHeaders(
  params: ListUnsubscribeHeadersParams
): ListUnsubscribeHeadersResult {
  const baseUrl = params.baseUrl || getCanonicalAppUrl();
  const mailto = params.mailtoAddress || "unsubscribe@aipp.org.pk";
  const httpUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(params.rawToken)}`;

  return {
    "List-Unsubscribe": `<${httpUrl}>, <mailto:${mailto}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

export function buildWebUnsubscribeUrl(rawToken: string, baseUrl?: string): string {
  const base = baseUrl || getCanonicalAppUrl();
  return `${base}/newsletter/unsubscribe#token=${encodeURIComponent(rawToken)}`;
}

