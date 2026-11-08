"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactModal from "@/components/ui/ContactModal";
import Badge from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Section from "@/components/ui/Section";
import { FadeIn, ImageReveal, Parallax, SlideIn, SlideUp, Stagger } from "@/components/ui/Reveal";
import { ABOUT_HERO, APPROACH_STEPS, LEADERSHIP, PURPOSE_AREAS } from "@/data/aboutData";

export default function AboutPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar onOpenContact={() => setIsContactOpen(true)} />

      <section className="relative overflow-hidden border-b border-border pt-28 pb-14 md:pt-32 md:pb-16">
        <Container wide>
          <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div className="max-w-xl pb-2">
              <FadeIn>
                <Badge tone="light">{ABOUT_HERO.eyebrow}</Badge>
              </FadeIn>
              <Stagger className="hero-lines mt-6 max-w-xl">
                <Heading level="h1" className="text-primary">
                  {ABOUT_HERO.titleLines.map((line) => <span key={line} className="hero-line">{line}</span>)}
                </Heading>
              </Stagger>
              <SlideUp delay={260} className="mt-7 max-w-lg">
                <p className="type-body-large text-foreground-muted">
                {ABOUT_HERO.description}
                </p>
              </SlideUp>
              <FadeIn delay={420} className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/research" className={buttonStyles({ size: "lg" })}>
                  Explore our research <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="#who-we-are" className={buttonStyles({ variant: "outline", size: "lg" })}>
                  Discover AIPP <ArrowDown className="h-4 w-4" />
                </Link>
              </FadeIn>
            </div>

            <ImageReveal className="group relative overflow-visible bg-background-muted shadow-[var(--shadow-deep)]">
              <div className="relative aspect-[5/4] overflow-hidden border border-border bg-background-muted md:aspect-[16/10] lg:aspect-[5/4]">
                <Parallax className="h-full w-full">
                  <img src={ABOUT_HERO.image} alt={ABOUT_HERO.imageAlt} className="h-[108%] w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                </Parallax>
                <div className="hero-overlay absolute inset-x-0 bottom-0 border-t border-background/25 bg-surface-dark/80 px-5 py-4 text-background backdrop-blur-sm md:px-7 md:py-5">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <span className="type-label text-background/65">AIPP / Political Praxis</span>
                      <p className="mt-2 max-w-xs font-serif text-base italic md:text-lg">Research becomes public action when the right voices are in the room.</p>
                    </div>
                    <span className="font-serif text-2xl text-accent">01</span>
                  </div>
                </div>
              </div>
              <span className="absolute -left-3 top-10 hidden h-24 w-px bg-primary/45 sm:block" />
              <div className="hero-overlay absolute right-2 top-4 border border-border bg-surface px-3 py-2 sm:px-4 sm:py-3 shadow-[var(--shadow-soft)] sm:-right-5 sm:top-10">
                <span className="type-label block text-primary">Research</span>
                <span className="type-label mt-1 block text-foreground-muted">Policy / Diplomacy</span>
              </div>
              <div className="hero-overlay absolute -bottom-3 left-2 sm:-bottom-5 sm:-left-6 flex items-center gap-3 bg-primary px-3.5 py-2.5 sm:px-4 sm:py-3 text-background shadow-[var(--shadow-soft)]">
                <span className="h-2 w-2 rounded-full border border-background/80" />
                <span className="type-label text-background">Women at the table</span>
              </div>
            </ImageReveal>
          </div>
        </Container>
      </section>

      <Section id="who-we-are" tone="ivory">
        <div className="grid items-center gap-14 lg:grid-cols-[0.7fr_1fr] lg:gap-24">
          <FadeIn className="order-2 lg:order-1">
            <ImageReveal className="overflow-hidden bg-background-muted">
              <Parallax className="h-full w-full">
                <img
                  src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=85&w=1400"
                  alt="A group in discussion at a policy gathering"
                  className="aspect-[4/5] w-full object-cover"
                />
              </Parallax>
            </ImageReveal>
          </FadeIn>
          <SlideIn direction="left" className="order-1 lg:order-2">
            <p className="type-label">02 / Who we are</p>
            <Heading level="h2" className="mt-5 max-w-2xl text-primary">
              A place for serious ideas and generous exchange.
            </Heading>
            <div className="mt-8 max-w-xl space-y-5 text-foreground-muted">
              <p className="type-body-large">
                AIPP is a non-partisan international policy institute dedicated to elevating women in diplomatic affairs, statecraft, and multilateral decision-making.
              </p>
              <p className="type-body">
                We bring research, policy thinking, strategic action, communication, and public advocacy into the same conversation. The result is a practical community for people who believe better representation produces better decisions.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-5">
              <div><span className="type-h3 text-primary">5</span><span className="type-caption mt-2 block">Practice areas</span></div>
              <div><span className="type-h3 text-primary">38</span><span className="type-caption mt-2 block">Nations connected</span></div>
              <div><span className="type-h3 text-primary">150+</span><span className="type-caption mt-2 block">Policy publications</span></div>
            </div>
          </SlideIn>
        </div>
      </Section>

      <Section id="purpose" tone="muted">
        <FadeIn className="max-w-3xl">
          <p className="type-label">03 / Our purpose</p>
          <Heading level="h2" className="mt-5 text-primary">
            From knowledge to meaningful influence.
          </Heading>
        </FadeIn>
        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {PURPOSE_AREAS.map((area) => (
            <article key={area.number} className="editorial-card group flex min-h-[23rem] flex-col justify-between rounded-[1.25rem] p-7 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="font-serif text-4xl text-primary/35 transition-transform duration-300 group-hover:translate-x-1">{area.number}</span>
                <span className="type-label">{area.label}</span>
              </div>
              <div>
                <Heading level="h3" className="max-w-xs text-primary transition-transform duration-300 group-hover:translate-x-1">{area.title}</Heading>
                <p className="type-body-small mt-5 max-w-sm text-foreground-muted transition-colors duration-300 group-hover:text-foreground">{area.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-primary">
                  <span className="type-caption">AIPP practice</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </Stagger>
      </Section>

      <Section id="approach" tone="ivory">
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr] lg:gap-24">
          <SlideUp>
            <p className="type-label">04 / Our approach</p>
            <Heading level="h2" className="mt-5 text-primary">A practice built to move.</Heading>
            <p className="type-body mt-6 max-w-sm text-foreground-muted">
              Our work moves between the page, the room, and the public square. Each step makes the next conversation sharper.
            </p>
          </SlideUp>
          <Stagger className="relative border-l border-border pl-7 md:pl-12">
            {APPROACH_STEPS.map((step, index) => (
              <div key={step.number} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[2.15rem] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-background font-sans text-[0.6rem] font-semibold text-primary md:-left-[3.15rem]">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <Heading level="h3" className="text-primary">{step.title}</Heading>
                  <p className="type-body-small max-w-xs text-foreground-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section id="leadership" tone="muted">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <FadeIn>
            <p className="type-label">05 / Leadership</p>
            <Heading level="h2" className="mt-5 max-w-2xl text-primary">Experience with an open door.</Heading>
          </FadeIn>
          <p className="type-body-small max-w-sm text-foreground-muted">A small group of practitioners, researchers, and strategists who keep AIPP close to the realities it studies.</p>
        </div>
        <Stagger className="mt-14 grid gap-8 md:grid-cols-3">
          {LEADERSHIP.map((member) => (
            <article key={member.name} className="group">
              <ImageReveal className="overflow-hidden rounded-[1.25rem] bg-background-muted">
                <img src={member.image} alt={member.name} className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              </ImageReveal>
              <div className="border-b border-border py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Heading level="h4" className="text-primary">{member.name}</Heading>
                    <p className="type-label mt-2">{member.role}</p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <p className="type-body-small mt-4 max-w-sm text-foreground-muted">{member.description}</p>
              </div>
            </article>
          ))}
        </Stagger>
      </Section>

      <section className="relative overflow-hidden bg-primary py-24 text-background md:py-32">
        <Container wide>
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <SlideUp className="max-w-3xl">
              <p className="type-label text-background/70">06 / Join the conversation</p>
              <Heading level="h2" className="mt-5 text-background">Be part of the conversation shaping tomorrow.</Heading>
            </SlideUp>
            <FadeIn className="flex flex-wrap gap-3">
              <Link href="/research" className={buttonStyles({ variant: "secondary", size: "lg" })}>Explore our research</Link>
              <Link href="/#get-involved" className={buttonStyles({ variant: "outline", size: "lg", className: "border-background/40 text-background hover:bg-background hover:text-primary" })}>Get involved</Link>
            </FadeIn>
          </div>
        </Container>
      </section>

      <Footer onOpenContact={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </main>
  );
}
