"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import { FadeIn, ImageReveal, Parallax } from "@/components/ui/Reveal";
import { HOME_STORY } from "@/data/homeStoryData";

export default function ScrollStorySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter((card): card is HTMLElement => Boolean(card));
    if (!cards.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (!visibleEntry) return;
        const nextIndex = cards.indexOf(visibleEntry.target as HTMLElement);
        if (nextIndex >= 0) setActiveIndex(nextIndex);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.2, 0.55, 0.8] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const activeStory = HOME_STORY[activeIndex];

  return (
    <section id="praxis" className="relative overflow-hidden border-y border-border bg-background-muted scroll-mt-20">
      <Container wide className="grid lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
        <div className="lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)] lg:items-center lg:py-12">
          <FadeIn className="w-full">
            <div className="mb-6 flex items-center justify-between gap-4">
              <Badge tone="light">How AIPP moves</Badge>
              <span className="type-label text-foreground-muted">{activeStory.number} / 03</span>
            </div>

            <ImageReveal className="group relative overflow-visible">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-border bg-background shadow-soft lg:aspect-[4/5]">
                {HOME_STORY.map((story, index) => (
                  <div
                    key={story.number}
                    className={`absolute inset-0 transition-opacity duration-700 ease-out ${activeIndex === index ? "opacity-100" : "opacity-0"}`}
                    aria-hidden={activeIndex !== index}
                  >
                    <Parallax className="h-full w-full">
                      <img src={story.image} alt={story.imageAlt} loading={index === 0 ? "eager" : "lazy"} className="h-[108%] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
                    </Parallax>
                  </div>
                ))}
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-lg border border-background/25 bg-surface-dark/80 p-4 text-background backdrop-blur-sm md:inset-x-5 md:bottom-5">
                  <div>
                    <span className="type-label text-background/65">Current practice</span>
                    <p className="mt-1 font-serif text-xl italic">{activeStory.label}</p>
                  </div>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                </div>
              </div>
              <span className="absolute -bottom-3 -right-3 h-20 w-20 rounded-full border border-primary/40" aria-hidden="true" />
            </ImageReveal>
          </FadeIn>
        </div>

        <div className="relative py-20 md:py-28 lg:py-0">
          <FadeIn className="max-w-xl lg:pt-28">
            <span className="type-label text-primary">From evidence to influence</span>
            <Heading level="h2" className="mt-4 text-foreground">A practice built for the moments that matter.</Heading>
            <p className="type-body mt-5 text-foreground-muted">Each part of our work strengthens the next, giving women leaders a clearer path from insight to action.</p>
          </FadeIn>

          <div className="mt-8 md:mt-12">
            {HOME_STORY.map((story, index) => (
              <article
                key={story.number}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="flex min-h-[30rem] items-center py-10 lg:min-h-[70vh] lg:py-16"
              >
                <div className={`editorial-card w-full p-7 transition-[border-color,box-shadow,transform] duration-500 md:p-10 ${activeIndex === index ? "border-primary shadow-soft md:-translate-y-1" : ""}`}>
                  <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
                    <span className="type-label text-primary">{story.label}</span>
                    <span className="type-label text-foreground-muted">{story.number}</span>
                  </div>
                  <Heading level="h3" className="mt-7 max-w-lg text-foreground">{story.title}</Heading>
                  <p className="type-body mt-5 max-w-lg text-foreground-muted">{story.description}</p>
                  <Link href={story.linkHref} className="group mt-8 inline-flex items-center gap-2 type-label text-primary">
                    {story.linkText}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
