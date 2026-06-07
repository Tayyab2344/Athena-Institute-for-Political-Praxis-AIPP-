export default function CollaborationRoadmap() {
  const steps = [
    {
      num: "01",
      title: "Submit Proposal",
      desc: "Share your vision through our preliminary survey portal."
    },
    {
      num: "02",
      title: "Review & Assessment",
      desc: "Internal evaluation by our board of fellows."
    },
    {
      num: "03",
      title: "Scope & Alignment",
      desc: "Consultation to align objectives and scope."
    },
    {
      num: "04",
      title: "Formalize Agreement",
      desc: "Preparation of agreements and resources effectively."
    },
    {
      num: "05",
      title: "Launch & Support",
      desc: "Ongoing collaboration and periodic outcome tracking.",
      highlighted: true
    }
  ];

  return (
    <section className="roadmap-section" aria-labelledby="roadmap-title">
      <div className="roadmap-container">
        <span className="roadmap-eyebrow">The Alignment Process</span>
        <h2 id="roadmap-title" className="roadmap-heading">
          Collaboration Roadmap
        </h2>

        <div className="roadmap-steps-grid">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`roadmap-step-card ${step.highlighted ? "highlighted" : ""}`}
            >
              <div className="roadmap-step-num-box">{step.num}</div>
              <h3 className="roadmap-step-title">{step.title}</h3>
              <p className="roadmap-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
