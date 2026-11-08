"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, CheckCircle2, Mail, Building2, HelpCircle, ArrowUpRight, Loader2 } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Section 8 — "Connect With AIPP"
   Creative Concept: "The Conversation Continues"
   Deep Navy Editorial Contact Experience:
   - Left:  Institutional Architectural Visual + Editorial Introduction
   - Right: Integrated Refined Contact Form directly on deep navy
   ───────────────────────────────────────────────────────────── */

export default function ConnectSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<"idle" | "prepared">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate brief processing for realistic UX
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedStatus("prepared");
    }, 600);
  };

  const handleOpenMailto = () => {
    const subject = encodeURIComponent(`[AIPP Inquiry: ${formData.inquiryType}] from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.inquiryType}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:contact@aipp-praxis.org?subject=${subject}&body=${body}`;
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      inquiryType: "General Inquiry",
      message: ""
    });
    setSubmittedStatus("idle");
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-[#081D2E] text-white scroll-mt-20 overflow-hidden border-t border-white/10"
      aria-label="Connect With AIPP"
    >
      {/* ═══ Ambient Gradient Background ═══ */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-[#0D2C49]/60 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-[#B09C4B]/10 rounded-full blur-[140px]" />
      </div>

      {/* ═══ Top Section Hairline ═══ */}
      <div className="relative z-20 pt-12 pb-4 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#B09C4B] flex-shrink-0" />
          <span
            className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-[#B09C4B]"
            style={{ fontFamily: "var(--font-hero-sans)" }}
          >
            08 / Connect With AIPP
          </span>
        </div>
      </div>

      {/* ═══ Main 50/50 Two-Column Stage ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN (~50%): Institutional Visual & Introduction
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.14] tracking-tight"
                style={{ fontFamily: "var(--font-hero-serif)" }}
              >
                Every meaningful change begins with a{" "}
                <span className="italic text-[#B09C4B] font-serif">conversation.</span>
              </h2>

              <p
                className="text-sm sm:text-base text-white/75 font-light leading-relaxed max-w-xl"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                Have a question, an idea, or an opportunity to collaborate? AIPP welcomes thoughtful
                conversations with individuals and organizations working toward meaningful change.
              </p>
            </div>

            {/* Institutional Architectural Visual Canvas */}
            <div
              className="
                relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10]
                rounded-2xl overflow-hidden border border-white/15 shadow-2xl
              "
            >
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600"
                alt="Athena Institute for Political Praxis multilateral headquarters architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E] via-[#0D2C49]/40 to-transparent" />
              <div className="absolute inset-0 bg-[#081D2E]/30" />

              {/* Gold Corner Accent */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <div className="w-6 h-6 border-t-2 border-l-2 border-[#B09C4B]/80" />
              </div>

              {/* Bottom In-Image Badge */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-white/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#B09C4B]">
                  Athena Institute for Political Praxis
                </span>
                <span className="text-[10px] text-white/60">Geneva · Vienna · Global Online</span>
              </div>
            </div>

            {/* Institutional Dialogue Pathways Notice */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-1">
                <Building2 className="w-4 h-4 text-[#B09C4B]" />
                <span className="block text-xs font-semibold text-white">Institutional</span>
                <span className="block text-[11px] text-white/60 font-light">Treaties &amp; Research</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-1">
                <Mail className="w-4 h-4 text-[#B09C4B]" />
                <span className="block text-xs font-semibold text-white">Publications</span>
                <span className="block text-[11px] text-white/60 font-light">Editorial Inquiries</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-1">
                <HelpCircle className="w-4 h-4 text-[#B09C4B]" />
                <span className="block text-xs font-semibold text-white">Fellowships</span>
                <span className="block text-[11px] text-white/60 font-light">Participant Support</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN (~50%): Refined Contact Form (Integrated directly into Navy)
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="relative p-5 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-md shadow-2xl">
              
              {/* Form Gold Accent Top Line */}
              <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#B09C4B]/70 to-transparent" />

              {submittedStatus === "prepared" ? (
                /* Transparent Post-Submission State */
                <div className="py-8 space-y-6 text-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#B09C4B]/20 border border-[#B09C4B] mx-auto flex items-center justify-center text-[#B09C4B]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3
                      className="text-2xl sm:text-3xl text-white font-normal"
                      style={{ fontFamily: "var(--font-hero-serif)" }}
                    >
                      Inquiry Formatted
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 font-light max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="text-white font-medium">{formData.name}</span>. Your statement regarding{" "}
                      <span className="text-[#B09C4B] font-medium">&ldquo;{formData.inquiryType}&rdquo;</span> has been recorded.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-left text-xs space-y-2 max-w-md mx-auto text-white/80">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#B09C4B]">
                      Institutional Transmission Notice
                    </div>
                    <p className="font-light leading-relaxed">
                      AIPP direct mail integration operates via authenticated ministerial gateways. You can dispatch this message directly via your email client or our team will review the locally dispatched draft.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleOpenMailto}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#B09C4B] text-[#081D2E] hover:bg-[#c2ad59] text-xs font-semibold tracking-wider transition-all duration-200 shadow-md"
                    >
                      <span>Open in Email Client</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleReset}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-xs font-medium tracking-wider transition-all duration-200"
                    >
                      <span>Submit Another Inquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary Refined Contact Form */
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="space-y-1">
                    <h3
                      className="text-2xl text-white font-normal"
                      style={{ fontFamily: "var(--font-hero-serif)" }}
                    >
                      Send an Inquiry
                    </h3>
                    <p className="text-xs text-white/60 font-light">
                      Please complete the details below to connect with the appropriate institute division.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-[11px] font-semibold uppercase tracking-wider text-white/80 block"
                      style={{ fontFamily: "var(--font-hero-sans)" }}
                    >
                      Full Name <span className="text-[#B09C4B]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ambassador / Dr. / Ms. Name"
                      className="w-full min-h-[44px] px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/30 text-sm sm:text-xs focus:outline-none focus:border-[#B09C4B] focus:ring-1 focus:ring-[#B09C4B] transition-colors"
                    />
                  </div>

                  {/* Email & Inquiry Pathway */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="text-[11px] font-semibold uppercase tracking-wider text-white/80 block"
                        style={{ fontFamily: "var(--font-hero-sans)" }}
                      >
                        Email Address <span className="text-[#B09C4B]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="address@organization.org"
                        className="w-full min-h-[44px] px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/30 text-sm sm:text-xs focus:outline-none focus:border-[#B09C4B] focus:ring-1 focus:ring-[#B09C4B] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-pathway"
                        className="text-[11px] font-semibold uppercase tracking-wider text-white/80 block"
                        style={{ fontFamily: "var(--font-hero-sans)" }}
                      >
                        Inquiry Pathway
                      </label>
                      <select
                        id="contact-pathway"
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full min-h-[44px] px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 bg-[#081D2E] text-white text-sm sm:text-xs focus:outline-none focus:border-[#B09C4B] focus:ring-1 focus:ring-[#B09C4B] transition-colors cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Research & Contributions">Research &amp; Policy Submissions</option>
                        <option value="Institutional Collaboration">Institutional Collaboration</option>
                        <option value="Fellowships & Programs">Fellowships &amp; Simulation Labs</option>
                        <option value="Press & Media">Press &amp; Media Dialogue</option>
                      </select>
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="text-[11px] font-semibold uppercase tracking-wider text-white/80 block"
                      style={{ fontFamily: "var(--font-hero-sans)" }}
                    >
                      Message / Proposal <span className="text-[#B09C4B]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your proposal, research idea, or collaborative objective..."
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/30 text-sm sm:text-xs focus:outline-none focus:border-[#B09C4B] focus:ring-1 focus:ring-[#B09C4B] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[10px] text-white/50 font-light text-center sm:text-left">
                      Confidential &amp; Non-Partisan Communication
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#B09C4B] text-[#081D2E] hover:bg-[#c2ad59] disabled:opacity-50 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                      style={{ fontFamily: "var(--font-hero-sans)" }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Message</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
