"use client";

export default function CurrentIssue() {
  const tocItems = [
    { title: "The Digital State: Sovereign Architectures", page: 112 },
    { title: "Institutional Drift in Multi-Polar Alignments", page: 141 },
    { title: "Bureaucracy as Policy: A Structural Analysis", page: 180 },
  ];

  return (
    <section className="current-issue-section">
      <div className="current-issue-container">
        <div className="current-issue-grid">
          {/* Left Column: Pure CSS Book Cover */}
          <div className="book-cover-wrapper">
            <div className="book-cover">
              <div className="book-cover-border-inner">
                <div className="book-cover-header">
                  <span className="book-cover-institution">ATHENA INSTITUTE</span>
                </div>
                <div className="book-cover-oval-container">
                  <div className="book-cover-oval">
                    <h2 className="book-cover-title">PRAXIS</h2>
                  </div>
                </div>
                <div className="book-cover-footer">
                  <span className="book-cover-subtitle">The Winter 2024 Edition</span>
                  <div className="book-cover-volume-info">
                    <span>VOL. 12</span>
                    <span className="cover-divider">|</span>
                    <span>NO. 4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Issue Details */}
          <div className="current-issue-details">
            <div className="issue-meta-row">
              <span className="current-issue-badge">Current Issue</span>
              <span className="issue-publish-date">Published Dec 12, 2024</span>
            </div>

            <h2 className="issue-title">Volume 12, Issue 4: The Winter 2024 Edition</h2>

            <p className="issue-abstract">
              This issue focuses on the evolution of digital sovereignty within the European Union
              and the architectural restructuring of post-conflict governance systems in the MENA
              region. Featuring lead articles by Dr. Elena Vance and Professor Marco Rossi.
            </p>

            <div className="issue-toc-container">
              <ul className="issue-toc-list">
                {tocItems.map((item, idx) => (
                  <li key={idx} className="issue-toc-item">
                    <span className="toc-item-title">{item.title}</span>
                    <span className="toc-dot-leader" aria-hidden="true" />
                    <span className="toc-item-page">Page {item.page}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="issue-actions-row">
              <button type="button" className="button-solid-black">
                View Full Issue
              </button>
              <button type="button" className="button-outline-black">
                Export Citation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
