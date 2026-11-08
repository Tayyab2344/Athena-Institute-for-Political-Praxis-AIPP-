"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import CinematicHero from "@/components/home/CinematicHero";
import IdeasToInfluenceSection from "@/components/sections/IdeasToInfluenceSection";
import PillarsSection from "@/components/sections/PillarsSection";
import ResearchSection from "@/components/sections/ResearchSection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import VoicesSection from "@/components/sections/VoicesSection";
import GetInvolvedSection from "@/components/sections/GetInvolvedSection";
import ConnectSection from "@/components/sections/ConnectSection";
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
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-background">
      <Navbar onOpenContact={() => handleOpenContact("General Inquiry")} />
      <CinematicHero />
      <IdeasToInfluenceSection />
      <PillarsSection />
      <ResearchSection />
      <ProgramsSection />
      <VoicesSection />
      <GetInvolvedSection onOpenContact={handleOpenContact} />
      <ConnectSection />
      <Footer onOpenContact={handleOpenContact} />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultPathway={contactPathway}
      />
    </main>
  );
}
