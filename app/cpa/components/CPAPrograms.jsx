"use client";

const programs = [
  {
    title: "Public Campaigns",
    desc: "Designing high-impact social and political awareness initiatives that drive legislative change.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M23 9c-.27 1.3-.98 2.45-1.93 3.25" />
        <path d="M19.07 5.75c1 .8 1.7 1.95 1.93 3.25" />
        <path d="M15.5 8.5a4 4 0 0 1 0 7" />
      </svg>
    ),
  },
  {
    title: "Civic Awareness",
    desc: "Bridging the gap between institutional policy and public understanding through data-driven campaigns.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="11" r="3" />
      </svg>
    ),
  },
  {
    title: "Strategic Communication",
    desc: "Providing expert advisory on messaging architecture for NGOs, governments, and think tanks.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Political Literacy",
    desc: "Curating pedagogical resources to navigate the complexities of modern electoral systems.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: "Media Engagement",
    desc: "Analyzing and influencing media narratives to ensure accurate reporting of public affairs.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
        <line x1="6" y1="18" x2="18" y2="18" />
        <line x1="6" y1="14" x2="18" y2="14" />
        <line x1="6" y1="10" x2="10" y2="10" />
        <line x1="14" y1="6" x2="18" y2="6" />
        <line x1="14" y1="10" x2="18" y2="10" />
        <rect x="6" y="6" width="4" height="4" />
      </svg>
    ),
  },
  {
    title: "Public Dialogue",
    desc: "Creating safe spaces for deliberative discourse between conflicting stakeholder groups.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
];

export default function CPAPrograms() {
  return (
    <section className="cpa-programs-section" aria-labelledby="programs-title">
      <div className="programs-header">
        <span>Our Competencies</span>
        <h2 id="programs-title">Strategic Programs</h2>
      </div>

      <div className="programs-grid">
        {programs.map((prog) => (
          <article key={prog.title} className="program-card">
            <span className="program-icon" aria-hidden="true">
              {prog.icon}
            </span>
            <h3>{prog.title}</h3>
            <p>{prog.desc}</p>
            <a className="program-link" href="#learn-more">
              Learn More
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
