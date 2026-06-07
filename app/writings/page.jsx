import Header from "../components/Header";
import Footer from "../components/Footer";
import WritingsClientPage from "./components/WritingsClientPage";

export const metadata = {
  title: "Policy Blogs & Insights - AIPP",
  description:
    "A definitive repository of strategic foresight, geopolitical analysis, and institutional critique at the Athena Institute for Political Praxis.",
};

export default function WritingsPage() {
  return (
    <main id="top" className="writings-page-container">
      <Header />
      <WritingsClientPage />
      <Footer />
    </main>
  );
}
