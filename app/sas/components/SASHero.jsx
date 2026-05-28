"use client";

export default function SASHero() {
  return (
    <section className="sas-hero" aria-labelledby="sas-hero-title">
      <div className="sas-hero-background" aria-hidden="true" />
      <div className="sas-hero-content">
        <div className="sas-hero-eyebrow">
          <span>Strategic Action & Simulation</span>
        </div>
        <h1 id="sas-hero-title">
          Transforming Political<br />Learning Through <span className="text-gold">Strategic<br />Simulation</span>
        </h1>
        <p>
          The global epicenter for immersive governance exercises, high-stakes crisis solving,
          and the practical application of coalition politics.
        </p>
        <div className="sas-hero-actions">
          <a className="button button-gold" href="#programs">
            Explore Simulation Labs
          </a>
          <a className="button button-gold-outline-dark" href="#archives">
            View Annual Agenda
          </a>
        </div>
      </div>
    </section>
  );
}
