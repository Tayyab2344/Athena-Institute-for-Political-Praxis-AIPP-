"use client";

const objectives = [
  {
    title: "Governance",
    text: "Advancing the principles of robust governance and institutional transparency across all levels of authority.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22h20M4 22V11m16 11V11M2 11l10-8 10 8M9 22v-8h6v8M12 3v3" />
      </svg>
    ),
  },
  {
    title: "Literacy",
    text: "Demystifying political systems through search-based education and accessible high-level curriculum.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3a1 1 0 0 1 1-1h15v20H6.5" />
      </svg>
    ),
  },
  {
    title: "Leadership",
    text: "Cultivating a network of resilient, strategic leaders equipped for the complexities of modern geopolitics.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
      </svg>
    ),
  },
  {
    title: "Research",
    text: "Conducting rigorous, data-driven research on political trends and the socio-economic status of women.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Advocacy",
    text: "Amplifying marginalized voices and championing policies that promote systemic equity and justice.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8z" />
        <path d="M18 8l4-3v14l-4-3" />
      </svg>
    ),
  },
  {
    title: "Policy",
    text: "Designing and recommending high-impact policy frameworks for international governing bodies.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function StrategicObjectives() {
  return (
    <section className="about-objectives-section" aria-labelledby="objectives-title">
      <div className="objectives-header">
        <h2 id="objectives-title">Strategic Objectives</h2>
        <p>Constant pillars of excellence designed to drive sustainable change in the political sphere.</p>
      </div>

      <div className="objectives-grid">
        {objectives.map((obj) => (
          <article key={obj.title} className="objective-card">
            <span className="objective-icon" aria-hidden="true">
              {obj.icon}
            </span>
            <h3>{obj.title}</h3>
            <p>{obj.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
