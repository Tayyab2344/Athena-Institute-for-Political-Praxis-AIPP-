import { Publication, Insight, Program, Pillar, StrategicStat } from "@/types";

export const HERO_DATA = {
  eyebrow: "WOMEN IN DIPLOMACY",
  headline: "Women shaping the conversations that shape our world.",
  description: "Advancing research, strategic action, and public advocacy for a stronger voice for women in diplomacy.",
  primaryCta: { text: "Explore Our Work", href: "#pillars" },
  secondaryCta: { text: "Learn About AIPP", href: "#about" },
  mainImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=2000",
  secondaryImage: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=1200",
  tertiaryImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
};

export const INTRO_DATA = {
  statement: "Research. Strategy. Advocacy.",
  paragraph: "The Athena Institute for Political Praxis (AIPP) is a non-partisan international policy institute dedicated to elevating women in diplomatic affairs, statecraft, and multilateral decision-making. Through rigorous empirical research, strategic simulations, and public advocacy, we equip current and emerging women leaders with the tools, networks, and authority to navigate complex global security challenges.",
  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1400",
  imageCaption: "Ambassador Elena Vance addressing the Multilateral Peace Conference in Geneva",
  pathways: [
    {
      number: "01",
      title: "Research",
      description: "Rigorous policy papers, geopolitical risk assessments, and institutional audits informing global governance."
    },
    {
      number: "02",
      title: "Strategic Action",
      description: "Crisis simulation labs, negotiation war-rooms, and executive bilateral training programs."
    },
    {
      number: "03",
      title: "Public Advocacy",
      description: "Elevating female perspectives in international media, summits, and legislative testimony."
    }
  ]
};

export const STATS_DATA: StrategicStat[] = [
  {
    value: "42%",
    label: "Increased Participation",
    description: "In target bilateral diplomatic delegations facilitated by AIPP frameworks."
  },
  {
    value: "150+",
    label: "Policy Publications",
    description: "Cited across international security journals, UN briefs, and ministry archives."
  },
  {
    value: "38",
    label: "Nations Represented",
    description: "By senior fellows and diplomatic simulation participants worldwide."
  }
];

export const PILLARS_DATA: Pillar[] = [
  {
    id: "research-policy",
    number: "01",
    title: "Research & Policy Innovation",
    shortDescription: "Research, policy analysis, publications, and evidence-based thinking shaping conversations around diplomacy and international affairs.",
    fullDescription: "Our research initiatives focus on high-stakes geopolitical domains including peace negotiations, climate diplomacy, nuclear non-proliferation, and cyber governance. We bridge academic rigor with real-world foreign policy decision-making.",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200",
    features: ["Bilateral Conflict Mapping", "Gender Mainstreaming in Treaties", "Institutional Representation Audits"],
    linkText: "Explore Research Initiative",
    linkHref: "#research"
  },
  {
    id: "strategic-action",
    number: "02",
    title: "Strategic Action & Simulation",
    shortDescription: "Diplomatic simulations, workshops, strategic exercises, and programs that transform knowledge into practical experience.",
    fullDescription: "We pioneer immersive diplomatic simulation labs where emerging and seasoned diplomats engage in real-time crisis response, treaty negotiation, and high-pressure strategic bargaining under simulated geopolitical stress.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
    features: ["Crisis Negotiation Labs", "Multilateral Summit Simulations", "Executive Leadership Fellowships"],
    linkText: "Discover Strategic Programs",
    linkHref: "#programs"
  },
  {
    id: "communications-advocacy",
    number: "03",
    title: "Communications & Public Advocacy",
    shortDescription: "Public dialogue, strategic communication, advocacy, media, and storytelling that bring important ideas into wider conversations.",
    fullDescription: "We amplify women's voices in global public discourse through strategic media partnerships, keynote summits, policy briefs for international broadcasts, and digital campaigns that challenge structural barriers in foreign policy.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200",
    features: ["Global Press Summits", "Ambassadorial Dialogues", "Opinion Editorial Syndication"],
    linkText: "View Advocacy Initiatives",
    linkHref: "#insights"
  }
];

