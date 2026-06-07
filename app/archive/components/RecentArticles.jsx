"use client";

import { useState } from "react";

export default function RecentArticles({ articles }) {
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "cited"
  const [visibleCount, setVisibleCount] = useState(2);

  // Sorting logic
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === "newest") {
      // For simplicity, we can sort by year/issue/id descending
      return b.id.localeCompare(a.id);
    } else {
      // Mocking citations sort: let's pretend art-2 and art-8 are highly cited
      const citedOrder = { "art-2": 150, "art-8": 120, "art-1": 95, "art-3": 60, "art-4": 42, "art-5": 20, "art-6": 15, "art-7": 8 };
      const scoreA = citedOrder[a.id] || 0;
      const scoreB = citedOrder[b.id] || 0;
      return scoreB - scoreA;
    }
  });

  const displayedArticles = sortedArticles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  return (
    <section className="recent-articles-section">
      <div className="articles-header-row">
        <h2 className="recent-articles-title">Recent Articles</h2>
        <div className="articles-sort-container">
          <span className="sort-label">Sort by:</span>
          <button
            type="button"
            className={`sort-tab ${sortBy === "newest" ? "active" : ""}`}
            onClick={() => setSortBy("newest")}
          >
            Newest
          </button>
          <span className="sort-divider">|</span>
          <button
            type="button"
            className={`sort-tab ${sortBy === "cited" ? "active" : ""}`}
            onClick={() => setSortBy("cited")}
          >
            Most Cited
          </button>
        </div>
      </div>

      {displayedArticles.length === 0 ? (
        <div className="articles-empty-state">
          <p>No articles match the selected filters.</p>
        </div>
      ) : (
        <div className="articles-list">
          {displayedArticles.map((article) => (
            <article key={article.id} className="article-item-card">
              <div className="article-meta-row">
                <span className="article-doc-type-tag">
                  {article.docType.toUpperCase()}
                </span>
                <span className="article-publish-date">{article.date}</span>
              </div>

              <h3 className="article-item-title">
                <a href="#article-details">{article.title}</a>
              </h3>

              <span className="article-item-author">{article.author}</span>

              <p className="article-item-excerpt">{article.excerpt}</p>

              <div className="article-footer-row">
                <div className="article-pills-row">
                  {article.tags.map((tag) => (
                    <span key={tag} className="article-pill-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="article-action-buttons">
                  <a href={article.pdfUrl} className="article-action-link pdf-link">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <polyline points="9 15 12 18 15 15" />
                    </svg>
                    PDF
                  </a>
                  <a href="#details" className="article-action-link details-link">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="9" y1="3" x2="9" y2="21" />
                    </svg>
                    Details
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="load-more-container">
          <button
            type="button"
            className="load-more-articles-button"
            onClick={handleLoadMore}
          >
            Load More Articles
          </button>
        </div>
      )}
    </section>
  );
}
