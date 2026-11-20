import path from "path";

export type SupportedFileType = "jpeg" | "png" | "webp" | "pdf";

export interface FileInspectionResult {
  valid: boolean;
  error?: string;
  detectedType?: SupportedFileType;
  canonicalMimeType?: string;
  canonicalExtension?: string;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_PDF_SIZE = 25 * 1024 * 1024;

export function inspectFile(
  buffer: Buffer,
  clientFileName: string,
  clientMimeType: string
): FileInspectionResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: "Empty file provided" };
  }

  const rawExt = path.extname(clientFileName).toLowerCase();

  let detectedType: SupportedFileType | null = null;

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    detectedType = "jpeg";
  } else if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    detectedType = "png";
  } else if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    detectedType = "webp";
  } else if (
    buffer.length >= 5 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  ) {
    detectedType = "pdf";
  }

  if (!detectedType) {
    return {
      valid: false,
      error: "Unsupported file type or invalid file signature. Only JPEG, PNG, WebP, and PDF files are allowed.",
    };
  }

  if (detectedType === "pdf") {
    if (buffer.length > MAX_PDF_SIZE) {
      return { valid: false, error: "PDF file size exceeds 25MB limit" };
    }
    const sample = buffer.subarray(0, Math.min(buffer.length, 1048576)).toString("latin1");
    if (sample.includes("/Encrypt")) {
      return { valid: false, error: "Encrypted or password-protected PDF files are not supported" };
    }
    if (rawExt !== ".pdf") {
      return { valid: false, error: "File extension does not match detected PDF content" };
    }
    if (clientMimeType !== "application/pdf") {
      return { valid: false, error: "Client MIME type does not match detected PDF content" };
    }
    return {
      valid: true,
      detectedType: "pdf",
      canonicalMimeType: "application/pdf",
      canonicalExtension: ".pdf",
    };
  }

  if (buffer.length > MAX_IMAGE_SIZE) {
    return { valid: false, error: "Image file size exceeds 10MB limit" };
  }

  if (detectedType === "jpeg") {
    if (rawExt !== ".jpg" && rawExt !== ".jpeg") {
      return { valid: false, error: "File extension does not match detected JPEG content" };
    }
    if (clientMimeType !== "image/jpeg" && clientMimeType !== "image/jpg") {
      return { valid: false, error: "Client MIME type does not match detected JPEG content" };
    }
    return {
      valid: true,
      detectedType: "jpeg",
      canonicalMimeType: "image/jpeg",
      canonicalExtension: ".jpg",
    };
  }

  if (detectedType === "png") {
    if (rawExt !== ".png") {
      return { valid: false, error: "File extension does not match detected PNG content" };
    }
    if (clientMimeType !== "image/png") {
      return { valid: false, error: "Client MIME type does not match detected PNG content" };
    }
    return {
      valid: true,
      detectedType: "png",
      canonicalMimeType: "image/png",
      canonicalExtension: ".png",
    };
  }

  if (detectedType === "webp") {
    if (rawExt !== ".webp") {
      return { valid: false, error: "File extension does not match detected WebP content" };
    }
    if (clientMimeType !== "image/webp") {
      return { valid: false, error: "Client MIME type does not match detected WebP content" };
    }
    return {
      valid: true,
      detectedType: "webp",
      canonicalMimeType: "image/webp",
      canonicalExtension: ".webp",
    };
  }

  return { valid: false, error: "Unsupported file format" };
}

