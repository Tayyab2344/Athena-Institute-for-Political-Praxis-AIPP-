export default function ValuesOfEngagement() {
  const values = [
    {
      title: "Political Learning",
      desc: "Deep immersion into geopolitical frameworks and contemporary political theory through exclusive seminar access.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10M6 10h10" />
        </svg>
      )
    },
    {
      title: "Research Exposure",
      desc: "Collaborative opportunities on high-stakes white papers and policy briefs with leading international scholars.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 22h18M6 18V9h12v9M4 9h16M12 2L4 6h16z" />
        </svg>
      )
    },
    {
      title: "Professional Development",
      desc: "Strategic mentorship focusing on institutional leadership, diplomacy, and high-level communications.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      title: "Leadership Growth",
      desc: "Pathways to governing governance roles within the institution across practical laboratories.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      title: "Strategic Thinking",
      desc: "Advanced training in scenario planning, risk assessment, and long-term political forecasting.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M16.2 7.8l-2 4.4-4.4 2 2-4.4 4.4-2z" />
        </svg>
      )
    },
    {
      title: "Intellectual Community",
      desc: "Access to a restricted forum for exchange between academics, diplomats, and policy practitioners.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="4" r="2" />
          <circle cx="12" cy="20" r="2" />
          <circle cx="4" cy="12" r="2" />
          <circle cx="20" cy="12" r="2" />
          <path d="M12 6v4M12 14v4M6 12h4M14 12h4" />
        </svg>
      )
    }
  ];

  return (
    <section className="join-values-section" aria-labelledby="join-values-title">
      <div className="join-values-container">
        <h2 id="join-values-title" className="join-values-heading">
          Values of Engagement
        </h2>

        <div className="join-values-grid">
          {values.map((val, idx) => (
            <div key={idx} className="join-value-card">
              <div className="join-value-icon-wrapper">{val.icon}</div>
              <h3 className="join-value-card-title">{val.title}</h3>
              <p className="join-value-card-desc">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
