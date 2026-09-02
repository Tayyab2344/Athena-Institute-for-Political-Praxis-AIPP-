import { PROGRAMS_DATA } from "@/data/mockData";
import { ArrowUpRight, Calendar, MapPin, Users } from "lucide-react";

export default function StrategicActionSection() {
  const mainProgram = PROGRAMS_DATA[0];
  const secondaryPrograms = PROGRAMS_DATA.slice(1);

  return (
    <section id="programs" className="py-28 md:py-40 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A] block mb-3">
              06.A / STRATEGIC ACTION & SIMULATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1817]">
              From diplomatic theory to <span className="italic text-[#4A121A]">strategic action</span>.
            </h2>
          </div>
          <p className="text-sm font-sans text-[#5C5755] max-w-md font-light">
            High-level crisis negotiation simulations, executive bilateral workshops, and multilateral strategic summits.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#4A121A]/10 mb-12 group min-h-[480px] flex flex-col justify-end">
          <img
            src={mainProgram.image}
            alt={mainProgram.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1817] via-[#1A1817]/60 to-transparent" />

          <div className="relative z-10 p-8 md:p-14 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/20 backdrop-blur-md border border-[#FAF8F5]/30 text-[#FAF8F5] text-xs font-sans font-semibold uppercase tracking-wider">
              <span>{mainProgram.category}</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] leading-tight">
              {mainProgram.title}
            </h3>

            <p className="text-sm sm:text-base font-sans text-[#FAF8F5]/80 font-light leading-relaxed">
              {mainProgram.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-sans text-[#FAF8F5]/90 pt-2 border-t border-[#FAF8F5]/20">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A8656C]" />
                <span>{mainProgram.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#A8656C]" />
                <span>{mainProgram.dates}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#A8656C]" />
                <span>{mainProgram.participants}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {secondaryPrograms.map((prog) => (
            <div
              key={prog.id}
              className="p-8 rounded-2xl bg-[#EFECE6] border border-[#4A121A]/10 hover:border-[#4A121A]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#4A121A]">
                    {prog.category}
                  </span>
                  <span className="text-xs font-sans text-[#5C5755]">
                    {prog.dates}
                  </span>
                </div>

                <h4 className="font-serif text-2xl text-[#1A1817] group-hover:text-[#4A121A] transition-colors">
                  {prog.title}
                </h4>

                <p className="text-xs font-sans text-[#5C5755] leading-relaxed font-light">
                  {prog.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#4A121A]/10 flex items-center justify-between text-xs font-sans text-[#4A121A] font-semibold">
                <span>{prog.location}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="#programs"
            onClick={(e) => {
              e.preventDefault();
              alert("Loading AIPP Strategic Programs Catalog.");
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#4A121A] text-[#FAF8F5] hover:bg-[#6A1B27] text-xs font-sans font-semibold tracking-wider transition-all duration-300 shadow-md"
          >
            <span>Explore Programs →</span>
          </a>
        </div>

      </div>
    </section>
  );
}
