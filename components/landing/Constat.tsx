import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { constat } from "@/content/landing";

export function Constat() {
  const titleId = `${constat.id}-title`;

  return (
    <section id={constat.id} aria-labelledby={titleId} className="py-24 md:py-36">
      <div className="shell">
        <SectionTitle id={titleId} label={constat.label} title={constat.title} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {constat.items.map((item, index) => (
            <li key={item.title} className="flex">
              <Reveal delay={index * 0.08} className="flex w-full">
                <GlassCard as="article" className="flex w-full flex-col p-7 md:p-8">
                  <span aria-hidden="true" className="eyebrow text-text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-10 font-display text-2xl leading-[1.15] tracking-[-0.015em] md:mt-16">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-text-muted md:text-[0.95rem]">
                    {item.text}
                  </p>
                </GlassCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
