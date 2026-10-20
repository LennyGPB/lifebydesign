import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { processSection } from "@/content/landing";

export function Process() {
  const titleId = `${processSection.id}-title`;

  return (
    <section
      id={processSection.id}
      aria-labelledby={titleId}
      className="border-t border-line py-24 md:py-36"
    >
      <div className="shell">
        <SectionTitle id={titleId} label={processSection.label} title={processSection.title} />

        <ol className="relative mt-14 grid gap-12 md:mt-20 lg:grid-cols-4 lg:gap-8">
          {/* Ligne de la timeline : verticale sur mobile, horizontale dès lg */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[5px] w-px bg-line lg:top-[5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
          />
          {processSection.steps.map((step, index) => (
            <li key={step.title} className="relative pl-10 lg:pt-12 lg:pl-0">
              <span
                aria-hidden="true"
                className={`absolute top-1.5 left-0 size-[11px] rounded-full border lg:top-0 ${
                  index === processSection.steps.length - 1
                    ? "border-accent bg-accent"
                    : "border-text/40 bg-bg"
                }`}
              />
              <Reveal delay={index * 0.1}>
                <p className="eyebrow text-text-muted">
                  {processSection.stepLabel} {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-2xl leading-tight tracking-[-0.015em]">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted md:text-[0.95rem]">
                  {step.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
