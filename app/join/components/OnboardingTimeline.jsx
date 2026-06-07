export default function OnboardingTimeline() {
  const phases = [
    {
      num: "PHASE 01",
      title: "APPLICATION",
      desc: "Submission of curriculum vitae and a statement of Praxis (400 words) detailing your alignment with our methodology."
    },
    {
      num: "PHASE 02",
      title: "REVIEW",
      desc: "Review by the Fellow Committee. This process typically spans 14 business days."
    },
    {
      num: "PHASE 03",
      title: "INTRODUCTION",
      desc: "A virtual face-to-face dialogue with a Lead Strategist or Governing Fellow."
    },
    {
      num: "PHASE 04",
      title: "ONBOARDING",
      desc: "Access granted to the Archive, secure communication channels, and initial project brief."
    },
    {
      num: "PHASE 05",
      title: "ENGAGEMENT",
      desc: "Active participation in chosen research line or organizational task."
    }
  ];

  return (
    <section className="onboarding-section" aria-labelledby="onboarding-title">
      <div className="onboarding-container">
        <div className="onboarding-left">
          <h2 id="onboarding-title" className="onboarding-heading">
            Onboarding Timeline
          </h2>
          <p className="onboarding-subheading">
            Our standard process vetting process to ensure all contributors share the
            Institute&apos;s dedication to intellectual rigor and diplomatic ethics.
          </p>
        </div>

        <div className="onboarding-right">
          <div className="onboarding-timeline-list">
            {phases.map((phase, idx) => (
              <div key={idx} className="onboarding-phase-item">
                <span className="onboarding-phase-bullet" aria-hidden="true" />
                <div className="onboarding-phase-content">
                  <span className="onboarding-phase-num">
                    {phase.num}: {phase.title}
                  </span>
                  <p className="onboarding-phase-desc">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