export const PUBLICATIONS_DATA: Publication[] = [
  {
    id: "pub-01",
    title: "Women at the Negotiation Table: Impact Metrics in Multilateral Peace Treaties (2000–2025)",
    slug: "women-at-negotiation-table-impact-metrics-peace-treaties",
    category: "Peace & Security",
    categorySlug: "peace-security",
    author: "Dr. Amara Sterling & Ambassador Miriam Chen",
    role: "AIPP Security Studies Directorate",
    date: "August 2026",
    publicationDate: "2026-08-20",
    publishedAt: "2026-08-20",
    year: 2026,
    type: "RESEARCH_PAPER",
    status: "PUBLISHED",
    excerpt: "A comprehensive 25-year empirical assessment demonstrating how structured female inclusion in ceasefire negotiations correlates with a 35% increase in treaty longevity across 40 post-conflict zones.",
    abstract: "A comprehensive 25-year empirical assessment demonstrating how structured female inclusion in ceasefire negotiations correlates with a 35% increase in treaty longevity across 40 post-conflict zones worldwide.",
    description: "This landmark study analyzes 120 bilateral and multilateral negotiations between 2000 and 2025. Leveraging quantitative regression models and qualitative delegation audits, the paper outlines structural mechanisms through which female negotiators introduce durable post-conflict economic provisions and legal enforcement safeguards.",
    pages: 48,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000",
    coverImageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000",
    pdfUrl: null,
    featured: true,
    doi: "10.1080/aipp.sec.2026.04",
    downloadCount: 1420,
    authors: [
      { name: "Dr. Amara Sterling", slug: "dr-amara-sterling" },
      { name: "Ambassador Miriam Chen", slug: "ambassador-miriam-chen" }
    ],
    tags: [
      { name: "Women", slug: "women" },
      { name: "Diplomacy", slug: "diplomacy" },
      { name: "Peace", slug: "peace" },
      { name: "Security", slug: "security" }
    ]
  },
  {
    id: "pub-02",
    title: "Reframing AI Governance: Female Leadership in Emerging Technology Diplomacy",
    slug: "reframing-ai-governance-female-leadership-technology-diplomacy",
    category: "Global Governance",
    categorySlug: "global-governance",
    author: "Sophia Al-Mansoor",
    role: "AIPP Technology & Governance Working Group",
    date: "July 2026",
    publicationDate: "2026-07-28",
    publishedAt: "2026-07-28",
    year: 2026,
    type: "POLICY_BRIEF",
    status: "PUBLISHED",
    excerpt: "Strategic recommendations for integrating human-centric ethical frameworks into international artificial intelligence treaties and multilateral technology standards.",
    abstract: "Strategic recommendations for integrating human-centric ethical frameworks into international artificial intelligence treaties and multilateral technology standards.",
    description: "As foreign policy establishments confront rapid generative AI deployment, this policy brief offers actionable guidance for chief negotiators to imbed rights-respecting standards into global tech pacts.",
    pages: 18,
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    coverImageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    pdfUrl: null,
    doi: "10.1080/aipp.tech.2026.02",
    downloadCount: 890,
    authors: [
      { name: "Sophia Al-Mansoor", slug: "sophia-al-mansoor" }
    ],
    tags: [
      { name: "Women", slug: "women" },
      { name: "Policy", slug: "policy" },
      { name: "Technology", slug: "technology" }
    ]
  },
  {
    id: "pub-03",
    title: "Climate Statecraft in the Indo-Pacific: Women-Led Coastal Resilience Treaties",
    slug: "climate-statecraft-indo-pacific-women-led-coastal-resilience",
    category: "Foreign Policy",
    categorySlug: "foreign-policy",
    author: "Dr. Katelyn Thorne",
    role: "AIPP Climate Security Initiative",
    date: "June 2026",
    publicationDate: "2026-06-14",
    publishedAt: "2026-06-14",
    year: 2026,
    type: "REPORT",
    status: "PUBLISHED",
    excerpt: "Examining regional pacts spearheaded by Pacific Island women leaders to protect maritime sovereignty and coastal economies under rising sea levels.",
    abstract: "Examining regional pacts spearheaded by Pacific Island women leaders to protect maritime sovereignty and coastal economies under rising sea levels.",
    description: "Coastal and island nations face existential threats requiring innovative legal statecraft. This comprehensive report documents 8 women-led regional initiatives that established legal precedents for maritime boundary retention.",
    pages: 34,
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    coverImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    pdfUrl: null,
    doi: "10.1080/aipp.clim.2026.01",
    downloadCount: 670,
    authors: [
      { name: "Dr. Katelyn Thorne", slug: "dr-katelyn-thorne" }
    ],
    tags: [
      { name: "Women", slug: "women" },
      { name: "Diplomacy", slug: "diplomacy" },
      { name: "Climate", slug: "climate" }
    ]
  },
  {
    id: "pub-04",
    title: "Institutional Barriers in Foreign Ministries: A Global Audit of Female Ambassadors",
    slug: "institutional-barriers-foreign-ministries-female-ambassadors-audit",
    category: "Women & Leadership",
    categorySlug: "women-leadership",
    author: "Ambassador Miriam Chen & Dr. Amara Sterling",
    role: "AIPP Diplomatic Audit Taskforce",
    date: "May 2026",
    publicationDate: "2026-05-10",
    publishedAt: "2026-05-10",
    year: 2026,
    type: "JOURNAL",
    status: "PUBLISHED",
    excerpt: "Surveying career progression, assignment bias, and structural retention factors across 52 foreign ministries globally.",
    abstract: "Surveying career progression, assignment bias, and structural retention factors across 52 foreign ministries globally.",
    description: "Despite increased female enrollment in diplomatic academies, structural bottlenecks persist at ambassadorial appointments. This journal article provides empirical recommendations for systemic career reform.",
    pages: 62,
    coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
    coverImageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
    pdfUrl: null,
    doi: "10.1080/aipp.audit.2026.03",
    downloadCount: 1100,
    authors: [
      { name: "Ambassador Miriam Chen", slug: "ambassador-miriam-chen" },
      { name: "Dr. Amara Sterling", slug: "dr-amara-sterling" }
    ],
    tags: [
      { name: "Women", slug: "women" },
      { name: "Leadership", slug: "leadership" },
      { name: "Policy", slug: "policy" }
    ]
  },
  {
    id: "pub-05",
    title: "Crisis Simulation Praxis: Preparing Female Envoys for Multilateral Deadlock",
    slug: "crisis-simulation-praxis-female-envoys-multilateral-deadlock",
    category: "Diplomacy",
    categorySlug: "diplomacy",
    author: "Dr. Amara Sterling",
    role: "AIPP Simulation Directorate",
    date: "November 2025",
    publicationDate: "2025-11-18",
    publishedAt: "2025-11-18",
    year: 2025,
    type: "RESEARCH_PAPER",
    status: "PUBLISHED",
    excerpt: "An empirical assessment of high-stress crisis simulation pedagogies in equipping emerging women envoys to break multilateral negotiation deadlocks.",
    abstract: "An empirical assessment of high-stress crisis simulation pedagogies in equipping emerging women envoys to break multilateral negotiation deadlocks.",
    description: "Examining 18 cohort simulations across Geneva and Vienna, this paper quantifies how tactical scenario testing accelerates negotiation agility under severe time constraints.",
    pages: 52,
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    coverImageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    pdfUrl: null,
    doi: "10.1080/aipp.dip.2025.11",
    downloadCount: 940,
    authors: [
      { name: "Dr. Amara Sterling", slug: "dr-amara-sterling" }
    ],
    tags: [
      { name: "Diplomacy", slug: "diplomacy" },
      { name: "Leadership", slug: "leadership" }
    ]
  },
  {
    id: "pub-06",
    title: "Gender Mainstreaming in Bilateral Trade Accords: Verification Protocols and Enforcement",
    slug: "gender-mainstreaming-bilateral-trade-accords-verification",
    category: "Gender & Policy",
    categorySlug: "gender-policy",
    author: "Sophia Al-Mansoor",
    role: "AIPP Trade & Governance Division",
    date: "September 2025",
    publicationDate: "2025-09-08",
    publishedAt: "2025-09-08",
    year: 2025,
    type: "POLICY_BRIEF",
    status: "PUBLISHED",
    excerpt: "Actionable protocols for auditing labor, procurement, and intellectual property chapters in bilateral trade accords through a gender lens.",
    abstract: "Actionable protocols for auditing labor, procurement, and intellectual property chapters in bilateral trade accords through a gender lens.",
    description: "Trade agreements often omit actionable gender impact metrics. This policy brief provides ministerial trade delegations with statutory checklists for bilateral compliance.",
    pages: 22,
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    coverImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    pdfUrl: null,
    doi: "10.1080/aipp.trade.2025.09",
    downloadCount: 780,
    authors: [
      { name: "Sophia Al-Mansoor", slug: "sophia-al-mansoor" }
    ],
    tags: [
      { name: "Policy", slug: "policy" },
      { name: "Governance", slug: "governance" }
    ]
  },
  {
    id: "pub-07",
    title: "Multilateralism Under Fragmentation: Middle-Power Coalitions and Female Statecraft",
    slug: "multilateralism-fragmentation-middle-power-coalitions",
    category: "International Relations",
    categorySlug: "international-relations",
    author: "Ambassador Miriam Chen",
    role: "AIPP Diplomatic Council",
    date: "April 2025",
    publicationDate: "2025-04-12",
    publishedAt: "2025-04-12",
    year: 2025,
    type: "REPORT",
    status: "PUBLISHED",
    excerpt: "How women foreign ministers in middle-power nations are forming agile plurilateral coalitions to uphold multilateral norms amidst great power rivalry.",
    abstract: "How women foreign ministers in middle-power nations are forming agile plurilateral coalitions to uphold multilateral norms amidst great power rivalry.",
    description: "Analyzing recent voting coalitions in UN General Assembly resolutions, this report documents the rise of flexible diplomatic blocs led by women chief diplomats.",
    pages: 44,
    coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
    coverImageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
    pdfUrl: null,
    doi: "10.1080/aipp.ir.2025.04",
    downloadCount: 1250,
    authors: [
      { name: "Ambassador Miriam Chen", slug: "ambassador-miriam-chen" }
    ],
    tags: [
      { name: "Diplomacy", slug: "diplomacy" },
      { name: "Governance", slug: "governance" }
    ]
  },
  {
    id: "pub-08",
    title: "Post-Conflict Economic Safeguards: Cross-National Analysis of Ceasefire Accords",
    slug: "post-conflict-economic-safeguards-ceasefire-accords",
    category: "Peace & Security",
    categorySlug: "peace-security",
    author: "Dr. Amara Sterling & Dr. Katelyn Thorne",
    role: "AIPP Security Studies Directorate",
    date: "December 2024",
    publicationDate: "2024-12-05",
    publishedAt: "2024-12-05",
    year: 2024,
    type: "JOURNAL",
    status: "PUBLISHED",
    excerpt: "Evaluating post-conflict recovery longevity when women negotiators secure dedicated budgetary allocations for civic reconstruction and judicial reform.",
    abstract: "Evaluating post-conflict recovery longevity when women negotiators secure dedicated budgetary allocations for civic reconstruction and judicial reform.",
    description: "Cross-national statistical review demonstrating that peace accords with earmarked economic recovery protocols supervised by female civil society observers experience 60% lower re-armament indices.",
    pages: 58,
    coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
    coverImageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
    pdfUrl: null,
    doi: "10.1080/aipp.econ.2024.12",
    downloadCount: 1310,
    authors: [
      { name: "Dr. Amara Sterling", slug: "dr-amara-sterling" },
      { name: "Dr. Katelyn Thorne", slug: "dr-katelyn-thorne" }
    ],
    tags: [
      { name: "Peace", slug: "peace" },
      { name: "Security", slug: "security" },
      { name: "Women", slug: "women" }
    ]
  },
  {
    id: "pub-09",
    title: "Track-I Mediation Architecture: Reassessing Mandate Distribution in Geneva Talks",
    slug: "track-i-mediation-architecture-mandate-distribution-geneva",
    category: "Diplomacy",
    categorySlug: "diplomacy",
    author: "Ambassador Miriam Chen",
    role: "AIPP Diplomatic Council",
    date: "July 2024",
    publicationDate: "2024-07-22",
    publishedAt: "2024-07-22",
    year: 2024,
    type: "POLICY_BRIEF",
    status: "PUBLISHED",
    excerpt: "A tactical analysis of chief mediator delegation appointments and their systemic correlation with successful ratification in high-intensity civil conflict.",
    abstract: "A tactical analysis of chief mediator delegation appointments and their systemic correlation with successful ratification in high-intensity civil conflict.",
    description: "Re-evaluating five key Track-I mediation processes in Geneva, this policy brief demonstrates the institutional leverage unlocked when female diplomats lead statutory plenary clusters.",
    pages: 26,
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800",
    coverImageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800",
    pdfUrl: null,
    doi: "10.1080/aipp.geneva.2024.07",
    downloadCount: 920,
    authors: [
      { name: "Ambassador Miriam Chen", slug: "ambassador-miriam-chen" }
    ],
    tags: [
      { name: "Diplomacy", slug: "diplomacy" },
      { name: "Leadership", slug: "leadership" }
    ]
  }
];

