"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function FooterNewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [hpOrg, setHpOrg] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setStatus("idle");
    setMessage("");

    if (!consent) {
      setStatus("error");
      setMessage("Please confirm your consent to receive institutional communications.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          consent,
          source: "FOOTER",
          hp_organization: hpOrg,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Subscription request failed. Please check your email address and try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "Thank you. If this email address is eligible for our communications, you will receive further instructions.");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setMessage("A network error occurred. Please verify your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-[#B09C4B]/30 bg-[#B09C4B]/10 p-4 text-white"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#B09C4B] mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-semibold tracking-wide text-white">
                Subscription Request Received
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                {message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#B09C4B] hover:text-white transition-colors"
          >
            Submit Another Address
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div className="relative">
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Email address for institutional briefings
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="footer-newsletter-email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.org"
                aria-invalid={status === "error" && !email ? "true" : undefined}
                aria-describedby={status === "error" ? "footer-newsletter-error" : undefined}
                className="w-full min-h-[44px] rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-sans text-white placeholder-white/40 focus:border-[#B09C4B] focus:outline-none focus:ring-1 focus:ring-[#B09C4B] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#B09C4B] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#081D2E] hover:bg-[#c4af56] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_organization">Organization</label>
            <input
              id="hp_organization"
              type="text"
              name="hp_organization"
              tabIndex={-1}
              autoComplete="off"
              value={hpOrg}
              onChange={(e) => setHpOrg(e.target.value)}
            />
          </div>

          <div className="flex items-start gap-2.5 pt-0.5">
            <input
              id="footer-newsletter-consent"
              type="checkbox"
              required
              disabled={loading}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="h-4 w-4 shrink-0 mt-0.5 rounded border-white/30 bg-white/10 text-[#B09C4B] focus:ring-1 focus:ring-[#B09C4B] focus:ring-offset-0 transition-colors cursor-pointer"
            />
            <label
              htmlFor="footer-newsletter-consent"
              className="text-[11px] leading-relaxed text-white/70 select-none cursor-pointer"
            >
              I consent to receive research publications, policy briefs, and institutional announcements from the Athena Institute for Political Praxis.
            </label>
          </div>

          {status === "error" && message && (
            <div
              id="footer-newsletter-error"
              role="alert"
              className="flex items-center gap-2 text-xs text-rose-300 font-sans pt-0.5"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

