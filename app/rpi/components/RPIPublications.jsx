"use client";

const publications = [
  {
    tag: "White Paper",
    title: "Digital Sovereignty in the Age of Algorithmic Governance",
    meta: "Dr. Elias Bouras · Oct 2025",
  },
  {
    tag: "Policy Brief",
    title: "Reforming Multilateral Trade Agreements for Climate Resilience",
    meta: "Maria Al-Tayyeb · Sept 2025",
  },
  {
    tag: "Journal",
    title: "The Erosion of Institutional Trust: A Global Meta-Analysis",
    meta: "Johan Schmidt · Aug 2025",
  },
  {
    tag: "Annual Report",
    title: "Civic Participation Trends in Post-Industrial Economies",
    meta: "Sarah Jenkins · July 2025",
  },
];

export default function RPIPublications() {
  return (
    <section className="rpi-publications-section" aria-labelledby="publications-title">
      <div className="publications-header">
        <div>
          <h2 id="publications-title">Latest Research &amp; Publications</h2>
        </div>
        <a className="publications-browse-link" href="#publications">
          View All Repository <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="publications-grid">
        {publications.map((pub) => (
          <article key={pub.title} className="pub-card">
            <div className="pub-cover-placeholder">
              <span className="pub-tag">{pub.tag}</span>
            </div>
            <div className="pub-body">
              <h3>{pub.title}</h3>
              <span className="pub-meta">{pub.meta}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
