"use client";

export default function ResearchHero({ searchQuery, setSearchQuery }) {
  return (
    <section className="research-hero" aria-labelledby="research-hero-title">
      <div className="research-hero-glow" aria-hidden="true" />
      <div className="research-hero-content">
        <div className="research-hero-main">
          <div className="research-title-group">
            <span className="research-hero-eyebrow">Institutional Archive</span>
            <span className="research-hero-rule" aria-hidden="true" />
            <h1 id="research-hero-title">Research Repository &amp; Policy Database</h1>
            <p className="research-hero-desc">
              A centralized archive of strategic foresight, institutional reform frameworks, 
              and geopolitical analysis.
            </p>
          </div>

          <div className="research-hero-stats">
            <div className="research-stat-card">
              <span className="research-stat-value">2,840</span>
              <span className="research-stat-label">Publications</span>
            </div>
            <div className="research-stat-card">
              <span className="research-stat-value">156</span>
              <span className="research-stat-label">Policy Briefs</span>
            </div>
            <div className="research-stat-card">
              <span className="research-stat-value">42</span>
              <span className="research-stat-label">Research Fellows</span>
            </div>
          </div>
        </div>

        <div className="research-hero-search">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by Title, Keywords, or DOI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search research repository"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
