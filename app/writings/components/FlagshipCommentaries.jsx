"use client";

export default function FlagshipCommentaries() {
  const cards = [
    {
      id: "flagship-14",
      label: "EDITORIAL BOARD",
      title: "The Pax Technologica: Redefining Global Power",
      text: "A multi-year study on the shift from military strength to computational capacity as the primary metric of state influence.",
      volume: "VOLUME 14",
      styleClass: "flagship-card-navy"
    },
    {
      id: "flagship-15",
      label: "POLICY & LEGISLATION",
      title: "Algorithmic Accountability in Civil Jurisprudence",
      text: "Exploring the legal frameworks necessary to audit automated judicial assistance systems in European courts.",
      volume: "VOLUME 15",
      styleClass: "flagship-card-blue"
    },
    {
      id: "flagship-16",
      label: "POLICY BRIEF",
      title: "Sub-National Diplomacy and the New Localism",
      text: "How metropolitan city-states are increasingly bypassing national legislatures to form global trade alliances.",
      volume: "VOLUME 16",
      styleClass: "flagship-card-gold"
    }
  ];

  return (
    <section className="flagship-commentaries-section" aria-labelledby="flagship-title">
      <div className="flagship-header">
        <h2 id="flagship-title">Flagship Blogs &amp; Insights</h2>
        <span className="flagship-eyebrow">Flagship Selection</span>
      </div>

      <div className="flagship-grid">
        {cards.map((card) => (
          <article key={card.id} className={`flagship-card ${card.styleClass}`}>
            <div className="flagship-card-content">
              <span className="flagship-label">{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
            <div className="flagship-card-footer">
              <span className="flagship-volume">{card.volume}</span>
              <span className="flagship-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
