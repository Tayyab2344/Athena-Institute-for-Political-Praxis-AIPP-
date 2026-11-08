import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIPP | What We Offer",
  description:
    "AIPP works across research, strategy, and communication to advance women in diplomacy, policy, and public leadership. Explore how we turn ideas into influence.",
  alternates: {
    canonical: "/what-we-offer",
  },
};

export default function WhatWeOfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
