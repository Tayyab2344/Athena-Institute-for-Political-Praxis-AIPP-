"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Please verify credentials.");
        setIsSubmitting(false);
        return;
      }

      // Successful login -> route to intended destination
      router.push(from);
      router.refresh();
    } catch {
      setErrorMessage("Network error. Unable to connect to authentication server.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col justify-between font-sans selection:bg-[#B09C4B]/20 selection:text-[#081D2E]">
      {/* Top Bar with Return Link */}
      <header className="p-4 sm:p-6 max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#64717C] hover:text-[#0D2C49] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Return to Public Portal</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-sans text-[#64717C]">
          <ShieldCheck className="w-4 h-4 text-[#B09C4B]" />
          <span>Secure Institutional Gateway</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-[#0D2C49]/10 shadow-sm mb-1">
              <Image
                src="/logo.png"
                alt="AIPP Logo"
                width={48}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-semibold text-[#B09C4B]">
                ATHENA INSTITUTE FOR POLITICAL PRAXIS
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#0D2C49] mt-1 font-normal tracking-tight">
                Executive CMS Portal
              </h1>
              <p className="text-xs font-sans text-[#64717C] mt-1 font-light">
                Sign in with authorized administrative credentials to manage research and publications.
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl border border-[#0D2C49]/10 p-6 sm:p-8 shadow-sm">
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-sans flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-sans font-medium text-[#243748]"
                >
                  Institutional Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64717C]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@aipp-praxis.org"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#0D2C49]/15 text-sm font-sans text-[#0D2C49] placeholder:text-[#64717C]/50 focus:outline-none focus:ring-2 focus:ring-[#B09C4B]/40 focus:border-[#B09C4B] transition-all bg-[#FDFCFB]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-sans font-medium text-[#243748]"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64717C]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#0D2C49]/15 text-sm font-sans text-[#0D2C49] placeholder:text-[#64717C]/50 focus:outline-none focus:ring-2 focus:ring-[#B09C4B]/40 focus:border-[#B09C4B] transition-all bg-[#FDFCFB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64717C] hover:text-[#0D2C49] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-full bg-[#0D2C49] hover:bg-[#081D2E] text-white text-xs font-sans font-semibold uppercase tracking-[0.12em] transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#B09C4B]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Authenticate &amp; Access CMS</span>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-5 border-t border-[#0D2C49]/10 text-center">
              <p className="text-[11px] font-sans text-[#64717C] leading-relaxed">
                Unauthorized access attempts are logged with encrypted identifiers. Repeated failures trigger automatic account and IP lockout.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 sm:p-6 text-center text-[11px] font-sans text-[#64717C]">
        Athena Institute for Political Praxis · Administrative Core
      </footer>
    </div>
  );
}

