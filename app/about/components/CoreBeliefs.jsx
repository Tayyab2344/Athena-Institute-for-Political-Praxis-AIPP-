"use client";

const beliefs = [
  {
    num: "01",
    title: "The Power of Praxis",
    text: "Theory without action is stagnant; action without theory is aimless. We balance the synthesis of both to create enduring political value.",
  },
  {
    num: "02",
    title: "Equitable Systems",
    text: "We believe that a truly democratic society is impossible without the full, uncompromised participation of women at every level of decision-making.",
  },
];

export default function CoreBeliefs() {
  return (
    <section className="about-beliefs-section" aria-labelledby="beliefs-title">
      <div className="beliefs-header">
        <h2 id="beliefs-title">Our Core Beliefs</h2>
        <p>The foundation values that guide every research initiative, partnership, and research project at the institute.</p>
      </div>

      <div className="beliefs-grid">
        {beliefs.map((belief) => (
          <article key={belief.num} className="belief-card">
            <span className="belief-number" aria-hidden="true">
              {belief.num}
            </span>
            <div className="belief-content">
              <h3>{belief.title}</h3>
              <p>{belief.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
