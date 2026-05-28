"use client";

const principles = [
  {
    title: "Integrity",
    text: "Unwavering commitment to truth and ethical conduct.",
  },
  {
    title: "Inclusivity",
    text: "Fostering diverse perspectives for a more robust discourse.",
  },
  {
    title: "Rigor",
    text: "Methodical, evidence-based research and analytical processes.",
  },
  {
    title: "Innovation",
    text: "Pioneering new methodologies for political engagement.",
  },
];

export default function OperativePrinciples() {
  return (
    <section className="about-principles-section" aria-labelledby="principles-title">
      <div className="principles-header">
        <h2 id="principles-title">Operative Principles</h2>
      </div>

      <div className="principles-grid">
        {principles.map((p) => (
          <article key={p.title} className="principle-card">
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
