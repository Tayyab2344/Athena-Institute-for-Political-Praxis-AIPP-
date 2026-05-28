"use client";

export default function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="about-hero-glow" aria-hidden="true" />
      <div className="about-hero-content">
        <span className="rule" aria-hidden="true" />
        <h1 id="about-hero-title">
          About Athena Institute for<br />Political Praxis
        </h1>
        <p>
          Bridging the gap between theoretical political science and the fresh reality of
          governance. AIPP is a beacon for evidence-based leadership and strategic
          political empowerment.
        </p>
      </div>
    </section>
  );
}
