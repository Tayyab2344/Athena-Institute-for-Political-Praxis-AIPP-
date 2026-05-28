"use client";

export default function FellowshipCTA() {
  return (
    <section className="about-cta-section" aria-labelledby="cta-title">
      <div className="cta-container">
        <span className="rule-center" aria-hidden="true" />
        <h2 id="cta-title">Excellence is not an act, but a habit of rigorous Praxis.</h2>
        <p>Join a movement dedicated to the intellectual revolution of the political arena.</p>
        <div className="cta-action">
          <a className="button button-gold-outline" href="mailto:fellowship@aipp.org">
            Inquire About Fellowship
          </a>
        </div>
      </div>
    </section>
  );
}
