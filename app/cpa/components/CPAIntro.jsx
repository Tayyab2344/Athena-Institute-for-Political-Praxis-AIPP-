"use client";

export default function CPAIntro() {
  return (
    <section className="cpa-intro-section" aria-labelledby="cpa-intro-title">
      <div className="cpa-intro-grid">
        <div className="intro-left">
          <span className="rule" aria-hidden="true" />
          <h2 id="cpa-intro-title">The Praxis of Modern Advocacy</h2>
        </div>

        <div className="intro-right">
          <p className="intro-lead">
            The Center for Communication & Public Advocacy (CPA) operates at the intersection of
            media theory and political reality. In an era where discourse is increasingly fragmented,
            our mission is to restore the clarity of democratic communication through rigorous
            academic inquiry and high-impact strategic outreach.
          </p>
          <p className="intro-body">
            We focus on three fundamental pillars: the dismantling of weaponized narratives, the cultivation of
            civic literacy among diverse populations, and the development of ethical communication structures for
            future leaders. Our work ensures that public advocacy remains a tool for progress rather than a
            catalyst for polarization.
          </p>
        </div>
      </div>
    </section>
  );
}
