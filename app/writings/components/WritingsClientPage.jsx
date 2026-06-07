"use client";

import { useState, useEffect } from "react";
import { commentaries } from "../data/commentaries";
import WritingsHero from "./WritingsHero";
import WritingsFiltersSidebar from "./WritingsFiltersSidebar";
import WritingsFiltersTopBar from "./WritingsFiltersTopBar";
import WritingsList from "./WritingsList";
import FlagshipCommentaries from "./FlagshipCommentaries";
import WritingsSubscribe from "./WritingsSubscribe";

export default function WritingsClientPage() {
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState(["Strategic Leadership"]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedTags, setSelectedTags] = useState([]);

  // Top bar select states
  const [selectedDocType, setSelectedDocType] = useState("All Types");
  const [selectedAuthor, setSelectedAuthor] = useState("All Authors");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset pagination to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedTopics,
    selectedYear,
    sortBy,
    selectedTags,
    selectedDocType,
    selectedAuthor,
    selectedCategory
  ]);

  // Real-time Client-Side Filtering logic
  const filteredCommentaries = commentaries.filter((item) => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchExcerpt = item.excerpt.toLowerCase().includes(q);
      const matchAuthor = item.author.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchAuthor) return false;
    }

    // 2. Topic Checkboxes (checked list)
    if (selectedTopics.length > 0) {
      if (!selectedTopics.includes(item.topic)) return false;
    }

    // 3. Publication Year Select
    if (selectedYear !== "all") {
      if (item.year.toString() !== selectedYear) return false;
    }

    // 4. Tags (OR query - matches if the item contains at least one selected tag)
    if (selectedTags.length > 0) {
      const matchTags = selectedTags.some((tag) => item.tags.includes(tag));
      if (!matchTags) return false;
    }

    // 5. Document Type Select (Top Bar)
    if (selectedDocType !== "All Types") {
      if (item.docType !== selectedDocType) return false;
    }

    // 6. Author Select (Top Bar)
    if (selectedAuthor !== "All Authors") {
      if (item.author !== selectedAuthor) return false;
    }

    // 7. Category Select (Top Bar)
    if (selectedCategory !== "All Categories") {
      if (item.category !== selectedCategory) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedCommentaries = [...filteredCommentaries].sort((a, b) => {
    if (sortBy === "recent") {
      // Sort by year descending, then by id descending
      if (b.year !== a.year) return b.year - a.year;
      return b.id - a.id;
    }
    if (sortBy === "viewed") {
      return b.views - a.views;
    }
    if (sortBy === "citations") {
      return b.citations - a.citations;
    }
    return 0;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTopics([]);
    setSelectedYear("all");
    setSortBy("recent");
    setSelectedTags([]);
    setSelectedDocType("All Types");
    setSelectedAuthor("All Authors");
    setSelectedCategory("All Categories");
    setCurrentPage(1);
  };

  return (
    <div className="writings-page-layout">
      {/* 1. Hero Banner Section */}
      <WritingsHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* 2. Core Filter & Grid Layout */}
      <div className="writings-main-container">
        <div className="writings-grid-layout">
          
          {/* Left Column: Filter Sidebar */}
          <div className="reveal-up">
            <WritingsFiltersSidebar
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              handleResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Column: Top Bar Filters + Commentary List */}
          <div className="writings-content-column">
            <div className="reveal-up">
              <WritingsFiltersTopBar
                selectedDocType={selectedDocType}
                setSelectedDocType={setSelectedDocType}
                selectedAuthor={selectedAuthor}
                setSelectedAuthor={setSelectedAuthor}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
            
            <div className="reveal-up">
              <WritingsList
                commentaries={sortedCommentaries}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>

        </div>
      </div>

      {/* 3. Flagship Spotlight Section */}
      <div className="reveal-up">
        <FlagshipCommentaries />
      </div>

      {/* 4. Newsletter Subscribe Section */}
      <div className="reveal-up">
        <WritingsSubscribe />
      </div>
    </div>
  );
}
