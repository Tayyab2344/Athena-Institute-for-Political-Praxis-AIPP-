"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import OfferSection from "@/components/home/OfferSection";
import ResearchPerspectivesSection from "@/components/home/ResearchPerspectivesSection";
import ClosingCtaSection from "@/components/home/ClosingCtaSection";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";

/* ─────────────────────────────────────────────────────────────
   AIPP Redesigned Homepage: Minimal, Premium, and Editorial
   - Strict 7-section structure
   - Less content, stronger visual impact
   - Respected international institution working in women's leadership,
     diplomacy, public policy, and empirical research
   ───────────────────────────────────────────────────────────── */

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactPathway, setContactPathway] = useState("General Inquiry");

  const handleOpenContact = (pathway?: string) => {
    if (pathway) {
      setContactPathway(pathway);
    } else {
      setContactPathway("General Inquiry");
    }
    setIsContactOpen(true);
  };

  return (
    <main className="min-h-screen bg-white text-[#081D2E] flex flex-col font-sans selection:bg-[#0D2C49] selection:text-white">
      {/* Section 1: Navigation */}
      <Navbar onOpenContact={() => handleOpenContact("General Inquiry")} />

      {/* Section 2: Hero */}
      <HeroSection />

      {/* Section 3: About AIPP */}
      <AboutSection />

      {/* Section 4: What We Offer */}
      <OfferSection />

      {/* Section 5: Research and Perspectives */}
      <ResearchPerspectivesSection />

      {/* Section 6: Closing CTA */}
      <ClosingCtaSection onOpenContact={handleOpenContact} />

      {/* Section 7: Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* Global Interactive Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultPathway={contactPathway}
      />
    </main>
  );
}
