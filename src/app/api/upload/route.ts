import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  MediaAssetType,
  MediaProvider,
  MediaAssetStatus,
  Prisma,
} from "@prisma/client";
import { requireAdminAuth } from "@/lib/auth/permissions";
import { validateRequestOrigin } from "@/lib/auth/csrf";
import { inspectFile } from "@/lib/security/fileInspection";
import {
  uploadImageToCloudinary,
  uploadPdfToCloudinary,
  deleteCloudinaryAsset,
  isAllowedFolder,
  AllowedUploadFolder,
} from "@/lib/cloudinary";

export async function POST(request: Request) {
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid && originCheck.response) {
    return originCheck.response;
  }

  const auth = await requireAdminAuth(request, "upload_files");
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const inspection = inspectFile(buffer, file.name, file.type);
    if (!inspection.valid || !inspection.detectedType || !inspection.canonicalMimeType) {
      return NextResponse.json(
        { error: inspection.error || "File validation failed" },
        { status: 400 }
      );
    }

    const requestedFolder = formData.get("folder") as string | null;
    let targetFolder: AllowedUploadFolder;

    if (requestedFolder && isAllowedFolder(requestedFolder)) {
      targetFolder = requestedFolder;
    } else if (inspection.detectedType === "pdf") {
      targetFolder = "aipp/publications/documents";
    } else {
      targetFolder = "aipp/publications/covers";
    }

    let uploadResult;
    if (inspection.detectedType === "pdf") {
      uploadResult = await uploadPdfToCloudinary(buffer, {
        folder: targetFolder,
        fileName: file.name,
      });
    } else {
      uploadResult = await uploadImageToCloudinary(buffer, {
        folder: targetFolder,
        fileName: file.name,
      });
    }

    const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

    let mediaAsset;
    try {
      mediaAsset = await prisma.mediaAsset.create({
        data: {
          publicId: uploadResult.publicId,
          mediaType:
            inspection.detectedType === "pdf"
              ? MediaAssetType.DOCUMENT
              : MediaAssetType.IMAGE,
          provider: MediaProvider.CLOUDINARY,
          secureUrl: uploadResult.url,
          originalFilename: file.name,
          format:
            uploadResult.format ||
            (inspection.detectedType === "pdf" ? "pdf" : inspection.detectedType),
          mimeType: inspection.canonicalMimeType,
          bytes: uploadResult.bytes || buffer.length,
          width: uploadResult.width ?? null,
          height: uploadResult.height ?? null,
          pages: uploadResult.pages ?? null,
          checksumSha256: checksum,
          folder: targetFolder,
          status: MediaAssetStatus.UPLOADED,
          uploadedById: auth.user.id,
        },
      });
    } catch (dbError) {
      let cleanupSuccess = false;
      let cleanupError: string | null = null;

      try {
        const destroyRes = await deleteCloudinaryAsset(
          uploadResult.publicId,
          (uploadResult.resourceType as "image" | "raw" | "video") || "image"
        );
        cleanupSuccess = destroyRes.result === "ok";
      } catch (destroyErr) {
        cleanupSuccess = false;
        cleanupError =
          destroyErr instanceof Error ? destroyErr.message : "Unknown destroy error";
      }

      const dbErrorCode =
        dbError instanceof Prisma.PrismaClientKnownRequestError
          ? dbError.code
          : dbError instanceof Error
            ? dbError.name
            : "UNKNOWN_DB_ERROR";

      console.error(
        JSON.stringify({
          event: "MEDIA_ASSET_REGISTRATION_FAILED",
          publicId: uploadResult.publicId,
          resourceType: uploadResult.resourceType || "image",
          cleanupAttempted: true,
          cleanupSuccess,
          cleanupError: cleanupError ? cleanupError.slice(0, 200) : null,
          dbErrorCode,
          timestamp: new Date().toISOString(),
        })
      );

      const isUniqueConstraint =
        dbError instanceof Prisma.PrismaClientKnownRequestError &&
        dbError.code === "P2002";

      return NextResponse.json(
        {
          error: isUniqueConstraint
            ? "Media asset with this identifier already exists."
            : "Failed to register media asset in database.",
          cleanupStatus: cleanupSuccess ? "CLEANED" : "ORPHANED",
        },
        { status: isUniqueConstraint ? 409 : 500 }
      );
    }

    return NextResponse.json({
      url: uploadResult.url,
      fileName: file.name,
      fileSize: uploadResult.bytes || file.size,
      mimeType: inspection.canonicalMimeType,
      assetId: mediaAsset.id,
      publicId: mediaAsset.publicId,
    });
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "";
    if (
      rawMessage.includes("missing permissions") ||
      rawMessage.includes("unexpected status code - 403")
    ) {
      return NextResponse.json(
        {
          error:
            "Cloud storage request forbidden: API key lacks upload/create permissions in Cloudinary.",
        },
        { status: 502 }
      );
    }

    if (
      rawMessage.includes("Invalid Signature") ||
      rawMessage.includes("api_secret mismatch") ||
      rawMessage.includes("configuration missing") ||
      rawMessage.includes("credentials") ||
      rawMessage.includes("Must supply api_key")
    ) {
      return NextResponse.json(
        {
          error:
            "Cloud storage authentication failed. Please verify storage credentials in system configuration.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to upload file to storage" },
      { status: 500 }
    );
  }
}
