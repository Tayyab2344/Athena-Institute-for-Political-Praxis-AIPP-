import { PILLARS_DATA } from "@/data/mockData";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function PillarsSection() {
  return (
    <section id="pillars" className="py-28 md:py-40 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A] block mb-3">
              04 / CORE PILLARS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1817]">
              Three pathways from <span className="italic text-[#4A121A]">ideas</span> to impact.
            </h2>
          </div>
          <p className="text-sm font-sans text-[#5C5755] max-w-md font-light">
            Integrating academic research, tactical crisis simulations, and high-impact international advocacy.
          </p>
        </div>

        <div className="space-y-24 md:space-y-36">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
              <span className="font-serif text-5xl md:text-6xl text-[#4A121A]/20 font-bold block">
                {PILLARS_DATA[0].number}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1817] font-normal">
                {PILLARS_DATA[0].title}
              </h3>
              <p className="text-sm sm:text-base font-sans text-[#5C5755] font-light leading-relaxed">
                {PILLARS_DATA[0].shortDescription}
              </p>
              <p className="text-xs font-sans text-[#5C5755]/80 leading-relaxed pt-2">
                {PILLARS_DATA[0].fullDescription}
              </p>

              <div className="pt-2 space-y-2">
                {PILLARS_DATA[0].features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-sans text-[#1A1817]">
                    <CheckCircle2 className="w-4 h-4 text-[#4A121A]" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href={PILLARS_DATA[0].linkHref}
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] hover:text-[#6A1B27] group"
                >
                  <span>{PILLARS_DATA[0].linkText}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl border border-[#4A121A]/10 group">
                <img
                  src={PILLARS_DATA[0].image}
                  alt={PILLARS_DATA[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#4A121A]/30 to-transparent" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#EFECE6] p-8 md:p-14 rounded-3xl border border-[#4A121A]/10">
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg group">
                <img
                  src={PILLARS_DATA[1].image}
                  alt={PILLARS_DATA[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 bg-[#FAF8F5]/90 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-sans font-semibold text-[#4A121A]">
                  Crisis Simulation Lab
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="font-serif text-5xl md:text-6xl text-[#4A121A]/20 font-bold block">
                {PILLARS_DATA[1].number}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1817] font-normal">
                {PILLARS_DATA[1].title}
              </h3>
              <p className="text-sm sm:text-base font-sans text-[#5C5755] font-light leading-relaxed">
                {PILLARS_DATA[1].shortDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {PILLARS_DATA[1].features.map((feat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#FAF8F5] border border-[#4A121A]/10 text-xs font-sans font-medium text-[#1A1817]">
                    {feat}
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href={PILLARS_DATA[1].linkHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold tracking-wider hover:bg-[#6A1B27] transition-colors group"
                >
                  <span>{PILLARS_DATA[1].linkText}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
              <span className="font-serif text-5xl md:text-6xl text-[#4A121A]/20 font-bold block">
                {PILLARS_DATA[2].number}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1817] font-normal">
                {PILLARS_DATA[2].title}
              </h3>
              <p className="text-sm sm:text-base font-sans text-[#5C5755] font-light leading-relaxed">
                {PILLARS_DATA[2].shortDescription}
              </p>
              <p className="text-xs font-sans text-[#5C5755]/80 leading-relaxed">
                {PILLARS_DATA[2].fullDescription}
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                {PILLARS_DATA[2].features.map((feat, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-[#EFECE6] border border-[#4A121A]/10 text-xs font-sans text-[#4A121A] font-medium">
                    {feat}
                  </span>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href={PILLARS_DATA[2].linkHref}
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#4A121A] hover:text-[#6A1B27] group"
                >
                  <span>{PILLARS_DATA[2].linkText}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl border border-[#4A121A]/10 group">
                <img
                  src={PILLARS_DATA[2].image}
                  alt={PILLARS_DATA[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1817]/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-xs font-serif italic text-[#FAF8F5]">
                  Public advocacy summit in Brussels
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
