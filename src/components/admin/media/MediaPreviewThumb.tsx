"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Image as ImageIcon } from "lucide-react";
import {
  getCloudinaryImageThumbnailUrl,
  getCloudinaryPdfThumbnailUrl
} from "@/lib/media/preview";

interface MediaPreviewThumbProps {
  mediaType: "IMAGE" | "DOCUMENT";
  secureUrl: string;
  originalFilename: string;
  format: string;
  pages?: number | null;
  width?: number | null;
  height?: number | null;
  variant?: "card" | "row" | "inspector";
}

export default function MediaPreviewThumb({
  mediaType,
  secureUrl,
  originalFilename,
  format,
  pages,
  width,
  height,
  variant = "card"
}: MediaPreviewThumbProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const previewUrl =
    mediaType === "DOCUMENT"
      ? getCloudinaryPdfThumbnailUrl(secureUrl)
      : getCloudinaryImageThumbnailUrl(secureUrl, variant === "inspector" ? 960 : 480);

  const imgFailed = !previewUrl || failedUrl === previewUrl;

  if (variant === "row") {
    return (
      <div className="relative w-11 h-11 rounded-lg bg-[#F7F7F7] border border-[#D9DEE2] overflow-hidden shrink-0 flex items-center justify-center">
        {!imgFailed ? (
          <Image
            src={previewUrl}
            alt={originalFilename}
            fill
            unoptimized
            sizes="44px"
            onError={() => setFailedUrl(previewUrl)}
            className={mediaType === "DOCUMENT" ? "object-cover object-top" : "object-cover"}
          />
        ) : mediaType === "DOCUMENT" ? (
          <div className="flex flex-col items-center justify-center text-[#0D2C49]">
            <FileText className="w-4 h-4 text-[#0D2C49]/80" />
            <span className="text-[8px] font-mono uppercase tracking-wider text-[#64717C] mt-0.5">
              PDF
            </span>
          </div>
        ) : (
          <ImageIcon className="w-4 h-4 text-[#64717C]/70" />
        )}
      </div>
    );
  }

  const containerHeight =
    variant === "inspector" ? "aspect-[16/10] max-h-64" : "aspect-[4/3]";

  return (
    <div
      className={`relative w-full ${containerHeight} bg-[#F7F7F7] overflow-hidden flex items-center justify-center`}
    >
      {!imgFailed ? (
        <>
          <Image
            src={previewUrl}
            alt={originalFilename}
            fill
            unoptimized
            sizes={variant === "inspector" ? "440px" : "(max-width: 640px) 100vw, 320px"}
            onError={() => setFailedUrl(previewUrl)}
            className={
              mediaType === "DOCUMENT"
                ? "object-contain p-3 bg-[#F7F7F7]"
                : variant === "inspector"
                  ? "object-contain p-2 bg-[#F7F7F7]"
                  : "object-cover"
            }
          />
          {mediaType === "DOCUMENT" && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#081D2E]/90 text-white text-[10px] font-mono uppercase tracking-wider">
              PDF{pages ? ` · ${pages}p` : ""}
            </span>
          )}
          {mediaType === "IMAGE" && width && height && variant === "card" && (
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#081D2E]/80 text-white text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              {width}×{height}
            </span>
          )}
        </>
      ) : mediaType === "DOCUMENT" ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-5 bg-[#F7F7F7]">
          <div className="w-20 h-24 rounded-md bg-white border border-[#D9DEE2] shadow-2xs flex flex-col justify-between p-2.5 relative">
            <div className="w-full h-0.5 bg-[#B09C4B]" />
            <div className="flex flex-col items-center justify-center gap-1">
              <FileText className="w-6 h-6 text-[#0D2C49]" />
              <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-[#0D2C49]">
                {format || "PDF"}
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-0.5 bg-[#D9DEE2]" />
              <div className="w-2/3 h-0.5 bg-[#D9DEE2]" />
            </div>
          </div>
          {pages ? (
            <span className="mt-2.5 text-[10px] font-mono text-[#64717C] uppercase tracking-wider">
              {pages} {pages === 1 ? "Page" : "Pages"}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1.5 text-[#64717C] p-4 text-center">
          <ImageIcon className="w-7 h-7 text-[#0D2C49]/35" />
          <span className="text-[10px] font-mono uppercase tracking-wider">
            {format || "IMAGE"} · Preview unavailable
          </span>
        </div>
      )}
    </div>
  );
}

