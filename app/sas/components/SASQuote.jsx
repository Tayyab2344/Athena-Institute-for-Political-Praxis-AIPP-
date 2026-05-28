"use client";

export default function SASQuote() {
  return (
    <section className="sas-quote-section" aria-label="Director statement">
      <div className="sas-quote-container">
        <span className="quote-icon" aria-hidden="true">”</span>
        <blockquote>
          "Political praxis is the ultimate test of human reason. Our simulations do not
          predict the future; they prepare the mind for its inevitable volatility."
        </blockquote>
        <cite>Dr. Elias Bouras, Director of SAS</cite>
      </div>
    </section>
  );
}
