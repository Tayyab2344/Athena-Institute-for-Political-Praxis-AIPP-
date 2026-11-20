if (typeof window !== "undefined") {
  throw new Error("Cloudinary server utility cannot be executed in the client runtime.");
}
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import crypto from "crypto";
import path from "path";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  pages?: number;
  resourceType: string;
}

export type AllowedUploadFolder =
  | "aipp/publications/covers"
  | "aipp/publications/documents"
  | "aipp/journals/covers"
  | "aipp/journals/documents"
  | "aipp/authors/avatars"
  | "aipp/test/phase7-1"
  | "aipp/test/phase7-2";

export const ALLOWED_FOLDERS: readonly AllowedUploadFolder[] = [
  "aipp/publications/covers",
  "aipp/publications/documents",
  "aipp/journals/covers",
  "aipp/journals/documents",
  "aipp/authors/avatars",
  "aipp/test/phase7-1",
  "aipp/test/phase7-2",
];

export function isAllowedFolder(folder: string): folder is AllowedUploadFolder {
  return (ALLOWED_FOLDERS as readonly string[]).includes(folder);
}

export function validateCloudinaryConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!process.env.CLOUDINARY_CLOUD_NAME) missing.push("CLOUDINARY_CLOUD_NAME");
  if (!process.env.CLOUDINARY_API_KEY) missing.push("CLOUDINARY_API_KEY");
  if (!process.env.CLOUDINARY_API_SECRET) missing.push("CLOUDINARY_API_SECRET");

  if (missing.length > 0 && !process.env.CLOUDINARY_URL) {
    return { valid: false, missing };
  }
  return { valid: true, missing: [] };
}

function initializeCloudinary() {
  const validation = validateCloudinaryConfig();
  if (!validation.valid) {
    throw new Error(
      `Cloudinary configuration missing: ${validation.missing.join(", ")}`
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function generateSafePublicId(fileName: string): string {
  const parsed = path.parse(fileName);
  const baseName = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .slice(0, 40);
  const entropy = crypto.randomBytes(8).toString("hex");
  return `${baseName}_${Date.now()}_${entropy}`;
}

export async function uploadImageToCloudinary(
  buffer: Buffer,
  options: {
    folder: AllowedUploadFolder;
    fileName: string;
  }
): Promise<CloudinaryUploadResult> {
  initializeCloudinary();

  if (!isAllowedFolder(options.folder)) {
    throw new Error("Invalid destination folder specified");
  }

  const publicId = generateSafePublicId(options.fileName);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
        unique_filename: true,
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      },
      (error, result?: UploadApiResponse) => {
        if (error) {
          reject(new Error(error.message || "Failed to upload image to Cloudinary"));
          return;
        }
        if (!result || !result.secure_url) {
          reject(new Error("Cloudinary returned invalid upload response"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          resourceType: result.resource_type,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function uploadPdfToCloudinary(
  buffer: Buffer,
  options: {
    folder: AllowedUploadFolder;
    fileName: string;
  }
): Promise<CloudinaryUploadResult> {
  initializeCloudinary();

  if (!isAllowedFolder(options.folder)) {
    throw new Error("Invalid destination folder specified");
  }

  const publicId = generateSafePublicId(options.fileName);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: publicId,
        resource_type: "image",
        format: "pdf",
        overwrite: false,
        unique_filename: true,
      },
      (error, result?: UploadApiResponse) => {
        if (error) {
          reject(new Error(error.message || "Failed to upload PDF to Cloudinary"));
          return;
        }
        if (!result || !result.secure_url) {
          reject(new Error("Cloudinary returned invalid upload response"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format || "pdf",
          bytes: result.bytes,
          pages: result.pages,
          resourceType: result.resource_type,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "raw" | "video" = "image"
): Promise<{ result: string }> {
  initializeCloudinary();

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: resourceType, invalidate: true },
      (error, result) => {
        if (error) {
          reject(new Error(error.message || "Failed to destroy Cloudinary asset"));
          return;
        }
        resolve(result || { result: "unknown" });
      }
    );
  });
}

export interface CloudinaryResourceSummary {
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
  secure_url: string;
  created_at: string;
}

export async function listCloudinaryResources(options?: {
  prefix?: string;
  resourceType?: "image" | "raw" | "video";
  maxResults?: number;
  nextCursor?: string;
}): Promise<{
  resources: CloudinaryResourceSummary[];
  next_cursor?: string;
}> {
  initializeCloudinary();

  return new Promise((resolve, reject) => {
    cloudinary.api.resources(
      {
        type: "upload",
        prefix: options?.prefix || "aipp/",
        resource_type: options?.resourceType || "image",
        max_results: options?.maxResults || 100,
        next_cursor: options?.nextCursor
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message || "Failed to list Cloudinary resources"));
          return;
        }
        resolve({
          resources: (result?.resources || []).map(
            (r: {
              public_id: string;
              format: string;
              resource_type: string;
              bytes: number;
              secure_url: string;
              created_at: string;
            }) => ({
              public_id: r.public_id,
              format: r.format,
              resource_type: r.resource_type,
              bytes: r.bytes,
              secure_url: r.secure_url,
              created_at: r.created_at
            })
          ),
          next_cursor: result?.next_cursor
        });
      }
    );
  });
}


