import { Reveal } from "@/components/ui/Reveal";

type SectionTitleProps = {
  id: string;
  label: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionTitle({
  id,
  label,
  title,
  text,
  align = "left",
  className = "",
}: SectionTitleProps) {
  const centered = align === "center";

  return (
    <Reveal className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p
        className={`eyebrow flex items-center gap-3 text-text-muted ${centered ? "justify-center" : ""}`}
      >
        <span aria-hidden="true" className="h-px w-8 bg-accent" />
        {label}
      </p>
      <h2
        id={id}
        className="mt-6 font-display text-[clamp(2.125rem,4.8vw,3.75rem)] leading-[1.04] font-normal tracking-[-0.015em] text-balance"
      >
        {title}
      </h2>
      {text ? (
        <p className={`mt-6 max-w-xl text-base leading-relaxed text-text-muted md:text-lg md:leading-relaxed ${centered ? "mx-auto" : ""}`}>
          {text}
        </p>
      ) : null}
    </Reveal>
  );
}
