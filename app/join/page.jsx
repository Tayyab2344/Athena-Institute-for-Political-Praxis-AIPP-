import Header from "../components/Header";
import Footer from "../components/Footer";
import JoinHero from "./components/JoinHero";
import ValuesOfEngagement from "./components/ValuesOfEngagement";
import ProgramPathways from "./components/ProgramPathways";
import RolesProvisions from "./components/RolesProvisions";
import JourneyOfPraxis from "./components/JourneyOfPraxis";
import OnboardingTimeline from "./components/OnboardingTimeline";
import JoinCTA from "./components/JoinCTA";

export const metadata = {
  title: "Join the Athena Community - AIPP",
  description:
    "Become part of the Athena Institute for Political Praxis. Explore membership benefits, volunteer programs, our boarding timeline, and values of engagement.",
};

export default function JoinPage() {
  return (
    <main id="top" className="join-page-container">
      <Header />
      <JoinHero />
      <div className="reveal-up"><ValuesOfEngagement /></div>
      <div className="reveal-up"><ProgramPathways /></div>
      <div className="reveal-up"><RolesProvisions /></div>
      <div className="reveal-up"><JourneyOfPraxis /></div>
      <div className="reveal-up"><OnboardingTimeline /></div>
      <div className="reveal-up"><JoinCTA /></div>
      <Footer />
    </main>
  );
}
