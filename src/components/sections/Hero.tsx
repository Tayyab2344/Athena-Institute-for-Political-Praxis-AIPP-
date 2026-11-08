import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import { FadeIn, ImageReveal, Parallax } from "@/components/ui/Reveal";
import { buttonStyles } from "@/components/ui/Button";
import { HERO_DATA } from "@/data/mockData";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-between overflow-x-clip bg-background pt-28 pb-12 md:pt-32 md:pb-16">
      <Container wide className="relative z-10 w-full">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <FadeIn className="flex flex-col items-start gap-7">
            <Badge tone="light">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
              {HERO_DATA.eyebrow}
            </Badge>

            <Heading level="h1" className="max-w-2xl text-foreground">
              Women shaping the <span className="italic text-primary">conversations</span> that shape our world.
            </Heading>

            <p className="type-body-large max-w-xl text-foreground-muted">{HERO_DATA.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              <a href={HERO_DATA.primaryCta.href} className={buttonStyles({ size: "lg" })}>
                {HERO_DATA.primaryCta.text} <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link href="/about" className={buttonStyles({ variant: "outline", size: "lg" })}>
                Learn about AIPP
              </Link>
            </div>

            <div className="grid w-full max-w-lg grid-cols-3 gap-5 border-t border-border pt-5">
              {["Research", "Strategy", "Advocacy"].map((label, index) => (
                <div key={label}>
                  <span className="type-h3 text-primary">0{index + 1}</span>
                  <span className="type-caption mt-2 block">{label}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <ImageReveal className="group relative overflow-visible rounded-[1.75rem] bg-background-muted lg:ml-4">
            <div className="relative aspect-[5/6] overflow-hidden rounded-[1.75rem] border border-border bg-background-muted shadow-soft">
              <Parallax className="h-full w-full">
                <img src={HERO_DATA.mainImage} alt="Women diplomats in session at international summit" loading="eager" className="h-[108%] w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
              </Parallax>
              <div className="absolute inset-x-4 bottom-4 border border-background/30 bg-surface-dark/85 p-4 text-background backdrop-blur-sm md:inset-x-6 md:bottom-6 md:p-5">
                <span className="type-label text-background/70">Institutional focus</span>
                <p className="mt-2 font-serif text-base italic md:text-lg">Multilateral peacebuilding is strongest when women hold decision-making seats.</p>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 hidden w-36 overflow-hidden rounded-xl border-4 border-background bg-background shadow-soft sm:block md:w-44">
              <div className="aspect-[4/3]">
                <img src={HERO_DATA.secondaryImage} alt="Women gathered in a diplomatic working session" loading="eager" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
              <span className="block px-3 py-2 type-label text-foreground-muted">Shared intelligence</span>
            </div>
            <div className="absolute -right-5 top-10 hidden w-24 overflow-hidden rounded-lg border-4 border-background bg-background shadow-soft lg:block">
              <div className="aspect-[3/4]">
                <img src={HERO_DATA.tertiaryImage} alt="A woman leader speaking at a public forum" loading="eager" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
            </div>
          </ImageReveal>
        </div>
      </Container>

      <Container wide className="flex w-full items-center justify-between pt-12 text-foreground-muted">
        <div className="flex items-center gap-2 type-caption">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>Athena Institute for Political Praxis</span>
        </div>
        <a href="#about" className="group flex items-center gap-2 type-label transition-colors hover:text-primary">
          Scroll to explore <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-1" />
        </a>
      </Container>
    </section>
  );
}
