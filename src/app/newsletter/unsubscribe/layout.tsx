import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe | Athena Institute for Political Praxis",
  description: "Manage your subscription preferences for Athena Institute research publications.",
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

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

