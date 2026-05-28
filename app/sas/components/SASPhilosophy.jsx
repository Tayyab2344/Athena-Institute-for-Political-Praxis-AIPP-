"use client";

export default function SASPhilosophy() {
  return (
    <section className="sas-philosophy-section" aria-labelledby="philosophy-title">
      <div className="sas-philosophy-grid">
        <div className="philosophy-left">
          <span className="rule" aria-hidden="true" />
          <h2 id="philosophy-title">The Philosophy of Practical Praxis</h2>
          <span className="philosophy-tag">Theory in the Real Era</span>
        </div>

        <div className="philosophy-right">
          <p className="philosophy-lead">
            At the Academy of International Political Praxis, we believe that leadership is not merely
            studied—it is forged. The Strategic Action & Simulation (SAS) division serves as the
            bridge between theoretical geopolitical analysis and the visceral pressure of executive
            decision-making.
          </p>

          <div className="philosophy-features-grid">
            <div className="philosophy-feature-card">
              <h3>Governance Education</h3>
              <p>
                Moving beyond the lecture hall, our programs immerse participants in the
                complexities of institutional stability and legislative maneuvering.
              </p>
            </div>
            <div className="philosophy-feature-card">
              <h3>Simulation-Based Learning</h3>
              <p>
                Utilizing proprietary algorithmic models and role-playing architectures to
                stress-test political strategies in a controlled yet volatile environment.
              </p>
            </div>
          </div>

          <p className="philosophy-body">
            Our pedagogy is rooted in "Cognitive Governance"—the study of how leaders perceive threats
            and opportunities under extreme stress. By replicating the atmosphere of a crisis room,
            we empower the next generation of global leaders to refine their instincts and master
            the art of the strategic pivot.
          </p>
        </div>
      </div>
    </section>
  );
}
