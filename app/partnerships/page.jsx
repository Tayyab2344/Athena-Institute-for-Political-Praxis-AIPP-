import Header from "../components/Header";
import Footer from "../components/Footer";
import PartnershipsHero from "./components/PartnershipsHero";
import WhyCollaborate from "./components/WhyCollaborate";
import PartnershipPath from "./components/PartnershipPath";
import CollaborationRoadmap from "./components/CollaborationRoadmap";
import NetworksList from "./components/NetworksList";
import CoreBenefits from "./components/CoreBenefits";
import PartnershipsCTA from "./components/PartnershipsCTA";

export const metadata = {
  title: "Strategic Partnerships & Collaboration - AIPP",
  description:
    "Forge alliances with the Athena Institute for Political Praxis. Explore organizational and individual partnership paths, our collaboration roadmap, and mutual benefits.",
};

export default function PartnershipsPage() {
  return (
    <main id="top" className="partnerships-page-container">
      <Header />
      <PartnershipsHero />
      <div className="reveal-up"><WhyCollaborate /></div>
      <div className="reveal-up"><PartnershipPath /></div>
      <div className="reveal-up"><CollaborationRoadmap /></div>
      <div className="reveal-up"><NetworksList /></div>
      <div className="reveal-up"><CoreBenefits /></div>
      <div className="reveal-up"><PartnershipsCTA /></div>
      <Footer />
    </main>
  );
}
