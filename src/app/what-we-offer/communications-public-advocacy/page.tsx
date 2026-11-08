"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import OfferPillarSwitcher from "@/components/what-we-offer/OfferPillarSwitcher";
import CommunicationsHero from "@/components/what-we-offer/communications/CommunicationsHero";
import PublicVoiceExpandingRings from "@/components/what-we-offer/communications/PublicVoiceExpandingRings";
import CommunicationJourney from "@/components/what-we-offer/communications/CommunicationJourney";
import PublicSpeakingStage from "@/components/what-we-offer/communications/PublicSpeakingStage";
import CommunicationsCapabilitiesRows from "@/components/what-we-offer/communications/CommunicationsCapabilitiesRows";
import PublicVoiceContentWall from "@/components/what-we-offer/communications/PublicVoiceContentWall";
import CommunicationsClosing from "@/components/what-we-offer/communications/CommunicationsClosing";
import "@/app/what-we-offer/offer.css";

export default function CommunicationsPillarPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Global Navbar */}
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      {/* Shared Editorial Pillar Switcher */}
      <OfferPillarSwitcher />

      {/* 01: Hero — 'The Speaker' Cinematic Split-Screen */}
      <CommunicationsHero />

      {/* 02: Signature Radial Visual — Public Voice Expanding Concentric Rings */}
      <PublicVoiceExpandingRings />

      {/* 03: Horizontal Journey — 'From Idea to Influence' 6-Stage Timeline */}
      <CommunicationJourney />

      {/* 04: Large Immersive Image Section — Public Speaking Visual with Editorial Labels */}
      <PublicSpeakingStage />

      {/* 05: Editorial Magazine Index — Expandable Communications Capabilities Rows */}
      <CommunicationsCapabilitiesRows />

      {/* 06: Public Content — Real Commentary & Perspectives Wall */}
      <PublicVoiceContentWall />

      {/* 07: Closing — Full-Width Image Stage with Dark Gradient & CTAs */}
      <CommunicationsClosing onOpenContact={() => setIsContactOpen(true)} />

      {/* Global Footer & Contact Modal */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}
