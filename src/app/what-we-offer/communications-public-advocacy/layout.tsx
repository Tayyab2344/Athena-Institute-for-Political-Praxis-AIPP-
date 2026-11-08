import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIPP | Communications & Public Advocacy",
  description:
    "Public dialogue, storytelling, and advocacy that bring important ideas into wider conversations and create opportunities for influence.",
  alternates: {
    canonical: "/what-we-offer/communications-public-advocacy",
  },
};

export default function CommsPillarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
