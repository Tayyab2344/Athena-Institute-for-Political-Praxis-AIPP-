"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

type PageState =
  | "INITIAL_LOADING"
  | "READY"
  | "SUBMITTING"
  | "SUCCESS"
  | "ALREADY_VERIFIED"
  | "EXPIRED"
  | "INVALID"
  | "ERROR";

interface TokenInspection {
  token: string | null;
  isLegacyQuery: boolean;
}

function extractTokenFromLocation(): TokenInspection {
  if (typeof window === "undefined") {
    return { token: null, isLegacyQuery: false };
  }
  const hash = window.location.hash;
  if (hash && hash.includes("token=")) {
    const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
    const params = new URLSearchParams(cleanHash);
    const token = params.get("token");
    if (token && /^[0-9a-fA-F]{64}$/.test(token)) {
      return { token, isLegacyQuery: false };
    }
  }
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("token")) {
    return { token: null, isLegacyQuery: true };
  }
  return { token: null, isLegacyQuery: false };
}

function VerificationContent() {
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<PageState>("INITIAL_LOADING");
  const [obfuscatedEmail, setObfuscatedEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"IDLE" | "SENDING" | "SENT">("IDLE");
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function initializeVerification() {
      const inspection = extractTokenFromLocation();

      if (inspection.isLegacyQuery) {
        if (isMounted) {
          setState("EXPIRED");
          setErrorMessage(
            "Verification links with query parameters are no longer supported for security reasons. Please request a fresh verification email below."
          );
        }
        return;
      }

      if (!inspection.token) {
        if (isMounted) {
          setState("INVALID");
          setErrorMessage("No verification token was provided in the link.");
        }
        return;
      }

      const extractedToken = inspection.token;

      if (isMounted) {
        setToken(extractedToken);
      }

      try {
        const res = await fetch("/api/newsletter/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            token: extractedToken,
            action: "preview",
          }),
        });
        const data = await res.json();

        if (!isMounted) return;

        if (res.status === 200 && data.valid && data.state === "READY") {
          setState("READY");
          setObfuscatedEmail(data.obfuscatedEmail || "");
        } else if (data.state === "ALREADY_VERIFIED") {
          setState("ALREADY_VERIFIED");
          setObfuscatedEmail(data.obfuscatedEmail || "");
        } else if (data.state === "EXPIRED") {
          setState("EXPIRED");
          setErrorMessage(data.error || "This verification link has expired.");
          setObfuscatedEmail(data.obfuscatedEmail || "");
        } else {
          setState("INVALID");
          setErrorMessage(data.error || "This verification link is invalid or malformed.");
        }
      } catch {
        if (!isMounted) return;
        setState("ERROR");
        setErrorMessage("Unable to verify link status at this moment. Please try again later.");
      }
    }

    initializeVerification();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleConfirm() {
    if (!token) return;
    setState("SUBMITTING");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          action: "confirm",
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", window.location.pathname);
        }
        setState("SUCCESS");
        setSuccessMessage(data.message || "Your subscription has been verified successfully.");
      } else if (data.code === "ALREADY_VERIFIED" || data.code === "ALREADY_ACTIVE") {
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", window.location.pathname);
        }
        setState("ALREADY_VERIFIED");
      } else if (data.code === "TOKEN_EXPIRED") {
        setState("EXPIRED");
        setErrorMessage(data.error || "This verification link has expired.");
      } else {
        setState("ERROR");
        setErrorMessage(data.error || "Verification failed. Please try again or request a new link.");
      }
    } catch {
      setState("ERROR");
      setErrorMessage("Network error occurred during confirmation. Please check your connection and try again.");
    }
  }

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResendStatus("SENDING");
    setResendMsg("");

    try {
      const res = await fetch("/api/newsletter/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resendEmail.trim() }),
      });
      const data = await res.json();
      setResendStatus("SENT");
      setResendMsg(data.message || "If this email address is registered, a new verification link has been sent.");
    } catch {
      setResendStatus("IDLE");
      setResendMsg("Unable to process resend request. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-slate-100 hover:text-amber-400 transition-colors">
            <span className="font-serif text-lg font-bold tracking-tight text-amber-400">AIPP</span>
            <span className="hidden sm:inline text-xs uppercase tracking-widest text-slate-400 font-medium">
              Athena Institute for Political Praxis
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-slate-400 hover:text-amber-400 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-xl p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400/90 mb-2">
              Subscription Verification
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Athena Institute for Political Praxis
            </h1>
          </div>

          {state === "INITIAL_LOADING" && (
            <div className="py-12 text-center" aria-live="polite">
              <div className="inline-block w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-400">Verifying security token details...</p>
            </div>
          )}

          {state === "READY" && (
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 text-left">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Recipient Address
                </p>
                <p className="text-base font-mono text-amber-300">
                  {obfuscatedEmail || "Your registered address"}
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed text-left">
                Please confirm that you requested to receive institutional research publications, policy briefs, and strategic announcements from the Athena Institute.
              </p>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-3.5 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm uppercase tracking-wider transition-all duration-150 shadow-lg shadow-amber-500/20 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Confirm Subscription
              </button>

              <p className="text-xs text-slate-500 leading-relaxed">
                By clicking confirm, your email address will be activated in our institutional publication roster. You may unsubscribe at any time.
              </p>
            </div>
          )}

          {state === "SUBMITTING" && (
            <div className="py-12 text-center" aria-live="polite">
              <div className="inline-block w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-300 font-medium">Activating subscription...</p>
            </div>
          )}

          {state === "SUCCESS" && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">
                ✓
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white mb-2">
                  Subscription Confirmed
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {successMessage || "Your email address has been verified successfully. Welcome to the Athena Institute for Political Praxis."}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block py-3 px-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs uppercase tracking-wider border border-slate-700 transition-colors"
                >
                  Return to Publications
                </Link>
              </div>
            </div>
          )}

          {state === "ALREADY_VERIFIED" && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-serif">
                i
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white mb-2">
                  Subscription Already Active
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {obfuscatedEmail ? `The address ${obfuscatedEmail} is already verified and active.` : "Your subscription is already active and verified."}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  You are already receiving publications from the Athena Institute.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block py-3 px-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs uppercase tracking-wider border border-slate-700 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}

          {state === "EXPIRED" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl mb-3">
                  !
                </div>
                <h2 className="text-xl font-serif font-bold text-white mb-2">
                  Verification Link Expired
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {errorMessage || "Verification links are valid for 24 hours. This link has expired."}
                </p>
              </div>

              <div className="p-5 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                  Request a New Link
                </h3>
                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={resendStatus === "SENDING"}
                    className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    {resendStatus === "SENDING" ? "Sending..." : "Send New Verification Link"}
                  </button>
                </form>
                {resendMsg && (
                  <p className="mt-3 text-xs text-amber-300 leading-relaxed">
                    {resendMsg}
                  </p>
                )}
              </div>
            </div>
          )}

          {state === "INVALID" && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl">
                ✕
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white mb-2">
                  Invalid Verification Link
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {errorMessage || "The verification link appears to be malformed or invalid."}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Please check the full link in your confirmation email or submit a new subscription request.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block py-3 px-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs uppercase tracking-wider border border-slate-700 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}

          {state === "ERROR" && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl">
                !
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white mb-2">
                  Service Temporarily Unavailable
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {errorMessage || "An error occurred while communicating with the verification service."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="py-2.5 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="py-2.5 px-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs uppercase tracking-wider border border-slate-700 transition-colors text-center"
                >
                  Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-900/40 px-6 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Athena Institute for Political Praxis. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}
