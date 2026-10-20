import { Reveal } from "@/components/ui/Reveal";
import { SceneImage } from "@/components/ui/SceneImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { methode } from "@/content/landing";

export function Methode() {
  const titleId = `${methode.id}-title`;

  return (
    <section
      id={methode.id}
      aria-labelledby={titleId}
      className="border-t border-line py-24 md:py-36"
    >
      <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-line sm:aspect-[16/10] lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:aspect-auto lg:h-[min(80vh,46rem)] lg:self-start">
          <SceneImage
            src={methode.image.src}
            alt={methode.image.alt}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-bg/70 via-transparent to-transparent"
          />
        </Reveal>

        <div>
          <SectionTitle
            id={titleId}
            label={methode.label}
            title={methode.title}
            text={methode.text}
          />

          <ol className="mt-14 border-b border-line">
            {methode.piliers.map((pilier, index) => (
              <li key={pilier.title} className="border-t border-line">
                <Reveal delay={index * 0.06} className="grid grid-cols-[3rem_1fr] gap-4 py-8 md:grid-cols-[4.5rem_1fr]">
                  <span className="font-display text-xl leading-none tracking-[-0.02em] text-accent md:text-2xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl leading-tight tracking-[-0.015em] md:text-[1.75rem]">
                      {pilier.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted md:text-base">
                      {pilier.text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
