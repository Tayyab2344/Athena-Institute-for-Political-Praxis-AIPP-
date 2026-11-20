"use client";

import { Trash2, X, ShieldAlert } from "lucide-react";

interface DeleteIssueModalProps {
  isOpen: boolean;
  issue: {
    id: string;
    journalId: string;
    title: string;
    volume: number;
    issueNumber: number;
    publicationsCount: number;
  } | null;
  onClose: () => void;
  onConfirm: (issueId: string) => Promise<void>;
  deleting: boolean;
}

export default function DeleteIssueModal({
  isOpen,
  issue,
  onClose,
  onConfirm,
  deleting
}: DeleteIssueModalProps) {
  if (!isOpen || !issue) return null;

  const hasPublications = issue.publicationsCount > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-issue-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#D9DEE2] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div
              className={`p-3 rounded-xl border ${
                hasPublications
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              {hasPublications ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <Trash2 className="w-6 h-6" />
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="p-1 rounded-lg text-[#64717C] hover:text-[#081D2E] hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <h3
              id="delete-issue-modal-title"
              className="font-serif text-xl font-medium text-[#081D2E]"
            >
              {hasPublications ? "Cannot Delete Compiled Issue" : "Delete Compiled Issue"}
            </h3>

            {hasPublications ? (
              <p className="text-xs sm:text-sm font-sans text-[#64717C] leading-relaxed">
                The issue <strong className="text-[#081D2E]">&ldquo;{issue.title}&rdquo;</strong> (Vol. {issue.volume}, Issue {issue.issueNumber}) currently has{" "}
                <strong className="text-amber-800">{issue.publicationsCount} linked research article{issue.publicationsCount === 1 ? "" : "s"}</strong>.
                To protect research attributions, please reassign or detach these articles from the Publications editor before deleting this issue.
              </p>
            ) : (
              <p className="text-xs sm:text-sm font-sans text-[#64717C] leading-relaxed">
                Are you sure you want to delete <strong className="text-[#081D2E]">&ldquo;{issue.title}&rdquo;</strong> (Vol. {issue.volume}, Issue {issue.issueNumber})?
                This action is permanent and will dissociate any associated cover image and PDF documents.
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-[#F7F7F7] border-t border-[#D9DEE2] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 min-h-[38px] rounded-lg border border-[#D9DEE2] text-xs font-sans font-medium text-[#081D2E] hover:border-[#0D2C49] bg-white transition-colors"
          >
            {hasPublications ? "Close" : "Cancel"}
          </button>

          {!hasPublications && (
            <button
              type="button"
              onClick={() => onConfirm(issue.id)}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-sans font-medium transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{deleting ? "Deleting..." : "Permanently Delete Issue"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
