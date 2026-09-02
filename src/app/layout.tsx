import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIPP | Athena Institute for Political Praxis",
  description: "A prestigious international policy institute advancing women in diplomacy, empirical research, strategic crisis simulation, and public advocacy.",
  keywords: [
    "Women in Diplomacy",
    "International Relations Institute",
    "Political Praxis",
    "Geopolitical Research",
    "Crisis Simulation",
    "Public Advocacy",
    "Global Governance"
  ],
  authors: [{ name: "Athena Institute for Political Praxis" }],
  openGraph: {
    title: "AIPP | Athena Institute for Political Praxis",
    description: "Women shaping the conversations that shape our world. Empirical research, strategic action, and public advocacy in international diplomacy.",
    url: "https://aipp-institute.org",
    siteName: "Athena Institute for Political Praxis",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "AIPP International Peace Summit Delegation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIPP | Athena Institute for Political Praxis",
    description: "Elevating women leaders in diplomacy, statecraft, and multilateral decision-making.",
    images: ["https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="bg-[#FAF8F5] text-[#1A1817] antialiased min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
