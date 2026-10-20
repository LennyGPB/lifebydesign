import Link from "next/link";
import type { ReactNode } from "react";
import { common } from "@/content/landing";

type Variant = "primary" | "secondary";
type Size = "md" | "lg" | "xl";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** CTA principal : lumière qui dérive dans le verre + flèche. */
  animated?: boolean;
  external?: boolean;
  className?: string;
  onClick?: () => void;
};

const base =
  "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border font-semibold tracking-[-0.01em] text-text backdrop-blur-md transition-[background-color,border-color,box-shadow,scale] duration-500 ease-calm";

const sizes: Record<Size, string> = {
  md: "min-h-11 px-6 text-sm",
  lg: "min-h-14 px-8 text-base",
  xl: "min-h-16 px-10 text-[1.0625rem] md:min-h-[4.25rem] md:px-11",
};

// Verre clair (primaire) et verre fumé (secondaire), discrets.
const variants: Record<Variant, string> = {
  primary:
    "border-white/20 bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:scale-[1.04] hover:border-white/30 hover:bg-white/[0.15] active:scale-[0.99]",
  secondary:
    "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.07]",
};

function Content({ children, animated }: { children: ReactNode; animated: boolean }) {
  return (
    <>
      {animated ? (
        <span aria-hidden="true" className="glass-flow" />
      ) : null}
      {/* Reflet qui balaie le bouton au survol (remplacé par le reflet automatique sur le CTA animé) */}
      {animated ? null : (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full -z-10 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-calm group-hover:translate-x-[400%] motion-reduce:hidden"
      />
      )}
      <span className="relative">{children}</span>
      {animated ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="relative -mr-1 size-4 transition-transform duration-500 ease-calm group-hover:translate-x-1 motion-reduce:transition-none"
        >
          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "lg",
  animated = false,
  external = false,
  className = "",
  onClick,
}: ButtonProps) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
      >
        <Content animated={animated}>{children}</Content>
        <span className="sr-only"> {common.newTab}</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      <Content animated={animated}>{children}</Content>
    </Link>
  );
}
