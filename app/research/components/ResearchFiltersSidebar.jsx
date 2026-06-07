"use client";

const topics = [
  "Institutional Reform",
  "Digital Sovereignty",
  "Global Hegemony",
  "Resource Security"
];

const regions = [
  "Transatlantic Union",
  "Indo-Pacific Bloc",
  "Global South Alliance"
];

const authors = [
  "Dr. Aria Thorne",
  "Professor Elena Vance",
  "Sir Marcus Whitehall"
];

export default function ResearchFiltersSidebar({
  selectedTopics,
  setSelectedTopics,
  selectedRegions,
  setSelectedRegions,
  selectedAuthors,
  setSelectedAuthors
}) {
  const handleToggle = (item, selectedList, setSelectedList) => {
    if (selectedList.includes(item)) {
      setSelectedList(selectedList.filter((x) => x !== item));
    } else {
      setSelectedList([...selectedList, item]);
    }
  };

  return (
    <aside className="research-sidebar" aria-label="Database filters sidebar">
      {/* 1. Topic Area Checkboxes */}
      <div className="sidebar-section">
        <h3>Topic Area</h3>
        <div className="checkbox-group">
          {topics.map((topic) => {
            const isChecked = selectedTopics.includes(topic);
            return (
              <label key={topic} className="custom-checkbox-container">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(topic, selectedTopics, setSelectedTopics)}
                />
                <span className="checkbox-checkmark" />
                <span className="checkbox-label">{topic}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Regional Focus Checkboxes */}
      <div className="sidebar-section">
        <h3>Regional Focus</h3>
        <div className="checkbox-group">
          {regions.map((region) => {
            const isChecked = selectedRegions.includes(region);
            return (
              <label key={region} className="custom-checkbox-container">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(region, selectedRegions, setSelectedRegions)}
                />
                <span className="checkbox-checkmark" />
                <span className="checkbox-label">{region}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Featured Authors Checkboxes */}
      <div className="sidebar-section">
        <h3>Featured Authors</h3>
        <div className="checkbox-group">
          {authors.map((author) => {
            const isChecked = selectedAuthors.includes(author);
            return (
              <label key={author} className="custom-checkbox-container">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(author, selectedAuthors, setSelectedAuthors)}
                />
                <span className="checkbox-checkmark" />
                <span className="checkbox-label">{author}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
