export function SectionHeader({ align = "center", eyebrow, title, action }) {
  return (
    <div className={`section-header ${align === "left" ? "section-header-left" : ""}`}>
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <div>
        <h2>
          {title}
          <span className="heading-rule" aria-hidden="true" />
        </h2>
        {action}
      </div>
    </div>
  );
}

export function ArrowLink({ children, href = "#" }) {
  return (
    <a className="arrow-link" href={href}>
      {children}
      <span aria-hidden="true">-&gt;</span>
    </a>
  );
}
