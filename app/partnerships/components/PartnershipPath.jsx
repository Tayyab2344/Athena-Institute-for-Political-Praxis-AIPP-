"use client";

import { useState, useRef } from "react";

export default function PartnershipPath() {
  const [activePath, setActivePath] = useState(null); // 'org' | 'ind' | null
  const [submittedOrg, setSubmittedOrg] = useState(false);
  const [submittedInd, setSubmittedInd] = useState(false);
  const [orgFile, setOrgFile] = useState(null);
  const [isOrgDragging, setIsOrgDragging] = useState(false);

  const orgFormRef = useRef(null);
  const indFormRef = useRef(null);

  const orgFeatures = [
    "JOINT ADVOCACY",
    "POLICY PROJECTS",
    "STRATEGIC PROGRAMS",
    "EVENTS & CONFERENCES",
    "ADVOCACY CAMPAIGNS",
    "CAPACITY BUILDING",
  ];

  const indFeatures = [
    "ACADEMIC PRIVILEGES",
    "RESEARCH COLLABORATION",
    "THOUGHT LEADERSHIP",
    "POLICY CONTRIBUTIONS",
    "VOLUNTEER EXPERTISE",
    "INNOVATION INITIATIVES",
  ];

  const handleCardClick = (path) => {
    if (activePath === path) {
      // Toggle off
      setActivePath(null);
    } else {
      setActivePath(path);
      // Smooth scroll to the form after it expands
      setTimeout(() => {
        const ref = path === "org" ? orgFormRef.current : indFormRef.current;
        if (ref) {
          ref.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 400);
    }
  };

  const handleOrgSubmit = (e) => {
    e.preventDefault();
    setSubmittedOrg(true);
    setOrgFile(null);
  };

  const handleIndSubmit = (e) => {
    e.preventDefault();
    setSubmittedInd(true);
  };

  return (
    <section className="path-section" aria-labelledby="path-title">
      <div className="path-container">
        <h2 id="path-title" className="path-heading">
          Choose Your <span>Partnership Path</span>
        </h2>

        <div className="path-cards-grid interactive-layout">
          {/* Pathway 1: Organizational Partnerships */}
          <div
            className={`path-card-interactive ${
              activePath === "org" ? "expanded" : activePath ? "dimmed" : ""
            }`}
          >
            <button
              type="button"
              className="path-card-header"
              onClick={() => handleCardClick("org")}
              aria-expanded={activePath === "org"}
            >
              <div className="path-card-header-left">
                <h3 className="path-card-title">Organizational Partnerships</h3>
                <p className="path-card-description">
                  Collaborate as a university, faculty, think tank, policy center,
                  development organization, or research body to foster
                  institutional synergy.
                </p>
              </div>
              <span className="path-card-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            <div className={`interactive-expand-container ${activePath === "org" ? "expanded" : ""}`}>
              <div className="interactive-expand-content" ref={orgFormRef}>
                <div className="path-features-wrapper">
                  <h4 className="path-section-subtitle">Scope of Collaboration</h4>
                  <ul className="path-features-grid" aria-label="Organizational collaboration scope">
                    {orgFeatures.map((feat) => (
                      <li key={feat} className="path-feature-item">
                        <span className="feature-bullet-caret" aria-hidden="true">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="path-form-wrapper">
                  {submittedOrg ? (
                    <div className="form-success-message">
                      <span className="success-icon" aria-hidden="true">✓</span>
                      <h4>Proposal Submitted Successfully</h4>
                      <p>Our Board of Fellows will review your organizational partnership request and contact you within 14 business days.</p>
                      <button type="button" className="success-reset-btn" onClick={() => setSubmittedOrg(false)}>Submit another proposal</button>
                    </div>
                  ) : (
                    <form onSubmit={handleOrgSubmit} className="premium-form">
                      <h4 className="form-legend">Organizational Intake Proposal</h4>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="org-name">Organization Name *</label>
                          <input type="text" id="org-name" required placeholder="e.g., Institute of Governance Studies" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="org-type">Organization Type *</label>
                          <select id="org-type" required defaultValue="">
                            <option value="" disabled>Select Type</option>
                            <option value="university">University / Faculty</option>
                            <option value="thinktank">Think Tank / Research Centre</option>
                            <option value="ngo">Non-Governmental Org (NGO)</option>
                            <option value="philanthropic">Philanthropic / Foundation</option>
                            <option value="civic">Civic Network</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="org-website">Website *</label>
                          <input type="url" id="org-website" required placeholder="https://example.org" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="org-contact">Contact Person *</label>
                          <input type="text" id="org-contact" required placeholder="Full Name" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="org-designation">Designation *</label>
                          <input type="text" id="org-designation" required placeholder="e.g., Director of Operations" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="org-email">Email Address *</label>
                          <input type="email" id="org-email" required placeholder="contact@example.org" />
                        </div>
                        <div className="form-group full-width">
                          <label htmlFor="org-country">Country *</label>
                          <input type="text" id="org-country" required placeholder="e.g., United Kingdom" />
                        </div>

                        <div className="form-group full-width">
                          <label>Partnership Interests *</label>
                          <div className="form-checkbox-grid">
                            {orgFeatures.map((feat) => (
                              <label key={feat} className="checkbox-label">
                                <input type="checkbox" name="interests" value={feat} />
                                <span className="custom-checkbox" />
                                {feat}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="org-file" className="file-upload-label">Proposal Upload (PDF/DOCX) *</label>
                          <div className="custom-file-upload">
                            <input
                              type="file"
                              id="org-file"
                              required={!orgFile}
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => setOrgFile(e.target.files[0] || null)}
                              onDragEnter={() => setIsOrgDragging(true)}
                              onDragLeave={() => setIsOrgDragging(false)}
                              onDrop={() => setIsOrgDragging(false)}
                            />
                            {orgFile ? (
                              <div className="file-upload-dummy file-selected">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <span>{orgFile.name}</span>
                                <span className="file-formats">{(orgFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                <button
                                  type="button"
                                  className="success-reset-btn"
                                  style={{ marginTop: "10px", zIndex: 10, position: "relative" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOrgFile(null);
                                    const input = document.getElementById("org-file");
                                    if (input) input.value = "";
                                  }}
                                >
                                  Remove File
                                </button>
                              </div>
                            ) : (
                              <div className={`file-upload-dummy ${isOrgDragging ? "dragging" : ""}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                </svg>
                                <span>Click to browse or drag proposal file here</span>
                                <span className="file-formats">Supported formats: PDF, DOC, DOCX up to 10MB</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="org-notes">Additional Notes</label>
                          <textarea id="org-notes" rows="4" placeholder="Brief outline of synergy ideas, objectives, or queries..." />
                        </div>
                      </div>

                      <button type="submit" className="form-submit-btn">
                        PARTNER AS AN ORGANIZATION
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pathway 2: Individual Partnerships */}
          <div
            className={`path-card-interactive ${
              activePath === "ind" ? "expanded" : activePath ? "dimmed" : ""
            }`}
          >
            <button
              type="button"
              className="path-card-header"
              onClick={() => handleCardClick("ind")}
              aria-expanded={activePath === "ind"}
            >
              <div className="path-card-header-left">
                <h3 className="path-card-title">Individual Partnerships</h3>
                <p className="path-card-description">
                  Research professionals, students, academics, and policy thinkers
                  contribute ideas and expertise to our growing network.
                </p>
              </div>
              <span className="path-card-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            <div className={`interactive-expand-container ${activePath === "ind" ? "expanded" : ""}`}>
              <div className="interactive-expand-content" ref={indFormRef}>
                <div className="path-features-wrapper">
                  <h4 className="path-section-subtitle">Scope of Collaboration</h4>
                  <ul className="path-features-grid" aria-label="Individual collaboration scope">
                    {indFeatures.map((feat) => (
                      <li key={feat} className="path-feature-item">
                        <span className="feature-bullet-caret" aria-hidden="true">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="path-form-wrapper">
                  {submittedInd ? (
                    <div className="form-success-message">
                      <span className="success-icon" aria-hidden="true">✓</span>
                      <h4>Inquiry Received Successfully</h4>
                      <p>Thank you for expressing interest in individual collaboration. Our recruitment team will get in touch with you shortly.</p>
                      <button type="button" className="success-reset-btn" onClick={() => setSubmittedInd(false)}>Submit another inquiry</button>
                    </div>
                  ) : (
                    <form onSubmit={handleIndSubmit} className="premium-form">
                      <h4 className="form-legend">Individual Intake Inquiry</h4>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="ind-name">Full Name *</label>
                          <input type="text" id="ind-name" required placeholder="e.g., Sarah Vance" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="ind-email">Email Address *</label>
                          <input type="email" id="ind-email" required placeholder="sarah@example.com" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="ind-country">Country *</label>
                          <input type="text" id="ind-country" required placeholder="e.g., United States" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="ind-linkedin">LinkedIn Profile URL</label>
                          <input type="url" id="ind-linkedin" placeholder="https://linkedin.com/in/username" />
                        </div>
                        <div className="form-group full-width">
                          <label htmlFor="ind-background">Professional / Academic Background *</label>
                          <input type="text" id="ind-background" required placeholder="e.g., PhD Candidate in Political Philosophy, Oxford" />
                        </div>

                        <div className="form-group full-width">
                          <label>Areas of Interest *</label>
                          <div className="form-checkbox-grid">
                            {indFeatures.map((feat) => (
                              <label key={feat} className="checkbox-label">
                                <input type="checkbox" name="interests" value={feat} />
                                <span className="custom-checkbox" />
                                {feat}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="ind-idea">Brief Project / Research Idea *</label>
                          <textarea id="ind-idea" rows="4" required placeholder="Outline a project, simulation, or policy brief you would like to drive at the Institute..." />
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="ind-notes">Additional Notes</label>
                          <textarea id="ind-notes" rows="3" placeholder="Any additional links, references, or details..." />
                        </div>
                      </div>

                      <button type="submit" className="form-submit-btn">
                        COLLABORATE AS AN INDIVIDUAL
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
