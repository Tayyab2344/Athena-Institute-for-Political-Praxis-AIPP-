import ArchiveClientPage from "./components/ArchiveClientPage";

export const metadata = {
  title: "Praxis: The Journal of Political Architecture & Governance - AIPP",
  description:
    "Explore scholarly articles, research papers, case studies, and peer-reviewed analysis on governance, institutional reform, and strategic leadership in the Praxis Journal archive.",
};

export default function ArchivePage() {
  return (
    <main id="top">
      <ArchiveClientPage />
    </main>
  );
}
