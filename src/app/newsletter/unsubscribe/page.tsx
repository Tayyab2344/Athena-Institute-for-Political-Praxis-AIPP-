"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

type PageState =
  | "INITIAL_LOADING"
  | "READY"
  | "SUBMITTING"
  | "SUCCESS"
  | "ALREADY_UNSUBSCRIBED"
  | "EXPIRED"
  | "INVALID"
  | "ERROR";

function extractTokenFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (hash && hash.includes("token=")) {
    const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
    const params = new URLSearchParams(cleanHash);
    const token = params.get("token");
    if (token && /^[0-9a-fA-F]{64}$/.test(token)) {
      return token;
    }
  }
  const searchParams = new URLSearchParams(window.location.search);
  const queryToken = searchParams.get("token");
  if (queryToken && /^[0-9a-fA-F]{64}$/.test(queryToken)) {
    return queryToken;
  }
  return null;
}

function UnsubscribeContent() {
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<PageState>("INITIAL_LOADING");
  const [obfuscatedEmail, setObfuscatedEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function initializeUnsubscribe() {
      const extractedToken = extractTokenFromLocation();

      if (!extractedToken) {
        if (isMounted) {
          setState("INVALID");
          setErrorMessage("No valid unsubscribe token was provided in the link.");
        }
        return;
      }

      if (isMounted) {
        setToken(extractedToken);
      }

      try {
        const res = await fetch("/api/newsletter/unsubscribe", {
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
        } else if (data.state === "ALREADY_UNSUBSCRIBED") {
          setState("ALREADY_UNSUBSCRIBED");
          setObfuscatedEmail(data.obfuscatedEmail || "");
        } else if (data.state === "EXPIRED") {
          setState("EXPIRED");
          setErrorMessage(data.error || "This unsubscribe link has expired.");
          setObfuscatedEmail(data.obfuscatedEmail || "");
        } else {
          setState("INVALID");
          setErrorMessage(data.error || "This unsubscribe link is invalid or malformed.");
        }
      } catch {
        if (!isMounted) return;
        setState("ERROR");
        setErrorMessage("Unable to verify link status at this moment. Please try again later.");
      }
    }

    initializeUnsubscribe();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleConfirm() {
    if (!token) return;
    setState("SUBMITTING");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
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
        setSuccessMessage(data.message || "You have been successfully unsubscribed from the newsletter.");
      } else if (data.code === "ALREADY_UNSUBSCRIBED") {
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", window.location.pathname);
        }
        setState("ALREADY_UNSUBSCRIBED");
      } else if (data.code === "TOKEN_EXPIRED") {
        setState("EXPIRED");
        setErrorMessage(data.error || "This unsubscribe link has expired.");
      } else {
        setState("ERROR");
        setErrorMessage(data.error || "Unsubscribe request could not be processed. Please try again.");
      }
    } catch {
      setState("ERROR");
      setErrorMessage("Network error occurred while submitting unsubscribe request. Please try again.");
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
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
              Subscription Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Unsubscribe from Newsletter
            </h1>
          </div>

          {state === "INITIAL_LOADING" && (
            <div className="py-12 text-center" aria-live="polite">
              <div className="inline-block w-8 h-8 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-400">Verifying unsubscribe details...</p>
            </div>
          )}

          {state === "READY" && (
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 text-left">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Subscribed Address
                </p>
                <p className="text-base font-mono text-amber-300">
                  {obfuscatedEmail || "Your registered address"}
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed text-left">
                Are you sure you want to stop receiving research publications, policy briefs, and institutional announcements from the Athena Institute?
              </p>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-3.5 px-6 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm uppercase tracking-wider transition-all duration-150 shadow-lg shadow-rose-600/20 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Confirm Unsubscribe
              </button>

              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/40 text-left">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong>Transactional Communications Notice:</strong> Unsubscribing applies solely to newsletter broadcasts and research publications. If you have active research inquiries, institutional correspondence, or administrative communications with AIPP, those essential messages will continue uninterrupted.
                </p>
              </div>
            </div>
          )}

          {state === "SUBMITTING" && (
            <div className="py-12 text-center" aria-live="polite">
              <div className="inline-block w-8 h-8 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-300 font-medium">Updating subscription status...</p>
            </div>
          )}

          {state === "SUCCESS" && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xl font-serif">
                ✓
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white mb-2">
                  Unsubscribed Successfully
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {successMessage || "Your email address has been removed from our publication roster."}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  You will no longer receive newsletter announcements from the Athena Institute.
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

          {state === "ALREADY_UNSUBSCRIBED" && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xl font-serif">
                i
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white mb-2">
                  Already Unsubscribed
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {obfuscatedEmail ? `The address ${obfuscatedEmail} is already unsubscribed.` : "Your address is already unsubscribed from our newsletter."}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  No further publications are being sent to your inbox.
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
            <div className="text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl">
                !
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white mb-2">
                  Link Expired
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {errorMessage || "This unsubscribe link has expired. Please use the link from the most recent email you received."}
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

          {state === "INVALID" && (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl">
                ✕
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white mb-2">
                  Invalid Unsubscribe Link
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {errorMessage || "The unsubscribe link appears to be malformed or invalid."}
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
                  {errorMessage || "An error occurred while communicating with the service."}
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
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-900/40 px-6 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Athena Institute for Political Praxis. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}

