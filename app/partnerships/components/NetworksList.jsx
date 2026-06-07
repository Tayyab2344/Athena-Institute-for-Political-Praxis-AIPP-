export default function NetworksList() {
  const orgNetworks = [
    "Universities",
    "NGOs",
    "Think Tanks",
    "Research Institutes",
    "Philanthropic Organizations",
    "Civic Networks"
  ];

  const indFellows = [
    "Researchers",
    "Students",
    "Academics",
    "Policy Experts",
    "Writers",
    "Governors and Mentors"
  ];

  return (
    <section className="networks-section" aria-label="Our Networks">
      <div className="networks-container">
        <div className="networks-column">
          <h3 className="networks-column-title">Organizational Networks</h3>
          <div className="networks-pills-container">
            {orgNetworks.map((item) => (
              <span key={item} className="network-pill">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="networks-column">
          <h3 className="networks-column-title">Individual Fellows</h3>
          <div className="networks-pills-container">
            {indFellows.map((item) => (
              <span key={item} className="network-pill">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
