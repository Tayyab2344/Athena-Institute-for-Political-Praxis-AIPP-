import Header from "../components/Header";
import Footer from "../components/Footer";
import SASHero from "./components/SASHero";
import SASPhilosophy from "./components/SASPhilosophy";
import SASPrograms from "./components/SASPrograms";
import SASJourney from "./components/SASJourney";
import SASArchives from "./components/SASArchives";
import SASQuote from "./components/SASQuote";
import SASCTA from "./components/SASCTA";

export const metadata = {
  title: "Strategic Action & Simulation (SAS) - AIPP",
  description:
    "Immersive political simulations, governance exercises, leadership labs, and strategic praxis learning at the Athena Institute for Political Praxis.",
};

export default function SASPage() {
  return (
    <main id="top" className="sas-page-container">
      <Header />
      <SASHero />
      <div className="reveal-up"><SASPhilosophy /></div>
      <div className="reveal-up"><SASPrograms /></div>
      <div className="reveal-up"><SASJourney /></div>
      <div className="reveal-up"><SASArchives /></div>
      <div className="reveal-up"><SASQuote /></div>
      <div className="reveal-up"><SASCTA /></div>
      <Footer />
    </main>
  );
}
