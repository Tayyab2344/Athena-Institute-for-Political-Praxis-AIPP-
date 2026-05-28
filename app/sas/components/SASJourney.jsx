"use client";

const steps = [
  {
    num: "01",
    title: "Analyze",
    desc: "Deep contextual immersion into the socio-political landscape and initial data sets.",
  },
  {
    num: "02",
    title: "Strategize",
    desc: "Formulating primary objectives and contingency planning within secure simulation suites.",
  },
  {
    num: "03",
    title: "Simulate",
    desc: "Engagement in the dynamic environment, testing decision skills in real-time response.",
  },
  {
    num: "04",
    title: "Respond",
    desc: "Countering of crisis management items as the simulation reactive scenarios alter.",
  },
  {
    num: "05",
    title: "Reflect",
    desc: "Post-mortem analysis and institutional debriefing to solidify learning outcomes.",
  },
];

export default function SASJourney() {
  return (
    <section className="sas-journey-section" aria-labelledby="journey-title">
      <div className="journey-container">
        <h2 id="journey-title">The Simulation Journey</h2>
        
        <div className="journey-timeline">
          <div className="timeline-line" aria-hidden="true" />
          
          {steps.map((step) => (
            <div key={step.num} className="journey-node">
              <div className="node-circle">
                <span className="node-number">{step.num}</span>
              </div>
              <div className="node-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
