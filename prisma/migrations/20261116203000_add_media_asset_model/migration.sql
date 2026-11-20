CREATE TYPE "MediaAssetType" AS ENUM ('IMAGE', 'DOCUMENT');

CREATE TYPE "MediaProvider" AS ENUM ('CLOUDINARY');

CREATE TYPE "MediaAssetStatus" AS ENUM ('UPLOADED', 'ATTACHED', 'ARCHIVED', 'DELETED');

ALTER TABLE "Publication" ADD COLUMN "coverImageAssetId" TEXT,
ADD COLUMN "pdfAssetId" TEXT;

CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "mediaType" "MediaAssetType" NOT NULL,
    "provider" "MediaProvider" NOT NULL DEFAULT 'CLOUDINARY',
    "secureUrl" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "pages" INTEGER,
    "checksumSha256" TEXT,
    "folder" TEXT NOT NULL,
    "status" "MediaAssetStatus" NOT NULL DEFAULT 'UPLOADED',
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaAsset_publicId_key" ON "MediaAsset"("publicId");

CREATE INDEX "MediaAsset_status_createdAt_idx" ON "MediaAsset"("status", "createdAt");

CREATE INDEX "MediaAsset_uploadedById_idx" ON "MediaAsset"("uploadedById");

CREATE INDEX "MediaAsset_checksumSha256_idx" ON "MediaAsset"("checksumSha256");

CREATE INDEX "MediaAsset_folder_idx" ON "MediaAsset"("folder");

ALTER TABLE "Publication" ADD CONSTRAINT "Publication_coverImageAssetId_fkey" FOREIGN KEY ("coverImageAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Publication" ADD CONSTRAINT "Publication_pdfAssetId_fkey" FOREIGN KEY ("pdfAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

