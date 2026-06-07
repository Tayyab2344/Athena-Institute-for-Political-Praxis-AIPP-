const columns = [
  {
    title: "Resources",
    links: [
      { label: "Research Archive", href: "/research" },
      { label: "Policy Papers", href: "/archive" },
      { label: "Annual Report", href: "/about" },
      { label: "Digital Library", href: "/writings" },
    ],
  },
  {
    title: "Institutional",
    links: [
      { label: "About AIPP", href: "/about" },
      { label: "Board of Directors", href: "/about" },
      { label: "Advisory Council", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about">
          <strong>AIPP</strong>
          <p>
            The Athena Institute for Political Praxis is dedicated to advancing political
            leadership and institutional reform.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2>{column.title}</h2>
            {column.links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <small>© 2026 Athena Institute for Political Praxis. All rights reserved.</small>
    </footer>
  );
}
