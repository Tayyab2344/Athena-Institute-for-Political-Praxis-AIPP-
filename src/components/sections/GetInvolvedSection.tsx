"use client";

import { ArrowUpRight, Handshake, PenTool, Users } from "lucide-react";

interface GetInvolvedSectionProps {
  onOpenContact: (pathway?: string) => void;
}

export default function GetInvolvedSection({ onOpenContact }: GetInvolvedSectionProps) {
  const pathways = [
    {
      title: "Volunteer",
      icon: Users,
      description: "Contribute your time, organizational skills, and passion to support AIPP summits, workshops, and global student fellowships.",
      ctaText: "Volunteer With Us",
      pathwayKey: "Volunteer"
    },
    {
      title: "Contribute",
      icon: PenTool,
      description: "Share peer-reviewed research, policy commentary, and expert perspectives to be published in AIPP journals and policy briefs.",
      ctaText: "Submit Research",
      pathwayKey: "Contribute"
    },
    {
      title: "Collaborate",
      icon: Handshake,
      description: "Partner with AIPP on institutional research grants, diplomatic crisis simulations, and multilateral leadership initiatives.",
      ctaText: "Institutional Partnership",
      pathwayKey: "Collaborate"
    }
  ];

  return (
    <section id="get-involved" className="py-28 md:py-40 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="relative rounded-3xl bg-[#4A121A] text-[#FAF8F5] p-10 md:p-20 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A8656C]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FAF8F5]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-8">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#A8656C] block">
              07 / ENGAGEMENT & PRAXIS
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] text-[#FAF8F5]">
              The future of diplomacy needs more <span className="italic font-serif text-[#C4928F]">voices</span> at the table.
            </h2>

            <p className="text-base sm:text-lg font-sans text-[#FAF8F5]/80 font-light leading-relaxed max-w-2xl">
              Whether you are an established ambassador, academic researcher, crisis analyst, or emerging leader, there are multiple pathways to shape global security and diplomatic praxis.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenContact("General Inquiry")}
                className="px-8 py-4 rounded-full bg-[#FAF8F5] text-[#4A121A] hover:bg-[#EFECE6] text-xs font-sans font-semibold tracking-wider transition-all duration-300 flex items-center gap-3 shadow-lg"
              >
                <span>Get Involved</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenContact("General Inquiry")}
                className="px-8 py-4 rounded-full border border-[#FAF8F5]/30 text-[#FAF8F5] hover:bg-[#FAF8F5]/10 text-xs font-sans font-medium tracking-wider transition-all duration-300"
              >
                <span>Contact AIPP</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {pathways.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-8 rounded-2xl bg-[#EFECE6] border border-[#4A121A]/10 hover:border-[#4A121A]/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#4A121A]/10 border border-[#4A121A]/20 flex items-center justify-center text-[#4A121A]">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-2xl text-[#1A1817] group-hover:text-[#4A121A] transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs font-sans text-[#5C5755] leading-relaxed font-light">
                    {p.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#4A121A]/10">
                  <button
                    onClick={() => onOpenContact(p.pathwayKey)}
                    className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#4A121A] hover:underline"
                  >
                    <span>{p.ctaText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
