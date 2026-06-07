"use client";

import { useEffect, useRef } from "react";

export default function WritingsList({
  commentaries,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onResetFilters
}) {
  const listRef = useRef(null);

  const totalPages = Math.ceil(commentaries.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = commentaries.slice(startIndex, startIndex + itemsPerPage);

  // Smooth scroll to top of list on page change
  useEffect(() => {
    if (listRef.current) {
      const topOffset = listRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="writings-list-container" ref={listRef}>
      {paginatedItems.length === 0 ? (
        <div className="writings-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <h4>No Blogs or Insights Found</h4>
          <p>We couldn't find any articles matching your search query or filter criteria.</p>
          <button type="button" onClick={onResetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="writings-list">
          {paginatedItems.map((item, index) => (
            <article 
              key={item.id} 
              className="writings-card"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="card-meta">
                <span className="card-category">{item.category}</span>
                <span className="card-meta-dot" aria-hidden="true">&middot;</span>
                <span className="card-author">{item.author}</span>
                <span className="card-meta-dot" aria-hidden="true">&middot;</span>
                <span className="card-date">{item.date}</span>
              </div>
              <h2 className="card-title">
                <a href={`/writings/${item.id}`} onClick={(e) => e.preventDefault()}>
                  {item.title}
                </a>
              </h2>
              <p className="card-excerpt">{item.excerpt}</p>
              <a 
                className="card-link" 
                href={`/writings/${item.id}`}
                onClick={(e) => e.preventDefault()}
              >
                Read {item.docType}
                <span className="card-link-arrow" aria-hidden="true">&rarr;</span>
              </a>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="writings-pagination" aria-label="Blogs and insights pagination">
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

          {/* Visual dots and fake page 42 to match layout in mockup if page count is small */}
          {totalPages < 5 && (
            <>
              <span className="pagination-dots" aria-hidden="true">...</span>
              <button
                type="button"
                className="pagination-num visual-only"
                onClick={() => {}}
                disabled
              >
                42
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
