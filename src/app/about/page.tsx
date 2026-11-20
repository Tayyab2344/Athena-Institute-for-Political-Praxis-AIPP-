"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import AboutHero from "@/components/about/AboutHero";
import WhoWeAreSection from "@/components/about/WhoWeAreSection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import ApproachSection from "@/components/about/ApproachSection";
import AboutCtaSection from "@/components/about/AboutCtaSection";

/* ─────────────────────────────────────────────────────────────
   AIPP About Page: Minimal, Premium, and Editorial
   - Strict 5-section structure matching homepage design system
   - Section 1: About Hero
   - Section 2: Who We Are
   - Section 3: Mission and Vision
   - Section 4: Our Approach
   - Section 5: Closing CTA
   - Reuses official Navbar, Footer, and ContactModal
   ───────────────────────────────────────────────────────────── */

export default function AboutPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-[#081D2E] flex flex-col font-sans selection:bg-[#0D2C49] selection:text-white">
      {/* Section 0: Global Navigation */}
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      {/* Section 1: About Hero */}
      <AboutHero />

      {/* Section 2: Who We Are */}
      <WhoWeAreSection />

      {/* Section 3: Mission and Vision */}
      <MissionVisionSection />

      {/* Section 4: Our Approach */}
      <ApproachSection />

      {/* Section 5: Closing CTA */}
      <AboutCtaSection onOpenContact={() => setIsContactOpen(true)} />

      {/* Section 6: Institutional Footer */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />

      {/* Global Interactive Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultPathway="Institutional Collaboration"
      />
    </main>
  );
}
