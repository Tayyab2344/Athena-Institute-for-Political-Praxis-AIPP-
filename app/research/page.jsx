import Header from "../components/Header";
import Footer from "../components/Footer";
import ResearchClientPage from "./components/ResearchClientPage";

export const metadata = {
  title: "Research Repository & Policy Database - AIPP",
  description:
    "A centralized archive of strategic foresight, institutional reform frameworks, and geopolitical analysis at the Athena Institute for Political Praxis.",
};

export default function ResearchPage() {
  return (
    <main id="top" className="research-page-container">
      <Header />
      <ResearchClientPage />
      <Footer />
    </main>
  );
}
