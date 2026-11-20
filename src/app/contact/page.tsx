import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactClosing from "@/components/contact/ContactClosing";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────
   AIPP Contact Us Page
   - Exact route: /contact
   - Brand Visual Identity: Predominantly White & Soft Off-White surfaces
   - Verified Contact Coordinates: contact@aipp-praxis.org | Geneva, Vienna, Washington D.C.
   - Comprehensive validated contact submission connected to /api/contact
   - Strict Founder Attribution: Tayyaba Atiq
   ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Contact Us | Athena Institute for Political Praxis",
  description:
    "Connect with the Athena Institute for Political Praxis (AIPP). Inquire about diplomatic crisis simulations, research submissions, fellowships, and institutional partnerships.",
  openGraph: {
    title: "Contact Us | Athena Institute for Political Praxis",
    description:
      "Connect with AIPP's external affairs directorate in Geneva, Vienna, and Washington, D.C.",
    url: "https://aipp-praxis.org/contact",
    siteName: "Athena Institute for Political Praxis",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-[#081D2E] flex flex-col font-sans selection:bg-[#0D2C49] selection:text-white">
      {/* ═══ Section 1: Institutional Navbar ═══ */}
      <Navbar />

      {/* ═══ Section 2: Contact Hero ═══ */}
      <ContactHero />

      {/* ═══ Section 3: Contact Coordinates & Interactive Form ═══ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white relative">
        <Container wide>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Verified Institutional Coordinates & Review Protocol (5 cols) */}
            <ScrollReveal variant="fade-up" className="lg:col-span-5">
              <ContactInfo />
            </ScrollReveal>

            {/* Right Column: Full Functional Contact Form with API Integration (7 cols) */}
            <ScrollReveal variant="fade-up" delay={100} className="lg:col-span-7">
              <ContactForm />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ═══ Section 4: Subtle Institutional Closing ═══ */}
      <ContactClosing />

      {/* ═══ Section 5: Institutional Footer ═══ */}
      <Footer />
    </main>
  );
}

