import { Prisma } from "@prisma/client";

export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractUniqueConstraintConflict(error: unknown): {
  isUnique: boolean;
  targets: string[];
} {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const rawTarget = error.meta?.target;
    const targets = Array.isArray(rawTarget)
      ? rawTarget.map((t) => String(t))
      : typeof rawTarget === "string"
      ? [rawTarget]
      : [];
    return { isUnique: true, targets };
  }
  return { isUnique: false, targets: [] };
}

export const PRIVATE_NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  Pragma: "no-cache"
} as const;

export const SAFE_ADMIN_ASSET_SELECT = {
  id: true,
  originalFilename: true,
  bytes: true,
  mimeType: true,
  format: true,
  secureUrl: true,
  width: true,
  height: true,
  pages: true,
  folder: true,
  status: true
} as const;

