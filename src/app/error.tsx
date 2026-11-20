"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#081D2E] flex flex-col font-sans">
      <Navbar />

      <section className="flex-1 flex items-center justify-center pt-36 pb-24 border-b border-[#E2DDD5]">
        <Container wide>
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 text-xs font-mono font-semibold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              SYSTEM ANOMALY · TEMPORARY INTERRUPTION
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#081D2E] leading-tight">
              An Unexpected Error Has Occurred
            </h1>

            <p className="text-sm sm:text-base text-[#5C6470] font-light leading-relaxed">
              The institute web service encountered an unexpected condition while processing this operation. Technical audit logs have captured the event details.
            </p>

            {error.digest && (
              <div className="p-3 bg-white border border-[#D9DEE2] rounded-lg inline-block text-xs font-mono text-[#64748B]">
                <span>Incident Reference: </span>
                <span className="text-[#081D2E] font-semibold">{error.digest}</span>
              </div>
            )}

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#081D2E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0D2C49] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Request</span>
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9DEE2] bg-white text-[#081D2E] text-xs font-semibold uppercase tracking-wider hover:bg-[#F0EEEA] transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Institute Home</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

