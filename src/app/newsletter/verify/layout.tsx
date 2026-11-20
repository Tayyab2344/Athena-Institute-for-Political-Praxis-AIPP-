import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Verification | Athena Institute for Political Praxis",
  description: "Confirm your subscription to research publications from the Athena Institute.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  referrer: "no-referrer",
};

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

