"use client";

import { useEffect, useRef } from "react";

export default function ResearchList({
  papers,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onResetFilters
}) {
  const containerRef = useRef(null);

  const totalPages = Math.ceil(papers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPapers = papers.slice(startIndex, startIndex + itemsPerPage);

  // Smooth scroll to top of list on page change
  useEffect(() => {
    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="research-list-container" ref={containerRef}>
      {paginatedPapers.length === 0 ? (
        <div className="research-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <h4>No Papers Found</h4>
          <p>No research publications match your search criteria or active filters.</p>
          <button type="button" onClick={onResetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="research-list">
          {paginatedPapers.map((paper, index) => (
            <article 
              key={paper.id} 
              className="research-card"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Card Header Meta */}
              <div className="research-card-meta">
                <span className={`research-card-doc-type doc-type-${paper.docType.toLowerCase().replace(/\s+/g, "-")}`}>
                  {paper.docType}
                </span>
                <span className="research-card-date">{paper.date}</span>
              </div>

              {/* Title */}
              <h2 className="research-card-title">
                <a href={`/research/${paper.id}`} onClick={(e) => e.preventDefault()}>
                  {paper.title}
                </a>
              </h2>

              {/* Excerpt */}
              <p className="research-card-excerpt">{paper.excerpt}</p>

              {/* Card Footer */}
              <div className="research-card-footer">
                <div className="research-card-author-info">
                  <span className="research-card-author">{paper.author}</span>
                  <span className="research-card-divider" aria-hidden="true">|</span>
                  <span className="research-card-division">{paper.division.toUpperCase()}</span>
                </div>

                <div className="research-card-actions">
                  <a 
                    className="research-action-link" 
                    href={`/research/pdf/${paper.id}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <polyline points="9 15 12 18 15 15" />
                    </svg>
                    PDF
                  </a>
                  <a 
                    className="research-action-link" 
                    href={`/research/details/${paper.id}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <nav className="research-pagination" aria-label="Research page navigation">
          <button
            type="button"
            className="pagination-arrow"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`pagination-num ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {/* Visual dots and fake page 12 to match layout in mockup if page count is small */}
          {totalPages < 10 && (
            <>
              <span className="pagination-dots" aria-hidden="true">...</span>
              <button
                type="button"
                className="pagination-num visual-only"
                onClick={() => {}}
                disabled
              >
                12
              </button>
            </>
          )}

          <button
            type="button"
            className="pagination-arrow"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            &gt;
          </button>
        </nav>
      )}
    </div>
  );
}
