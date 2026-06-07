export default function WhyCollaborate() {
  const points = [
    { num: "01", title: "Shared Knowledge" },
    { num: "02", title: "Research Collaboration" },
    { num: "03", title: "Policy Innovation" },
    { num: "04", title: "Public Advocacy" },
    { num: "05", title: "Leadership Development" },
  ];

  return (
    <section className="why-collaborate-section" aria-labelledby="why-collaborate-title">
      <div className="why-collaborate-container">
        <div className="why-collaborate-left">
          <h2 id="why-collaborate-title" className="why-collaborate-heading">
            Why Collaborate With AIPP
          </h2>
        </div>
        <div className="why-collaborate-right">
          <ul className="why-collaborate-list" aria-label="Reasons to collaborate">
            {points.map((pt, idx) => (
              <li key={idx} className="why-collaborate-item">
                <span className="why-collaborate-num">{pt.num}</span>
                <h3 className="why-collaborate-text">{pt.title}</h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
