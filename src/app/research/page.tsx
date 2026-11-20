"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Publication } from "@/types";
import {
  Search,
  ArrowUpRight,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Filter,
  X,
  Share2,
  Check
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   AIPP Research Hub: Modern Editorial Redesign
   - Brand Identity: Predominantly White & Soft Off-White surfaces
   - Typography: Cormorant Garamond display + Manrope body
   - Buttons: Strict rounded-full styling across all actions
   - Institutional Integrity: Tayyaba Atiq as Founder
   - Sections: Hero, Mandate, Interactive Library, Closing CTA
   ───────────────────────────────────────────────────────────── */

export default function PublicResearchLibraryPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }
    loadCategories();
  }, []);

  // Fetch publications based on active filters
  const fetchPublications = async () => {
    setLoading(true);
    try {
      let url = `/api/publications?page=${page}&limit=9`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (selectedType !== "ALL") url += `&type=${selectedType}`;
      if (selectedCategory !== "ALL") url += `&category=${selectedCategory}`;
      if (selectedYear !== "ALL") url += `&year=${selectedYear}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.publications) {
        setPublications(data.publications);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.total || 0);
        }
      }
    } catch (e) {
      console.error("Failed to load research library", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      fetchPublications();
    });
    return () => cancelAnimationFrame(frame);
  }, [search, selectedType, selectedCategory, selectedYear, page]);

  const typeTabs = [
    { label: "All Works", value: "ALL" },
    { label: "Research Papers", value: "RESEARCH_PAPER" },
    { label: "Journals", value: "JOURNAL" },
    { label: "Policy Briefs", value: "POLICY_BRIEF" },
    { label: "Reports", value: "REPORT" }
  ];

  // Helper to format authors nicely
  const formatAuthors = (pub: Publication) => {
    if (pub.authors && Array.isArray(pub.authors) && pub.authors.length > 0) {
      return pub.authors.map((a: { name: string }) => a.name).join(", ");
    }
    return pub.author || "AIPP Research Directorate";
  };

  // Helper to format category name
  const formatCategory = (pub: Publication) => {
    if (pub.category && typeof pub.category === "object") {
      return pub.category.name;
    }
    return pub.category || "Diplomacy Praxis";
  };

  // Helper to format date
  const formatDate = (pub: Publication) => {
    if (pub.publicationDate) {
      try {
        return new Date(pub.publicationDate).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric"
        });
      } catch (e) {
        return pub.date || String(pub.year) || "2026";
      }
    }
    return pub.date || String(pub.year) || "2026";
  };

  // Clean type tag display
  const formatType = (type?: string) => {
    if (!type) return "Research";
    switch (type) {
      case "RESEARCH_PAPER":
        return "Research Paper";
      case "POLICY_BRIEF":
        return "Policy Brief";
      case "REPORT":
        return "Report";
      case "JOURNAL":
        return "Journal";
      default:
        return type.replace(/_/g, " ");
    }
  };

  // Featured publication (first item on first page with no search)
  const isDefaultView = page === 1 && !search && selectedType === "ALL" && selectedCategory === "ALL" && selectedYear === "ALL";
  const featuredPub = isDefaultView && publications.length > 0 ? publications[0] : null;
  const standardList = featuredPub ? publications.slice(1) : publications;

  const hasActiveFilters = Boolean(search || selectedType !== "ALL" || selectedCategory !== "ALL" || selectedYear !== "ALL");

  const clearAllFilters = () => {
    setSearch("");
    setSelectedType("ALL");
    setSelectedCategory("ALL");
    setSelectedYear("ALL");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-white text-[#081D2E] flex flex-col font-sans selection:bg-[#0D2C49] selection:text-white">
      {/* Global Navigation */}
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      {/* ─────────────────────────────────────────────────────────────
          Section 1: Research Hero (Editorial & Light)
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-white text-[#081D2E] pt-28 sm:pt-32 pb-14 sm:pb-20 border-b border-[#D9DEE2]/70 overflow-hidden"
        aria-label="Research Hero"
      >
        <Container wide>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Typography & Mission Introduction */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Eyebrow Marker */}
              <div className="hero-animate-eyebrow flex items-center gap-3 mb-4 sm:mb-6">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  AIPP Digital Research Repository
                </span>
              </div>

              {/* Display Headline */}
              <h1
                className="hero-animate-heading text-[2.625rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem] font-normal leading-[1.06] tracking-tight text-[#0D2C49] text-balance mb-6"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Rigorous inquiry shaping diplomatic statecraft.
              </h1>

              {/* Supporting Lead Description */}
              <p
                className="hero-animate-body text-lg sm:text-[1.1875rem] leading-relaxed text-[#243748] font-normal max-w-2xl mb-8"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                The Athena Institute for Political Praxis publishes empirical policy assessments, peer-reviewed journal papers, crisis simulation protocols, and strategic briefs to elevate women leaders in multilateral governance.
              </p>

              {/* Dual Restrained Action CTAs */}
              <div className="hero-animate-cta flex flex-wrap items-center gap-4">
                <a
                  href="#publications-library"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Browse Publications</span>
                  <ArrowUpRight className="h-4 w-4 text-[#B09C4B] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-6 py-3 text-base font-semibold text-[#081D2E] transition-all duration-200 hover:border-[#0D2C49] hover:bg-[#F7F7F7] active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Submit Inquiry</span>
                </button>
              </div>

              {/* Research Metrics Ledger */}
              <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-[#D9DEE2]/80 max-w-xl">
                <div>
                  <span
                    className="text-2xl sm:text-3xl font-light text-[#0D2C49] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    150+
                  </span>
                  <span
                    className="text-[0.6875rem] sm:text-xs font-semibold text-[#64717C] uppercase tracking-wider block mt-0.5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Policy Papers
                  </span>
                </div>
                <div>
                  <span
                    className="text-2xl sm:text-3xl font-light text-[#0D2C49] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    40
                  </span>
                  <span
                    className="text-[0.6875rem] sm:text-xs font-semibold text-[#64717C] uppercase tracking-wider block mt-0.5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Treaties Audited
                  </span>
                </div>
                <div>
                  <span
                    className="text-2xl sm:text-3xl font-light text-[#0D2C49] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    99%
                  </span>
                  <span
                    className="text-[0.6875rem] sm:text-xs font-semibold text-[#64717C] uppercase tracking-wider block mt-0.5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Empirical Rigor
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Visual Composition */}
            <div className="hero-animate-image lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                
                {/* Framed Editorial Document Showcase */}
                <div className="relative overflow-hidden rounded-2xl border border-[#D9DEE2] bg-[#FAF9F5] p-3 sm:p-4 shadow-sm">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#0D2C49]">
                    <Image
                      src="/ideas-strategy.jpg"
                      alt="AIPP diplomatic policy research session in progress"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                      className="object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                    />
                    {/* Editorial Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081D2E]/95 via-[#081D2E]/50 to-transparent p-5 sm:p-6 pt-16">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B09C4B]" />
                        <p
                          className="text-xs uppercase tracking-widest text-[#B09C4B] font-semibold"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          Doctrinal Inquiry
                        </p>
                      </div>
                      <p
                        className="text-base sm:text-lg text-white font-medium mt-1 leading-snug"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Evidence-based research advancing women in Track-I multilateral peace architectures.
                      </p>
                    </div>
                  </div>

                  {/* Refined Document Badge */}
                  <div className="mt-3.5 flex items-center justify-between px-2 py-1 text-xs text-[#64717C]">
                    <span className="font-semibold text-[#0D2C49]">AIPP Research Directorate</span>
                    <span className="text-[#B09C4B] font-medium">Vol. III &bull; 2026 Series</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 2: Research Mandate (Institutional Role)
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-14 sm:py-20 border-b border-[#D9DEE2]/80 overflow-hidden"
        aria-label="Research Mandate"
      >
        <Container wide>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Institutional Statement */}
            <ScrollReveal variant="fade-up" className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Institutional Mandate
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Bridging empirical scholarship with frontline statecraft.
              </h2>

              <p
                className="text-base sm:text-lg text-[#243748] font-normal leading-relaxed pt-2"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Founded by <strong className="font-semibold text-[#0D2C49]">Tayyaba Atiq</strong>, the Athena Institute for Political Praxis operates on the fundamental principle that sustainable peacebuilding and durable international law require rigorous, disaggregated evidence.
              </p>
            </ScrollReveal>

            {/* Right Column: Three Research Pillars */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <ScrollReveal variant="fade-up" delay={0} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
                <div>
                  <span
                    className="text-xl font-light text-[#B09C4B] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    01
                  </span>
                  <h3
                    className="text-lg font-normal text-[#0D2C49] mt-2 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Empirical Treaty Audits
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Quantitative and historical evaluation of ceasefire durability, dispute mechanism density, and post-conflict economic provisions across bilateral accords.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Peace &amp; Security
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={100} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
                <div>
                  <span
                    className="text-xl font-light text-[#B09C4B] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    02
                  </span>
                  <h3
                    className="text-lg font-normal text-[#0D2C49] mt-2 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Technology Governance
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Formulating ethical, human-centric diplomacy frameworks for AI treaties, algorithmic non-proliferation, and cyber sovereignty standards.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Global Governance
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={200} className="bg-white p-6 rounded-2xl border border-[#D9DEE2] shadow-xs flex flex-col justify-between aipp-card-lift">
                <div>
                  <span
                    className="text-xl font-light text-[#B09C4B] block"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    03
                  </span>
                  <h3
                    className="text-lg font-normal text-[#0D2C49] mt-2 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Foreign Ministry Audits
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#243748] leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Structural retention analysis, assignment equity metrics, and career bottleneck audits across 50+ international diplomatic establishments.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#D9DEE2]/60 text-xs font-semibold text-[#0D2C49]">
                  Leadership Praxis
                </div>
              </ScrollReveal>

            </div>

          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 3: Interactive Publications Library (Main Focus)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="publications-library"
        className="relative w-full bg-white text-[#081D2E] py-14 sm:py-20 flex-grow scroll-mt-20 overflow-hidden"
        aria-label="Publications Library"
      >
        <Container wide>
          
          {/* Section Header */}
          <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#D9DEE2]">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#B09C4B]" />
                <span
                  className="text-xs sm:text-[0.8125rem] font-semibold tracking-wider text-[#0D2C49] uppercase"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Published Research Archive
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Explore Studies, Policy Briefs &amp; Journals
              </h2>
              <p
                className="text-sm sm:text-base text-[#243748] font-normal leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Filter by publication type, research discipline, or calendar year. Open any title to inspect peer citations, executive summaries, and full statutory texts.
              </p>
            </div>

            {/* Quick Count Badge */}
            <div className="shrink-0">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-[#D9DEE2] bg-[#FAF9F5] px-4 py-2 text-xs font-semibold text-[#0D2C49]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#B09C4B]" />
                <span>{totalCount} Verified Records</span>
              </span>
            </div>
          </ScrollReveal>

          {/* Filter & Search Suite */}
          <div className="space-y-6 mb-10">
            
            {/* Type Filter Pills (Horizontal Scroll on Mobile) */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2">
              {typeTabs.map((tab) => {
                const isActive = selectedType === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      setSelectedType(tab.value);
                      setPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap min-h-[40px] cursor-pointer ${
                      isActive
                        ? "bg-[#0D2C49] text-white shadow-xs"
                        : "bg-[#F7F7F7] text-[#243748] border border-[#D9DEE2] hover:border-[#0D2C49] hover:bg-white"
                    }`}
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input and Dropdowns Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 items-center">
              
              {/* Search Bar (6 cols) */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-[#64717C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title, author, keyword, or abstract..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full min-h-[46px] pl-11 pr-10 py-2.5 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] text-sm font-sans text-[#081D2E] placeholder:text-[#64717C]/70 focus:outline-hidden focus:border-[#0D2C49] focus:bg-white transition-all duration-200"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64717C] hover:text-[#081D2E] p-1"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Select (4 cols) */}
              <div className="md:col-span-4 relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full min-h-[46px] px-5 py-2.5 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] text-sm font-sans text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49] focus:bg-white transition-all duration-200 cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23243748' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1.25rem center"
                  }}
                >
                  <option value="ALL">All Practice Areas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Select (2 cols) */}
              <div className="md:col-span-2 relative">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setPage(1);
                  }}
                  className="w-full min-h-[46px] px-5 py-2.5 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] text-sm font-sans text-[#081D2E] focus:outline-hidden focus:border-[#0D2C49] focus:bg-white transition-all duration-200 cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23243748' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1.25rem center"
                  }}
                >
                  <option value="ALL">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

            </div>

            {/* Active Filters Clear Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between text-xs text-[#64717C] pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>Filtered results</span>
                  {selectedType !== "ALL" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0D2C49]/10 px-2.5 py-0.5 text-[#0D2C49] font-medium">
                      {formatType(selectedType)}
                    </span>
                  )}
                  {selectedCategory !== "ALL" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0D2C49]/10 px-2.5 py-0.5 text-[#0D2C49] font-medium">
                      {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                    </span>
                  )}
                  {selectedYear !== "ALL" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0D2C49]/10 px-2.5 py-0.5 text-[#0D2C49] font-medium">
                      {selectedYear}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-[#0D2C49] hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}

          </div>

          {/* ─────────────────────────────────────────────────────────
              Publication Showcase & Listing
              ───────────────────────────────────────────────────────── */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] text-sm text-[#243748]">
                <div className="w-4 h-4 border-2 border-[#0D2C49] border-t-transparent rounded-full animate-spin" />
                <span>Querying AIPP Digital Research Database...</span>
              </div>
            </div>
          ) : publications.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center bg-[#FAF9F5] rounded-3xl border border-[#D9DEE2] p-8 max-w-2xl mx-auto space-y-4">
              <FileText className="w-12 h-12 text-[#64717C]/50 mx-auto" />
              <h3
                className="text-2xl font-normal text-[#0D2C49]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                No publications match your filter criteria.
              </h3>
              <p
                className="text-sm text-[#243748] font-normal max-w-md mx-auto"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Try broadening your search term or resetting the practice area filter to inspect our complete collection.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#081D2E] cursor-pointer"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* Featured Publication Showcase (Displayed on Page 1 Default View) */}
              {featuredPub && (
                <ScrollReveal variant="fade-up" className="relative overflow-hidden rounded-3xl border border-[#D9DEE2] bg-[#FAF9F5] p-6 sm:p-8 lg:p-10 shadow-xs hover:border-[#0D2C49]/40 transition-all duration-300 aipp-card-lift">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left: Metadata & Narrative (7 cols) */}
                    <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
                      
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0D2C49] text-white text-[0.6875rem] font-semibold uppercase tracking-wider">
                          Featured Paper
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-[#D9DEE2] text-[#0D2C49] text-[0.6875rem] font-semibold uppercase tracking-wider">
                          {formatCategory(featuredPub)}
                        </span>
                        <span className="text-xs text-[#64717C] font-medium">
                          {formatDate(featuredPub)}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/research/${featuredPub.slug || featuredPub.id}`}>
                        <h3
                          className="text-2xl sm:text-3xl lg:text-[2.25rem] font-normal leading-tight text-[#0D2C49] hover:text-[#B09C4B] transition-colors"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {featuredPub.title}
                        </h3>
                      </Link>

                      {/* Author Credits */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0D2C49]">
                        <span>By {formatAuthors(featuredPub)}</span>
                        {featuredPub.doi && (
                          <span className="text-[#64717C] font-normal">
                            &bull; DOI: {featuredPub.doi}
                          </span>
                        )}
                      </div>

                      {/* Abstract / Excerpt */}
                      <p
                        className="text-sm sm:text-base text-[#243748] leading-relaxed font-normal pt-1 line-clamp-3 sm:line-clamp-4"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {featuredPub.abstract || featuredPub.excerpt}
                      </p>

                      {/* Action Links */}
                      <div className="pt-4 flex flex-wrap items-center gap-3">
                        <Link
                          href={`/research/${featuredPub.slug || featuredPub.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] hover:gap-3"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          <span>Read Full Paper</span>
                          <ArrowUpRight className="h-4 w-4 text-[#B09C4B]" />
                        </Link>

                        {featuredPub.pages && (
                          <span className="text-xs text-[#64717C] font-medium px-3 py-2 rounded-full bg-white border border-[#D9DEE2]">
                            {featuredPub.pages} Pages &bull; Statutory Analysis
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Right: Featured Cover Preview (5 cols) */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                      <Link
                        href={`/research/${featuredPub.slug || featuredPub.id}`}
                        className="block group relative overflow-hidden rounded-2xl border border-[#D9DEE2] bg-white p-2 shadow-xs"
                      >
                        <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#0D2C49]">
                          <Image
                            src={featuredPub.coverImageUrl || featuredPub.coverImage || "/ideas-strategy.jpg"}
                            alt={featuredPub.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 500px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#081D2E]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        </div>
                      </Link>
                    </div>

                  </div>
                </ScrollReveal>
              )}

              {/* Standard Publication Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {standardList.map((pub, idx) => {
                  const targetSlug = pub.slug || pub.id;
                  return (
                    <ScrollReveal
                      key={pub.id}
                      variant="fade-up"
                      delay={idx * 60}
                      as="article"
                      className="group bg-white rounded-2xl border border-[#D9DEE2] p-6 sm:p-7 shadow-xs hover:border-[#0D2C49] hover:shadow-md transition-all duration-300 flex flex-col justify-between aipp-card-lift"
                    >
                      <div className="space-y-4">
                        
                        {/* Top Badges Row */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#D9DEE2] text-[#0D2C49] text-[0.6875rem] font-semibold uppercase tracking-wider">
                            {formatType(pub.type)}
                          </span>
                          <span className="text-[#64717C] text-[0.75rem] font-medium">
                            {formatDate(pub)}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/research/${targetSlug}`} className="block">
                          <h3
                            className="text-xl sm:text-[1.375rem] font-normal leading-snug text-[#0D2C49] group-hover:text-[#B09C4B] transition-colors line-clamp-2"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {pub.title}
                          </h3>
                        </Link>

                        {/* Author Credit */}
                        <p
                          className="text-xs font-semibold text-[#0D2C49]"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          By {formatAuthors(pub)}
                        </p>

                        {/* Excerpt / Abstract */}
                        <p
                          className="text-xs sm:text-sm text-[#243748] font-normal leading-relaxed line-clamp-3"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {pub.abstract || pub.excerpt}
                        </p>

                      </div>

                      {/* Card Footer */}
                      <div className="mt-6 pt-4 border-t border-[#D9DEE2] flex items-center justify-between">
                        <span
                          className="text-xs text-[#64717C] font-medium"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {formatCategory(pub)}
                        </span>

                        <Link
                          href={`/research/${targetSlug}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0D2C49] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 group-hover:bg-[#081D2E] group-hover:gap-2.5"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          <span>Read</span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#B09C4B]" />
                        </Link>
                      </div>

                    </ScrollReveal>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-8 border-t border-[#D9DEE2]">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage(page - 1);
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#D9DEE2] bg-white text-[#0D2C49] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#F7F7F7] hover:border-[#0D2C49] transition-all cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span
                    className="text-xs font-semibold text-[#0D2C49] px-4 py-2 rounded-full bg-[#FAF9F5] border border-[#D9DEE2]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage(page + 1);
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#D9DEE2] bg-white text-[#0D2C49] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#F7F7F7] hover:border-[#0D2C49] transition-all cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}

        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Section 4: Closing Institutional Collaboration Section
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-[#F7F7F7] text-[#081D2E] py-16 sm:py-20 border-t border-[#D9DEE2] overflow-hidden"
        aria-label="Institutional Collaboration"
      >
        <Container wide>
          <ScrollReveal variant="fade-up" className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D9DEE2] bg-white text-xs uppercase tracking-widest text-[#0D2C49] font-semibold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B09C4B]" />
              <span>Academic &amp; Diplomatic Partnerships</span>
            </div>

            {/* Display Heading */}
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.85rem] font-normal leading-[1.14] tracking-tight text-[#0D2C49] text-balance"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Commission an institutional audit or co-author policy research.
            </h2>

            {/* Narrative */}
            <p
              className="text-base sm:text-lg leading-relaxed text-[#243748] font-normal max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              AIPP partners with foreign ministries, diplomatic academies, multilateral secretariats, and university research institutes worldwide to evaluate representation, negotiation strategy, and treaty durability.
            </p>

            {/* Restrained Rounded-Full CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2C49] px-7 py-3.5 text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#081D2E] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] cursor-pointer"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Initiate Research Collaboration</span>
                <ArrowUpRight className="h-4 w-4 text-[#B09C4B]" />
              </button>

              <Link
                href="/what-we-offer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9DEE2] bg-white px-7 py-3.5 text-base font-semibold text-[#081D2E] transition-all duration-200 hover:border-[#0D2C49] hover:bg-[#F7F7F7] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Explore What We Offer</span>
              </Link>
            </div>

          </ScrollReveal>
        </Container>
      </section>

      {/* Global Institutional Footer */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />

      {/* Interactive Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultPathway="Institutional Collaboration"
      />
    </main>
  );
}
