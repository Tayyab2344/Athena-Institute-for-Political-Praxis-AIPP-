"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, MessageSquareQuote } from "lucide-react";
import Container from "@/components/ui/Container";
import { INSIGHTS_DATA } from "@/data/mockData";

export default function PublicVoiceContentWall() {
  const featured = INSIGHTS_DATA[0];
  const companions = INSIGHTS_DATA.slice(1, 3);

  return (
    <section id="perspectives-wall" className="py-20 lg:py-28 bg-[#FAF9F6] border-b border-[var(--color-border)]" aria-label="Perspectives and Commentary Wall">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-gold)] block mb-3">
              PUBLIC COMMENTARY & PERSPECTIVES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--hero-navy)] font-normal leading-tight">
              Ideas in the Public Sphere.
            </h2>
          </div>
          <Link
            href="/#insights"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--hero-navy)] hover:text-[var(--hero-gold)] transition-colors shrink-0"
          >
            <span>Explore All Perspectives</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Content Wall: Large Featured Story (Left 7 cols) + Companion Stories (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Large Featured Story */}
          {featured && (
            <div className="lg:col-span-7 bg-white border border-[var(--color-border)] rounded-sm overflow-hidden flex flex-col justify-between p-7 sm:p-10 shadow-sm group hover:border-[var(--hero-gold)]/60 transition-all">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="px-3 py-1 bg-[var(--hero-navy)] text-white text-[0.625rem] font-mono uppercase tracking-wider rounded-sm font-semibold">
                    {featured.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>{featured.readTime}</span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--hero-navy)] font-semibold leading-snug group-hover:text-[var(--hero-gold)] transition-colors">
                  {featured.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-slate-600 font-sans font-light">
                  {featured.excerpt}
                </p>

                {/* Author Block */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <Image
                      src={featured.avatar || "/ideas-research.jpg"}
                      alt={featured.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-serif text-base text-[var(--hero-navy)] font-medium block">
                      {featured.author}
                    </span>
                    <span className="font-mono text-xs text-slate-500 block">
                      {featured.role} · {featured.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/#insights"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--hero-navy)] hover:text-[var(--hero-gold)] transition-colors"
                >
                  <span>Read Full Commentary</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--hero-gold)] font-bold">
                  <MessageSquareQuote className="h-4 w-4" />
                  <span>OP-ED SYNDICATION</span>
                </div>
              </div>
            </div>
          )}

          {/* Smaller Companion Stories Stacked on Right */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {companions.map((item) => (
              <div
                key={item.id}
                className="group p-6 bg-white border border-[var(--color-border)] rounded-sm hover:border-[var(--hero-navy)] hover:shadow-md transition-all flex flex-col justify-between flex-1"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[var(--hero-gold)] font-bold uppercase tracking-wider text-[0.625rem]">
                      {item.category}
                    </span>
                    <span className="text-slate-400 text-[0.6875rem]">{item.date}</span>
                  </div>

                  <h4 className="font-serif text-lg text-[var(--hero-navy)] font-medium leading-snug group-hover:text-[var(--hero-gold)] transition-colors">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-xs text-slate-500 font-sans line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-sans font-medium text-slate-700">{item.author}</span>
                  <Link
                    href="/#insights"
                    className="inline-flex items-center gap-1 font-mono text-[var(--hero-navy)] group-hover:text-[var(--hero-gold)] group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Read Analysis</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
