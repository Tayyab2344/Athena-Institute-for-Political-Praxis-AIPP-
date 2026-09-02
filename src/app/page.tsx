"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import IntroSection from "@/components/sections/IntroSection";
import PillarsSection from "@/components/sections/PillarsSection";
import ResearchSection from "@/components/sections/ResearchSection";
import StrategicActionSection from "@/components/sections/StrategicActionSection";
import InsightsSection from "@/components/sections/InsightsSection";
import GetInvolvedSection from "@/components/sections/GetInvolvedSection";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";

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
    <main className="min-h-screen bg-[#FAF8F5] text-[#1A1817] flex flex-col font-sans selection:bg-[#4A121A] selection:text-[#FAF8F5]">
      <Navbar onOpenContact={() => handleOpenContact("General Inquiry")} />
      <Hero />
      <IntroSection />
      <PillarsSection />
      <ResearchSection />
      <StrategicActionSection />
      <InsightsSection />
      <GetInvolvedSection onOpenContact={handleOpenContact} />
      <Footer onOpenContact={handleOpenContact} />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultPathway={contactPathway}
      />
    </main>
  );
}
