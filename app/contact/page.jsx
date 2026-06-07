"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactPage() {
  // Form state
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    subject: "",
    message: ""
  });

  // Clocks state
  const [times, setTimes] = useState({
    geneva: "",
    london: "",
    dc: ""
  });

  const [statuses, setStatuses] = useState({
    geneva: false,
    london: false,
    dc: false
  });

  // FAQ state
  const [activeFaq, setActiveFaq] = useState(null);

  // Time Zones Clocks & Statuses Logic
  useEffect(() => {
    const updateClocks = () => {
      const getFormattedTime = (timeZone) => {
        return new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }).format(new Date());
      };

      const checkOpenStatus = (timeZone) => {
        const hourString = new Intl.DateTimeFormat("en-GB", {
          timeZone,
          hour: "numeric",
          hour12: false
        }).format(new Date());

        const dayString = new Intl.DateTimeFormat("en-GB", {
          timeZone,
          weekday: "short"
        }).format(new Date());

        const hour = parseInt(hourString, 10);
        const isWeekend = dayString === "Sat" || dayString === "Sun";
        
        // Open Mon-Fri, 9:00 AM - 5:00 PM (9:00 - 17:00)
        return hour >= 9 && hour < 17 && !isWeekend;
      };

      setTimes({
        geneva: getFormattedTime("Europe/Paris"),
        london: getFormattedTime("Europe/London"),
        dc: getFormattedTime("America/New_York")
      });

      setStatuses({
        geneva: checkOpenStatus("Europe/Paris"),
        london: checkOpenStatus("Europe/London"),
        dc: checkOpenStatus("America/New_York")
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      type: "",
      subject: "",
      message: ""
    });
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How are research applications evaluated at AIPP?",
      a: "Our Academic Review Board evaluates proposal submissions quarterly. We look for rigorous methodology, alignment with practical democratic governance, and parity-centered frameworks."
    },
    {
      q: "Can outside organizations co-sponsor a Policy Simulation Lab?",
      a: "Yes. We collaborate with select multilateral institutions, university departments, and think tanks to host simulations. Contact the Partnerships team for detailed guidelines."
    },
    {
      q: "What is the average response window for inquiries?",
      a: "General inquiries are normally processed within 3 business days. Press inquiries and urgent media commentary requests are prioritized and handled within 4–12 hours."
    },
    {
      q: "Are your publications open-access or subscription-only?",
      a: "Our quarterly whitepapers and research briefs are open-access. However, the printed Quarterly Journal of Praxis is reserved exclusively for registered institutional members."
    }
  ];

  return (
    <main id="top" className="contact-page-container">
      <Header />
      
      {/* Contact Hero - Dark, Premium style matching SAS/RPI */}
      <section className="sas-hero" aria-labelledby="contact-hero-title" style={{ minHeight: "520px", padding: "160px 24px 60px" }}>
        <div 
          className="sas-hero-background" 
          aria-hidden="true" 
          style={{
            background: `linear-gradient(180deg, rgba(6, 20, 43, 0.45) 0%, rgba(6, 20, 43, 0.92) 100%),
                         linear-gradient(90deg, rgba(6, 20, 43, 0.94) 0%, rgba(6, 20, 43, 0.75) 50%, rgba(6, 20, 43, 0.44)),
                         url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80") center / cover`
          }}
        />
        <div className="sas-hero-content">
          <div className="sas-hero-eyebrow">
            <span>Get in Touch</span>
          </div>
          <h1 id="contact-hero-title">
            Connect with <span className="text-gold">Athena Institute</span>
          </h1>
          <p style={{ maxWidth: "660px" }}>
            Reach out to our global team to discuss research collaborations, legislative drafting workshops, media commentaries, or general institutional inquiries.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="section-shell">
        <div className="contact-layout-grid reveal-up">
          
          {/* Left Column: Premium Contact Form */}
          <div className="premium-contact-form-card">
            {submitted ? (
              <div className="form-success-message">
                <span className="success-icon" aria-hidden="true">✓</span>
                <h4>Inquiry Submitted Successfully</h4>
                <p>
                  Thank you, {formData.name}. Your inquiry has been routed to our team. We will review your message and respond to you at <strong>{formData.email}</strong> shortly.
                </p>
                <button type="button" className="success-reset-btn" onClick={handleReset}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="premium-form">
                <h2 style={{ fontSize: "28px", color: "var(--navy)", margin: "0 0 8px", fontWeight: "400", fontFamily: "var(--serif)" }}>
                  Send an Inquiry
                </h2>
                <p style={{ color: "var(--muted)", fontFamily: "var(--sans)", fontSize: "13.5px", margin: "0 0 32px" }}>
                  Please fill out the form below and our coordinators will route it to the appropriate department.
                </p>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input 
                      type="text" 
                      id="contact-name" 
                      required 
                      placeholder="e.g., Dr. Elena Rostova" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input 
                      type="email" 
                      id="contact-email" 
                      required 
                      placeholder="elena@university.edu" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="contact-type">Inquiry Type *</label>
                    <select 
                      id="contact-type" 
                      required 
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="" disabled>Select Inquiry Type</option>
                      <option value="general">General &amp; Academic Inquiry</option>
                      <option value="media">Media &amp; Press Relations</option>
                      <option value="partnership">Institutional Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="contact-subject">Subject *</label>
                    <input 
                      type="text" 
                      id="contact-subject" 
                      required 
                      placeholder="e.g., Request for Simulation Partnership Details" 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="contact-message">Message *</label>
                    <textarea 
                      id="contact-message" 
                      rows="6" 
                      required 
                      placeholder="Please details your inquiry here. Be as specific as possible so we can route your message to the correct division..." 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="form-submit-btn" style={{ marginTop: "24px" }}>
                  SEND INQUIRY
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Office Clocks & FAQ Accordion */}
          <div className="contact-sidebar">
            
            {/* World Offices Hubs */}
            <div>
              <h2 className="faq-section-title" style={{ marginTop: 0 }}>Global Office Hubs</h2>
              <div style={{ display: "grid", gap: "20px" }}>
                
                {/* Hub 1: Geneva */}
                <div className="contact-office-card">
                  <div className="office-card-header">
                    <h3 className="office-title">Geneva Headquarters</h3>
                    <span className="office-status-badge" style={{ color: statuses.geneva ? "#2ec4b6" : "#e63946" }}>
                      <span className={`status-dot ${statuses.geneva ? "open" : "closed"}`} />
                      {statuses.geneva ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="office-time">{times.geneva || "Loading Geneva Time..."}</div>
                  <ul className="office-details-list">
                    <li><strong>Venue:</strong> Rue de la Paix 18, Geneva, Switzerland</li>
                    <li><strong>Phone:</strong> +41 22 749 0100</li>
                    <li><strong>Email:</strong> <a href="mailto:geneva@aipp.org">geneva@aipp.org</a></li>
                  </ul>
                </div>

                {/* Hub 2: London */}
                <div className="contact-office-card">
                  <div className="office-card-header">
                    <h3 className="office-title">London Policy Research</h3>
                    <span className="office-status-badge" style={{ color: statuses.london ? "#2ec4b6" : "#e63946" }}>
                      <span className={`status-dot ${statuses.london ? "open" : "closed"}`} />
                      {statuses.london ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="office-time">{times.london || "Loading London Time..."}</div>
                  <ul className="office-details-list">
                    <li><strong>Venue:</strong> Great Smith St, Westminster, London, UK</li>
                    <li><strong>Phone:</strong> +44 20 7901 3000</li>
                    <li><strong>Email:</strong> <a href="mailto:london@aipp.org">london@aipp.org</a></li>
                  </ul>
                </div>

                {/* Hub 3: Washington D.C. */}
                <div className="contact-office-card">
                  <div className="office-card-header">
                    <h3 className="office-title">Washington D.C. Advocacy</h3>
                    <span className="office-status-badge" style={{ color: statuses.dc ? "#2ec4b6" : "#e63946" }}>
                      <span className={`status-dot ${statuses.dc ? "open" : "closed"}`} />
                      {statuses.dc ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="office-time">{times.dc || "Loading Washington D.C. Time..."}</div>
                  <ul className="office-details-list">
                    <li><strong>Venue:</strong> Constitution Ave NW, Washington, D.C., USA</li>
                    <li><strong>Phone:</strong> +1 202 546 1200</li>
                    <li><strong>Email:</strong> <a href="mailto:dc@aipp.org">dc@aipp.org</a></li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Accordion FAQ */}
            <div>
              <h2 className="faq-section-title">Frequently Asked Questions</h2>
              <div className="faq-accordion">
                {faqs.map((faq, idx) => {
                  const isActive = activeFaq === idx;
                  return (
                    <div key={idx} className={`faq-item ${isActive ? "active" : ""}`}>
                      <button
                        type="button"
                        className="faq-trigger"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isActive}
                      >
                        {faq.q}
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <div 
                        className="faq-content-wrapper" 
                        style={{ maxHeight: isActive ? "180px" : "0" }}
                      >
                        <div className="faq-content">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
