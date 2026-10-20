import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "glass" | "accent";
  className?: string;
};

export function Badge({ children, variant = "glass", className = "" }: BadgeProps) {
  const styles =
    variant === "accent"
      ? "border-accent/40 bg-accent-soft text-accent"
      : "border-line bg-white/8 text-text backdrop-blur-md";

  return (
    <span
      className={`eyebrow inline-flex items-center gap-2.5 rounded-full border px-4 py-2 ${styles} ${className}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}
