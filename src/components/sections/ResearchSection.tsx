"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { PUBLICATIONS_DATA } from "@/data/mockData";
import { Publication } from "@/types";
import PublicationModal from "@/components/ui/PublicationModal";
import Container from "@/components/ui/Container";
import { ArrowUpRight, BookOpen, FileText, Download, Award, Layers } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Section 4 — "The Ideas Shaping Tomorrow"
   Light, prestigious, academic/editorial research showcase.
   ───────────────────────────────────────────────────────────── */

export default function ResearchSection() {
  const [selectedId, setSelectedId] = useState<string>(PUBLICATIONS_DATA[0]?.id || "");
  const [activePublication, setActivePublication] = useState<Publication | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isVisible, setIsVisible] = useState(true);
  const [coverTransition, setCoverTransition] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const allPublications = PUBLICATIONS_DATA;
  const categories = ["All", ...Array.from(new Set(allPublications.map((p) => p.category)))];

  const filteredPublications = selectedCategory === "All"
    ? allPublications
    : allPublications.filter((p) => p.category === selectedCategory);

  // If selectedId isn't in filtered list, fallback to first in filtered
  const featured = filteredPublications.find((p) => p.id === selectedId) || filteredPublications[0] || allPublications[0];
  const supporting = allPublications.filter((p) => p.id !== featured?.id);

  /* Intersection Observer for smooth entry animations */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Handle selection with crossfade */
  const selectPublicationById = useCallback(
    (id: string) => {
      if (id === featured?.id) return;
      setCoverTransition(true);
      setTimeout(() => {
        setSelectedId(id);
        setCoverTransition(false);
      }, 200);
    },
    [featured?.id]
  );

  /* Handle category filter switch */
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const firstInCat = cat === "All" ? allPublications[0] : allPublications.find((p) => p.category === cat);
    if (firstInCat) {
      setSelectedId(firstInCat.id);
    }
  };

  /* Empty state */
  if (!allPublications.length) {
    return (
      <section
        id="research"
        className="relative w-full bg-[#FAF9F6] text-[#081D2E] py-24 scroll-mt-20 border-t border-[#E2DDD5]"
      >
        <Container wide>
          <div className="flex flex-col items-center justify-center text-center gap-6 py-20">
            <BookOpen className="w-12 h-12 text-[#8C743E]" />
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#081D2E]"
              style={{ fontFamily: "var(--font-hero-serif)" }}
            >
              Research publications are being prepared.
            </h2>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#0D2C49] text-[#0D2C49] text-xs font-semibold tracking-wider hover:bg-[#0D2C49] hover:text-white transition-all duration-300"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              <span>Visit Research Archive</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      id="research"
      ref={sectionRef}
      className="relative w-full bg-[#FAF8F5] text-[#1B2D42] scroll-mt-24 overflow-hidden border-t border-[#E5DFD5]"
      aria-label="Research & Publications"
    >
      {/* ═══ Subtle Architectural Grid Texture (Light) ═══ */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(13, 44, 73, 0.06) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Soft radial warmth */}
        <div
          className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(176, 156, 75, 0.1) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-10 left-10 w-[500px] h-[350px] rounded-full blur-[120px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(13, 44, 73, 0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ═══ Section Top Header Badge ═══ */}
      <div className="relative z-20 pt-16 sm:pt-16 pb-4">
        <Container wide>
          <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-4">
            <div className="inline-flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#8C743E]" />
              <span
                className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#8C743E]"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                04 / RESEARCH &amp; PUBLICATIONS
              </span>
            </div>
            <div
              className="hidden sm:flex items-center gap-3 text-xs text-[#64748B]"
              style={{ fontFamily: "var(--font-hero-sans)" }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#8C743E]" />
                Peer-Reviewed Index
              </span>
              <span>•</span>
              <span>Quarterly Release</span>
            </div>
          </div>
        </Container>
      </div>

      {/* ═══ Main Section Content ═══ */}
      <div className="relative z-10 pt-8 pb-20 sm:pb-28">
        <Container wide>
          {/* ─── Two Column Layout ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">

            {/* LEFT COLUMN: Editorial Narrative & Category Selector */}
            <div
              className={`lg:col-span-5 xl:col-span-5 flex flex-col justify-between transition-all duration-[800ms] ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div>
                {/* Section Title */}
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.08] font-normal text-[#081D2E] tracking-[-0.015em] mb-5"
                  style={{ fontFamily: "var(--font-hero-serif)" }}
                >
                  Ideas that inform{" "}
                  <span className="italic font-medium text-[#8C743E] block sm:inline">
                    the future.
                  </span>
                </h2>

                {/* Subtitle */}
                <p
                  className="text-base sm:text-lg text-[#475569] leading-relaxed font-light mb-6"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  Rigorous empirical studies, policy briefs, and strategic analysis from women leading at the highest levels of global diplomacy.
                </p>

                {/* Vertical accent divider line */}
                <div className="w-12 h-[2px] bg-[#8C743E] mb-6" />

                {/* Topic / Category Filter Buttons */}
                <div className="mb-8">
                  <span
                    className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#64748B] block mb-3"
                    style={{ fontFamily: "var(--font-hero-sans)" }}
                  >
                    Filter by Disciplinary Focus:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                          selectedCategory === cat
                            ? "bg-[#0D2C49] text-white shadow-sm"
                            : "bg-[#EDE9E1] text-[#475569] hover:bg-[#E2DDD3] hover:text-[#081D2E]"
                        }`}
                        style={{ fontFamily: "var(--font-hero-sans)" }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 gap-3.5 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-white/70 border border-[#E5DFD5] shadow-sm mb-8">
                  <div>
                    <div
                      className="text-2xl sm:text-3xl font-light text-[#0D2C49]"
                      style={{ fontFamily: "var(--font-hero-serif)" }}
                    >
                      150+
                    </div>
                    <div
                      className="text-xs text-[#64748B] uppercase tracking-wider font-semibold mt-1"
                      style={{ fontFamily: "var(--font-hero-sans)" }}
                    >
                      Policy Papers
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-2xl sm:text-3xl font-light text-[#0D2C49]"
                      style={{ fontFamily: "var(--font-hero-serif)" }}
                    >
                      38
                    </div>
                    <div
                      className="text-xs text-[#64748B] uppercase tracking-wider font-semibold mt-1"
                      style={{ fontFamily: "var(--font-hero-sans)" }}
                    >
                      Member States
                    </div>
                  </div>
                </div>
              </div>

              {/* View Full Catalog Link */}
              <div className="pt-2">
                <Link
                  href="/research"
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-[#0D2C49] text-white text-xs font-semibold tracking-wider hover:bg-[#8C743E] transition-all duration-300 shadow-sm"
                  style={{ fontFamily: "var(--font-hero-sans)" }}
                >
                  <span className="uppercase">View Full Research Library</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: Featured Card & Interactive Preview Stack */}
            <div
              className={`lg:col-span-7 xl:col-span-7 relative transition-all duration-[900ms] ease-out delay-150 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Main Featured Card */}
              {featured && (
                <div
                  className={`relative z-20 transition-all duration-300 ${
                    coverTransition ? "opacity-20 scale-[0.98]" : "opacity-100 scale-100"
                  }`}
                >
                  <div className="bg-white rounded-2xl border border-[#E2DDD5] shadow-[0_12px_40px_rgba(13,44,73,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_18px_50px_rgba(13,44,73,0.12)] hover:border-[#D5CEBE]">
                    <div className="grid grid-cols-1 sm:grid-cols-12">
                      {/* Cover Image Thumbnail / Book Spine Representation */}
                      <div className="sm:col-span-5 relative min-h-[220px] sm:min-h-[340px] bg-[#0c263c] overflow-hidden">
                        {featured.coverImage ? (
                          <Image
                            src={featured.coverImage}
                            alt={featured.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 320px"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white/40">
                            <BookOpen className="w-12 h-12 mb-2 text-[#B09C4B]" />
                            <span className="text-xs uppercase tracking-widest">AIPP Monograph</span>
                          </div>
                        )}
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                        {/* Top Badge on image */}
                        <div className="absolute top-3 left-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#081D2E] text-[0.65rem] font-bold uppercase tracking-[0.14em] shadow-sm"
                            style={{ fontFamily: "var(--font-hero-sans)" }}
                          >
                            <FileText className="w-3 h-3 text-[#8C743E]" />
                            {featured.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Right */}
                      <div className="sm:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                            <span style={{ fontFamily: "var(--font-hero-sans)" }}>{featured.date}</span>
                            {featured.pages && (
                              <span className="text-[0.6875rem] bg-[#F4F1EA] px-2.5 py-0.5 rounded text-[#7A6432]">
                                {featured.pages} Pages
                              </span>
                            )}
                          </div>

                          <h3
                            className="text-xl sm:text-2xl font-normal text-[#081D2E] leading-snug mb-3 hover:text-[#8C743E] transition-colors cursor-pointer"
                            style={{ fontFamily: "var(--font-hero-serif)" }}
                            onClick={() => setActivePublication(featured)}
                          >
                            {featured.title}
                          </h3>

                          <p
                            className="text-xs text-[#8C743E] font-medium mb-3"
                            style={{ fontFamily: "var(--font-hero-sans)" }}
                          >
                            By {featured.author}
                            {featured.role && (
                              <span className="text-[#64748B] font-normal block text-[0.7rem] mt-0.5">
                                {featured.role}
                              </span>
                            )}
                          </p>

                          <p
                            className="text-sm text-[#475569] leading-relaxed line-clamp-3 mb-6 font-light"
                            style={{ fontFamily: "var(--font-hero-sans)" }}
                          >
                            {featured.excerpt}
                          </p>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-4 border-t border-[#EAE6DF] flex items-center justify-between">
                          <button
                            onClick={() => setActivePublication(featured)}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D2C49] hover:text-[#8C743E] transition-colors"
                            style={{ fontFamily: "var(--font-hero-sans)" }}
                          >
                            <span>Read Summary</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          {featured.pdfUrl && (
                            <a
                              href={featured.pdfUrl}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F1EA] hover:bg-[#EAE5DA] text-xs font-semibold text-[#0D2C49] transition-colors"
                              style={{ fontFamily: "var(--font-hero-sans)" }}
                              download
                            >
                              <Download className="w-3.5 h-3.5 text-[#8C743E]" />
                              <span>PDF</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Supporting Items preview row (Desktop & Tablet) */}
              {supporting.length > 0 && (
                <div className="mt-4 hidden sm:grid sm:grid-cols-2 gap-3">
                  {supporting.slice(0, 2).map((pub) => (
                    <div
                      key={pub.id}
                      onClick={() => selectPublicationById(pub.id)}
                      className="group cursor-pointer bg-white/80 hover:bg-white border border-[#E5DFD5] hover:border-[#8C743E]/50 rounded-xl p-3.5 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-3"
                    >
                      <div className="relative w-14 h-16 rounded overflow-hidden flex-shrink-0 bg-[#0c263c]">
                        {pub.coverImage ? (
                          <Image
                            src={pub.coverImage}
                            alt={pub.title}
                            fill
                            sizes="56px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[#8C743E]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-[0.625rem] font-bold uppercase tracking-wider text-[#8C743E] block truncate"
                          style={{ fontFamily: "var(--font-hero-sans)" }}
                        >
                          {pub.category}
                        </span>
                        <h4
                          className="text-xs font-medium text-[#081D2E] truncate group-hover:text-[#8C743E] transition-colors"
                          style={{ fontFamily: "var(--font-hero-serif)" }}
                        >
                          {pub.title}
                        </h4>
                        <span
                          className="text-[0.65rem] text-[#64748B] block mt-0.5"
                          style={{ fontFamily: "var(--font-hero-sans)" }}
                        >
                          {pub.author ? pub.author.split('&')[0] : "AIPP"} · {pub.date}
                        </span>
                      </div>
                      <div className="pr-1 text-[#64748B] group-hover:text-[#081D2E] transition-colors">
                        <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ═══ Interactive Document Selector / Carousel ═══ */}
          <div
            className={`mt-14 pt-8 border-t border-[#E5DFD5] transition-all duration-[1000ms] ease-out delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-xs font-bold uppercase tracking-[0.16em] text-[#64748B]"
                style={{ fontFamily: "var(--font-hero-sans)" }}
              >
                Featured Publications Index
              </span>
              <span className="text-xs text-[#8C743E]">
                Select to view details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {allPublications.map((pub, idx) => {
                const isActive = pub.id === featured.id;
                return (
                  <button
                    key={pub.id}
                    onClick={() => selectPublicationById(pub.id)}
                    className={`text-left p-4 rounded-xl border transition-all duration-300 relative ${
                      isActive
                        ? "bg-white border-[#8C743E] shadow-md ring-1 ring-[#8C743E]/30"
                        : "bg-white/60 border-[#E5DFD5] hover:bg-white hover:border-[#D5CEBE]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-light ${
                          isActive ? "text-[#8C743E] font-bold" : "text-[#94A3B8]"
                        }`}
                        style={{ fontFamily: "var(--font-hero-serif)" }}
                      >
                        Vol. {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[0.625rem] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#F4F1EA] text-[#7A6432]"
                        style={{ fontFamily: "var(--font-hero-sans)" }}
                      >
                        {pub.category}
                      </span>
                    </div>

                    <h5
                      className={`text-xs font-medium leading-snug line-clamp-2 ${
                        isActive ? "text-[#081D2E] font-semibold" : "text-[#475569]"
                      }`}
                      style={{ fontFamily: "var(--font-hero-serif)" }}
                    >
                      {pub.title}
                    </h5>

                    <span
                      className="text-[0.65rem] text-[#94A3B8] block mt-2"
                      style={{ fontFamily: "var(--font-hero-sans)" }}
                    >
                      {pub.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </div>

      {/* ═══ Detail Modal ═══ */}
      <PublicationModal
        publication={activePublication}
        onClose={() => setActivePublication(null)}
      />
    </section>
  );
}
