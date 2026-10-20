import { Reveal } from "@/components/ui/Reveal";
import { SceneImage } from "@/components/ui/SceneImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { apropos } from "@/content/landing";

export function APropos() {
  const titleId = `${apropos.id}-title`;

  return (
    <section
      id={apropos.id}
      aria-labelledby={titleId}
      className="border-t border-line py-24 md:py-36"
    >
      <div className="shell grid items-center gap-12 md:grid-cols-[5fr_7fr] md:gap-16 lg:gap-24">
        <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[20px] border border-line bg-bg-elevated md:mx-0">
          <SceneImage
            src={apropos.image.src}
            alt={apropos.image.alt}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="opacity-80"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-bg/80 via-bg/10 to-transparent"
          />
        </Reveal>

        <div>
          <SectionTitle id={titleId} label={apropos.label} title={apropos.title} />
          <Reveal delay={0.1} className="mt-8 space-y-5">
            {apropos.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg md:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
