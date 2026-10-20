import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  as?: "div" | "article" | "li" | "aside";
  /** "light" : verre clair, comme le CTA principal. */
  variant?: "default" | "light";
  /** Lumière qui dérive lentement dans le verre (même effet que le CTA principal). */
  animated?: boolean;
  className?: string;
};

const variants = {
  default:
    "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]",
  light:
    "border-white/20 bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-white/30 hover:bg-white/[0.15]",
};

export function GlassCard({
  children,
  as: Tag = "div",
  variant = "default",
  animated = false,
  className = "",
}: GlassCardProps) {
  return (
    <Tag
      className={`group relative isolate overflow-hidden rounded-[20px] border backdrop-blur-md transition-[background-color,border-color] duration-500 ease-calm ${variants[variant]} ${className}`}
    >
      {animated ? <span aria-hidden="true" className="glass-flow" /> : null}
      {children}
    </Tag>
  );
}
