"use client";

export default function ResearchStats() {
  const stats = [
    { value: "12k+", label: "Institutional Citations" },
    { value: "84", label: "Policy Implementations" },
    { value: "140+", label: "Global Reach (Nations)" }
  ];

  return (
    <section className="research-stats-section" aria-label="Research impact metrics">
      <div className="research-stats-container">
        {stats.map((stat) => (
          <div key={stat.label} className="research-stats-metric">
            <span className="metric-value">{stat.value}</span>
            <span className="metric-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
