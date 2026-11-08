import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIPP | Strategic Action & Simulation",
  description:
    "Scenario-based thinking, strategic simulations, and decision-making exercises that prepare leaders for complexity and uncertainty.",
  alternates: {
    canonical: "/what-we-offer/strategic-action-simulation",
  },
};

export default function StrategicPillarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
