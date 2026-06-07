"use client";

import { editorialBoard } from "../data/journalData";

export default function EditorialBoard() {
  const { editorInChief, managingEditor, associateEditor, reviewEditor, deadlines } =
    editorialBoard;

  const boardMembers = [
    { label: "EDITOR-IN-CHIEF", ...editorInChief },
    { label: "MANAGING EDITOR", ...managingEditor },
    { label: "ASSOCIATE EDITOR", ...associateEditor },
    { label: "REVIEW EDITOR", ...reviewEditor },
  ];

  return (
    <section className="editorial-board-section">
      <div className="editorial-board-container">
        <div className="editorial-main-grid">
          {/* Left Column: Heading and guiding text */}
          <div className="editorial-left-col">
            <h2 className="editorial-title">Editorial Board</h2>
            <p className="editorial-guiding-text">
              Guiding the intellectual direction of Praxis through rigorous peer-review and ethical
              oversight.
            </p>
            <a href="#governance-framework" className="editorial-framework-link">
              View Peer-Governance Framework
            </a>
          </div>

          {/* Right Column: Grid of Editors */}
          <div className="editorial-right-col">
            <div className="editors-grid">
              {boardMembers.map((member, idx) => (
                <div key={idx} className="editor-member-card">
                  <span className="editor-role-label">{member.label}</span>
                  <h3 className="editor-name">{member.name}</h3>
                  <span className="editor-affiliation">{member.affiliation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Deadlines & Stats row */}
        <div className="editorial-bottom-bar">
          {deadlines.map((dl, idx) => (
            <div key={idx} className="editorial-deadline-item">
              <span className="deadline-label">{dl.label}</span>
              <span className="deadline-value">{dl.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
