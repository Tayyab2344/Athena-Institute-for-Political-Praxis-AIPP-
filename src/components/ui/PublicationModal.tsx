import { useEffect } from "react";
import { Publication } from "@/types";
import { X, Download, FileText, Share2, BookOpen } from "lucide-react";

interface PublicationModalProps {
  publication: Publication | null;
  onClose: () => void;
}

export default function PublicationModal({ publication, onClose }: PublicationModalProps) {
  useEffect(() => {
    if (!publication) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [publication, onClose]);

  if (!publication) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/75 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="publication-modal-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl md:rounded-[1.5rem] border border-border bg-surface shadow-[var(--shadow-deep)]">
        
        <div className="flex items-start justify-between border-b border-border bg-background-muted p-4 sm:p-6 md:p-8">
          <div className="space-y-1.5 sm:space-y-2 pr-4 sm:pr-6">
            <span className="type-label inline-block rounded-full bg-primary px-3 py-1 text-background text-[0.625rem] sm:text-[0.6875rem]">
              {publication.category}
            </span>
            <h3 id="publication-modal-title" className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground leading-snug">
              {publication.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-full p-2 text-foreground transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-5 sm:space-y-6 flex-grow touch-scroll">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 rounded-xl border border-border bg-surface p-4 text-xs text-foreground-muted sm:grid-cols-3">
            <div>
              <span className="type-label block text-[0.625rem]">Author</span>
              <span className="mt-0.5 block font-medium text-foreground">{publication.author}</span>
            </div>
            <div>
              <span className="type-label block text-[0.625rem]">Publication Date</span>
              <span className="mt-0.5 block font-medium text-foreground">{publication.date}</span>
            </div>
            <div>
              <span className="type-label block text-[0.625rem]">Specification</span>
              <span className="mt-0.5 block font-medium text-foreground">{publication.pages} Pages · Peer Reviewed</span>
            </div>
          </div>

          <div>
            <h4 className="type-h4 mb-2 text-primary">Executive Abstract</h4>
            <p className="type-body-small text-foreground-muted leading-relaxed">
              {publication.excerpt}
            </p>
          </div>

          <div className="space-y-2.5 rounded-xl border border-border bg-background-muted p-4 sm:p-5">
            <h5 className="font-serif text-sm font-semibold text-primary">Methodology & Citation Notice</h5>
            <p className="type-body-small text-foreground-muted break-words leading-relaxed">
              This publication is archived under AIPP Open Policy Initiative. DOI: <span className="font-mono text-primary font-medium">{publication.doi || "10.1080/aipp.2026"}</span>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-t border-border bg-background-muted p-4 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">AIPP Digital Archive</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => alert("Citation copied to clipboard.")}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary-soft"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Cite Paper</span>
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`Downloading PDF for: ${publication.title}`);
              }}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-full bg-primary px-5 sm:px-6 py-2.5 text-xs font-semibold text-background transition-colors hover:bg-primary-hover"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
