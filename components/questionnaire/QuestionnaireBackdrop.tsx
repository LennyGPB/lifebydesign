"use client";

import { useEffect, useRef } from "react";

export function QuestionnaireBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    let inView = false;
    const syncAnimation = () => {
      backdrop.style.animationPlayState = inView && !document.hidden ? "running" : "paused";
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncAnimation();
    });
    observer.observe(backdrop);
    document.addEventListener("visibilitychange", syncAnimation);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, []);

  return <div ref={backdropRef} aria-hidden="true" className="glass-flow questionnaire-backdrop" />;
}
