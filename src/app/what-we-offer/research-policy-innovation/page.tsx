"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import OfferPillarSwitcher from "@/components/what-we-offer/OfferPillarSwitcher";
import ResearchHero from "@/components/what-we-offer/research/ResearchHero";
import ResearchWorkflow from "@/components/what-we-offer/research/ResearchWorkflow";
import InteractivePolicyDocument from "@/components/what-we-offer/research/InteractivePolicyDocument";
import ResearchCapabilitiesIndex from "@/components/what-we-offer/research/ResearchCapabilitiesIndex";
import ResearchArchive from "@/components/what-we-offer/research/ResearchArchive";
import ResearchVisualStatement from "@/components/what-we-offer/research/ResearchVisualStatement";
import ResearchEnding from "@/components/what-we-offer/research/ResearchEnding";
import "@/app/what-we-offer/offer.css";

export default function ResearchPillarPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Global Navbar */}
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      {/* Shared Editorial Pillar Navigation Strip */}
      <OfferPillarSwitcher />

      {/* 01: Hero — 'The Research Desk' Editorial Composition */}
      <ResearchHero />

      {/* 02: Horizontal Editorial Process — 'From Question to Insight' */}
      <ResearchWorkflow />

      {/* 03: Interactive Central Research Document — 'Watching Research Become Insight' */}
      <InteractivePolicyDocument />

      {/* 04: Capabilities Portfolio — Large Editorial Numbered Index */}
      <ResearchCapabilitiesIndex />

      {/* 05: Primary Scholarship — Live Editorial Publications Archive */}
      <ResearchArchive />

      {/* 06: Epistemic Philosophy — Full-Width Dark Navy Visual Statement */}
      <ResearchVisualStatement />

      {/* 07: Research Ending — Fading Document Composition & CTAs */}
      <ResearchEnding onOpenContact={() => setIsContactOpen(true)} />

      {/* Global Footer & Contact Modal */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}
