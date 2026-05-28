"use client";

const metrics = [
  { value: "124", label: "Policy Briefs" },
  { value: "15", label: "Global Summits" },
  { value: "82%", label: "Engagement" },
  { value: "40+", label: "Partnerships" },
];

export default function CPAQuote() {
  return (
    <section className="cpa-quote-section" aria-label="Director statement and metrics">
      <div className="cpa-quote-container">
        <span className="quote-eyebrow">Voices of Praxis</span>
        <span className="quote-icon" aria-hidden="true">”</span>
        <blockquote>
          "The strength of a democracy is measured not by the loudness of its voices, but by
          the integrity of its discourse. Advocacy without communication is merely noise."
        </blockquote>
        <cite>— Dr. Carlos Mendoza, Director of Public Advocacy</cite>

        <div className="cpa-metrics-grid">
          {metrics.map((m) => (
            <div key={m.label} className="metric-item">
              <span className="metric-value">{m.value}</span>
              <span className="metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
