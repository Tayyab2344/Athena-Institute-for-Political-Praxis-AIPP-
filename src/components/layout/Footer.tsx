"use client";

import { ArrowUpRight, Globe, Mail, Share2, ExternalLink } from "lucide-react";

interface FooterProps {
  onOpenContact: (pathway?: string) => void;
}

export default function Footer({ onOpenContact }: FooterProps) {
  return (
    <footer className="bg-[#1A1817] text-[#FAF8F5] pt-20 pb-12 border-t border-[#FAF8F5]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#FAF8F5]/10">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#4A121A] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-xs">
                A
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF8F5]">
                AIPP
              </span>
            </div>

            <p className="text-xs font-sans text-[#FAF8F5]/70 font-light leading-relaxed max-w-sm">
              The Athena Institute for Political Praxis is a non-partisan international policy institute elevating women in diplomacy, research, strategic action, and public advocacy.
            </p>

            <div className="flex items-center gap-3 text-xs font-sans text-[#FAF8F5]/60 pt-2">
              <a
                href="#"
                className="p-2.5 rounded-full border border-[#FAF8F5]/20 hover:border-[#FAF8F5] hover:text-[#FAF8F5] transition-colors"
                aria-label="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full border border-[#FAF8F5]/20 hover:border-[#FAF8F5] hover:text-[#FAF8F5] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full border border-[#FAF8F5]/20 hover:border-[#FAF8F5] hover:text-[#FAF8F5] transition-colors"
                aria-label="Website"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => onOpenContact("General Inquiry")}
                className="p-2.5 rounded-full border border-[#FAF8F5]/20 hover:border-[#FAF8F5] hover:text-[#FAF8F5] transition-colors"
                aria-label="Email Contact"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#A8656C]">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#FAF8F5]/80 font-light">
              <li><a href="#about" className="hover:text-[#FAF8F5] transition-colors">About AIPP</a></li>
              <li><a href="#pillars" className="hover:text-[#FAF8F5] transition-colors">What We Offer</a></li>
              <li><a href="#research" className="hover:text-[#FAF8F5] transition-colors">Research Archive</a></li>
              <li><a href="#programs" className="hover:text-[#FAF8F5] transition-colors">Strategic Programs</a></li>
              <li><a href="#insights" className="hover:text-[#FAF8F5] transition-colors">Insights & Media</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#A8656C]">
              Get Involved
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#FAF8F5]/80 font-light">
              <li>
                <button onClick={() => onOpenContact("Volunteer")} className="hover:text-[#FAF8F5] transition-colors text-left">
                  Volunteer Opportunities
                </button>
              </li>
              <li>
                <button onClick={() => onOpenContact("Contribute")} className="hover:text-[#FAF8F5] transition-colors text-left">
                  Research Contributor
                </button>
              </li>
              <li>
                <button onClick={() => onOpenContact("Collaborate")} className="hover:text-[#FAF8F5] transition-colors text-left">
                  Institutional Collaboration
                </button>
              </li>
              <li>
                <button onClick={() => onOpenContact("General Inquiry")} className="hover:text-[#FAF8F5] transition-colors text-left">
                  Contact Taskforce
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#A8656C]">
              Research & Policy
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#FAF8F5]/80 font-light">
              <li><a href="#research" className="hover:text-[#FAF8F5] transition-colors">Peer-Reviewed Papers</a></li>
              <li><a href="#research" className="hover:text-[#FAF8F5] transition-colors">Diplomatic Policy Briefs</a></li>
              <li><a href="#research" className="hover:text-[#FAF8F5] transition-colors">AIPP Security Journals</a></li>
              <li><a href="#research" className="hover:text-[#FAF8F5] transition-colors">Annual Institutional Reports</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-[#FAF8F5]/50 gap-4">
          <p>© {new Date().getFullYear()} Athena Institute for Political Praxis (AIPP). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#FAF8F5] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FAF8F5] transition-colors">Terms of Governance</a>
            <a href="#" className="hover:text-[#FAF8F5] transition-colors">Accessibility Statement</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
