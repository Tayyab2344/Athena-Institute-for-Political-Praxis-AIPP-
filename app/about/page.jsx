import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutHero from "./components/AboutHero";
import Legacy from "./components/Legacy";
import VisionMission from "./components/VisionMission";
import StrategicObjectives from "./components/StrategicObjectives";
import CoreBeliefs from "./components/CoreBeliefs";
import OperativePrinciples from "./components/OperativePrinciples";
import PracticalEngagement from "./components/PracticalEngagement";
import FellowshipCTA from "./components/FellowshipCTA";

export const metadata = {
  title: "About AIPP - Athena Institute for Political Praxis",
  description:
    "Learn about the Athena Institute for Political Praxis, our mission, vision, strategic objectives, core beliefs, and operative principles in political education.",
};

export default function AboutPage() {
  return (
    <main id="top" className="about-page-container">
      <Header />
      <AboutHero />
      <div className="reveal-up"><Legacy /></div>
      <div className="reveal-up"><VisionMission /></div>
      <div className="reveal-up"><StrategicObjectives /></div>
      <div className="reveal-up"><CoreBeliefs /></div>
      <div className="reveal-up"><OperativePrinciples /></div>
      <div className="reveal-up"><PracticalEngagement /></div>
      <div className="reveal-up"><FellowshipCTA /></div>
      <Footer />
    </main>
  );
}
