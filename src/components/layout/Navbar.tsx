"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import OfferMegaMenu from "@/components/what-we-offer/OfferMegaMenu";
import OfferMobileAccordion from "@/components/what-we-offer/OfferMobileAccordion";

/* ─────────────────────────────────────────────────────────────
   Navigation links — "What We Offer" is handled separately
   for mega-menu / accordion treatment.
   ───────────────────────────────────────────────────────────── */
const PLAIN_LINKS = [
  { name: "About", href: "/about" },
  { name: "Research", href: "/research" },
  { name: "Programs", href: "/#programs" },
  { name: "Insights", href: "/#insights" },
  { name: "Get Involved", href: "/#get-involved" },
];

interface NavbarProps {
  onOpenContact: () => void;
}

export default function Navbar({ onOpenContact }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
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

  /* Close mega menu & mobile menu on route change */
  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const closeMegaMenu = useCallback(() => setMegaMenuOpen(false), []);

  const isOfferActive = pathname.startsWith("/what-we-offer");

  return (
    <header
      className={`nav-enter fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,padding,box-shadow] duration-500 ${
        scrolled
          ? "border-border bg-background/95 py-3.5 sm:py-4 shadow-sm backdrop-blur-md"
          : "border-transparent bg-transparent py-4 sm:py-6"
      }`}
    >
      <Container wide className="flex items-center justify-between">
        {/* ═══ Logo ═══ */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2.5 sm:gap-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary font-serif text-xs sm:text-sm font-bold text-background transition-transform duration-300 group-hover:scale-105">
            A
          </span>
          <span className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold text-primary leading-tight">
              AIPP
            </span>
            <span className="type-caption -mt-0.5 text-[0.625rem] sm:text-[0.6875rem]">
              Political Praxis
            </span>
          </span>
        </Link>

        {/* ═══ Desktop Navigation ═══ */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          {/* Plain links */}
          {PLAIN_LINKS.slice(0, 1).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative py-1 type-label text-foreground/75 transition-colors hover:text-primary"
            >
              {link.name}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}

          {/* What We Offer — mega-menu trigger */}
          <div
            className="relative"
            onMouseEnter={() => setMegaMenuOpen(true)}
          >
            <button
              type="button"
              className={`group relative py-1 type-label transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isOfferActive ? "text-primary font-semibold" : "text-foreground/75"
              }`}
              onClick={() => setMegaMenuOpen((prev) => !prev)}
              aria-expanded={megaMenuOpen}
              aria-haspopup="true"
            >
              What We Offer
              <span
                className={`absolute inset-x-0 bottom-0 h-px origin-left bg-primary transition-transform duration-300 ${
                  isOfferActive || megaMenuOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>
          </div>

          {/* Remaining plain links */}
          {PLAIN_LINKS.slice(1).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative py-1 type-label text-foreground/75 transition-colors hover:text-primary"
            >
              {link.name}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* ═══ Desktop Contact Button ═══ */}
        <div className="hidden lg:flex">
          <Button variant="outline" size="sm" onClick={onOpenContact}>
            Contact us <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* ═══ Mobile Menu Toggle ═══ */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full p-2 text-primary transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* ═══ Desktop Mega Menu ═══ */}
      <OfferMegaMenu isOpen={megaMenuOpen} onClose={closeMegaMenu} />

      {/* ═══ Mobile Menu ═══ */}
      {mobileMenuOpen ? (
        <div className="absolute inset-x-0 top-full max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-border bg-background px-4 sm:px-6 py-6 sm:py-8 shadow-[var(--shadow-soft)] lg:hidden touch-scroll">
          <nav
            className="aipp-container flex flex-col gap-3 sm:gap-4"
            aria-label="Mobile navigation"
          >
            {/* About */}
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="flex min-h-[44px] items-center justify-between border-b border-border py-3 font-serif text-xl sm:text-2xl text-foreground transition-colors hover:text-primary"
            >
              <span>About</span>
              <ArrowUpRight className="h-5 w-5 text-primary/60" />
            </Link>

            {/* What We Offer — Accordion */}
            <div className="border-b border-border pb-1">
              <OfferMobileAccordion onNavigate={closeMobileMenu} />
            </div>

            {/* Remaining links */}
            {PLAIN_LINKS.slice(1).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className="flex min-h-[44px] items-center justify-between border-b border-border py-3 font-serif text-xl sm:text-2xl text-foreground transition-colors hover:text-primary"
              >
                <span>{link.name}</span>
                <ArrowUpRight className="h-5 w-5 text-primary/60" />
              </Link>
            ))}

            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                closeMobileMenu();
                onOpenContact();
              }}
              className="mt-3 w-full min-h-[48px]"
            >
              Contact us <ArrowUpRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
