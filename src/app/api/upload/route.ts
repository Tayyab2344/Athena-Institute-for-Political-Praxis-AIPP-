import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = (formData.get("type") as string) || "pdf";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const maxSizeBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "File size exceeds 25MB limit" },
        { status: 400 }
      );
    }

    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Only PDF, PNG, JPEG, and WebP files are allowed." },
        { status: 400 }
      );
    }

    const isPdf = file.type === "application/pdf";
    const subDirectory = isPdf ? "pdf" : "covers";
    const targetDir = path.join(process.cwd(), "public", "uploads", subDirectory);

    await mkdir(targetDir, { recursive: true });

    const rawExt = path.extname(file.name).toLowerCase() || (isPdf ? ".pdf" : ".jpg");
    const safeExt = [".pdf", ".png", ".jpg", ".jpeg", ".webp"].includes(rawExt)
      ? rawExt
      : isPdf
      ? ".pdf"
      : ".png";

    const uniqueHash = crypto.randomBytes(8).toString("hex");
    const safeFileName = `${subDirectory}_${Date.now()}_${uniqueHash}${safeExt}`;
    const filePath = path.join(targetDir, safeFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${subDirectory}/${safeFileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file to storage" },
      { status: 500 }
    );
  }
}
