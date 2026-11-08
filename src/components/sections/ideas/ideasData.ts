export interface IdeaStage {
  number: string;
  stageName: string;
  title: string;
  shortStatement: string;
  dynamicStatement: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  pillText: string;
}

export const IDEAS_STAGES: IdeaStage[] = [
  {
    number: "01",
    stageName: "RESEARCH",
    title: "Research & Policy Innovation",
    shortStatement: "Knowledge that informs action.",
    dynamicStatement: "KNOWLEDGE THAT INFORMS",
    description:
      "AIPP investigates issues, develops knowledge and contributes research that informs conversations around women, diplomacy, policy and public affairs.",
    ctaText: "Explore Research",
    ctaHref: "/research",
    image: "/ideas-research.jpg",
    imageAlt:
      "Woman policy researcher examining strategic documents and international legal briefs in institutional archive",
    pillText: "RESEARCH & INNOVATION",
  },
  {
    number: "02",
    stageName: "STRATEGY",
    title: "Strategic Action & Simulation",
    shortStatement: "Ideas put into practice.",
    dynamicStatement: "IDEAS INTO PRACTICE",
    description:
      "AIPP creates practical environments where ideas can be explored through simulation, strategy, workshops and collaborative engagement.",
    ctaText: "Explore Strategic Action",
    ctaHref: "/what-we-offer/strategic-action-simulation",
    image: "/ideas-strategy.jpg",
    imageAlt:
      "Women strategists and diplomats collaborating during an executive diplomatic simulation workshop",
    pillText: "STRATEGY & SIMULATION",
  },
  {
    number: "03",
    stageName: "ADVOCACY",
    title: "Communications & Public Advocacy",
    shortStatement: "Voices brought into public dialogue.",
    dynamicStatement: "VOICES INTO DIALOGUE",
    description:
      "AIPP creates platforms for women to communicate ideas, share expertise and contribute to meaningful public conversations.",
    ctaText: "Explore Advocacy",
    ctaHref: "/what-we-offer/communications-public-advocacy",
    image: "/ideas-advocacy.jpg",
    imageAlt:
      "Senior woman diplomat delivering keynote address at international multilateral symposium",
    pillText: "PUBLIC ADVOCACY",
  },
];
