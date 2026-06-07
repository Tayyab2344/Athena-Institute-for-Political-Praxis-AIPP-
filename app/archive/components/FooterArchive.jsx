"use client";

export default function FooterArchive() {
  const footerColumns = [
    {
      title: "Institutional",
      links: [
        { label: "Mission Statement", href: "#mission" },
        { label: "Governance Framework", href: "#governance" },
        { label: "Research Ethics", href: "#ethics" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Cookie Policy", href: "#cookies" },
        { label: "Open Access Policy", href: "#open-access" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Institutional Contact", href: "#contact-inst" },
        { label: "Press & Media", href: "#press" },
        { label: "Press Office", href: "#press-office" },
      ],
    },
  ];

  return (
    <footer className="archive-site-footer">
      <div className="footer-top-row">
        {/* Brand column */}
        <div className="footer-brand-column">
          <span className="footer-brand-logo">AIPP</span>
          <p className="footer-brand-text">
            Strategic foresight for a changing world. The Athena Institute for Political Praxis is a
            non-partisan research organization dedicated to the study of governance and institutional
            reform.
          </p>
        </div>

        {/* Links columns */}
        <div className="footer-links-wrapper">
          {footerColumns.map((col, idx) => (
            <div key={idx} className="footer-links-column">
              <h4 className="footer-column-title">{col.title}</h4>
              <ul className="footer-column-list">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href={link.href} className="footer-column-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom-row">
        <span className="footer-copyright">
          © 2026 Athena Institute for Political Praxis. All rights reserved.
        </span>
        <span className="footer-newsletter-text">
          Subscribe to the weekly newsletter to receive our annual summary and policy papers.
        </span>
      </div>
    </footer>
  );
}
