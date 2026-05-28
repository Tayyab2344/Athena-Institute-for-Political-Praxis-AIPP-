"use client";

export default function PracticalEngagement() {
  return (
    <section className="about-engagement-section" aria-labelledby="engagement-title">
      <div className="engagement-grid">
        <div className="engagement-quote-card">
          <span className="quote-mark" aria-hidden="true">“</span>
          <blockquote>
            "The Academy must not be a tower of ivory, but a workshop for the future. True praxis
            happens when theory meets the friction of reality."
          </blockquote>
          <cite>— Director's Statement</cite>
        </div>

        <div className="engagement-content">
          <h2 id="engagement-title">The Necessity of Practical Engagement</h2>
          <p>
            At AIPP, we do not merely study power; we shape the navigation of its nuances.
            Our "Practical Engagement" module places students and researchers at the heart of
            active legislative cycles, international summits, and local government labs.
          </p>
          <ul className="engagement-list">
            <li>Integrative legislative drafting and simulation environments.</li>
            <li>Strategic networking with active leaders to build local solutions.</li>
            <li>Direct involvement in the drafting of white papers for international NGOs.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
