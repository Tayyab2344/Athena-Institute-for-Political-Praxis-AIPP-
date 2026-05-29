"use client";

import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "What We Offer", href: "#what-we-offer", isDropdown: true },
  { label: "Publications", href: "/#publications" },
  { label: "Partnerships", href: "/#partners" },
  { label: "Join Us", href: "/#join" },
];

const divisions = [
  {
    title: "SAS",
    desc: "Political simulations, governance exercises, leadership labs, and strategic praxis learning.",
    href: "/sas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "RPI",
    desc: "Policy research, governance analysis, think tank initiatives, and strategic institutional studies.",
    href: "/rpi",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: "CPA",
    desc: "Advocacy campaigns, civic engagement, public discourse, and political communication initiatives.",
    href: "/cpa",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateHeader = () => {
      setIsScrolled(window.scrollY > 24);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? "site-header-scrolled" : ""}`}>
      <a className="brand-mark" href="/" aria-label="AIPP home">
        <img src="/logo.png" alt="AIPP" width="72" height="72" />
        <span aria-hidden="true" />
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        {navItems.map((item, index) => {
          if (item.isDropdown) {
            return (
              <div
                key={item.label}
                className="nav-dropdown-container"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="nav-dropdown-trigger"
                  aria-expanded={isDropdownOpen}
                >
                  {item.label}
                  <svg className={`trigger-caret ${isDropdownOpen ? "caret-active" : ""}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className={`mega-menu-wrapper ${isDropdownOpen ? "mega-menu-open" : ""}`}>
                  <div className="mega-menu-inner">
                    {divisions.map((div) => (
                      <a key={div.title} href={div.href} className="mega-card">
                        <span className="mega-card-icon">{div.icon}</span>
                        <div className="mega-card-content">
                          <h3>{div.title}</h3>
                          <p>{div.desc}</p>
                        </div>
                        <span className="mega-card-arrow" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <a key={item.href} href={item.href} className={index === navItems.length - 1 ? "has-caret" : ""}>
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="nav-actions">
        <a className="contact-button" href="#join">
          Contact Us
          <span aria-hidden="true">-&gt;</span>
        </a>
      </div>

      <details
        className="mobile-menu"
        open={isMobileMenuOpen}
        onToggle={(e) => setIsMobileMenuOpen(e.target.open)}
      >
        <summary aria-label="Open menu">
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile navigation">
          {navItems.map((item) => {
            if (item.isDropdown) {
              return (
                <div key={item.label} className="mobile-dropdown-container">
                  <button
                    type="button"
                    className="mobile-dropdown-trigger"
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    aria-expanded={isMobileDropdownOpen}
                  >
                    {item.label}
                    <svg className={`mobile-trigger-caret ${isMobileDropdownOpen ? "caret-active" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className={`mobile-accordion ${isMobileDropdownOpen ? "accordion-open" : ""}`}>
                    {divisions.map((div) => (
                      <a
                        key={div.title}
                        href={div.href}
                        className="mobile-mega-card"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="mobile-mega-card-header">
                          <span className="mobile-mega-card-icon">{div.icon}</span>
                          <h4>{div.title}</h4>
                        </div>
                        <p>{div.desc}</p>
                        <span className="mobile-mega-card-arrow">
                          Explore Division &rarr;
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
          <a href="#join" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </a>
        </nav>
      </details>
    </header>
  );
}
