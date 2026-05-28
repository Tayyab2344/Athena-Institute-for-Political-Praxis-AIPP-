const columns = [
  {
    title: "Resources",
    links: ["Research Archive", "Policy Papers", "Annual Report", "Digital Library"],
  },
  {
    title: "Institutional",
    links: ["About AIPP", "Board of Directors", "Advisory Council", "Contact Us"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
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
              <a key={link} href="#top">
                {link}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <small>© 2026 Athena Institute for Political Praxis. All rights reserved.</small>
    </footer>
  );
}
