"use client";

import { useState } from "react";

const docTypes = ["All Types", "Policy Blog", "Insight", "White Paper", "Policy Brief", "Journal"];
const authors = [
  "All Authors",
  "Dr. Alistair Vance",
  "Sofia Georgiova",
  "Marcus Thorne",
  "Dr. Elena Rost",
  "Julian Delore",
  "Dr. Elias Bouras",
  "Maria Al-Tayyeb"
];
const categories = [
  "All Categories",
  "STATE & ALLEGIANCE",
  "INSTITUTIONAL REFORM",
  "GLOBAL HEGEMONY",
  "URBAN RESILIENCE",
  "DIGITAL SOVEREIGNTY"
];

export default function WritingsFiltersTopBar({
  selectedDocType,
  setSelectedDocType,
  selectedAuthor,
  setSelectedAuthor,
  selectedCategory,
  setSelectedCategory
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleApplyClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
  };

  return (
    <div className="writings-top-bar" aria-label="Horizontal filter bar">
      <div className="top-bar-filter">
        <label htmlFor="doc-type-select">Document Type</label>
        <div className="top-bar-select-wrapper">
          <select
            id="doc-type-select"
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
          >
            {docTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <span className="select-arrow" aria-hidden="true">
            <svg width="8" height="5" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="top-bar-filter">
        <label htmlFor="author-select">Author/Fellow</label>
        <div className="top-bar-select-wrapper">
          <select
            id="author-select"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
          <span className="select-arrow" aria-hidden="true">
            <svg width="8" height="5" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="top-bar-filter">
        <label htmlFor="category-select">Category</label>
        <div className="top-bar-select-wrapper">
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All Categories" ? "All Categories" : cat}
              </option>
            ))}
          </select>
          <span className="select-arrow" aria-hidden="true">
            <svg width="8" height="5" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="top-bar-action">
        <button
          type="button"
          className={`apply-filters-btn ${isClicked ? "pulse-animation" : ""}`}
          onClick={handleApplyClick}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
