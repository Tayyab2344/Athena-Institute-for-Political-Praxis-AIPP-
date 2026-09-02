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
    category: "Research Paper",
    author: "Dr. Amara Sterling & Ambassador Miriam Chen",
    role: "Senior Research Fellows, AIPP Security Studies",
    date: "August 2026",
    excerpt: "A comprehensive 25-year empirical assessment demonstrating how structured female inclusion in ceasefire negotiations correlates with a 35% increase in treaty longevity across 40 post-conflict zones.",
    pages: 48,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000",
    pdfUrl: "#",
    featured: true,
    doi: "10.1080/aipp.sec.2026.04",
    downloadCount: 1420
  },
  {
    id: "pub-02",
    title: "Reframing AI Governance: Female Leadership in Emerging Technology Diplomacy",
    category: "Policy Brief",
    author: "Sophia Al-Mansoor",
    role: "Director of Technology & Diplomacy",
    date: "July 2026",
    excerpt: "Strategic recommendations for integrating human-centric ethical frameworks into international artificial intelligence treaties.",
    pages: 18,
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    pdfUrl: "#",
    doi: "10.1080/aipp.tech.2026.02"
  },
  {
    id: "pub-03",
    title: "Climate Statecraft in the Indo-Pacific: Women-Led Coastal Resilience Treaties",
    category: "Report",
    author: "Dr. Katelyn Thorne",
    role: "Chair of Climate Security Praxis",
    date: "June 2026",
    excerpt: "Examining regional pacts spearheaded by Pacific Island women leaders to protect maritime sovereignty under rising sea levels.",
    pages: 34,
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    pdfUrl: "#",
    doi: "10.1080/aipp.clim.2026.01"
  },
  {
    id: "pub-04",
    title: "Institutional Barriers in Foreign Ministries: A Global Survey of Female Ambassadors",
    category: "Journal",
    author: "AIPP Global Taskforce",
    role: "Diplomatic Audit Division",
    date: "May 2026",
    excerpt: "Surveying career progression, assignment bias, and structural retention factors across 52 foreign ministries.",
    pages: 62,
    coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
    pdfUrl: "#",
    doi: "10.1080/aipp.audit.2026.03"
  }
];

export const PROGRAMS_DATA: Program[] = [
  {
    id: "prog-01",
    title: "Global Diplomatic Simulation Summit",
    subtitle: "High-Stakes Crisis Simulation",
    description: "An intensive 4-day immersive multilateral simulation uniting 60 emerging female diplomats to resolve a simulated Indo-Pacific maritime escalation.",
    category: "Simulation",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1400",
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
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1400",
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
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1400",
    location: "Brussels Diplomatic Hub",
    dates: "December 08–10, 2026",
    participants: "120 International Delegates"
  }
];

export const INSIGHTS_DATA: Insight[] = [
  {
    id: "ins-01",
    title: "Beyond Tokenism: Why Strategic Multilateralism Requires Female Chief Negotiators",
    category: "Commentary",
    author: "Ambassador Patricia Howard",
    role: "Former UN Envoy & AIPP Senior Trustee",
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
    author: "Elena Rostova",
    role: "Head of Cyber Policy Studies",
    avatar: "https://images.unsplash.com/photo-1580894732413-a75151b1424e?auto=format&fit=crop&q=80&w=200",
    date: "August 18, 2026",
    readTime: "4 min read",
    excerpt: "How women cyber analysts and diplomats are shaping critical infrastructure defense norms away from aggressive deterrence models.",
    image: "https://images.unsplash.com/photo-1580894732413-a75151b1424e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "ins-03",
    title: "Rebuilding Trust in Multilateral Institutions: Lessons from Global South Women Leaders",
    category: "Analysis",
    author: "Dr. Amina Diallo",
    role: "Senior Fellow, African Governance Praxis",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200",
    date: "August 10, 2026",
    readTime: "7 min read",
    excerpt: "Institutional credibility can only be restored when Southern voices are backed by actionable policy levers rather than regional quotas.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
  }
];

export const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "What We Offer", href: "#pillars" },
  { name: "Research", href: "#research" },
  { name: "Programs", href: "#programs" },
  { name: "Insights", href: "#insights" },
  { name: "Get Involved", href: "#get-involved" }
];
