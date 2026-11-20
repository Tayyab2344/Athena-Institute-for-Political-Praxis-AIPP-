import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { BookOpen, FileText, Home, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "404 - Document Not Found | AIPP",
  description: "The requested institutional resource, research paper, or journal volume was not found.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#081D2E] flex flex-col font-sans">
      <Navbar />

      <section className="flex-1 flex items-center justify-center pt-36 pb-24 border-b border-[#E2DDD5]">
        <Container wide>
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B09C4B]/15 text-[#8C743E] border border-[#B09C4B]/40 text-xs font-mono font-semibold uppercase tracking-wider">
              404 · RESOURCE UNRESOLVED
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#081D2E] leading-tight">
              Institutional Document or Page Not Found
            </h1>

            <p className="text-sm sm:text-base text-[#5C6470] font-light leading-relaxed">
              The policy monograph, journal issue, or administration workspace you requested is unavailable or has been reclassified within the institute repository.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#081D2E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0D2C49] transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Institute Home</span>
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9DEE2] bg-white text-[#081D2E] text-xs font-semibold uppercase tracking-wider hover:bg-[#F0EEEA] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#8C743E]" />
                <span>Research Archive</span>
              </Link>
              <Link
                href="/journals"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9DEE2] bg-white text-[#081D2E] text-xs font-semibold uppercase tracking-wider hover:bg-[#F0EEEA] transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#8C743E]" />
                <span>Journals Archive</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

