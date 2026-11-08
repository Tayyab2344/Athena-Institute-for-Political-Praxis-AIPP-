import { INTRO_DATA, STATS_DATA } from "@/data/mockData";
import { ArrowUpRight } from "lucide-react";

export default function IntroSection() {
  return (
    <section id="about" className="py-24 md:py-36 bg-[#F7F6F2] border-y border-[#0A192F]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex items-center gap-3 mb-12">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#958772]">
            03 / INSTITUTIONAL IDENTITY
          </span>
          <div className="h-px bg-[#958772]/25 flex-grow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#0D1B2A] leading-[1.1] mb-8">
                {INTRO_DATA.statement}
              </h2>

              <div className="w-16 h-1 bg-[#0A192F] mb-8" />

              <p className="text-base sm:text-lg font-sans text-[#5C6470] leading-relaxed font-light mb-10">
                {INTRO_DATA.paragraph}
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#0A192F]/10">
              {INTRO_DATA.pathways.map((item) => (
                <div key={item.number} className="group flex items-start gap-5">
                  <span className="font-serif text-2xl text-[#0A192F] font-bold">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-[#0D1B2A] group-hover:text-[#0A192F] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-sans text-[#5C6470] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] border border-[#0A192F]/10 group">
              <img
                src={INTRO_DATA.image}
                alt="AIPP Senior Fellow addressing international delegation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06101E]/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs font-sans text-white opacity-90">
                {INTRO_DATA.imageCaption}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {STATS_DATA.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white border border-[#0A192F]/10 shadow-sm flex flex-col justify-between"
                >
                  <span className="font-serif text-3xl md:text-4xl text-[#0A192F] font-bold">
                    {stat.value}
                  </span>
                  <div className="mt-2">
                    <span className="block font-sans text-xs font-semibold text-[#0D1B2A]">
                      {stat.label}
                    </span>
                    <span className="text-[10px] font-sans text-[#5C6470] mt-0.5 block leading-tight hidden sm:block">
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
