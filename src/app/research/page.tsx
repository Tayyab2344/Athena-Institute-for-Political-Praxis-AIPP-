"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import PublicationModal from "@/components/ui/PublicationModal";
import { Publication } from "@/types";
import { Search, Filter, ArrowUpRight, BookOpen, FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function PublicResearchLibraryPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activePublication, setActivePublication] = useState<Publication | null>(null);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (e) {
        console.error("Failed to load categories");
      }
    }
    loadCategories();
  }, []);

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
      console.error("Failed to load research library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [search, selectedType, selectedCategory, selectedYear, page]);

  const typeTabs = [
    { label: "All Works", value: "ALL" },
    { label: "Research Papers", value: "RESEARCH_PAPER" },
    { label: "Journals", value: "JOURNAL" },
    { label: "Policy Briefs", value: "POLICY_BRIEF" },
    { label: "Reports", value: "REPORT" }
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1A1817] flex flex-col font-sans">
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <section className="pt-36 pb-16 bg-[#EFECE6] border-b border-[#4A121A]/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A]">
              AIPP DIGITAL RESEARCH REPOSITORY
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1817]">
              Research & Publications
            </h1>
            <p className="text-base font-sans text-[#5C5755] font-light leading-relaxed">
              Empirical studies, policy briefs, institutional reports, and peer-reviewed journal papers informing women's leadership in global diplomacy.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#FAF8F5] flex-grow">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#4A121A]/10">
              {typeTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setSelectedType(tab.value);
                    setPage(1);
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-sans font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedType === tab.value
                      ? "bg-[#4A121A] text-[#FAF8F5] shadow-sm"
                      : "bg-[#EFECE6] text-[#5C5755] hover:text-[#4A121A] hover:bg-[#EFECE6]/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-[#5C5755] absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by title, author, key topic, or abstract..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
                />
              </div>

              <div className="md:col-span-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
                >
                  <option value="ALL">All Research Areas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#1A1817] focus:outline-none focus:border-[#4A121A]"
                >
                  <option value="ALL">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-sans text-[#5C5755] pt-2">
            <span>Showing {totalCount} published research documents</span>
            <span>Page {page} of {totalPages}</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs font-sans text-[#5C5755]">
              Querying AIPP Digital Research Database...
            </div>
          ) : publications.length === 0 ? (
            <div className="py-20 text-center bg-[#EFECE6] rounded-3xl border border-[#4A121A]/10 space-y-4">
              <FileText className="w-10 h-10 text-[#4A121A]/30 mx-auto" />
              <p className="font-serif text-xl text-[#1A1817]">No research publications match your search filter.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedType("ALL");
                  setSelectedCategory("ALL");
                  setSelectedYear("ALL");
                }}
                className="text-xs font-sans font-semibold text-[#4A121A] underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="bg-[#FAF8F5] rounded-3xl border border-[#4A121A]/10 p-8 shadow-sm hover:border-[#4A121A]/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-sans">
                      <span className="px-3 py-1 rounded-full bg-[#4A121A]/10 text-[#4A121A] font-semibold uppercase tracking-wider">
                        {pub.type ? pub.type.replace("_", " ") : (pub.category && typeof pub.category === 'string' ? pub.category : "Research")}
                      </span>
                      <span className="text-[#5C5755]">
                        {pub.publicationDate ? new Date(pub.publicationDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : (pub.year || pub.date)}
                      </span>
                    </div>

                    <Link href={`/research/${pub.slug || pub.id}`}>
                      <h3 className="font-serif text-2xl text-[#1A1817] group-hover:text-[#4A121A] transition-colors leading-tight line-clamp-2">
                        {pub.title}
                      </h3>
                    </Link>

                    <div className="text-xs font-sans text-[#4A121A] font-medium">
                      By {pub.authors?.map((a: any) => a.name).join(", ") || pub.author || "AIPP Fellow"}
                    </div>

                    <p className="text-xs font-sans text-[#5C5755] line-clamp-3 font-light leading-relaxed">
                      {pub.abstract || pub.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#4A121A]/10 flex items-center justify-between">
                    <span className="text-[11px] font-sans text-[#5C5755]">
                      {typeof pub.category === 'object' ? pub.category?.name : (pub.category || "Diplomacy Praxis")}
                    </span>

                    <Link
                      href={`/research/${pub.slug || pub.id}`}
                      className="px-5 py-2 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold hover:bg-[#6A1B27] transition-colors flex items-center gap-2"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8 border-t border-[#4A121A]/10">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-3 rounded-full border border-[#4A121A]/20 text-[#4A121A] disabled:opacity-30 hover:bg-[#4A121A]/5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-sans text-[#1A1817]">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-3 rounded-full border border-[#4A121A]/20 text-[#4A121A] disabled:opacity-30 hover:bg-[#4A121A]/5 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <PublicationModal publication={activePublication} onClose={() => setActivePublication(null)} />
    </main>
  );
}
