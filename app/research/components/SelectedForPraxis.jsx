"use client";

export default function SelectedForPraxis() {
  const cards = [
    {
      id: "praxis-1",
      tag: "High Impact",
      title: "The Architecture of Post-Dollar Diplomacy",
      text: "A foundational text on the restructuring of global trade settlements in a multipolar currency environment.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
        </svg>
      )
    },
    {
      id: "praxis-2",
      tag: "Strategic Foresight",
      title: "Planetary Governance: The 2040 Charter",
      text: "Drafting the protocols for resource allocation and climate mitigation under a unified institutional framework.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
        </svg>
      )
    },
    {
      id: "praxis-3",
      tag: "Institutional Reform",
      title: "AI-Led Jurisprudence: Ethical Guardrails",
      text: "Establishing the legal precedents for autonomous decision-support systems in public administration.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    }
  ];

  return (
    <section className="praxis-spotlight-section" aria-labelledby="praxis-spotlight-title">
      <div className="praxis-spotlight-header">
        <div className="praxis-spotlight-title-group">
          <span className="praxis-spotlight-eyebrow">Curator Selection</span>
          <h2 id="praxis-spotlight-title">Selected for Praxis</h2>
        </div>
        <p className="praxis-spotlight-desc">
          Essential reading for institutional leaders and policy architects selected by our board.
        </p>
      </div>

      <div className="praxis-spotlight-grid">
        {cards.map((card) => (
          <article key={card.id} className="praxis-spotlight-card">
            <div className="praxis-card-header">
              <span className="praxis-card-tag">{card.tag}</span>
              <span className="praxis-card-icon" aria-hidden="true">{card.icon}</span>
            </div>
            <div className="praxis-card-body">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
            <div className="praxis-card-footer">
              <a 
                className="praxis-card-link" 
                href={`/research/selected/${card.id}`}
                onClick={(e) => e.preventDefault()}
              >
                Access Document
                <span className="praxis-link-arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
