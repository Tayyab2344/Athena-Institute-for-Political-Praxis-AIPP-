import { INTRO_DATA, STATS_DATA } from "@/data/mockData";
import { ArrowUpRight } from "lucide-react";

export default function IntroSection() {
  return (
    <section id="about" className="py-24 md:py-36 bg-[#EFECE6] border-y border-[#4A121A]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex items-center gap-3 mb-12">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A]">
            03 / INSTITUTIONAL IDENTITY
          </span>
          <div className="h-px bg-[#4A121A]/15 flex-grow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1817] leading-[1.1] mb-8">
                {INTRO_DATA.statement}
              </h2>

              <div className="w-16 h-1 bg-[#4A121A] mb-8" />

              <p className="text-base sm:text-lg font-sans text-[#5C5755] leading-relaxed font-light mb-10">
                {INTRO_DATA.paragraph}
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#4A121A]/15">
              {INTRO_DATA.pathways.map((item) => (
                <div key={item.number} className="group flex items-start gap-5">
                  <span className="font-serif text-2xl text-[#4A121A] font-bold">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1817] group-hover:text-[#4A121A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-sans text-[#5C5755] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] border border-[#4A121A]/10 group">
              <img
                src={INTRO_DATA.image}
                alt="AIPP Senior Fellow addressing international delegation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1817]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs font-sans text-[#FAF8F5] opacity-90">
                {INTRO_DATA.imageCaption}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {STATS_DATA.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#FAF8F5] border border-[#4A121A]/10 flex flex-col justify-between"
                >
                  <span className="font-serif text-3xl md:text-4xl text-[#4A121A] font-bold">
                    {stat.value}
                  </span>
                  <div className="mt-2">
                    <span className="block font-sans text-xs font-semibold text-[#1A1817]">
                      {stat.label}
                    </span>
                    <span className="text-[10px] font-sans text-[#5C5755] mt-0.5 block leading-tight hidden sm:block">
                      {stat.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
