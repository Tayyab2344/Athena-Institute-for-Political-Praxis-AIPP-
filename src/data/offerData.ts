/* ─────────────────────────────────────────────────────────────
   WHAT WE OFFER — Central Data Configuration
   Single source of truth for pillar names, routes, descriptions,
   capabilities and visual treatment.
   ───────────────────────────────────────────────────────────── */

export interface OfferCapability {
  number: string;
  title: string;
  description: string;
}

export interface OfferPillar {
  number: string;
  slug: string;
  title: string;
  shortTitle: string;
  route: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  heroHeadline: string;
  heroDescription: string;
  capabilities: OfferCapability[];
  ctaText: string;
  image: string;
  imageAlt: string;
}

export const OFFER_PILLARS: OfferPillar[] = [
  {
    number: "01",
    slug: "research-policy-innovation",
    title: "Research & Policy Innovation",
    shortTitle: "Research",
    route: "/what-we-offer/research-policy-innovation",
    tagline: "Knowledge that informs action.",
    shortDescription:
      "Evidence, analysis and policy thinking that turn complex issues into actionable insight.",
    longDescription:
      "AIPP examines complex policy questions, produces research, develops evidence-based perspectives and creates knowledge that can support meaningful public and institutional discussion.",
    heroHeadline: "Research That Moves Policy Forward.",
    heroDescription:
      "AIPP develops research and policy perspectives that examine complex issues, generate evidence and contribute to informed public and institutional dialogue.",
    capabilities: [
      {
        number: "01",
        title: "Policy Research",
        description:
          "Examining complex policy questions with rigour and independence, producing work that contributes to informed institutional and public discussion.",
      },
      {
        number: "02",
        title: "Issue Analysis",
        description:
          "Investigating specific issues in diplomacy, governance and public affairs to develop clear, evidence-based perspectives.",
      },
      {
        number: "03",
        title: "Policy Briefs",
        description:
          "Translating detailed research into concise, accessible documents that can inform decision-makers and public conversations.",
      },
      {
        number: "04",
        title: "Research Papers",
        description:
          "Producing in-depth research that contributes original perspectives to important policy questions and academic discourse.",
      },
      {
        number: "05",
        title: "Evidence-Based Recommendations",
        description:
          "Developing practical recommendations grounded in evidence, analysis and a deep understanding of institutional realities.",
      },
      {
        number: "06",
        title: "Knowledge Development",
        description:
          "Building a body of knowledge that informs strategy, public dialogue and the broader understanding of issues that matter.",
      },
    ],
    ctaText: "Explore Research & Policy Innovation",
    image: "/ideas-research.jpg",
    imageAlt: "Woman researcher examining policy documents in an institutional environment",
  },
  {
    number: "02",
    slug: "strategic-action-simulation",
    title: "Strategic Action & Simulation",
    shortTitle: "Strategy",
    route: "/what-we-offer/strategic-action-simulation",
    tagline: "Ideas put into practice.",
    shortDescription:
      "Scenario-based thinking and strategic frameworks that prepare leaders for complex decisions.",
    longDescription:
      "AIPP creates environments where ideas are tested through strategic simulation, scenario planning, decision-making exercises and collaborative strategic thinking.",
    heroHeadline: "Prepare for Complexity Before It Arrives.",
    heroDescription:
      "Complex environments require more than static analysis. They require the ability to explore scenarios, test assumptions, understand trade-offs and make decisions under uncertainty.",
    capabilities: [
      {
        number: "01",
        title: "Scenario Planning",
        description:
          "Exploring possible futures and developing frameworks for thinking about how complex situations may evolve.",
      },
      {
        number: "02",
        title: "Strategic Simulations",
        description:
          "Creating immersive environments where participants can test ideas, evaluate options and experience the consequences of decisions.",
      },
      {
        number: "03",
        title: "Decision-Making Exercises",
        description:
          "Structured activities that develop the ability to evaluate complex trade-offs, weigh competing priorities and make informed choices.",
      },
      {
        number: "04",
        title: "Crisis & Policy Scenarios",
        description:
          "Preparing individuals and organisations to think clearly under pressure through realistic, carefully designed scenario exercises.",
      },
      {
        number: "05",
        title: "Strategic Workshops",
        description:
          "Collaborative sessions that bring together diverse perspectives to explore challenges, develop strategies and build shared understanding.",
      },
      {
        number: "06",
        title: "Leadership Exercises",
        description:
          "Activities designed to develop strategic thinking, communication under pressure and the ability to lead through complexity.",
      },
    ],
    ctaText: "Explore Strategic Action & Simulation",
    image: "/ideas-strategy.jpg",
    imageAlt: "Women strategists collaborating during a diplomatic simulation workshop",
  },
  {
    number: "03",
    slug: "communications-public-advocacy",
    title: "Communications & Public Advocacy",
    shortTitle: "Communication",
    route: "/what-we-offer/communications-public-advocacy",
    tagline: "Voices brought into public dialogue.",
    shortDescription:
      "Public dialogue, storytelling and advocacy that bring important ideas into wider conversations.",
    longDescription:
      "Strong ideas only create influence when they can enter public conversations effectively. AIPP helps important ideas find their public voice through strategic communication, advocacy and dialogue.",
    heroHeadline: "Give Important Ideas a Public Voice.",
    heroDescription:
      "Research can inform. Strategy can prepare. Communication brings ideas into the conversation — creating the visibility and understanding that make meaningful change possible.",
    capabilities: [
      {
        number: "01",
        title: "Strategic Communication",
        description:
          "Developing clear, compelling narratives that help important ideas reach the audiences that need to hear them.",
      },
      {
        number: "02",
        title: "Public Advocacy",
        description:
          "Creating sustained public engagement around issues that matter, building understanding and support for meaningful change.",
      },
      {
        number: "03",
        title: "Public Dialogue",
        description:
          "Facilitating conversations that bring diverse perspectives together around important issues, creating space for genuine exchange.",
      },
      {
        number: "04",
        title: "Storytelling",
        description:
          "Using narrative to make complex ideas accessible, personal and compelling — helping people connect with issues that affect shared futures.",
      },
      {
        number: "05",
        title: "Media Engagement",
        description:
          "Helping important ideas reach wider audiences through thoughtful engagement with media platforms and public discourse.",
      },
      {
        number: "06",
        title: "Campaign Communication",
        description:
          "Designing and executing communication strategies that build momentum around important ideas and create opportunities for influence.",
      },
    ],
    ctaText: "Explore Communications & Public Advocacy",
    image: "/ideas-advocacy.jpg",
    imageAlt: "Senior woman diplomat delivering keynote address at an international forum",
  },
];

