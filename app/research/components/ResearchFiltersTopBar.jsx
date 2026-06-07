"use client";

const docTypes = ["All Types", "Policy Brief", "Analytical Report", "White Paper"];
const divisions = ["All Divisions", "Geopolitics Division", "Governance Division", "Labs Division"];
const years = ["All Years", "2025", "2024"];

export default function ResearchFiltersTopBar({
  selectedDocType,
  setSelectedDocType,
  selectedDivision,
  setSelectedDivision,
  selectedYear,
  setSelectedYear,
  onResetFilters
}) {
  return (
    <div className="research-top-bar" aria-label="Horizontal filter bar">
      <div className="top-bar-filters-group">
        
        {/* 1. Publication Type Select */}
        <div className="top-bar-filter">
          <div className="top-bar-select-wrapper">
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              aria-label="Filter by publication type"
            >
              {docTypes.map((type) => (
                <option key={type} value={type === "All Types" ? "all" : type}>
                  {type === "All Types" ? "Publication Type" : type}
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

        {/* 2. Division Select */}
        <div className="top-bar-filter">
          <div className="top-bar-select-wrapper">
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              aria-label="Filter by division"
            >
              {divisions.map((div) => (
                <option key={div} value={div === "All Divisions" ? "all" : div}>
                  {div === "All Divisions" ? "Division" : div}
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

        {/* 3. Year Select */}
        <div className="top-bar-filter">
          <div className="top-bar-select-wrapper">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label="Filter by year"
            >
              {years.map((year) => (
                <option key={year} value={year === "All Years" ? "all" : year}>
                  {year === "All Years" ? "Year" : year}
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

      </div>

      {/* Reset Filters text button */}
      <div className="top-bar-reset">
        <button type="button" onClick={onResetFilters} className="reset-link-btn">
          <svg className="reset-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          Reset Filters
        </button>
      </div>
    </div>
  );
}
