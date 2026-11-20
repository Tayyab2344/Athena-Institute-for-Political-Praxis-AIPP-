"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Upload, X, FileText, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import {
  OPERATIONAL_UPLOAD_FOLDERS,
  OPERATIONAL_IMAGE_FOLDERS,
  OPERATIONAL_DOCUMENT_FOLDERS,
  OperationalUploadFolder,
  getMediaFolderLabel
} from "@/lib/media/folders";
import { formatFileSize } from "@/lib/media/preview";

interface UploadApiResponse {
  url?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  assetId?: string;
  publicId?: string;
  error?: string;
}

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (assetId: string) => void;
  allowedMediaType?: "IMAGE" | "DOCUMENT";
  defaultFolder?: OperationalUploadFolder;
}

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_PDF_BYTES = 25 * 1024 * 1024;

function getFileExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
}

export default function MediaUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  allowedMediaType,
  defaultFolder
}: MediaUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const availableFolders: readonly OperationalUploadFolder[] =
    allowedMediaType === "IMAGE"
      ? OPERATIONAL_IMAGE_FOLDERS
      : allowedMediaType === "DOCUMENT"
        ? OPERATIONAL_DOCUMENT_FOLDERS
        : OPERATIONAL_UPLOAD_FOLDERS;

  const initialFolder: OperationalUploadFolder =
    defaultFolder && availableFolders.includes(defaultFolder)
      ? defaultFolder
      : availableFolders[0];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folder, setFolder] = useState<OperationalUploadFolder>(initialFolder);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedAsset, setUploadedAsset] = useState<{
    assetId: string;
    fileName: string;
    fileSize: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !uploading) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, uploading, onClose]);

  useEffect(() => {
    return () => {
      if (xhrRef.current) {
        xhrRef.current.abort();
        xhrRef.current = null;
      }
    };
  }, []);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const acceptAttr =
    allowedMediaType === "IMAGE"
      ? ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
      : allowedMediaType === "DOCUMENT"
        ? ".pdf,application/pdf"
        : ".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf";

  const formatHint =
    allowedMediaType === "IMAGE"
      ? "JPEG, PNG, or WebP images only (up to 10 MB)"
      : allowedMediaType === "DOCUMENT"
        ? "Non-encrypted PDF documents only (up to 25 MB)"
        : "JPEG, PNG, WebP (up to 10 MB) · Non-encrypted PDF (up to 25 MB)";

  const handleSelectFile = (file: File | null) => {
    setErrorMessage(null);
    setUploadedAsset(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const ext = getFileExtension(file.name);
    const isPdf = ext === ".pdf" || file.type === "application/pdf";
    const isImage = IMAGE_EXTENSIONS.has(ext);

    if (allowedMediaType === "IMAGE" && !isImage) {
      setSelectedFile(null);
      setErrorMessage("Only JPEG, PNG, or WebP images can be uploaded for this image field.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (allowedMediaType === "DOCUMENT" && !isPdf) {
      setSelectedFile(null);
      setErrorMessage("Only PDF documents can be uploaded for this document field.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (isPdf) {
      if (file.size > MAX_PDF_BYTES) {
        setErrorMessage("PDF file exceeds the 25 MB maximum size limit.");
      }
      if (!allowedMediaType) {
        setFolder("aipp/publications/documents");
      }
    } else if (isImage) {
      if (file.size > MAX_IMAGE_BYTES) {
        setErrorMessage("Image file exceeds the 10 MB maximum size limit.");
      }
      if (!allowedMediaType) {
        setFolder("aipp/publications/covers");
      }
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setProgress(0);
    setPhaseLabel("Uploading to secure intake...");
    setErrorMessage(null);
    setUploadedAsset(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const pct = Math.min(99, Math.round((event.loaded / event.total) * 100));
        setProgress(pct);
        if (pct >= 99) {
          setPhaseLabel("Verifying file signature and registering in archive...");
        }
      }
    };

    xhr.onload = () => {
      xhrRef.current = null;
      setUploading(false);
      let parsed: UploadApiResponse = {};
      try {
        parsed = JSON.parse(xhr.responseText) as UploadApiResponse;
      } catch {
        parsed = {};
      }

      if (xhr.status >= 200 && xhr.status < 300 && parsed.assetId) {
        setProgress(100);
        setPhaseLabel("Registered in archive");
        setUploadedAsset({
          assetId: parsed.assetId,
          fileName: parsed.fileName || selectedFile.name,
          fileSize: parsed.fileSize || selectedFile.size
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onUploadSuccess(parsed.assetId);
      } else {
        setProgress(0);
        setPhaseLabel("");
        setErrorMessage(
          parsed.error ||
            `Upload failed with status ${xhr.status}. Please verify the file and try again.`
        );
      }
    };

    xhr.onerror = () => {
      xhrRef.current = null;
      setUploading(false);
      setProgress(0);
      setPhaseLabel("");
      setErrorMessage("Network error occurred while uploading the file. Please try again.");
    };

    xhr.onabort = () => {
      xhrRef.current = null;
      setUploading(false);
      setProgress(0);
      setPhaseLabel("");
    };

    xhr.open("POST", "/api/upload", true);
    xhr.send(formData);
  };

  const isSelectedPdf = selectedFile
    ? getFileExtension(selectedFile.name) === ".pdf" || selectedFile.type === "application/pdf"
    : false;

  return createPortal(
    <div className="fixed inset-0 z-[60] h-dvh flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#081D2E]/55"
        onClick={() => {
          if (!uploading) onClose();
        }}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-upload-title"
        className="relative z-10 w-full max-w-lg bg-white rounded-xl border border-[#D9DEE2] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#D9DEE2] flex items-center justify-between">
          <div>
            <h2
              id="media-upload-title"
              className="font-serif text-xl font-medium text-[#081D2E]"
            >
              {allowedMediaType === "IMAGE"
                ? "Upload Image Asset"
                : allowedMediaType === "DOCUMENT"
                  ? "Upload PDF Document"
                  : "Upload Media Asset"}
            </h2>
            <p className="text-xs font-sans text-[#64717C] mt-0.5">
              Files are verified and registered as unreferenced uploads in the archive.
            </p>
          </div>
          <button
            type="button"
            disabled={uploading}
            onClick={onClose}
            aria-label="Close upload dialog"
            className="p-1.5 rounded-lg text-[#64717C] hover:text-[#081D2E] hover:bg-[#F7F7F7] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label
              htmlFor="media-upload-folder"
              className="block text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-[#081D2E] mb-1.5"
            >
              Destination Collection
            </label>
            <select
              id="media-upload-folder"
              value={folder}
              disabled={uploading}
              onChange={(e) => setFolder(e.target.value as OperationalUploadFolder)}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] text-xs font-sans text-[#081D2E] focus:outline-none focus:border-[#0D2C49]"
            >
              {availableFolders.map((f) => (
                <option key={f} value={f}>
                  {getMediaFolderLabel(f)} ({f})
                </option>
              ))}
            </select>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!uploading) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (!uploading && e.dataTransfer.files?.[0]) {
                handleSelectFile(e.dataTransfer.files[0]);
              }
            }}
            className={`border border-dashed rounded-xl p-6 text-center transition-colors ${
              isDragging
                ? "border-[#B09C4B] bg-[#B09C4B]/8"
                : "border-[#D9DEE2] bg-[#F7F7F7]"
            }`}
          >
            <input
              ref={fileInputRef}
              id="media-library-file-input"
              type="file"
              accept={acceptAttr}
              disabled={uploading}
              onChange={(e) => handleSelectFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-[#D9DEE2] mx-auto flex items-center justify-center text-[#0D2C49]">
                  {isSelectedPdf ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-sans font-semibold text-[#081D2E] break-all">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] font-mono text-[#64717C]">
                    {formatFileSize(selectedFile.size)} · {selectedFile.type || "Unknown MIME"}
                  </p>
                </div>
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-sans font-medium text-[#0D2C49] hover:underline cursor-pointer"
                  >
                    Choose a different file
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <Upload className="w-6 h-6 text-[#0D2C49]/70 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-sans font-medium text-[#081D2E]">
                    Drop a file here, or select from your computer
                  </p>
                  <p className="text-[11px] font-sans text-[#64717C]">{formatHint}</p>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#0D2C49]/30 bg-white text-xs font-sans font-medium text-[#0D2C49] hover:bg-[#0D2C49] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Browse Files</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {uploading && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="text-[#081D2E] font-medium">{phaseLabel}</span>
                <span className="font-mono text-[#64717C]">{progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#F7F7F7] border border-[#D9DEE2] overflow-hidden">
                <div
                  className="h-full bg-[#0D2C49] transition-all duration-200"
                  style={{ width: `${Math.max(progress, 6)}%` }}
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-sans flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {uploadedAsset && (
            <div
              role="status"
              className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-sans flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Registered in Media Library</p>
                <p className="text-[11px] text-emerald-800 mt-0.5 break-all">
                  {uploadedAsset.fileName} ({formatFileSize(uploadedAsset.fileSize)})
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#D9DEE2] bg-[#F7F7F7] flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={uploading}
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#D9DEE2] bg-white text-xs font-sans font-medium text-[#081D2E] hover:border-[#0D2C49] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {uploadedAsset ? "Done" : "Cancel"}
          </button>
          <button
            type="button"
            disabled={!selectedFile || uploading}
            onClick={handleUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D2C49] text-white text-xs font-sans font-medium hover:bg-[#081D2E] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? "Uploading..." : "Upload to Archive"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
