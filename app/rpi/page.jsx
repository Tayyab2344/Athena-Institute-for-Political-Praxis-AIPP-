import Header from "../components/Header";
import Footer from "../components/Footer";
import RPIHero from "./components/RPIHero";
import RPIIntro from "./components/RPIIntro";
import RPIPillars from "./components/RPIPillars";
import RPIPublications from "./components/RPIPublications";
import RPIInitiative from "./components/RPIInitiative";
import RPIQuote from "./components/RPIQuote";
import RPICTA from "./components/RPICTA";

export const metadata = {
  title: "Research & Policy Innovation (RPI) - AIPP",
  description:
    "Rigorous academic research, policy analysis, think tank initiatives, and strategic institutional studies at the Athena Institute for Political Praxis.",
};

export default function RPIPage() {
  return (
    <main id="top" className="rpi-page-container">
      <Header />
      <RPIHero />
      <div className="reveal-up"><RPIIntro /></div>
      <div className="reveal-up"><RPIPillars /></div>
      <div className="reveal-up"><RPIPublications /></div>
      <div className="reveal-up"><RPIInitiative /></div>
      <div className="reveal-up"><RPIQuote /></div>
      <div className="reveal-up"><RPICTA /></div>
      <Footer />
    </main>
  );
}
