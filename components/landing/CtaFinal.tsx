import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SceneImage } from "@/components/ui/SceneImage";
import { common, ctaFinal } from "@/content/landing";

export function CtaFinal() {
  return (
    <section
      aria-labelledby="cta-final-title"
      className="relative isolate flex min-h-[80svh] items-center overflow-hidden"
    >
      <SceneImage src={ctaFinal.image.src} alt={ctaFinal.image.alt} className="-z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-bg via-bg/40 to-bg/90"
      />

      <div className="shell py-28 text-center">
        <Reveal className="mx-auto max-w-4xl">
          <h2
            id="cta-final-title"
            className="font-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1] font-normal tracking-[-0.02em] text-balance"
          >
            {ctaFinal.title}
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-text/80 md:text-lg">
            {ctaFinal.text}
          </p>
          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
            <Button href={ctaFinal.primaryCta.href} size="xl" animated>
              {ctaFinal.primaryCta.label}
            </Button>
            <a
              href={ctaFinal.secondaryLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-text/85 underline decoration-line underline-offset-[6px] transition-colors hover:text-text hover:decoration-text"
            >
              {ctaFinal.secondaryLink.label}
              <span className="sr-only"> {common.newTab}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
