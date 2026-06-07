"use client";

import { useState, useRef, useEffect } from "react";

export default function ProgramPathways() {
  const [activePathway, setActivePathway] = useState(null); // 'member' | 'volunteer' | null
  const [submittedMember, setSubmittedMember] = useState(false);
  const [submittedVolunteer, setSubmittedVolunteer] = useState(false);
  const [volunteerFile, setVolunteerFile] = useState(null);
  const [isVolunteerDragging, setIsVolunteerDragging] = useState(false);

  const memberFormRef = useRef(null);
  const volunteerFormRef = useRef(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#member") {
        setActivePathway("member");
        setTimeout(() => {
          memberFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else if (hash === "#volunteer") {
        setActivePathway("volunteer");
        setTimeout(() => {
          volunteerFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    };

    handleHash();

    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const membershipPerks = [
    "Quarterly Journal of Praxis Hardcopy Subscription",
    "Voting Rights in Annual Strategy Assemblies",
    "Exclusive Invitations to Diplomatic Roundtable events",
    "Research Grant Eligibility for Independent Inquiry",
    "Global Fellowship Network Digital Access",
    "Private Archive & Library Borrowing Privileges"
  ];

  const volunteerPerks = [
    "Hands-on Experience in Policy Design & Analysis",
    "Support Logistics for Global Peace Summits",
    "Data Verification & Archival Research Support",
    "Digital Advocacy and Strategic Communications",
    "Translation & Localization of Institutional Works",
    "Undergraduate/Graduate Credit Eligibility"
  ];

  const interestsList = [
    "Geopolitical Frameworks",
    "Parliamentary Reform",
    "Institutional Strategy",
    "Simulation Planning",
    "Leadership Mentorship",
    "Public Advocacy"
  ];

  const handleCardClick = (pathway) => {
    if (activePathway === pathway) {
      setActivePathway(null);
    } else {
      setActivePathway(pathway);
      // Smooth scroll to the form after it expands
      setTimeout(() => {
        const ref = pathway === "member" ? memberFormRef.current : volunteerFormRef.current;
        if (ref) {
          ref.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 400);
    }
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    setSubmittedMember(true);
  };

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    setSubmittedVolunteer(true);
    setVolunteerFile(null);
  };

  return (
    <section className="join-pathways-section" aria-label="Program Pathways">
      <div className="join-pathways-container interactive-layout">
        
        {/* Pathway 1: Membership */}
        <div
          className={`path-card-interactive ${
            activePathway === "member" ? "expanded" : activePathway ? "dimmed" : ""
          }`}
        >
          <button
            type="button"
            className="path-card-header"
            onClick={() => handleCardClick("member")}
            aria-expanded={activePathway === "member"}
          >
            <div className="path-card-header-left">
              <span className="pathway-eyebrow dark-eyebrow">PROFESSIONAL STATUS</span>
              <h3 className="path-card-title">Membership</h3>
              <p className="path-card-description">
                Gaining formal membership within the Athena Institute allows access to
                academic privileges, diplomatic assemblies, and private archives.
              </p>
            </div>
            <span className="path-card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>

          <div className={`interactive-expand-container ${activePathway === "member" ? "expanded" : ""}`}>
            <div className="interactive-expand-content" ref={memberFormRef}>
              <div className="path-features-wrapper">
                <h4 className="path-section-subtitle">Membership Benefits</h4>
                <ul className="pathway-list" aria-label="Membership benefits">
                  {membershipPerks.map((perk, idx) => (
                    <li key={idx} className="pathway-item">
                      <span className="pathway-icon" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="path-form-wrapper">
                {submittedMember ? (
                  <div className="form-success-message">
                    <span className="success-icon" aria-hidden="true">✓</span>
                    <h4>Membership Application Received</h4>
                    <p>Thank you for applying. A representative from the Membership Committee will contact you to conduct the onboarding process.</p>
                    <button type="button" className="success-reset-btn" onClick={() => setSubmittedMember(false)}>Submit another application</button>
                  </div>
                ) : (
                  <form onSubmit={handleMemberSubmit} className="premium-form">
                    <h4 className="form-legend">Apply for Institutional Membership</h4>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="member-name">Full Name *</label>
                        <input type="text" id="member-name" required placeholder="e.g., Prof. Arthur Pendelton" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="member-email">Email Address *</label>
                        <input type="email" id="member-email" required placeholder="arthur@example.org" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="member-occupation">Occupation / Affiliation *</label>
                        <input type="text" id="member-occupation" required placeholder="e.g., Professor of Constitutional Law" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="member-country">Country *</label>
                        <input type="text" id="member-country" required placeholder="e.g., Germany" />
                      </div>

                      <div className="form-group full-width">
                        <label>Areas of Interest *</label>
                        <div className="form-checkbox-grid">
                          {interestsList.map((interest) => (
                            <label key={interest} className="checkbox-label">
                              <input type="checkbox" name="interests" value={interest} />
                              <span className="custom-checkbox" />
                              {interest}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="member-why">Why Join the Athena Institute? *</label>
                        <textarea id="member-why" rows="4" required placeholder="Briefly describe what you hope to achieve and how you can contribute to AIPP's mission..." />
                      </div>
                    </div>

                    <button type="submit" className="form-submit-btn">
                      APPLY FOR MEMBERSHIP
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pathway 2: Volunteer Program */}
        <div
          className={`path-card-interactive ${
            activePathway === "volunteer" ? "expanded" : activePathway ? "dimmed" : ""
          }`}
        >
          <button
            type="button"
            className="path-card-header"
            onClick={() => handleCardClick("volunteer")}
            aria-expanded={activePathway === "volunteer"}
          >
            <div className="path-card-header-left">
              <span className="pathway-eyebrow dark-eyebrow">CONTRIBUTOR STATUS</span>
              <h3 className="path-card-title">Volunteer Program</h3>
              <p className="path-card-description">
                Support policy research logistics, digital advocacy, and administrative
                efforts to assist in high-stakes governance praxis.
              </p>
            </div>
            <span className="path-card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>

          <div className={`interactive-expand-container ${activePathway === "volunteer" ? "expanded" : ""}`}>
            <div className="interactive-expand-content" ref={volunteerFormRef}>
              <div className="path-features-wrapper">
                <h4 className="path-section-subtitle">Volunteer Opportunities</h4>
                <ul className="pathway-list" aria-label="Volunteer opportunities">
                  {volunteerPerks.map((perk, idx) => (
                    <li key={idx} className="pathway-item">
                      <span className="pathway-icon" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="path-form-wrapper">
                {submittedVolunteer ? (
                  <div className="form-success-message">
                    <span className="success-icon" aria-hidden="true">✓</span>
                    <h4>Volunteer Request Logged</h4>
                    <p>Thank you for your service offer. Our Volunteer Logistics Coordinator will get in touch with you shortly to schedule an interview.</p>
                    <button type="button" className="success-reset-btn" onClick={() => setSubmittedVolunteer(false)}>Submit another request</button>
                  </div>
                ) : (
                  <form onSubmit={handleVolunteerSubmit} className="premium-form">
                    <h4 className="form-legend">Volunteer Service Application</h4>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="volunteer-name">Full Name *</label>
                        <input type="text" id="volunteer-name" required placeholder="e.g., Sarah Vance" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="volunteer-email">Email Address *</label>
                        <input type="email" id="volunteer-email" required placeholder="sarah@example.com" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="volunteer-availability">Availability *</label>
                        <select id="volunteer-availability" required defaultValue="">
                          <option value="" disabled>Select Hours/Week</option>
                          <option value="5-10">5 - 10 hours per week</option>
                          <option value="10-20">10 - 20 hours per week</option>
                          <option value="20+">20+ hours per week (Full support)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="volunteer-area">Preferred Area *</label>
                        <select id="volunteer-area" required defaultValue="">
                          <option value="" disabled>Select Area</option>
                          <option value="policy">Policy Design & Analysis</option>
                          <option value="logistics">Logistics for Global Summits</option>
                          <option value="archival">Data Verification & Research</option>
                          <option value="advocacy">Digital Advocacy & Comms</option>
                          <option value="translation">Translation & Localization</option>
                        </select>
                      </div>
                      <div className="form-group full-width">
                        <label htmlFor="volunteer-skills">Key Skills & Capabilities *</label>
                        <input type="text" id="volunteer-skills" required placeholder="e.g., Data analysis, editing, event planning, multi-lingual translation" />
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="volunteer-file" className="file-upload-label">Curriculum Vitae (CV) Upload *</label>
                        <div className="custom-file-upload">
                          <input
                            type="file"
                            id="volunteer-file"
                            required={!volunteerFile}
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setVolunteerFile(e.target.files[0] || null)}
                            onDragEnter={() => setIsVolunteerDragging(true)}
                            onDragLeave={() => setIsVolunteerDragging(false)}
                            onDrop={() => setIsVolunteerDragging(false)}
                          />
                          {volunteerFile ? (
                            <div className="file-upload-dummy file-selected">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              <span>{volunteerFile.name}</span>
                              <span className="file-formats">{(volunteerFile.size / 1024 / 1024).toFixed(2)} MB</span>
                              <button
                                type="button"
                                className="success-reset-btn"
                                style={{ marginTop: "10px", zIndex: 10, position: "relative" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setVolunteerFile(null);
                                  const input = document.getElementById("volunteer-file");
                                  if (input) input.value = "";
                                }}
                              >
                                Remove File
                              </button>
                            </div>
                          ) : (
                            <div className={`file-upload-dummy ${isVolunteerDragging ? "dragging" : ""}`}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                              </svg>
                              <span>Click to browse or drag CV file here</span>
                              <span className="file-formats">Supported formats: PDF, DOC, DOCX up to 10MB</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="volunteer-why">Why Volunteer for AIPP? *</label>
                        <textarea id="volunteer-why" rows="4" required placeholder="Describe your motivations and how you can support our coordination efforts..." />
                      </div>
                    </div>

                    <button type="submit" className="form-submit-btn">
                      REGISTER AS VOLUNTEER
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
