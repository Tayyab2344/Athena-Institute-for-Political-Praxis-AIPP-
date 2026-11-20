"use client";

import { Trash2, X, ShieldAlert } from "lucide-react";

interface DeleteJournalModalProps {
  isOpen: boolean;
  journal: {
    id: string;
    title: string;
    issuesCount: number;
  } | null;
  onClose: () => void;
  onConfirm: (journalId: string) => Promise<void>;
  deleting: boolean;
}

export default function DeleteJournalModal({
  isOpen,
  journal,
  onClose,
  onConfirm,
  deleting
}: DeleteJournalModalProps) {
  if (!isOpen || !journal) return null;

  const hasIssues = journal.issuesCount > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-journal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#D9DEE2] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div
              className={`p-3 rounded-xl border ${
                hasIssues
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              {hasIssues ? (
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
              id="delete-journal-modal-title"
              className="font-serif text-xl font-medium text-[#081D2E]"
            >
              {hasIssues ? "Cannot Delete Journal" : "Delete Institutional Journal"}
            </h3>

            {hasIssues ? (
              <p className="text-xs sm:text-sm font-sans text-[#64717C] leading-relaxed">
                The journal <strong className="text-[#081D2E]">&ldquo;{journal.title}&rdquo;</strong> currently contains{" "}
                <strong className="text-amber-800">{journal.issuesCount} compiled issue{journal.issuesCount === 1 ? "" : "s"}</strong>.
                To prevent accidental cascading data loss, all child issues must be removed or reassigned before this journal can be deleted.
              </p>
            ) : (
              <p className="text-xs sm:text-sm font-sans text-[#64717C] leading-relaxed">
                Are you sure you want to delete <strong className="text-[#081D2E]">&ldquo;{journal.title}&rdquo;</strong>?
                This action is permanent and will dissociate any associated cover image assets.
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
            {hasIssues ? "Close" : "Cancel"}
          </button>

          {!hasIssues && (
            <button
              type="button"
              onClick={() => onConfirm(journal.id)}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-sans font-medium transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{deleting ? "Deleting..." : "Permanently Delete Journal"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
