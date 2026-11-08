import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIPP | Research & Policy Innovation",
  description:
    "AIPP develops research and policy perspectives that examine complex issues, generate evidence and contribute to informed public and institutional dialogue.",
  alternates: {
    canonical: "/what-we-offer/research-policy-innovation",
  },
};

export default function ResearchPillarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
