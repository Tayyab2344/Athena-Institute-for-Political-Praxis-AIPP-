"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    subject: "",
    message: ""
  });

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

  return (
    <main id="top" className="contact-page-container">
      <Header />
      
      {/* Contact Hero */}
      <section className="about-hero" aria-labelledby="contact-hero-title">
        <div className="about-hero-glow" aria-hidden="true" />
        <div className="about-hero-content">
          <span className="rule" aria-hidden="true" />
          <h1 id="contact-hero-title">
            Contact the Institute
          </h1>
          <p>
            For inquiries regarding our research, leadership simulations, policy papers, or institutional framework. Get in touch with our team directly.
          </p>
        </div>
      </section>

      {/* Inquiry Channels / Cards */}
      <section className="section-shell" id="channels" style={{ borderBottom: "1px solid var(--line)", background: "var(--white)" }}>
        <div className="feature-grid reveal-up" style={{ marginTop: 0 }}>
          <div className="feature-card">
            <span className="line-icon" aria-hidden="true">G</span>
            <h3 style={{ marginTop: "20px", fontSize: "18px", color: "var(--navy)" }}>General Inquiries</h3>
            <p style={{ marginTop: "8px", fontSize: "12.5px" }}>
              For general questions regarding the Athena Institute, program participation, or general administration.
            </p>
            <a href="mailto:office@aipp.org" style={{ display: "inline-block", marginTop: "12px", color: "var(--gold)", fontFamily: "var(--sans)", fontSize: "12px", fontWeight: "800" }}>
              office@aipp.org &rarr;
            </a>
          </div>

          <div className="feature-card">
            <span className="line-icon" aria-hidden="true">M</span>
            <h3 style={{ marginTop: "20px", fontSize: "18px", color: "var(--navy)" }}>Media &amp; Press</h3>
            <p style={{ marginTop: "8px", fontSize: "12.5px" }}>
              For press inquiries, publication rights, and interview scheduling with our researchers and experts.
            </p>
            <a href="mailto:media@aipp.org" style={{ display: "inline-block", marginTop: "12px", color: "var(--gold)", fontFamily: "var(--sans)", fontSize: "12px", fontWeight: "800" }}>
              media@aipp.org &rarr;
            </a>
          </div>

          <div className="feature-card">
            <span className="line-icon" aria-hidden="true">P</span>
            <h3 style={{ marginTop: "20px", fontSize: "18px", color: "var(--navy)" }}>Partnerships</h3>
            <p style={{ marginTop: "8px", fontSize: "12.5px" }}>
              For academic affiliations, leadership lab sponsorships, and policy prototyping collaborations.
            </p>
            <a href="mailto:partnerships@aipp.org" style={{ display: "inline-block", marginTop: "12px", color: "var(--gold)", fontFamily: "var(--sans)", fontSize: "12px", fontWeight: "800" }}>
              partnerships@aipp.org &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="section-shell" id="contact-form-section">
        <div style={{ maxWidth: "800px", margin: "0 auto" }} className="reveal-up">
          <div className="path-form-wrapper" style={{ background: "var(--white)", border: "1px solid var(--line)", padding: "clamp(24px, 5vw, 42px)", boxShadow: "var(--shadow)" }}>
            {submitted ? (
              <div className="form-success-message" style={{ textAlign: "center", padding: "40px 20px" }}>
                <span className="success-icon" style={{ display: "inline-grid", placeItems: "center", width: "60px", height: "60px", background: "rgba(201, 154, 66, 0.1)", color: "var(--gold)", borderRadius: "50%", fontSize: "30px", marginBottom: "20px" }} aria-hidden="true">✓</span>
                <h4 style={{ fontSize: "22px", color: "var(--navy)", margin: "0 0 10px", fontWeight: "400" }}>Inquiry Submitted Successfully</h4>
                <p style={{ color: "var(--muted)", fontFamily: "var(--sans)", fontSize: "14px", margin: "0 auto 24px", maxWidth: "480px" }}>
                  Thank you for contacting us. A member of our team will review your message and respond to you at the provided email address as soon as possible.
                </p>
                <button type="button" className="success-reset-btn" onClick={handleReset}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="premium-form">
                <h4 className="form-legend" style={{ fontSize: "22px", color: "var(--navy)", borderBottom: "1px solid var(--line)", paddingBottom: "16px", marginBottom: "24px", fontWeight: "400" }}>
                  Send an Inquiry
                </h4>
                
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
                      placeholder="e.g., Request for Fellowship Details" 
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

                <button type="submit" className="form-submit-btn">
                  SEND INQUIRY
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
