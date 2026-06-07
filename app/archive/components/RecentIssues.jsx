"use client";

import { pastIssues } from "../data/journalData";

export default function RecentIssues({ onSelectIssue }) {
  return (
    <section className="recent-issues-section">
      <div className="section-header-row">
        <h2 className="recent-issues-title">Recent Issues</h2>
        <a href="#all-archives" className="view-all-link">
          View All Archive
        </a>
      </div>

      <div className="recent-issues-grid">
        {pastIssues.map((issue) => (
          <div
            key={issue.id}
            className="past-issue-card"
            onClick={() => onSelectIssue && onSelectIssue(issue.volume, issue.issue)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectIssue && onSelectIssue(issue.volume, issue.issue);
              }
            }}
          >
            <span className="issue-vol-num">
              Volume {issue.volume} Issue {issue.issue}
            </span>
            <h3 className="issue-date-label">{issue.date}</h3>
            <span className="issue-article-count">Article Count: {issue.articleCount}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
