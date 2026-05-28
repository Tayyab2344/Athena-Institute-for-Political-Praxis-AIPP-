"use client";

const pillars = [
  {
    title: "Governance Studies",
    desc: "Analyzing the structural integrity of executive and legislative functions in modern states.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18M2 22h20M9 22V9h6v13" />
      </svg>
    ),
  },
  {
    title: "Democratic Systems",
    desc: "Investigating electoral mechanics and the preservation of democratic norms in digital spaces.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Public Policy",
    desc: "Designing adaptive regulatory frameworks for emerging sectors and global trade.",
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
    title: "Political Innovation",
    desc: "Exploring novel participation models and decentralized governance technologies.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37-1 8.87 1.4 10.06 5.69" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    title: "Civic Structures",
    desc: "Mapping the evolution of non-governmental institutions and local community resilience.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6h14M21 21V10M3 21V10M12 10v11" />
      </svg>
    ),
  },
  {
    title: "Institutional Analysis",
    desc: "Critical evaluation of international bureaucratic efficiency and inter-agency cooperation.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function RPIPillars() {
  return (
    <section className="rpi-pillars-section" aria-labelledby="pillars-title">
      <div className="pillars-header">
        <h2 id="pillars-title">Pillars of Inquiry</h2>
        <p>Core disciplines driving our strategic research agenda.</p>
      </div>

      <div className="pillars-grid">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="pillar-card">
            <span className="pillar-icon" aria-hidden="true">
              {pillar.icon}
            </span>
            <h3>{pillar.title}</h3>
            <p>{pillar.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
