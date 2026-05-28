"use client";

export default function CPAHero() {
  return (
    <section className="cpa-hero" aria-labelledby="cpa-hero-title">
      <div className="cpa-hero-background" aria-hidden="true" />
      <div className="cpa-hero-content">
        <div className="cpa-hero-eyebrow">
          <span>Division of Communication</span>
        </div>
        <h1 id="cpa-hero-title">
          Shaping Public Discourse<br />Through Strategic<br />Communication and Advocacy
        </h1>
        <p>
          Advancing democratic integrity, dismantling misinformation, empowering
          civic voices, and redefining the narrative of political praxis in a digital age.
        </p>
        <div className="cpa-hero-actions">
          <a className="button button-gold-solid" href="#initiatives">
            Explore Initiatives
          </a>
          <a className="button button-white-outline-dark" href="#portfolio">
            Institutional Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
