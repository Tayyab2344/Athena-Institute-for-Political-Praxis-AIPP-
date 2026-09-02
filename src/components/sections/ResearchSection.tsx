"use client";

import { useState } from "react";
import { PUBLICATIONS_DATA } from "@/data/mockData";
import { Publication } from "@/types";
import PublicationModal from "@/components/ui/PublicationModal";
import { ArrowUpRight, FileText, Download, BookOpen } from "lucide-react";

export default function ResearchSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePublication, setActivePublication] = useState<Publication | null>(null);

  const categories = ["All", "Research Paper", "Policy Brief", "Report", "Journal"];

  const filteredPublications = selectedCategory === "All"
    ? PUBLICATIONS_DATA
    : PUBLICATIONS_DATA.filter((p) => p.category === selectedCategory);

  const featuredPublication = PUBLICATIONS_DATA.find((p) => p.featured) || PUBLICATIONS_DATA[0];
  const secondaryPublications = filteredPublications.filter((p) => p.id !== featuredPublication.id);

  return (
    <section id="research" className="py-28 md:py-36 bg-[#EFECE6] border-y border-[#4A121A]/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A] block mb-3">
              05 / DIGITAL RESEARCH ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1817]">
              Ideas that <span className="italic text-[#4A121A]">inform</span> action.
            </h2>
          </div>
          <p className="text-sm font-sans text-[#5C5755] max-w-md font-light">
            Peer-reviewed empirical studies, geopolitical risk assessments, and policy briefs shaping international governance.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 border-b border-[#4A121A]/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-sans font-medium transition-all duration-300 whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#4A121A] text-[#FAF8F5] shadow-sm"
                  : "bg-[#FAF8F5] text-[#5C5755] hover:text-[#4A121A] hover:bg-[#FAF8F5]/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-3xl p-8 md:p-10 border border-[#4A121A]/10 shadow-lg flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="px-3.5 py-1 rounded-full bg-[#4A121A]/10 text-[#4A121A] text-[11px] font-sans font-semibold uppercase tracking-wider">
                  {featuredPublication.category} · Featured
                </span>
                <span className="text-xs font-sans text-[#5C5755]">
                  {featuredPublication.date}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1817] mb-4 leading-tight group-hover:text-[#4A121A] transition-colors">
                {featuredPublication.title}
              </h3>

              <div className="text-xs font-sans text-[#4A121A] font-medium mb-6">
                By {featuredPublication.author} · <span className="text-[#5C5755]">{featuredPublication.role}</span>
              </div>

              <p className="text-sm font-sans text-[#5C5755] leading-relaxed font-light mb-8">
                {featuredPublication.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-[#4A121A]/10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-sans text-[#5C5755]">
                {featuredPublication.pages} Pages · PDF Document
              </span>

              <button
                onClick={() => setActivePublication(featuredPublication)}
                className="px-6 py-3 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold hover:bg-[#6A1B27] transition-all flex items-center gap-2 shadow-md"
              >
                <span>Read Publication</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondaryPublications.slice(0, 3).map((pub) => (
              <div
                key={pub.id}
                onClick={() => setActivePublication(pub)}
                className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#4A121A]/10 hover:border-[#4A121A]/30 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-[11px] font-sans">
                    <span className="text-[#4A121A] font-semibold uppercase tracking-wider">
                      {pub.category}
                    </span>
                    <span className="text-[#5C5755]">
                      {pub.date}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg text-[#1A1817] group-hover:text-[#4A121A] transition-colors leading-snug mb-2">
                    {pub.title}
                  </h4>

                  <p className="text-xs font-sans text-[#5C5755] line-clamp-2 font-light">
                    {pub.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-[#4A121A]/10 flex items-center justify-between text-xs font-sans text-[#4A121A]">
                  <span className="font-medium">Author: {pub.author}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="flex justify-center pt-4">
          <a
            href="#research"
            onClick={(e) => {
              e.preventDefault();
              alert("Showing complete AIPP research repository.");
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#4A121A]/30 text-[#4A121A] hover:bg-[#4A121A] hover:text-[#FAF8F5] text-xs font-sans font-semibold tracking-wider transition-all duration-300 shadow-sm"
          >
            <span>Explore Research Archive →</span>
          </a>
        </div>

      </div>

      <PublicationModal
        publication={activePublication}
        onClose={() => setActivePublication(null)}
      />
    </section>
  );
}
