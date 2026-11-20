"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Download, Calendar, User } from "lucide-react";
import Container from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PUBLICATIONS_DATA } from "@/data/mockData";

export default function ResearchArchive() {
  const featured = PUBLICATIONS_DATA[0];
  const companions = PUBLICATIONS_DATA.slice(1, 4);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-[var(--color-border)]" aria-label="Research Publications Archive">
      <Container>
        {/* Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-2">
              PRIMARY SCHOLARSHIP
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
              Selected Publications &amp; Archival Papers.
            </h2>
          </div>
          <Link
            href="/research"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--hero-navy)] hover:text-[var(--hero-gold)] transition-colors shrink-0"
          >
            <span>Complete Research Archive</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </ScrollReveal>

        {/* Editorial Archive Grid: Left Featured (7 cols) + Right Stack (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Large Featured Publication on the Left */}
          {featured && (
            <ScrollReveal variant="fade-up" delay={50} className="lg:col-span-7 bg-[#FCFBF8] border border-[var(--color-border)] rounded-sm overflow-hidden flex flex-col justify-between p-7 sm:p-10 shadow-sm group hover:border-[var(--hero-gold)]/60 transition-all aipp-card-lift">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="px-3 py-1 bg-[var(--hero-navy)] text-white text-[0.625rem] font-mono uppercase tracking-wider rounded-sm font-semibold">
                    {typeof featured.category === "object" && featured.category !== null && "name" in featured.category
                      ? (featured.category as { name: string }).name
                      : String(featured.category || "")}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {featured.date}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--hero-navy)] font-semibold leading-snug group-hover:text-[var(--hero-gold)] transition-colors">
                  {featured.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-600 font-sans font-light">
                  {featured.excerpt}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="block font-mono text-[0.625rem] text-slate-400 uppercase">
                      AUTHOR(S)
                    </span>
                    <span className="font-medium text-[var(--hero-navy)] mt-0.5 block">
                      {featured.author}
                    </span>
                    <span className="text-[0.6875rem] text-slate-500 block">
                      {featured.role}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[0.625rem] text-slate-400 uppercase">
                      DOI &amp; SPECIFICATION
                    </span>
                    <span className="font-mono text-xs text-[var(--hero-gold)] mt-0.5 block font-semibold">
                      {featured.doi}
                    </span>
                    <span className="text-[0.6875rem] text-slate-500 block">
                      {featured.pages} Pages · Peer Reviewed
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                <Link
                  href={`/research/${featured.id}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--hero-navy)] hover:text-[var(--hero-gold)] transition-colors"
                >
                  <span>Read Executive Paper</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <span className="font-mono text-[0.6875rem] text-slate-400">
                  {featured.downloadCount}+ Institutional Downloads
                </span>
              </div>
            </ScrollReveal>
          )}

          {/* Stacked Companion Publications on the Right */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {companions.map((pub, idx) => (
              <ScrollReveal
                key={pub.id}
                variant="fade-up"
                delay={100 + idx * 60}
                className="flex flex-col flex-1"
              >
                <Link
                  href={`/research/${pub.id}`}
                  className="group p-5 bg-white border border-[var(--color-border)] rounded-sm hover:border-[var(--hero-navy)] hover:shadow-md transition-all flex flex-col justify-between flex-1 aipp-card-lift"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-[var(--hero-gold)] font-bold uppercase tracking-wider text-[0.625rem]">
                        {typeof pub.category === "object" && pub.category !== null && "name" in pub.category
                          ? (pub.category as { name: string }).name
                          : String(pub.category || "")}
                      </span>
                      <span className="text-slate-400 text-[0.6875rem]">{pub.date}</span>
                    </div>

                    <h4 className="font-serif text-lg text-[var(--hero-navy)] font-medium leading-snug group-hover:text-[var(--hero-gold)] transition-colors">
                      {pub.title}
                    </h4>

                    <p className="mt-2 text-xs text-slate-500 font-sans line-clamp-2 leading-relaxed">
                      {pub.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-sans font-medium text-slate-700">{pub.author}</span>
                    <div className="flex items-center gap-1 font-mono text-[var(--hero-navy)] group-hover:text-[var(--hero-gold)] group-hover:translate-x-0.5 transition-all">
                      <span>View Dossier</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
