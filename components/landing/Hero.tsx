import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SceneImage } from "@/components/ui/SceneImage";
import { hero } from "@/content/landing";

const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      <SceneImage
        src={hero.image.src}
        alt={hero.image.alt}
        position={hero.image.position}
        priority
        className="-z-10"
      />
      {/* Voiles sombres : haut (navbar), gauche (titre sur le ciel lumineux), bas (transition vers la page) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-bg/35 via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-bg/60 via-bg/15 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-bg via-bg/60 to-transparent"
      />

      <div className="shell flex flex-1 flex-col justify-end pt-[calc(var(--nav-height)+3rem)] pb-8 md:pb-10">
        <div className="max-w-4xl">
          <h1
            id="hero-title"
            className="rise font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.98] font-normal tracking-[-0.02em]"
            style={delay(0.2)}
          >
            <span className="title-reveal -mb-[0.12em] inline-block pb-[0.12em]">
              {hero.titleLines.map((line, index) => (
                <span key={line} className={`block ${index === 0 ? "font-extralight italic" : "font-medium"}`}>
                  {line}
                  {index < hero.titleLines.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          </h1>
          <p
            className="rise mt-7 max-w-xl text-base leading-relaxed text-text/80 md:text-lg md:leading-relaxed"
            style={delay(0.35)}
          >
            {hero.subtitle}
          </p>
          <div
            className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={delay(0.5)}
          >
            <Button href={hero.primaryCta.href} size="xl" animated>
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="secondary" size="xl">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        <div
          className="rise mt-14 flex items-end justify-between gap-10 border-t border-line pt-7 md:mt-16"
          style={delay(0.7)}
        >
          <dl className="grid w-full grid-cols-3 gap-4 sm:gap-10 lg:w-auto">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1.5">
                <dt className="text-xs leading-snug text-text-muted sm:text-sm">{stat.label}</dt>
                <dd className="font-display text-2xl leading-none tracking-[-0.02em] whitespace-nowrap sm:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <GlassCard
            as="aside"
            variant="light"
            animated
            className="hidden max-w-xs shrink-0 p-6 lg:block"
          >
            <p className="text-sm leading-relaxed text-text/90">{hero.card.text}</p>
            {/* Le lien couvre toute la carte (after:inset-0) */}
            <Link
              href={hero.card.link.href}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-text after:absolute after:inset-0 after:rounded-[20px]"
            >
              {hero.card.link.label}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-4 transition-transform duration-500 ease-calm group-hover:translate-x-1"
              >
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
