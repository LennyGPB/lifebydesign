"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { navigation } from "@/content/landing";

const MENU_ID = "menu-mobile";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  // Pas de backdrop-filter quand le menu est ouvert : il ferait du header
  // le bloc conteneur du panneau en position fixed.
  const headerStyle = open
    ? "border-line bg-bg"
    : scrolled
      ? "border-white/8 bg-bg/60 backdrop-blur-xl"
      : "border-transparent bg-transparent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ease-calm ${headerStyle}`}
    >
      <div className="shell relative flex h-(--nav-height) items-center justify-between gap-6">
        <Link
          href={siteConfig.routes.home}
          aria-label={navigation.homeLabel}
          onClick={close}
          className="font-display text-xl font-medium leading-none tracking-[-0.02em] whitespace-nowrap"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label={navigation.mainLabel} className="hidden md:block">
          <ul className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1">
            {navigation.links.map((link, index) => (
              <li key={link.href} className="flex items-center">
                {index > 0 ? (
                  <span aria-hidden="true" className="px-1 text-text-muted/60">
                    ·
                  </span>
                ) : null}
                <Link
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm text-text/80 transition-colors duration-300 hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button href={navigation.cta.href} size="md">
              {navigation.cta.label}
            </Button>
          </div>

          <button
            type="button"
            className="relative inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07] md:hidden"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? navigation.menuClose : navigation.menuOpen}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              aria-hidden="true"
              className={`absolute h-px w-4.5 bg-text transition-transform duration-300 ease-calm ${
                open ? "rotate-45" : "-translate-y-[3.5px]"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px w-4.5 bg-text transition-transform duration-300 ease-calm ${
                open ? "-rotate-45" : "translate-y-[3.5px]"
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={MENU_ID}
            role="dialog"
            aria-modal="true"
            aria-label={navigation.menuTitle}
            className="fixed inset-x-0 top-(--nav-height) bottom-0 z-40 flex h-[calc(100dvh-var(--nav-height))] flex-col bg-bg/80 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label={navigation.mobileLabel} className="shell flex flex-1 flex-col justify-between pt-10 pb-10">
              <ul className="flex flex-col">
                {navigation.links.map((link, index) => (
                  <motion.li
                    key={link.href}
                    className="border-b border-line"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      className="flex items-baseline justify-between py-5 font-display text-5xl leading-none tracking-[-0.02em]"
                    >
                      {link.label}
                      <span aria-hidden="true" className="eyebrow text-text-muted">
                        0{index + 1}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Button href={navigation.cta.href} onClick={close} className="w-full">
                {navigation.cta.label}
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
