"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "What We Offer", href: "#what-we-offer", isDropdown: true, dropdownType: "offers" },
  { label: "Publications", href: "/#publications", isDropdown: true, dropdownType: "publications" },
  { label: "Partnerships", href: "/partnerships" },
  { label: "Join Us", href: "/join" },
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

const publicationsItems = [
  {
    title: "Blogs & Insights",
    desc: "Policy blogs, governance insights, public discourse, leadership reflections, and strategic perspectives.",
    href: "/writings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    title: "Research Papers",
    desc: "Evidence-based political research, governance analysis, policy studies, institutional assessments, and strategic recommendations.",
    href: "/research",
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
    title: "Journal",
    desc: "Academic publications, scholarly articles, peer-reviewed work, and advanced political praxis research.",
    href: "/archive",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    ),
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'offers' | 'publications' | null
  const [isMobileOffersOpen, setIsMobileOffersOpen] = useState(false);
  const [isMobilePublicationsOpen, setIsMobilePublicationsOpen] = useState(false);
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

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`site-header ${isScrolled ? "site-header-scrolled" : ""}`}>
      <a className="brand-mark" href="/" aria-label="AIPP home">
        <img src="/logo.png" alt="AIPP" width="72" height="72" />
        <span aria-hidden="true" />
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        {navItems.map((item, index) => {
          const isDropdownActive =
            (item.dropdownType === "publications" && ["/writings", "/research", "/archive"].includes(pathname)) ||
            (item.dropdownType === "offers" && ["/sas", "/rpi", "/cpa"].includes(pathname));
          if (item.isDropdown) {
            const isOpen = activeDropdown === item.dropdownType;
            return (
              <div
                key={item.label}
                className="nav-dropdown-container"
                onMouseEnter={() => setActiveDropdown(item.dropdownType)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={`nav-dropdown-trigger ${isOpen ? "open" : ""} ${isDropdownActive ? "active" : ""}`}
                  aria-expanded={isOpen}
                >
                  {item.label}
                  <svg className={`trigger-caret ${isOpen ? "caret-active" : ""}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {item.dropdownType === "offers" && (
                  <div className={`mega-menu-wrapper ${isOpen ? "mega-menu-open" : ""}`}>
                    <div className="mega-menu-inner">
                      {divisions.map((div) => (
                        <a key={div.title} href={div.href} className={`mega-card ${pathname === div.href ? "active" : ""}`}>
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
                )}

                {item.dropdownType === "publications" && (
                  <div className={`mega-menu-wrapper ${isOpen ? "mega-menu-open" : ""}`}>
                    <div className="mega-menu-inner">
                      {publicationsItems.map((pub) => (
                        <a key={pub.title} href={pub.href} className={`mega-card ${pathname === pub.href ? "active" : ""}`}>
                          <span className="mega-card-icon">{pub.icon}</span>
                          <div className="mega-card-content">
                            <h3>{pub.title}</h3>
                            <p>{pub.desc}</p>
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
                )}
              </div>
            );
          }
          const isActive = pathname === item.href;
          return (
            <a key={item.href} href={item.href} className={isActive ? "active" : ""}>
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="nav-actions">
        <a className="contact-button" href="/join">
          Contact Us
          <span aria-hidden="true">-&gt;</span>
        </a>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <button
          className="mobile-menu-trigger"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
        </button>
        <nav aria-label="Mobile navigation">
          {navItems.map((item) => {
            const isDropdownActive =
              (item.dropdownType === "publications" && ["/writings", "/research", "/archive"].includes(pathname)) ||
              (item.dropdownType === "offers" && ["/sas", "/rpi", "/cpa"].includes(pathname));
            if (item.isDropdown) {
              const isMobileOpen = item.dropdownType === "offers" ? isMobileOffersOpen : isMobilePublicationsOpen;
              const toggleMobileDropdown = () => {
                if (item.dropdownType === "offers") {
                  setIsMobileOffersOpen(!isMobileOffersOpen);
                } else {
                  setIsMobilePublicationsOpen(!isMobilePublicationsOpen);
                }
              };
              return (
                <div key={item.label} className="mobile-dropdown-container">
                  <button
                    type="button"
                    className={`mobile-dropdown-trigger ${isDropdownActive ? "active" : ""}`}
                    onClick={toggleMobileDropdown}
                    aria-expanded={isMobileOpen}
                  >
                    {item.label}
                    <svg className={`mobile-trigger-caret ${isMobileOpen ? "caret-active" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {item.dropdownType === "offers" && (
                    <div className={`mobile-accordion ${isMobileOpen ? "accordion-open" : ""}`}>
                      {divisions.map((div) => (
                        <a
                          key={div.title}
                          href={div.href}
                          className={`mobile-mega-card ${pathname === div.href ? "active" : ""}`}
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
                  )}

                  {item.dropdownType === "publications" && (
                    <div className={`mobile-accordion ${isMobileOpen ? "accordion-open" : ""}`}>
                      {publicationsItems.map((pub) => (
                        <a
                          key={pub.title}
                          href={pub.href}
                          className={`mobile-mega-card ${pathname === pub.href ? "active" : ""}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="mobile-mega-card-header">
                            <span className="mobile-mega-card-icon">{pub.icon}</span>
                            <h4>{pub.title}</h4>
                          </div>
                          <p>{pub.desc}</p>
                          <span className="mobile-mega-card-arrow">
                            Explore Publication &rarr;
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={isActive ? "active" : ""}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
          <a href="/join" className={pathname === "/join" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