/* Pipeline stages for the interconnected system visualization */
export const PIPELINE_STAGES = [
  { label: "Research", sublabel: "creates knowledge" },
  { label: "Strategy", sublabel: "turns knowledge into decisions" },
  { label: "Communication", sublabel: "turns decisions into public influence" },
];

/* Research workflow stages */
export const RESEARCH_WORKFLOW = [
  { label: "Question", description: "Identifying the issues that matter" },
  { label: "Research", description: "Rigorous inquiry and evidence gathering" },
  { label: "Analysis", description: "Making sense of complexity" },
  { label: "Insight", description: "Generating original perspectives" },
  { label: "Policy Perspective", description: "Contributing to informed dialogue" },
];

/* Strategic approach steps */
export const STRATEGIC_APPROACH = [
  { number: "01", title: "Understand the Context", description: "Mapping the landscape of forces, actors and dynamics that shape the challenge." },
  { number: "02", title: "Define the Challenge", description: "Clarifying what is at stake, what decisions need to be made and what uncertainties exist." },
  { number: "03", title: "Explore Scenarios", description: "Testing different possibilities and understanding how situations may evolve." },
  { number: "04", title: "Test Decisions", description: "Evaluating choices, understanding trade-offs and experiencing consequences." },
  { number: "05", title: "Reflect & Adapt", description: "Learning from the process and developing strategies that are robust under uncertainty." },
];

/* Communication pipeline stages */
export const COMMS_PIPELINE = [
  { label: "Idea", description: "An important perspective takes shape" },
  { label: "Message", description: "The idea finds its clearest expression" },
  { label: "Story", description: "The message becomes human and compelling" },
  { label: "Dialogue", description: "The story enters public conversation" },
  { label: "Public Engagement", description: "The conversation creates opportunity for influence" },
];
