"use client";

const labs = [
  {
    num: "01",
    title: "Decision-Making Lab",
    desc: "Optimizing municipal governance through smart data orchestration.",
  },
  {
    num: "02",
    title: "Method Handbook",
    desc: "Drafting enforceable regulatory standards for generative intelligence.",
  },
  {
    num: "03",
    title: "Democracy 2.0 Project",
    desc: "Reimagining voting systems for hyper-mobile populations.",
  },
];

export default function RPIInitiative() {
  return (
    <section className="rpi-initiative-section" aria-labelledby="initiative-title">
      <div className="rpi-initiative-grid">
        <div className="initiative-left-card">
          <span className="initiative-tag">Active Initiative</span>
          <h2 id="initiative-title">The Global Fellows Program</h2>
          <p>
            Our flagship fellowship brings together leading scholars and practitioners for six-month
            intensive residencies to solve specific policy bottlenecks.
          </p>
          <a className="button button-gold-outline-dark" href="#join">
            Apply For Fellowship
          </a>
        </div>

        <div className="initiative-right-list">
          <h3>Policy Innovation Labs</h3>
          <div className="labs-list">
            {labs.map((lab) => (
              <div key={lab.num} className="lab-item">
                <span className="lab-num">{lab.num}</span>
                <div className="lab-item-content">
                  <h4>{lab.title}</h4>
                  <p>{lab.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
