import { INSIGHTS_DATA } from "@/data/mockData";
import { ArrowUpRight, Clock, User } from "lucide-react";

export default function InsightsSection() {
  const featuredArticle = INSIGHTS_DATA.find((item) => item.featured) || INSIGHTS_DATA[0];
  const sideArticles = INSIGHTS_DATA.filter((item) => item.id !== featuredArticle.id);

  return (
    <section id="insights" className="py-28 md:py-36 bg-[#EFECE6] border-y border-[#4A121A]/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#4A121A] block mb-3">
              06.B / EDITORIAL PERSPECTIVES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1817]">
              Perspectives <span className="italic text-[#4A121A]">shaping</span> the conversation.
            </h2>
          </div>
          <p className="text-sm font-sans text-[#5C5755] max-w-md font-light">
            Thought leadership, commentary, and expert analysis from ambassadors, scholars, and foreign policy practitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-3xl overflow-hidden border border-[#4A121A]/10 shadow-lg group flex flex-col justify-between">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#4A121A] text-[#FAF8F5] text-[10px] font-sans font-semibold uppercase tracking-wider">
                {featuredArticle.category}
              </div>
            </div>

            <div className="p-8 md:p-10 space-y-6">
              <div className="flex items-center gap-4 text-xs font-sans text-[#5C5755]">
                <span>{featuredArticle.date}</span>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#4A121A]" />
                  <span>{featuredArticle.readTime}</span>
                </div>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1817] group-hover:text-[#4A121A] transition-colors leading-tight">
                {featuredArticle.title}
              </h3>

              <p className="text-sm font-sans text-[#5C5755] font-light leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="pt-6 border-t border-[#4A121A]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#4A121A]/10 overflow-hidden border border-[#4A121A]/20">
                    <img
                      src={featuredArticle.avatar}
                      alt={featuredArticle.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-sans font-semibold text-[#1A1817]">
                      {featuredArticle.author}
                    </span>
                    <span className="block text-[10px] font-sans text-[#5C5755]">
                      {featuredArticle.role}
                    </span>
                  </div>
                </div>

                <a
                  href="#insights"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Reading article: ${featuredArticle.title}`);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#4A121A] text-[#FAF8F5] text-xs font-sans font-semibold hover:bg-[#6A1B27] transition-colors flex items-center gap-2"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            {sideArticles.map((art) => (
              <article
                key={art.id}
                className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#4A121A]/10 hover:border-[#4A121A]/30 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-sans">
                    <span className="text-[#4A121A] font-semibold uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span className="text-[#5C5755]">{art.readTime}</span>
                  </div>

                  <h4 className="font-serif text-xl text-[#1A1817] group-hover:text-[#4A121A] transition-colors leading-snug">
                    {art.title}
                  </h4>

                  <p className="text-xs font-sans text-[#5C5755] line-clamp-3 font-light leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#4A121A]/10 flex items-center justify-between text-xs font-sans">
                  <span className="text-[#1A1817] font-medium">{art.author}</span>
                  <a
                    href="#insights"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Reading article: ${art.title}`);
                    }}
                    className="text-[#4A121A] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>Read</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>

        </div>

        <div className="flex justify-center pt-4">
          <a
            href="#insights"
            onClick={(e) => {
              e.preventDefault();
              alert("Opening AIPP Editorial Insights Journal.");
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#4A121A]/30 text-[#4A121A] hover:bg-[#4A121A] hover:text-[#FAF8F5] text-xs font-sans font-semibold tracking-wider transition-all duration-300 shadow-sm"
          >
            <span>View Insights →</span>
          </a>
        </div>

      </div>
    </section>
  );
}
