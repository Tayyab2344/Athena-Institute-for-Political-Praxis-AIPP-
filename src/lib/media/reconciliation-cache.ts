import { checkRateLimit, RateLimitResult } from "@/lib/auth/rate-limiter";
import {
  collectReconciliationSnapshot,
  sliceReconciliationSnapshot,
  ReconciliationCacheMetadata,
  ReconciliationFilterOptions,
  ReconciliationReport,
  ReconciliationSnapshot
} from "@/lib/media/reconciliation";

export const MEDIA_RECONCILIATION_CACHE_TTL_MS = 90_000;
export const MEDIA_RECONCILIATION_RATE_LIMIT_MAX = 5;
export const MEDIA_RECONCILIATION_RATE_LIMIT_WINDOW_SECONDS = 300;

interface CachedReconciliationEntry {
  snapshot: ReconciliationSnapshot;
  cachedAtMs: number;
  expiresAtMs: number;
}

type InFlightOutcome =
  | {
      ok: true;
      snapshot: ReconciliationSnapshot;
      finishedAtMs: number;
      isCloudinaryFailed: boolean;
    }
  | {
      ok: false;
      status: 429;
      error: string;
      retryAfterSeconds: number;
      lastSuccessfulAt: string | null;
    };

interface ReconciliationCacheStore {
  entry: CachedReconciliationEntry | null;
  lastSuccessfulAt: string | null;
  inFlight: Promise<InFlightOutcome> | null;
}

const globalForReconciliation = globalThis as unknown as {
  __aippMediaReconciliationStore?: ReconciliationCacheStore;
};

function getStore(): ReconciliationCacheStore {
  if (!globalForReconciliation.__aippMediaReconciliationStore) {
    globalForReconciliation.__aippMediaReconciliationStore = {
      entry: null,
      lastSuccessfulAt: null,
      inFlight: null
    };
  }
  return globalForReconciliation.__aippMediaReconciliationStore;
}

export function resetMediaReconciliationCache(): void {
  const store = getStore();
  store.entry = null;
  store.lastSuccessfulAt = null;
  store.inFlight = null;
}

export function getMediaReconciliationCacheState(): {
  hasCachedEntry: boolean;
  lastSuccessfulAt: string | null;
  inFlight: boolean;
} {
  const store = getStore();
  return {
    hasCachedEntry: store.entry !== null,
    lastSuccessfulAt: store.lastSuccessfulAt,
    inFlight: store.inFlight !== null
  };
}

export interface ExecuteCachedReconciliationOptions {
  adminUserId: string;
  clientIp: string;
  forceRefresh?: boolean;
  filters?: ReconciliationFilterOptions;
  ttlMs?: number;
  nowMs?: () => number;
  rateLimitMax?: number;
  rateLimitWindowSeconds?: number;
  checkRateLimitFn?: (
    key: string,
    maxPoints: number,
    windowSeconds: number
  ) => Promise<RateLimitResult>;
  collectSnapshotFn?: () => Promise<ReconciliationSnapshot>;
}

export type CachedReconciliationResult =
  | {
      ok: true;
      report: ReconciliationReport;
    }
  | {
      ok: false;
      status: 429;
      error: string;
      retryAfterSeconds: number;
      lastSuccessfulAt: string | null;
    };

export async function getOrRefreshMediaReconciliation(
  options: ExecuteCachedReconciliationOptions
): Promise<CachedReconciliationResult> {
  const store = getStore();
  const ttlMs = Math.max(1000, options.ttlMs ?? MEDIA_RECONCILIATION_CACHE_TTL_MS);
  const ttlSeconds = Math.round(ttlMs / 1000);
  const nowFn = options.nowMs ?? (() => Date.now());
  const now = nowFn();
  const forceRefresh = Boolean(options.forceRefresh);

  if (!forceRefresh && store.entry && store.entry.expiresAtMs > now) {
    const cacheMeta: ReconciliationCacheMetadata = {
      hit: true,
      coalesced: false,
      ttlSeconds,
      cachedAt: new Date(store.entry.cachedAtMs).toISOString(),
      expiresAt: new Date(store.entry.expiresAtMs).toISOString(),
      lastSuccessfulAt: store.lastSuccessfulAt
    };

    return {
      ok: true,
      report: sliceReconciliationSnapshot(store.entry.snapshot, options.filters, cacheMeta)
    };
  }

  let coalesced = false;
  let activePromise = store.inFlight;

  if (activePromise) {
    coalesced = true;
  } else {
    const rateLimiter = options.checkRateLimitFn ?? checkRateLimit;
    const maxPoints = options.rateLimitMax ?? MEDIA_RECONCILIATION_RATE_LIMIT_MAX;
    const windowSeconds =
      options.rateLimitWindowSeconds ?? MEDIA_RECONCILIATION_RATE_LIMIT_WINDOW_SECONDS;
    const rateLimitKey = `admin:media-reconciliation:${options.adminUserId}:${options.clientIp}`;
    const runner = options.collectSnapshotFn ?? (() => collectReconciliationSnapshot());

    const createdPromise: Promise<InFlightOutcome> = (async () => {
      const rateLimit = await rateLimiter(rateLimitKey, maxPoints, windowSeconds);
      if (!rateLimit.allowed) {
        return {
          ok: false,
          status: 429,
          error:
            "Rate limit exceeded for live media reconciliation refreshes. Please wait before running another external inventory scan.",
          retryAfterSeconds: rateLimit.retryAfterSeconds ?? windowSeconds,
          lastSuccessfulAt: store.lastSuccessfulAt
        };
      }

      const snapshot = await runner();
      const finishedAtMs = nowFn();
      const isCloudinaryFailed =
        snapshot.cloudinaryApi.status === "UNAVAILABLE" ||
        snapshot.cloudinaryApi.enumeration.completeness === "FAILED";

      if (!isCloudinaryFailed) {
        store.entry = {
          snapshot,
          cachedAtMs: finishedAtMs,
          expiresAtMs: finishedAtMs + ttlMs
        };
        store.lastSuccessfulAt = snapshot.generatedAt;
      }

      return {
        ok: true,
        snapshot,
        finishedAtMs,
        isCloudinaryFailed
      };
    })();

    store.inFlight = createdPromise;
    activePromise = createdPromise;

    createdPromise.finally(() => {
      if (store.inFlight === createdPromise) {
        store.inFlight = null;
      }
    }).catch(() => {});
  }

  const outcome = await activePromise;
  if (!outcome.ok) {
    return outcome;
  }

  const cacheMeta: ReconciliationCacheMetadata = {
    hit: false,
    coalesced,
    ttlSeconds,
    cachedAt: new Date(outcome.finishedAtMs).toISOString(),
    expiresAt: outcome.isCloudinaryFailed
      ? new Date(outcome.finishedAtMs).toISOString()
      : new Date(outcome.finishedAtMs + ttlMs).toISOString(),
    lastSuccessfulAt: store.lastSuccessfulAt
  };

  return {
    ok: true,
    report: sliceReconciliationSnapshot(outcome.snapshot, options.filters, cacheMeta)
  };
}
