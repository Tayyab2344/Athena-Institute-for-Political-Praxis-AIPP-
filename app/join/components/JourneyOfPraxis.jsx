export default function JourneyOfPraxis() {
  const steps = [
    { num: "01", title: "JOIN", desc: "Registration & Acceptance" },
    { num: "02", title: "LEARN", desc: "Frameworks & Theory" },
    { num: "03", title: "CONTRIBUTE", desc: "Active Project Support" },
    { num: "04", title: "COLLABORATE", desc: "Synergy with authorities" },
    { num: "05", title: "LEAD", desc: "Directing Initiatives" }
  ];

  return (
    <section className="journey-section" aria-labelledby="journey-title">
      <div className="journey-container">
        <h2 id="journey-title" className="journey-heading">
          The Journey of Praxis
        </h2>

        <div className="journey-steps-wrapper">
          <div className="journey-timeline-line" aria-hidden="true" />
          <div className="journey-steps-grid">
            {steps.map((step, idx) => (
              <div key={idx} className="journey-step-card">
                <div className="journey-step-circle">{step.num}</div>
                <h3 className="journey-step-title">{step.title}</h3>
                <p className="journey-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
