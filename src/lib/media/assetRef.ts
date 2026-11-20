import { Prisma, MediaAssetType, MediaAssetStatus, MediaProvider } from "@prisma/client";
import { isAssociableMediaFolder } from "@/lib/media/folders";

export async function lockMediaAssets(
  tx: Prisma.TransactionClient,
  assetIds: (string | null | undefined)[]
): Promise<string[]> {
  const distinctSortedIds = Array.from(
    new Set(
      assetIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0)
    )
  ).sort();

  if (distinctSortedIds.length > 0) {
    await tx.$queryRaw`
      SELECT "id" FROM "MediaAsset"
      WHERE "id" IN (${Prisma.join(distinctSortedIds)})
      FOR UPDATE
    `;
  }

  return distinctSortedIds;
}

export async function countMediaAssetReferences(
  tx: Prisma.TransactionClient,
  assetId: string
): Promise<number> {
  const rows = await tx.$queryRaw<Array<{ total: bigint | number }>>`
    SELECT (
      (SELECT COUNT(*) FROM "Publication" WHERE "coverImageAssetId" = ${assetId} OR "pdfAssetId" = ${assetId}) +
      (SELECT COUNT(*) FROM "Journal" WHERE "coverImageAssetId" = ${assetId}) +
      (SELECT COUNT(*) FROM "JournalIssue" WHERE "coverImageAssetId" = ${assetId} OR "pdfAssetId" = ${assetId}) +
      (SELECT COUNT(*) FROM "Author" WHERE "photoAssetId" = ${assetId})
    ) AS total
  `;

  return Number(rows[0]?.total ?? 0);
}

export async function syncMediaAssetStatuses(
  tx: Prisma.TransactionClient,
  assetIds: (string | null | undefined)[]
): Promise<void> {
  const distinctIds = Array.from(
    new Set(
      assetIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0)
    )
  );

  if (distinctIds.length === 0) {
    return;
  }

  const rows = await tx.$queryRaw<Array<{ id: string; total: bigint | number }>>`
    SELECT
      a."id" AS id,
      (
        (SELECT COUNT(*) FROM "Publication" WHERE "coverImageAssetId" = a."id" OR "pdfAssetId" = a."id") +
        (SELECT COUNT(*) FROM "Journal" WHERE "coverImageAssetId" = a."id") +
        (SELECT COUNT(*) FROM "JournalIssue" WHERE "coverImageAssetId" = a."id" OR "pdfAssetId" = a."id") +
        (SELECT COUNT(*) FROM "Author" WHERE "photoAssetId" = a."id")
      ) AS total
    FROM "MediaAsset" a
    WHERE a."id" IN (${Prisma.join(distinctIds)})
  `;

  const idsToUpload: string[] = [];
  const idsToAttach: string[] = [];

  for (const row of rows) {
    if (Number(row.total) === 0) {
      idsToUpload.push(row.id);
    } else {
      idsToAttach.push(row.id);
    }
  }

  if (idsToUpload.length > 0) {
    await tx.mediaAsset.updateMany({
      where: { id: { in: idsToUpload }, status: MediaAssetStatus.ATTACHED },
      data: { status: MediaAssetStatus.UPLOADED }
    });
  }

  if (idsToAttach.length > 0) {
    await tx.mediaAsset.updateMany({
      where: { id: { in: idsToAttach }, status: MediaAssetStatus.UPLOADED },
      data: { status: MediaAssetStatus.ATTACHED }
    });
  }
}

export async function validateMediaAsset(
  tx: Prisma.TransactionClient,
  assetId: string,
  expectedType: MediaAssetType
): Promise<{ valid: true; asset: { id: string; secureUrl: string; originalFilename: string; format: string; mimeType: string; bytes: number; pages: number | null } } | { valid: false; error: string }> {
  const asset = await tx.mediaAsset.findUnique({
    where: { id: assetId }
  });

  if (!asset) {
    return { valid: false, error: `Media asset with id ${assetId} not found.` };
  }

  if (asset.provider !== MediaProvider.CLOUDINARY) {
    return { valid: false, error: `Asset provider must be CLOUDINARY.` };
  }

  if (asset.mediaType !== expectedType) {
    return {
      valid: false,
      error: `Asset media type must be ${expectedType}, found ${asset.mediaType}.`
    };
  }

  if (
    asset.status !== MediaAssetStatus.UPLOADED &&
    asset.status !== MediaAssetStatus.ATTACHED
  ) {
    return {
      valid: false,
      error: `Asset status must be UPLOADED or ATTACHED, found ${asset.status}.`
    };
  }

  if (!isAssociableMediaFolder(asset.folder)) {
    return {
      valid: false,
      error: `Asset folder '${asset.folder}' is not an approved AIPP media folder.`
    };
  }

  return { valid: true, asset };
}

