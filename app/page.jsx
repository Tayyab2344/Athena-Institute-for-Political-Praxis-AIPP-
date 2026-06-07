import { DivisionCard, FeatureCard, ProgramCard, PublicationCard } from "./components/Cards";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ArrowLink, SectionHeader } from "./components/Section";

const stats = [
  ["50+", "Leadership labs run"],
  ["12", "Fellowship programs"],
  ["100+", "Policy convenings"],
];

const missionCards = [
  {
    title: "Strategy, Autonomy",
    text: "Empowering leaders to navigate transparency, opinion, and complex frameworks for policy decision-making.",
  },
  {
    title: "Praxis-Oriented",
    text: "Moving beyond rhetoric into the practical mechanics of institutional change and legislative craft.",
  },
  {
    title: "Global Network",
    text: "Creating permanent archives and active cohorts of leaders that serve the future of democratic governance worldwide.",
  },
];

const pillars = [
  {
    icon: "P",
    title: "Practical Political Learning",
    text: "Deep dives into the mechanics of power, from constitutional law to legislative drafting.",
  },
  {
    icon: "S",
    title: "Strategic Simulations",
    text: "High-fidelity crisis management and policy design events to accelerate real-world readiness.",
  },
  {
    icon: "I",
    title: "Policy Innovation",
    text: "Developing new solutions for complex societal challenges through rigorous evidence and research.",
  },
  {
    icon: "L",
    title: "Leadership Development",
    text: "Mentoring the next generation of organizational skills required for top-tier political office.",
  },
  {
    icon: "A",
    title: "Advocacy",
    text: "Building the art of persuasion and the strategic deployment of narrative in the public sphere.",
  },
  {
    icon: "G",
    title: "Governance Understanding",
    text: "An analytical approach to institutional structures, bureaucracies, and global governance.",
  },
];

const divisions = [
  {
    index: "1. Politics",
    label: "Research & Policy Innovation",
    title: "Research & Policy Innovation",
    text: "Producing rigorous academic journals and policy whitepapers that introduce foundations of political thought.",
  },
  {
    index: "2. Application",
    label: "Strategic Action & Simulation",
    title: "Strategic Action & Simulation",
    text: "Interactive environments where leaders test strategies against real-world civic and geopolitical scenarios.",
    featured: true,
  },
  {
    index: "3. Republic",
    label: "Communication & Public Advocacy",
    title: "Communication & Public Advocacy",
    text: "Training in high-stakes communication, media strategy, and the construction of compelling policy narratives.",
  },
];

const programs = [
  {
    title: "Strategic Leadership Summit",
    text: "An annual convergence of global minds to discuss institutional resilience and geopolitical governance.",
    cta: "Register for 2026",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=75",
    priority: true,
  },
  {
    title: "Policy Innovation Lab",
    text: "Closed mentoring and resource extraction for transformative policy prototypes and legislative proposals.",
    cta: "Apply for Cohort V",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=75",
  },
];

const publications = [
  {
    icon: "D",
    title: "Quarterly Report",
    type: "Institutional Frameworks in Multilateral Negotiation",
    text: "An inquiry into the cross-sectional nature of consensus-building among democratic institutions.",
  },
  {
    icon: "B",
    title: "Whitepaper",
    type: "Institutional Resilience in the Digital Era",
    text: "Mapping the impact of civic data, behavioral governance, and platform regulation.",
  },
  {
    icon: "G",
    title: "Analysis",
    type: "Citizenship Diplomacy & Gender Parity",
    text: "A global survey of how gender-aware leadership supports civic power and institutional trust.",
  },
  {
    icon: "R",
    title: "Research Brief",
    type: "The Athena Protocol",
    text: "Decentralized policy-building practices for the age of networked governance.",
  },
];

const partners = ["Oxford Policy", "Harvard Kennedy", "UN Women", "Brookings Inst.", "Chatham House"];

export default function Home() {
  return (
    <main id="top">
      <Header />

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-content">
          <h1 id="hero-title">Advancing Political Cognition. Empowering Leadership.</h1>
          <p>
            The global institute for women-centered political research, leadership simulation,
            and policy innovation.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#publications">
              Explore our Research
            </a>
            <a className="button button-ghost" href="#join">
              Join the Institute
            </a>
          </div>
          <dl className="hero-stats">
            {stats.map(([value, label]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="vision-section section-shell" id="vision">
        <div className="vision-copy reveal-left">
          <span className="rule" aria-hidden="true" />
          <h2>Vision &amp; Mission</h2>
          <p>
            Athena Institute for Political Praxis shapes the critical functions political theory
            and practice into action. We focus on parliamentary reform, institutional strategy,
            and the primary arena of governance innovation.
          </p>
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=760&q=75"
            alt="A modern conference room prepared for policy discussion"
            width="760"
            height="430"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="mission-grid reveal-right">
          {missionCards.map((card) => (
            <article key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-section">
        <div>
          <span aria-hidden="true">”</span>
          <blockquote>
            Politics is an intellectual craft, yet half the world&apos;s intellect remains on the
            periphery.
          </blockquote>
          <p>
            Traditional political education often overlooks the role praxis, coalition
            competencies, women&apos;s historic leadership, and strategic pressure play in the
            productive function and strategic admissions necessary for a new era of governance.
          </p>
        </div>
      </section>

      <section className="section-shell" id="pillars">
        <SectionHeader eyebrow="Foundations of Praxis" title="Our Core Pillars" />
        <div className="feature-grid reveal-up">
          {pillars.map((pillar) => (
            <FeatureCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </section>

      <section className="divisions-section section-shell">
        <SectionHeader eyebrow="Institutional Architecture" title="Core Divisions" />
        <div className="division-grid reveal-up">
          {divisions.map((division) => (
            <DivisionCard key={division.title} {...division} />
          ))}
        </div>
      </section>

      <section className="section-shell programs-section">
        <SectionHeader align="left" eyebrow="Leadership in Practice" title="Featured Programs" />
        <div className="program-grid reveal-up">
          {programs.map((program) => (
            <ProgramCard key={program.title} {...program} />
          ))}
        </div>
      </section>

      <section className="publications-section section-shell" id="publications">
        <SectionHeader
          align="left"
          eyebrow="Insights & Research"
          title="Latest Publications"
          action={<ArrowLink href="#publications">View full archive</ArrowLink>}
        />
        <div className="publication-grid reveal-up">
          {publications.map((publication) => (
            <PublicationCard key={publication.title} {...publication} />
          ))}
        </div>
      </section>

      <section className="partners-section section-shell" id="partners">
        <SectionHeader eyebrow="Strategic Partnerships" title="Global Collaboration" />
        <ul aria-label="Institutional partners">
          {partners.map((partner) => (
            <li key={partner}>{partner}</li>
          ))}
        </ul>
      </section>

      <section className="join-section section-shell" id="join">
        <form className="newsletter-card reveal-left">
          <h2>Stay Informed</h2>
          <p>Subscribe to the Praxis Report for monthly analysis and institutional opinions.</p>
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" />
          <button type="submit">Subscribe</button>
        </form>

        <aside className="member-card reveal-right">
          <h2>Become a Member</h2>
          <p>Join our community of over 50,000 practitioners and gain access to exclusive research and events.</p>
          <ul>
            <li>Early access to publications</li>
            <li>Invitations to closed-door seminars</li>
            <li>Strategic networking platform</li>
          </ul>
          <a href="/join#member">Join the Network</a>
        </aside>
      </section>

      <section className="closing-statement">
        <h2>Transforming Governance Through Intellectual Praxis.</h2>
      </section>

      <Footer />
    </main>
  );
}