export const PROGRAMS_DATA: Program[] = [
  {
    id: "prog-01",
    title: "Global Diplomatic Simulation Summit",
    subtitle: "High-Stakes Crisis Simulation",
    description: "An intensive 4-day immersive multilateral simulation uniting 60 emerging female diplomats to resolve a simulated Indo-Pacific maritime escalation.",
    category: "Simulation",
    image: "/ideas-strategy.jpg",
    location: "Geneva & Online Hybrid",
    dates: "October 14–18, 2026",
    participants: "60 Selected Fellows",
    featured: true
  },
  {
    id: "prog-02",
    title: "Bilateral Negotiation Executive Workshop",
    subtitle: "Masterclass in Mediation Strategy",
    description: "Advanced negotiation techniques led by veteran ambassadors, focusing on leverage building, deadlock breaking, and multi-party alignment.",
    category: "Workshop",
    image: "/ideas-research.jpg",
    location: "Vienna Policy Center",
    dates: "November 02–05, 2026",
    participants: "25 Executive Participants"
  },
  {
    id: "prog-03",
    title: "Women in Security Strategic Assembly",
    subtitle: "Annual Policy Leadership Forum",
    description: "A high-level dialogue co-hosted with international institutions, connecting mid-career diplomats with ministers of foreign affairs.",
    category: "Strategic Summit",
    image: "/offer-women-summit.jpg",
    location: "Brussels Diplomatic Hub",
    dates: "December 08–10, 2026",
    participants: "120 International Delegates"
  },
  {
    id: "prog-04",
    title: "Diplomatic Praxis Executive Fellowship",
    subtitle: "Senior Track-I Statecraft Mentorship",
    description: "A competitive cohort fellowship connecting high-potential women foreign service officers with seasoned chief negotiators, empirical treaty research, and bilateral conflict mediation labs.",
    category: "Fellowship",
    image: "/hero-diplomat.jpg",
    location: "Geneva, Vienna & Hybrid",
    dates: "Spring–Autumn 2026 Cohort",
    participants: "15 Executive Fellows"
  }
];

