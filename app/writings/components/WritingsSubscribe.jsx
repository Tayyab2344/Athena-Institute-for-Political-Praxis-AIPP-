"use client";

import { useState } from "react";

export default function WritingsSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 800);
  };

  return (
    <section className="writings-subscribe-section" aria-labelledby="subscribe-title">
      <div className="subscribe-card">
        <div className="subscribe-icon-wrapper" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <h2 id="subscribe-title">Institutional Intelligence</h2>
        <p className="subscribe-desc">
          Receive our monthly digest of policy insights and archive updates directly from the fellows at Athena Institute.
        </p>

        {status === "success" ? (
          <div className="subscribe-success-msg" role="status">
            <span className="success-check">&bull;</span>
            <p>Thank you for subscribing. You have been added to the register.</p>
          </div>
        ) : (
          <form className="subscribe-form" onSubmit={handleSubmit}>
            <div className="subscribe-input-group">
              <label htmlFor="subscribe-email" className="visually-hidden">Email address</label>
              <input
                id="subscribe-email"
                type="email"
                placeholder="professore@institution.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
              />
              <button 
                type="submit" 
                className={status === "loading" ? "loading" : ""}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>
        )}

        <span className="subscribe-disclaimer">
          STRICT ADHERENCE TO RESEARCH ETHICS &amp; PRIVACY FRAMEWORKS
        </span>
      </div>
    </section>
  );
}
