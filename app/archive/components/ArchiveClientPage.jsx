"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import JournalHero from "./JournalHero";
import CurrentIssue from "./CurrentIssue";
import FiltersSidebar from "./FiltersSidebar";
import RecentIssues from "./RecentIssues";
import RecentArticles from "./RecentArticles";
import EditorialBoard from "./EditorialBoard";
import FooterArchive from "./FooterArchive";
import { articles as initialArticles } from "../data/journalData";

export default function ArchiveClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("all");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState(initialArticles);

  // Apply filters dynamically when state changes
  useEffect(() => {
    let result = [...initialArticles];

    // 1. Search Query Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 2. Volume Filter
    if (selectedVolume !== "all") {
      result = result.filter(
        (article) => article.volume.toString() === selectedVolume
      );
    }

    // 3. Topic/Research Area Filter
    if (selectedTopics.length > 0) {
      result = result.filter((article) =>
        article.topics.some((topic) => selectedTopics.includes(topic))
      );
    }

    // 4. Document Type Filter
    if (selectedDocType !== "all") {
      result = result.filter((article) => article.docType === selectedDocType);
    }

    setFilteredArticles(result);
  }, [searchQuery, selectedVolume, selectedTopics, selectedDocType]);

  const handleSelectIssue = (volume, issue) => {
    setSelectedVolume(volume.toString());
    // Scroll to the articles section
    const articlesSection = document.querySelector(".recent-articles-section");
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="journal-page-container">
      {/* Standard Website Header */}
      <Header />

      {/* Main Journal Hero Banner */}
      <JournalHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={setSearchQuery}
      />

      {/* Showcase Current Issue */}
      <CurrentIssue />

      {/* Main Columns Container */}
      <div className="journal-main-columns-container">
        <div className="journal-columns-layout">
          {/* Left Column: Sidebar Filters */}
          <FiltersSidebar
            selectedVolume={selectedVolume}
            setSelectedVolume={setSelectedVolume}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            selectedDocType={selectedDocType}
            setSelectedDocType={setSelectedDocType}
          />

          {/* Right Column: Grid and Lists */}
          <div className="journal-content-column">
            <RecentIssues onSelectIssue={handleSelectIssue} />
            <RecentArticles articles={filteredArticles} />
          </div>
        </div>
      </div>

      {/* Editorial Board */}
      <EditorialBoard />

      {/* Footer */}
      <FooterArchive />
    </div>
  );
}
