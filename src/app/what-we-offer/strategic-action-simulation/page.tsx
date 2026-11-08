"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import OfferPillarSwitcher from "@/components/what-we-offer/OfferPillarSwitcher";
import StrategyHero from "@/components/what-we-offer/strategy/StrategyHero";
import InteractiveScenarioSandbox from "@/components/what-we-offer/strategy/InteractiveScenarioSandbox";
import StrategyScrollJourney from "@/components/what-we-offer/strategy/StrategyScrollJourney";
import StrategyCapabilitiesIndex from "@/components/what-we-offer/strategy/StrategyCapabilitiesIndex";
import StrategyRoomShowcase from "@/components/what-we-offer/strategy/StrategyRoomShowcase";
import StrategyConvergenceClosing from "@/components/what-we-offer/strategy/StrategyConvergenceClosing";
import "@/app/what-we-offer/offer.css";

export default function StrategicPillarPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#081D2E] text-white">
      {/* Global Navbar */}
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      {/* Shared Editorial Pillar Switcher */}
      <OfferPillarSwitcher />

      {/* 01: Hero — Interactive Decision Map (Occupying ~60% of Hero) */}
      <StrategyHero />

      {/* 02: Interactive Scenario Sandbox — Methodological Decision & Consequence */}
      <InteractiveScenarioSandbox />

      {/* 03: Scroll Experience — 'One Decision. Many Possibilities.' 6-Phase Journey */}
      <StrategyScrollJourney />

      {/* 04: Strategic Capabilities — Interactive Strategy Index with Active Map Branches */}
      <StrategyCapabilitiesIndex />

      {/* 05: The Strategy Room — Large Editorial Women-Only Imagery with Coordinate Overlays */}
      <StrategyRoomShowcase />

      {/* 06: Closing — Converging Paths into One Route & CTAs */}
      <StrategyConvergenceClosing onOpenContact={() => setIsContactOpen(true)} />

      {/* Global Footer & Contact Modal */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}
