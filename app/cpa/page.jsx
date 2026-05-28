import Header from "../components/Header";
import Footer from "../components/Footer";
import CPAHero from "./components/CPAHero";
import CPAIntro from "./components/CPAIntro";
import CPAPrograms from "./components/CPAPrograms";
import CPAParticipation from "./components/CPAParticipation";
import CPAQuote from "./components/CPAQuote";
import CPAInitiatives from "./components/CPAInitiatives";
import CPACTA from "./components/CPACTA";

export const metadata = {
  title: "Communication & Public Advocacy (CPA) - AIPP",
  description:
    "Shaping public discourse through strategic communication, civic literacy, media engagement, and democratic advocacy at the Athena Institute for Political Praxis.",
};

export default function CPAPage() {
  return (
    <main id="top" className="cpa-page-container">
      <Header />
      <CPAHero />
      <div className="reveal-up"><CPAIntro /></div>
      <div className="reveal-up"><CPAPrograms /></div>
      <div className="reveal-up"><CPAParticipation /></div>
      <div className="reveal-up"><CPAQuote /></div>
      <div className="reveal-up"><CPAInitiatives /></div>
      <div className="reveal-up"><CPACTA /></div>
      <Footer />
    </main>
  );
}