export const INSIGHTS_DATA: Insight[] = [
  {
    id: "ins-01",
    title: "Beyond Tokenism: Why Strategic Multilateralism Requires Female Chief Negotiators",
    category: "Commentary",
    author: "AIPP Strategic Perspectives",
    role: "Athena Institute for Political Praxis",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    date: "August 24, 2026",
    readTime: "6 min read",
    excerpt: "Appointing women to ceremonial diplomatic delegations without granting tactical negotiating mandates weakens crisis resolution outcomes. Here is how foreign policy establishments can realign incentive structures.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1400",
    featured: true
  },
  {
    id: "ins-02",
    title: "The Silent Architecture of Cyber Diplomacy: Women Leading De-escalation Frameworks",
    category: "Expert Perspective",
    author: "AIPP Cyber Policy Initiative",
    role: "Athena Institute for Political Praxis",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    date: "August 18, 2026",
    readTime: "4 min read",
    excerpt: "How women cyber analysts and diplomats are shaping critical infrastructure defense norms away from aggressive deterrence models.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1400"
  },
  {
    id: "ins-03",
    title: "Rebuilding Trust in Multilateral Institutions: Lessons from Global South Women Leaders",
    category: "Analysis",
    author: "AIPP Governance Analysis",
    role: "Athena Institute for Political Praxis",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200",
    date: "August 10, 2026",
    readTime: "7 min read",
    excerpt: "Institutional credibility can only be restored when Southern voices are backed by actionable policy levers rather than regional quotas.",
    image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&q=80&w=1400"
  }
];

export const NAV_LINKS = [
  { name: "About", href: "/about" },
  { name: "What We Offer", href: "/what-we-offer" },
  { name: "Research", href: "/research" },
  { name: "Programs", href: "/#programs" },
  { name: "Insights", href: "/#insights" },
  { name: "Get Involved", href: "/#get-involved" }
];
