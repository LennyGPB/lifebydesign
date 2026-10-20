import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { PlaceholderContent } from "@/content/pages";

export function PlaceholderPage({ content }: { content: PlaceholderContent }) {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-(--nav-height)">
      <div aria-hidden="true" className="scene-fallback absolute inset-0 opacity-60" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-bg/40 via-transparent to-bg" />
      <div className="shell relative py-24">
        <p className="eyebrow flex items-center gap-3 text-text-muted">
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          {content.label}
        </p>
        <h1 className="rise mt-6 max-w-3xl font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1] font-normal tracking-[-0.02em] text-balance">
          {content.title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
          {content.text}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          {content.externalLink ? (
            <Button href={content.externalLink.href} external>
              {content.externalLink.label}
            </Button>
          ) : null}
          <Link
            href={content.backLink.href}
            className="text-sm text-text/80 underline-offset-4 hover:text-text hover:underline"
          >
            {content.backLink.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
