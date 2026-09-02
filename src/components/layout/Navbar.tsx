"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/data/mockData";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenContact: () => void;
}

export default function Navbar({ onOpenContact }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#4A121A]/10 py-4 shadow-sm"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a
          href="#"
          className="group flex items-center gap-3 text-[#1A1817] focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full border border-[#4A121A] flex items-center justify-center bg-[#4A121A] text-[#FAF8F5] text-xs font-serif font-bold tracking-wider group-hover:scale-105 transition-transform duration-300">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-tight font-bold text-[#4A121A]">
              AIPP
            </span>
            <span className="text-[9px] tracking-[0.22em] uppercase text-[#5C5755] font-sans font-medium -mt-1">
              Political Praxis
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#1A1817]/80 hover:text-[#4A121A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#4A121A] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <button
            onClick={onOpenContact}
            className="group px-5 py-2.5 rounded-full border border-[#4A121A]/30 text-[#4A121A] hover:bg-[#4A121A] hover:text-[#FAF8F5] text-xs font-sans font-semibold tracking-wider transition-all duration-300 flex items-center gap-2"
          >
            <span>Contact Us</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#4A121A] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-[#FAF8F5] z-40 border-t border-[#4A121A]/10 px-8 py-10 flex flex-col justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl text-[#1A1817] hover:text-[#4A121A] transition-colors pb-3 border-b border-[#4A121A]/10 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ArrowUpRight className="w-5 h-5 opacity-40" />
              </a>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#4A121A]/10 flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-4 rounded-full bg-[#4A121A] text-[#FAF8F5] text-sm font-sans font-semibold text-center tracking-wider hover:bg-[#6A1B27] transition-colors flex items-center justify-center gap-2"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-[#5C5755] text-center font-sans">
              Athena Institute for Political Praxis
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
