"use client";

const labs = [
  {
    title: "Crisis Simulations",
    desc: "Real-time response training for kinetic conflicts, humanitarian disasters, and diplomatic standoffs.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    title: "Leadership Labs",
    desc: "Executive development focusing on psychological profiling, team dynamics, and institutional influence.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18M2 22h20M9 22V9h6v13" />
      </svg>
    ),
  },
  {
    title: "Governance Exercises",
    desc: "Deep-dives into legislative procedure, public policy implementation, and regulatory hurdles.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 10l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Strategic Debates",
    desc: "Oxford-style rhetorical exercises focused on policy advocacy and narrative control.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Campaign Strategy",
    desc: "Modeling electoral dynamics, voter behavior analysis, and resource allocation in high-stakes races.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 15V9a4 4 0 0 0-4-4H9M9 18h6" />
      </svg>
    ),
  },
  {
    title: "Political Praxis Workshops",
    desc: "Intensive technical sessions on negotiation theory, mediation, and conflict resolution tactics.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
];

export default function SASPrograms() {
  return (
    <section className="sas-programs-section" id="programs" aria-labelledby="programs-title">
      <div className="programs-header">
        <h2 id="programs-title">Core Lab Programs</h2>
        <p>High-stakes environments designed to challenge conventional wisdom and build professional resilience.</p>
      </div>

      <div className="programs-grid">
        {labs.map((lab) => (
          <article key={lab.title} className="lab-card">
            <div className="lab-card-header">
              <span className="lab-icon" aria-hidden="true">
                {lab.icon}
              </span>
              <h3>{lab.title}</h3>
            </div>
            <p>{lab.desc}</p>
            <a className="lab-details-link" href="#join">
              Lab Details <span aria-hidden="true">&rarr;</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
