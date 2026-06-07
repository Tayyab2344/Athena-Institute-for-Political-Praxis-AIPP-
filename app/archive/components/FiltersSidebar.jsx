"use client";

export default function FiltersSidebar({
  selectedVolume,
  setSelectedVolume,
  selectedTopics,
  setSelectedTopics,
  selectedDocType,
  setSelectedDocType,
}) {
  const topicsList = [
    "Global Governance",
    "Institutional Reform",
    "Strategic Leadership",
    "Digital Sovereignty",
  ];

  const docTypesList = ["Original Research", "Case Study", "Policy Brief"];

  const handleTopicToggle = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleDocTypeToggle = (type) => {
    if (selectedDocType === type) {
      setSelectedDocType("all"); // toggle off
    } else {
      setSelectedDocType(type);
    }
  };

  return (
    <aside className="journal-filters-sidebar">
      <div className="filter-group">
        <h3 className="filter-title">Filter Archive</h3>

        {/* Volume & Year Dropdown */}
        <div className="filter-item">
          <label htmlFor="volume-select" className="filter-label">
            VOLUME & YEAR
          </label>
          <div className="select-wrapper">
            <select
              id="volume-select"
              value={selectedVolume}
              onChange={(e) => setSelectedVolume(e.target.value)}
              className="filter-select"
            >
              <option value="all">Select Volume (All)</option>
              <option value="12">Volume 12 (2024 - 2025)</option>
              <option value="11">Volume 11 (2023 - 2024)</option>
            </select>
            <svg
              className="select-caret"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Research Area Checkboxes */}
        <div className="filter-item">
          <span className="filter-label">RESEARCH AREA</span>
          <div className="checkbox-list">
            {topicsList.map((topic) => {
              const isChecked = selectedTopics.includes(topic);
              return (
                <label key={topic} className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTopicToggle(topic)}
                  />
                  <span className="checkmark" />
                  <span className="checkbox-text">{topic}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Article Type Tags */}
        <div className="filter-item">
          <span className="filter-label">ARTICLE TYPE</span>
          <div className="tags-list">
            {docTypesList.map((type) => {
              const isActive = selectedDocType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleDocTypeToggle(type)}
                  className={`filter-tag-button ${isActive ? "active" : ""}`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call for Papers Card */}
      <div className="call-for-papers-card">
        <h4 className="call-papers-title">Call for Papers</h4>
        <p className="call-papers-text">
          Currently accepting submissions for Volume 13, Issue 2, 'The Future of Non-State Actors'.
        </p>
        <a href="#submit" className="call-papers-link">
          Submission Portal
          <span className="call-link-arrow" aria-hidden="true">
            &rarr;
          </span>
        </a>
      </div>
    </aside>
  );
}
