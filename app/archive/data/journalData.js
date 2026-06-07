export const editorialBoard = {
  editorInChief: {
    name: "Dr. Julian Thorne",
    role: "Editor-in-Chief",
    affiliation: "Georgetown University"
  },
  managingEditor: {
    name: "Elena Vost",
    role: "Managing Editor",
    affiliation: "Advanced Law"
  },
  associateEditor: {
    name: "Prof. Liam O'Connor",
    role: "Associate Editor",
    affiliation: "Oxford Law Faculty"
  },
  reviewEditor: {
    name: "Dr. Amara Singh",
    role: "Review Editor",
    affiliation: "Leverhulme Trust School"
  },
  deadlines: [
    { label: "Submission Deadline", value: "March 1st, 2025" },
    { label: "Peer-Review Cycle", value: "6-8 Weeks" },
    { label: "Acceptance Rate", value: "14% (FY 2024)" }
  ]
};

export const pastIssues = [
  {
    id: "issue-12-3",
    volume: 12,
    issue: 3,
    date: "Oct 2024",
    articleCount: 12
  },
  {
    id: "issue-12-2",
    volume: 12,
    issue: 2,
    date: "July 2024",
    articleCount: 14
  },
  {
    id: "issue-12-1",
    volume: 12,
    issue: 1,
    date: "April 2024",
    articleCount: 11
  }
];

