"use client";

export default function CPAParticipation() {
  return (
    <section className="cpa-participation-section" aria-labelledby="participation-title">
      <div className="cpa-participation-grid">
        <div className="participation-left">
          <div className="participation-image-wrapper">
            <img
              className="participation-image"
              src="https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=600&q=75"
              alt="Monochrome view of auditorium seating facing a stage"
              loading="lazy"
            />
            <div className="participation-impact-card">
              <span className="impact-tag">Outreach Impact</span>
              <span className="impact-number">4.2M+</span>
              <p className="impact-desc">
                Global citizens reached through our 2026 Digital Democracy campaign.
              </p>
            </div>
          </div>
        </div>

        <div className="participation-right">
          <span className="rule" aria-hidden="true" />
          <h2 id="participation-title">Fostering Democratic Participation</h2>
          <p className="participation-lead">
            Participation is the lifeblood of praxis. We move beyond theoretical frameworks to
            actively engage with communities on the ground, utilizing modern digital tools to
            amplify marginalized voices.
          </p>
          <ul className="participation-bullets" aria-label="Democratic initiatives">
            <li>
              <span>Digital Equity Frameworks for Civic Advocacy</span>
            </li>
            <li>
              <span>Cross-National Dialogue on Civic Identity</span>
            </li>
            <li>
              <span>Ethical Standards for Political Messaging</span>
            </li>
          </ul>
          <div className="participation-action">
            <a className="outreach-link" href="#outreach">
              Join our Outreach Networks <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
