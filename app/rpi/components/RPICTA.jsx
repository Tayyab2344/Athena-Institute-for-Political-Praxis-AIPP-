"use client";

export default function RPICTA() {
  return (
    <section className="rpi-cta-section" aria-labelledby="rpi-cta-title">
      <div className="rpi-cta-container">
        <span className="rule-center" aria-hidden="true" />
        <h2 id="rpi-cta-title">Drive the Future of Policy</h2>
        <p>
          We invite academic institutions, private foundations, and governmental bodies to
          collaborate with our research teams on high-impact projects.
        </p>
        <div className="rpi-cta-actions">
          <a className="button button-navy-solid" href="#join">
            Partner With Us
          </a>
          <a className="button button-navy-outline" href="#join">
            Submit a Research Proposal
          </a>
        </div>
      </div>
    </section>
  );
}
