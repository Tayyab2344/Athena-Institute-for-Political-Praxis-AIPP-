export default function CoreBenefits() {
  const benefits = [
    {
      title: "Knowledge Exchange",
      desc: "Direct access to AIPP's proprietary political frameworks and academic archives.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
    {
      title: "Institutional Visibility",
      desc: "Co-branding research journal material, governance workshops and policy panels.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 22h18M6 18V9h12v9M4 9h16M12 2L4 6h16z" />
        </svg>
      )
    },
    {
      title: "Joint Research",
      desc: "Collaborative white papers and deep-dive analysis on geopolitical shifts.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 2v7.5M14 2v7.5M8.5 6h7M16 11.5c1.8 1.8 3 4.2 3 7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2c0-2.8 1.2-5.2 3-7" />
        </svg>
      )
    },
    {
      title: "Network Expansion",
      desc: "Connections to a global consortium of political innovators and thinkers.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l3 6 7 1-5 5 1.5 7-6.5-3.5L6 21.5l1.5-7-5-5 7-1z" />
        </svg>
      )
    },
    {
      title: "Strategic Impact",
      desc: "Translate theoretical research into actionable policy frameworks for governance.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      )
    },
    {
      title: "Leadership Development",
      desc: "Exclusive seminars and mentorship programs for aspiring political leaders.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm-3 3l-1.5 5 4.5-2.5 4.5 2.5-1.5-5" />
        </svg>
      )
    }
  ];

  return (
    <section className="benefits-section" aria-labelledby="benefits-title">
      <div className="benefits-container">
        <h2 id="benefits-title" className="benefits-heading">
          Core Benefits
        </h2>
        <p className="benefits-subtitle">
          Investing global resources through reciprocal engagement.
        </p>

        <div className="benefits-grid">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="benefit-card">
              <div className="benefit-icon-wrapper">{benefit.icon}</div>
              <h3 className="benefit-card-title">{benefit.title}</h3>
              <p className="benefit-card-desc">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
