"use client";

import { useState, useEffect } from "react";
import { papers } from "../data/papers";
import ResearchHero from "./ResearchHero";
import ResearchFiltersSidebar from "./ResearchFiltersSidebar";
import ResearchFiltersTopBar from "./ResearchFiltersTopBar";
import ResearchList from "./ResearchList";
import SelectedForPraxis from "./SelectedForPraxis";
import ResearchStats from "./ResearchStats";

export default function ResearchClientPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Sidebar filter states
  const [selectedTopics, setSelectedTopics] = useState(["Digital Sovereignty"]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  // Top bar select states
  const [selectedDocType, setSelectedDocType] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Reset pagination to page 1 when any filter updates
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedTopics,
    selectedRegions,
    selectedAuthors,
    selectedDocType,
    selectedDivision,
    selectedYear
  ]);

  // Client-side filtering logic
  const filteredPapers = papers.filter((paper) => {
    // 1. Search Query (Title, Excerpt, DOI, Author, or Division)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = paper.title.toLowerCase().includes(q);
      const matchExcerpt = paper.excerpt.toLowerCase().includes(q);
      const matchDoi = paper.doi.toLowerCase().includes(q);
      const matchAuthor = paper.author.toLowerCase().includes(q);
      const matchDivision = paper.division.toLowerCase().includes(q);
      
      if (!matchTitle && !matchExcerpt && !matchDoi && !matchAuthor && !matchDivision) {
        return false;
      }
    }

    // 2. Topic Checkboxes (checked list)
    if (selectedTopics.length > 0) {
      if (!selectedTopics.includes(paper.topic)) return false;
    }

    // 3. Regional Focus Checkboxes
    if (selectedRegions.length > 0) {
      if (!selectedRegions.includes(paper.region)) return false;
    }

    // 4. Featured Authors Checkboxes
    if (selectedAuthors.length > 0) {
      if (!selectedAuthors.includes(paper.author)) return false;
    }

    // 5. Document Type Select (Top Bar)
    if (selectedDocType !== "all") {
      if (paper.docType !== selectedDocType) return false;
    }

    // 6. Division Select (Top Bar)
    if (selectedDivision !== "all") {
      if (paper.division !== selectedDivision) return false;
    }

    // 7. Year Select (Top Bar)
    if (selectedYear !== "all") {
      if (paper.year.toString() !== selectedYear) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTopics([]);
    setSelectedRegions([]);
    setSelectedAuthors([]);
    setSelectedDocType("all");
    setSelectedDivision("all");
    setSelectedYear("all");
    setCurrentPage(1);
  };

  return (
    <div className="research-page-layout">
      {/* 1. Hero Search Section */}
      <ResearchHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* 2. Core Search & Grid Layout */}
      <div className="research-main-container">
        <div className="research-grid-layout">
          
          {/* Left Column: Filters Sidebar */}
          <div className="reveal-up">
            <ResearchFiltersSidebar
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
              selectedAuthors={selectedAuthors}
              setSelectedAuthors={setSelectedAuthors}
            />
          </div>

          {/* Right Column: Top Bar + Papers List */}
          <div className="research-content-column">
            <div className="reveal-up">
              <ResearchFiltersTopBar
                selectedDocType={selectedDocType}
                setSelectedDocType={setSelectedDocType}
                selectedDivision={selectedDivision}
                setSelectedDivision={setSelectedDivision}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                onResetFilters={handleResetFilters}
              />
            </div>

            <div className="reveal-up">
              <ResearchList
                papers={filteredPapers}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>

        </div>
      </div>

      {/* 3. Selected Spotlight Section */}
      <div className="reveal-up">
        <SelectedForPraxis />
      </div>

      {/* 4. Global Statistics strip */}
      <div className="reveal-up">
        <ResearchStats />
      </div>
    </div>
  );
}
