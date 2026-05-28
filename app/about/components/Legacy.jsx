"use client";

export default function Legacy() {
  return (
    <section className="about-legacy-section" aria-labelledby="legacy-title">
      <div className="legacy-grid">
        <div className="legacy-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=760&q=75"
            alt="A modern, glass-walled boardroom prepared for policy conferences"
            width="760"
            height="430"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="legacy-content">
          <span className="rule" aria-hidden="true" />
          <h2 id="legacy-title">A Legacy of Intellectual Rigor</h2>
          <p>
            The Athena Institute for Political Praxis (AIPP) stands at the intersection of
            academic excellence and real-world impact. Founded on the principle that political
            knowledge must be actionable, we specialize in the unique challenges and
            opportunities facing women's leadership globally.
          </p>
          <p>
            Our approach is deeply rooted in the "praxis"—the practical application of political
            theory. By providing the tools for literacy, advocacy, and active governance, we
            ensure that the next generation of global leaders is not just prepared, but powered
            to redefine the structures of power.
          </p>
        </div>
      </div>
    </section>
  );
}
