"use client";

import { useState } from "react";

export default function JournalHero({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const [localSearch, setLocalSearch] = useState(searchQuery || "");

  const handleInputChange = (e) => {
    setLocalSearch(e.target.value);
    if (setSearchQuery) {
      setSearchQuery(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(localSearch);
    }
  };

  return (
    <section className="journal-hero-section">
      <div className="journal-hero-container">
        <span className="journal-hero-eyebrow">Institutional Repository</span>
        <h1 className="journal-hero-title">
          Praxis: The Journal of Political Architecture & Governance
        </h1>
        <p className="journal-hero-subtitle">
          The official peer-reviewed publication of the Athena Institute, dedicated to the rigorous
          exploration of institutional reform and strategic leadership.
        </p>

        <div className="journal-stats-row">
          <div className="journal-stat-item">
            <span className="stat-number">Volume 1-12</span>
            <span className="stat-label">Institutional History</span>
          </div>
          <span className="journal-stat-divider" aria-hidden="true" />
          <div className="journal-stat-item">
            <span className="stat-number">48 Issues</span>
            <span className="stat-label">Published Quarterly</span>
          </div>
          <span className="journal-stat-divider" aria-hidden="true" />
          <div className="journal-stat-item">
            <span className="stat-number">600+ Articles</span>
            <span className="stat-label">Peer-Reviewed</span>
          </div>
        </div>

        <form className="journal-search-form" onSubmit={handleSubmit}>
          <div className="journal-search-input-wrapper">
            <svg
              className="journal-search-input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="journal-search-input"
              placeholder="Search by author, keyword, or DOI..."
              value={localSearch}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="journal-search-submit">
            Search
            <svg
              className="journal-search-submit-arrow"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
