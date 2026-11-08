"use client";

import { useState, useEffect } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPathway?: string;
}

export default function ContactModal({ isOpen, onClose, defaultPathway = "General Inquiry" }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    pathway: defaultPathway,
    message: ""
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/70 p-2.5 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border border-border bg-surface shadow-[var(--shadow-deep)]">
        
        <div className="flex items-start justify-between bg-primary p-4 sm:p-6 md:p-8 text-background">
          <div className="pr-3">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] opacity-80 block mb-1">
              ATHENA INSTITUTE FOR POLITICAL PRAXIS
            </span>
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-normal leading-snug">
              Get Involved & Contact
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-background transition-colors hover:bg-background/10 active:scale-95"
            aria-label="Close contact modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="my-auto flex flex-col items-center justify-center space-y-6 p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-primary-soft text-primary">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="type-h3 text-primary">Thank You for Reaching Out</h4>
            <p className="type-body-small max-w-sm text-foreground-muted">
              Your inquiry has been logged with the AIPP External Affairs Taskforce. Our team will review your message promptly.
            </p>
            <button
              onClick={handleReset}
              className="rounded-full bg-primary px-8 py-3 text-xs font-semibold text-background transition-colors hover:bg-primary-hover"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div>
              <label className="type-label mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ambassador / Dr. / Ms. Full Name"
                className="w-full min-h-[44px] rounded-xl border border-border bg-background-muted px-4 py-2.5 sm:py-3 text-sm sm:text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="type-label mb-1.5 block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@institution.org"
                  className="w-full min-h-[44px] rounded-xl border border-border bg-background-muted px-4 py-2.5 sm:py-3 text-sm sm:text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="type-label mb-1.5 block">
                  Pathway
                </label>
                <select
                  value={formData.pathway}
                  onChange={(e) => setFormData({ ...formData, pathway: e.target.value })}
                  className="w-full min-h-[44px] rounded-xl border border-border bg-background-muted px-4 py-2.5 sm:py-3 text-sm sm:text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Volunteer">Volunteer</option>
                  <option value="Contribute">Contribute Research</option>
                  <option value="Collaborate">Institutional Collaboration</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="type-label mb-1.5 block">
                Organization / Affiliation
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Ministry, Institute, University, or NGO"
                className="w-full min-h-[44px] rounded-xl border border-border bg-background-muted px-4 py-2.5 sm:py-3 text-sm sm:text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="type-label mb-1.5 block">
                Message / Statement of Purpose
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe how you wish to collaborate or contribute to AIPP..."
                className="w-full rounded-xl border border-border bg-background-muted px-4 py-2.5 sm:py-3 text-sm sm:text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-background transition-colors hover:bg-primary-hover sm:w-auto"
              >
                <span>Submit Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
