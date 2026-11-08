"use client";

import Container from "@/components/ui/Container";
import { useOfferReveal } from "./useOfferReveal";

interface PipelineStage {
  label: string;
  description?: string;
}

interface OfferPipelineProps {
  stages: PipelineStage[];
  sectionLabel?: string;
  sectionTitle?: string;
}

/**
 * Animated process/pipeline visualization.
 * Horizontal on desktop, vertical on mobile.
 * Used for Research Workflow, Communication Pipeline, and Strategic Approach.
 */
export default function OfferPipeline({
  stages,
  sectionLabel,
  sectionTitle,
}: OfferPipelineProps) {
  const [ref, visible] = useOfferReveal();

  return (
    <section className="aipp-section surface-muted" aria-label={sectionLabel || sectionTitle || "Process"}>
      <Container>
        {(sectionLabel || sectionTitle) && (
          <div className="offer-entrance mb-10" ref={ref} data-visible={visible}>
            {sectionLabel && (
              <p
                className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] mb-4"
                style={{
                  fontFamily: "var(--font-hero-sans)",
                  color: "var(--hero-gold)",
                }}
              >
                {sectionLabel}
              </p>
            )}
            {sectionTitle && (
              <h2
                className="text-2xl sm:text-3xl lg:text-[2.25rem] font-normal leading-[1.12] max-w-2xl"
                style={{
                  fontFamily: "var(--font-hero-serif)",
                  color: "var(--hero-navy)",
                }}
              >
                {sectionTitle}
              </h2>
            )}
          </div>
        )}

        <div
          ref={!sectionLabel && !sectionTitle ? ref : undefined}
          className="offer-pipeline offer-pipeline-enter"
          data-visible={visible}
        >
          {stages.map((stage, i) => (
            <span key={stage.label} className="contents">
              <div className="offer-pipeline-node" data-active={i === 0 ? "true" : undefined}>
                <span className="offer-pipeline-dot" />
                <span className="offer-pipeline-label">{stage.label}</span>
                {stage.description && (
                  <span className="offer-pipeline-sublabel">{stage.description}</span>
                )}
              </div>
              {i < stages.length - 1 && <div className="offer-pipeline-connector" />}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
