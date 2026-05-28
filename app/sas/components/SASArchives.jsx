"use client";

export default function SASArchives() {
  return (
    <section className="sas-archives-section" id="archives" aria-labelledby="archives-title">
      <div className="archives-header">
        <div>
          <h2 id="archives-title">Featured Simulation Archives</h2>
          <p>Real-world impact through synthetic exercises.</p>
        </div>
        <a className="archive-browse-link" href="#archives">
          Browse full archive <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="archives-grid">
        <article className="archive-card">
          <div className="archive-image-wrapper">
            <span className="archive-badge">Convened March 2026</span>
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=640&q=75"
              alt="A command center interface with digital charts and monitors"
              width="640"
              height="360"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="archive-content">
            <h3>Operation Meridian Shift</h3>
            <p>
              A 48-hour continuous simulation modeling multi-state energy grid failures and
              geopolitical tension.
            </p>
          </div>
        </article>

        <article className="archive-card">
          <div className="archive-image-wrapper">
            <span className="archive-badge">September 2026</span>
            <img
              src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=640&q=75"
              alt="Diplomats sitting around a long conference table during a seminar"
              width="640"
              height="360"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="archive-content">
            <h3>The Geneva Synthesis</h3>
            <p>
              An upcoming high-level diplomatic exercise focusing on AI governance and
              cross-border security policymaking.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
