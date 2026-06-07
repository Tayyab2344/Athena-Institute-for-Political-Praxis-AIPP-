"use client";

import { usePathname } from "next/navigation";

export default function HeaderArchive({ onSearchChange, searchQuery }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Research", href: "/research" },
    { label: "Strategy", href: "/sas" },
    { label: "Labs", href: "/cpa" },
    { label: "Archive", href: "/archive" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="archive-site-header">
      <div className="header-left">
        <a className="archive-brand-mark" href="/">
          AIPP
        </a>
      </div>

      <nav className="archive-primary-nav" aria-label="Archive navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`archive-nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="header-right">
        <div className="archive-search-container">
          <svg
            className="archive-search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="archive-header-search"
            placeholder="Search archive..."
            value={searchQuery || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
        <a className="archive-contact-button" href="/#join">
          Contact
        </a>
      </div>
    </header>
  );
}