export const articles = [
  {
    id: "art-1",
    title: "Digital Sovereignty and the New Institutionalism",
    author: "Dr. Elena Vance, Prof. Marco Rossi",
    date: "Published Oct 23, 2024",
    year: 2024,
    volume: 12,
    issue: 4,
    docType: "Original Research",
    topics: ["Digital Sovereignty"],
    tags: ["Sovereignty", "Infrastructure", "Digital Law"],
    excerpt: "This paper examines the emerging structural shifts in global governance as nation-states attempt to re-assert authority over digital infrastructure. Through a comparative analysis of three major jurisdictions, the authors argue that \"digital sovereignty\" is not merely a policy goal, but a fundamental redesign of the modern institution...",
    citation: "Vance, E., & Rossi, M. (2024). Digital Sovereignty and the New Institutionalism. Praxis: The Journal of Political Architecture & Governance, 12(4), 112-140.",
    pdfUrl: "#",
    page: 112,
    featured: true
  },
  {
    id: "art-2",
    title: "Post-Conflict Governance in the Levant: A Ten-Year Retrospective",
    author: "Sarah Al-Sayed, Ph.D.",
    date: "Published Sep 15, 2024",
    year: 2024,
    volume: 12,
    issue: 4,
    docType: "Case Study",
    topics: ["Global Governance", "Institutional Reform"],
    tags: ["MENA", "Reconstruction", "Decentralization"],
    excerpt: "Analyzing the success and failures of decentralized governance models across the Levant over the past decade. This study highlights the tension between local agency and international institutional frameworks, proposing a new \"Adaptive Neutrality\" framework for future reconstruction efforts...",
    citation: "Al-Sayed, S. (2024). Post-Conflict Governance in the Levant: A Ten-Year Retrospective. Praxis: The Journal of Political Architecture & Governance, 12(4), 141-179.",
    pdfUrl: "#",
    page: 141,
    featured: true
  },
  {
    id: "art-3",
    title: "Bureaucracy as Policy: A Structural Analysis",
    author: "Prof. Arthur Pendelton",
    date: "Published Nov 02, 2024",
    year: 2024,
    volume: 12,
    issue: 4,
    docType: "Original Research",
    topics: ["Institutional Reform"],
    tags: ["Bureaucracy", "Policy Design", "Administrative Law"],
    excerpt: "An exploration of how administrative rule-making functions as a primary policy lever, often independent of legislative mandate, and how design frameworks can restore democratic accountability.",
    citation: "Pendelton, A. (2024). Bureaucracy as Policy: A Structural Analysis. Praxis: The Journal of Political Architecture & Governance, 12(4), 180-210.",
    pdfUrl: "#",
    page: 180,
    featured: true
  },
  {
    id: "art-4",
    title: "Sovereign Debt and Multi-Polar Alignments",
    author: "Dr. Elena Vance",
    date: "Published Oct 10, 2024",
    year: 2024,
    volume: 12,
    issue: 3,
    docType: "Policy Brief",
    topics: ["Global Governance"],
    tags: ["Debt", "Sovereignty", "Finance"],
    excerpt: "This article discusses the changing landscapes of sovereign debt restructuring under the influence of new multilateral lenders, highlighting the shifting balance of power in international financial institutions.",
    citation: "Vance, E. (2024). Sovereign Debt and Multi-Polar Alignments. Praxis: The Journal of Political Architecture & Governance, 12(3), 45-72.",
    pdfUrl: "#",
    page: 45
  },
  {
    id: "art-5",
    title: "Strategic Simulation in Crisis Management: A Pedagogical Framework",
    author: "Prof. Marco Rossi",
    date: "Published July 22, 2024",
    year: 2024,
    volume: 12,
    issue: 2,
    docType: "Case Study",
    topics: ["Strategic Leadership"],
    tags: ["Simulation", "Crisis", "Education"],
    excerpt: "Detailing the design of high-fidelity simulations for policy practitioners. The author presents data on decision-making outcomes under time constraints.",
    citation: "Rossi, M. (2024). Strategic Simulation in Crisis Management: A Pedagogical Framework. Praxis: The Journal of Political Architecture & Governance, 12(2), 12-39.",
    pdfUrl: "#",
    page: 12
  },
  {
    id: "art-6",
    title: "Technological Autonomy and Platform Governance",
    author: "Dr. Julian Thorne",
    date: "Published April 05, 2024",
    year: 2024,
    volume: 12,
    issue: 1,
    docType: "Original Research",
    topics: ["Digital Sovereignty"],
    tags: ["Platform", "Autonomy", "Regulation"],
    excerpt: "An analysis of standardizing interface protocols to limit platform monopoly, arguing for open-source digital infrastructure in municipal administration.",
    citation: "Thorne, J. (2024). Technological Autonomy and Platform Governance. Praxis: The Journal of Political Architecture & Governance, 12(1), 54-82.",
    pdfUrl: "#",
    page: 54
  },
  {
    id: "art-7",
    title: "Multilateral Accords on Algorithmic Auditing",
    author: "Prof. Liam O'Connor",
    date: "Published Feb 18, 2024",
    year: 2024,
    volume: 11,
    issue: 4,
    docType: "Policy Brief",
    topics: ["Digital Sovereignty", "Global Governance"],
    tags: ["Algorithmic Bias", "Treaties", "Tech Governance"],
    excerpt: "Proposing a framework for international cooperation in auditing decision-making algorithms used by nation-states, drawing parallels from civil aviation safety conventions.",
    citation: "O'Connor, L. (2024). Multilateral Accords on Algorithmic Auditing. Praxis: The Journal of Political Architecture & Governance, 11(4), 98-121.",
    pdfUrl: "#",
    page: 98
  },
  {
    id: "art-8",
    title: "The Limits of Hegemony: Civic Trust in Transitional States",
    author: "Dr. Amara Singh",
    date: "Published Nov 12, 2023",
    year: 2023,
    volume: 11,
    issue: 3,
    docType: "Original Research",
    topics: ["Global Governance", "Strategic Leadership"],
    tags: ["Civic Trust", "State Building", "Hegemony"],
    excerpt: "Exploring the fragile equilibrium between state power and citizen consensus in post-colonial transitional polities, using survey data collected across six regional centers.",
    citation: "Singh, A. (2023). The Limits of Hegemony: Civic Trust in Transitional States. Praxis: The Journal of Political Architecture & Governance, 11(3), 110-142.",
    pdfUrl: "#",
    page: 110
  }
];
