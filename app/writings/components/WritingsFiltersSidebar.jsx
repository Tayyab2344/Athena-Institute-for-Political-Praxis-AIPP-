"use client";

const topicsList = [
  "Institutional Reform",
  "Strategic Leadership",
  "Digital Sovereignty",
  "Global Hegemony",
  "Urban Resilience"
];

const tagsList = [
  "HUMAN RIGHTS",
  "STATE",
  "BI-SEGREGATIONAL",
  "MIMETIC SECURITY",
  "POST-TRUTH"
];

export default function WritingsFiltersSidebar({
  selectedTopics,
  setSelectedTopics,
  selectedYear,
  setSelectedYear,
  sortBy,
  setSortBy,
  selectedTags,
  setSelectedTags,
  handleResetFilters
}) {
  const handleTopicChange = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <aside className="writings-sidebar" aria-label="Filters sidebar">
      <div className="sidebar-section">
        <h3>Topic Area</h3>
        <div className="checkbox-group">
          {topicsList.map((topic) => {
            const isChecked = selectedTopics.includes(topic);
            return (
              <label key={topic} className="custom-checkbox-container">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleTopicChange(topic)}
                />
                <span className="checkbox-checkmark" />
                <span className="checkbox-label">{topic}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Publication Year</h3>
        <div className="select-wrapper">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            aria-label="Filter by publication year"
          >
            <option value="all">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <span className="select-arrow" aria-hidden="true">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Sort Articles</h3>
        <div className="radio-group">
          {[
            { id: "recent", label: "Most Recent" },
            { id: "viewed", label: "Most Viewed" },
            { id: "citations", label: "Citation Count" }
          ].map((option) => (
            <label key={option.id} className="custom-radio-container">
              <input
                type="radio"
                name="sortBy"
                checked={sortBy === option.id}
                onChange={() => setSortBy(option.id)}
              />
              <span className="radio-circle" />
              <span className="radio-label">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Tags</h3>
        <div className="tags-cloud">
          {tagsList.map((tag) => {
            const isActive = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                className={`tag-bubble ${isActive ? "active" : ""}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="reset-filters-btn"
        onClick={handleResetFilters}
      >
        Clear All Filters
      </button>
    </aside>
  );
}
