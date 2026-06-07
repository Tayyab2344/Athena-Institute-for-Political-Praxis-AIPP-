"use client";

export default function WritingsHero({ searchQuery, setSearchQuery }) {
  return (
    <section className="writings-hero" aria-labelledby="writings-hero-title">
      <div className="writings-hero-glow" aria-hidden="true" />
      <div className="writings-hero-content">
        <div className="writings-hero-main">
          <div className="writings-title-group">
            <span className="writings-hero-rule" aria-hidden="true" />
            <h1 id="writings-hero-title">Policy Blogs &amp; Insights</h1>
            <p className="writings-hero-desc">
              A definitive repository of strategic foresight, geopolitical analysis, and institutional critique. 
              Our archive preserves the intellectual rigor required to navigate modern political praxis.
            </p>
          </div>
 
          <div className="writings-hero-stats">
            <div className="writings-stat-card">
              <span className="writings-stat-value">1,248</span>
              <span className="writings-stat-label">Articles Published</span>
            </div>
            <div className="writings-stat-card">
              <span className="writings-stat-value">42</span>
              <span className="writings-stat-label">Active Fellows</span>
            </div>
          </div>
        </div>
 
        <div className="writings-hero-search">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search the repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search blogs and insights"
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
