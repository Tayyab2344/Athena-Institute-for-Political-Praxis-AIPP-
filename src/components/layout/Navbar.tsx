"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X, ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";

/* ─────────────────────────────────────────────────────────────
   AIPP Institutional Navigation
   - Exact Desktop Order:
     AIPP Logo | About | What We Offer | Research | Programs | Get Involved | Inquire ↗
   - Single prominent Inquire CTA linking to /contact
   - Fully accessible mobile drawer with keyboard navigation
   ───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { name: "About", href: "/about" },
  { name: "What We Offer", href: "/what-we-offer" },
  { name: "Research", href: "/research" },
  { name: "Programs", href: "/programs" },
  { name: "Get Involved", href: "/get-involved" },
];

interface NavbarProps {
  onOpenContact?: () => void;
}

export default function Navbar({ onOpenContact }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock body scroll when mobile menu is open & handle Escape key */
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  /* Close mobile menu on route change */
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMobileMenuOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#D9DEE2]/80 bg-white/95 py-3 shadow-xs backdrop-blur-md"
          : "border-b border-transparent bg-white/80 py-4 sm:py-5 backdrop-blur-xs"
      }`}
    >
      <Container wide className="flex items-center justify-between">
        {/* ═══ Official AIPP Logo ═══ */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-3 text-[#081D2E] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] rounded-sm"
          aria-label="AIPP - Athena Institute for Political Praxis Home"
        >
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105 shadow-2xs">
            <Image
              src="/logo.png"
              alt="AIPP Official Logo"
              fill
              sizes="40px"
              priority
              className="object-contain"
            />
          </div>
          <span className="flex flex-col">
            <span
              className="text-xl font-bold tracking-tight text-[#0D2C49] leading-none"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              AIPP
            </span>
            <span
              className="text-[0.6875rem] font-medium tracking-wider text-[#64717C] pt-0.5"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Athena Institute for Political Praxis
            </span>
          </span>
        </Link>

        {/* ═══ Desktop Navigation & Single Inquire CTA ═══ */}
        {/* Exact Desktop Order: AIPP Logo | About | What We Offer | Research | Programs | Get Involved | Inquire ↗ */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-8">
          <nav
            className="flex items-center gap-7 xl:gap-8"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative py-1 text-[0.9375rem] font-medium transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] rounded-xs ${
                    isActive
                      ? "text-[#0D2C49] font-semibold"
                      : "text-[#243748] hover:text-[#0D2C49]"
                  }`}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>{item.name}</span>
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-0.5 bg-[#B09C4B] rounded-full transition-transform duration-250 origin-left ease-out ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Single prominent Inquire CTA button linking directly to Contact Us (/contact) */}
          <Link
            href="/contact"
            className={`group inline-flex items-center gap-2 rounded-full px-5 py-2 text-[0.9375rem] font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] shadow-xs hover:shadow-sm ${
              pathname === "/contact"
                ? "bg-[#081D2E] text-white ring-2 ring-[#B09C4B]/60"
                : "bg-[#0D2C49] text-white hover:bg-[#081D2E]"
            }`}
            style={{ fontFamily: "var(--font-sans)" }}
            aria-label="Inquire with AIPP - Contact Page"
          >
            <span>Inquire</span>
            <ArrowUpRight className="h-4 w-4 text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* ═══ Mobile Hamburger Toggle (44px min tap target) ═══ */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full p-2 text-[#0D2C49] hover:bg-[#F7F7F7] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] lg:hidden"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* ═══ Accessible Mobile Navigation Drawer ═══ */}
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-[#D9DEE2] bg-white px-6 py-8 shadow-lg lg:hidden">
          <nav
            className="flex flex-col gap-1"
            aria-label="Mobile Navigation Menu"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex min-h-[48px] items-center justify-between border-b border-[#F7F7F7] py-3 text-lg font-medium transition-all ${
                    isActive
                      ? "text-[#0D2C49] font-semibold pl-1"
                      : "text-[#081D2E] hover:text-[#0D2C49] hover:pl-1"
                  }`}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <span>{item.name}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#B09C4B]" />
                </Link>
              );
            })}

            {/* Single prominent Inquire CTA button navigating to /contact */}
            <div className="pt-6">
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full py-3 text-base font-semibold shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B09C4B] ${
                  pathname === "/contact"
                    ? "bg-[#081D2E] text-white ring-2 ring-[#B09C4B]/60"
                    : "bg-[#0D2C49] text-white hover:bg-[#081D2E]"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span>Inquire</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
