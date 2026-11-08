"use client";

import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import type { OfferCapability } from "@/data/offerData";
import { useOfferReveal } from "./useOfferReveal";

interface OfferCapabilityListProps {
  capabilities: OfferCapability[];
  sectionLabel?: string;
  sectionTitle?: string;
}

/**
 * Editorial capability list — numbered rows with title, description, and hover interaction.
 * Used on all three pillar detail pages with pillar-specific capabilities.
 */
export default function OfferCapabilityList({
  capabilities,
  sectionLabel = "What we do",
  sectionTitle,
}: OfferCapabilityListProps) {
  const [ref, visible] = useOfferReveal();

  return (
    <section className="aipp-section" aria-label={sectionLabel}>
      <Container>
        {sectionTitle && (
          <div className="offer-entrance mb-10" ref={ref} data-visible={visible}>
            <p
              className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] mb-4"
              style={{
                fontFamily: "var(--font-hero-sans)",
                color: "var(--hero-gold)",
              }}
            >
              {sectionLabel}
            </p>
            <h2
              className="text-2xl sm:text-3xl lg:text-[2.25rem] font-normal leading-[1.12] max-w-2xl"
              style={{
                fontFamily: "var(--font-hero-serif)",
                color: "var(--hero-navy)",
              }}
            >
              {sectionTitle}
            </h2>
          </div>
        )}

        <div className="offer-stagger" ref={!sectionTitle ? ref : undefined} data-visible={visible}>
          {capabilities.map((cap) => (
            <div key={cap.number} className="offer-capability-row">
              <span className="offer-capability-number">{cap.number}</span>
              <div>
                <h3 className="offer-capability-title">{cap.title}</h3>
                <p className="offer-capability-description">{cap.description}</p>
              </div>
              <ArrowUpRight className="offer-capability-arrow h-5 w-5 mt-1" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
