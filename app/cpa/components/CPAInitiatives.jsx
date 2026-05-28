"use client";

const initiatives = [
  {
    category: "Legislative Change",
    title: "Transparency in Lobbying Framework",
    desc: "A multi-year advocacy project aiming to digitalize and democratize access to federal lobbying disclosures.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=75",
    link: "#lobbying-case",
  },
  {
    category: "Civic Education",
    title: "The Youth Voter Literacy Program",
    desc: "Deploying interactive civic resources into digital education platforms for high-school senior groups.",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=75",
    link: "#youth-case",
  },
];

export default function CPAInitiatives() {
  return (
    <section className="cpa-initiatives-section" aria-labelledby="initiatives-title">
      <div className="initiatives-header">
        <h2 id="initiatives-title">Ongoing Initiatives</h2>
        <a className="initiatives-archive-link" href="#archive">
          View Archive <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="initiatives-grid">
        {initiatives.map((init) => (
          <article key={init.title} className="initiative-card">
            <div className="initiative-image-wrapper">
              <img
                src={init.image}
                alt=""
                loading="lazy"
              />
            </div>
            <div className="initiative-body">
              <span className="initiative-cat">{init.category}</span>
              <h3>{init.title}</h3>
              <p>{init.desc}</p>
              <a className="case-study-link" href={init.link}>
                Full Case Study <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
