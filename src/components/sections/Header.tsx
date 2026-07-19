"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV, SITE } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="container-x">
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-5",
            scrolled
              ? "glass shadow-glass"
              : "border border-transparent bg-transparent",
          )}
        >
          {/* Logo */}
          <Link href="/#accueil" className="group flex items-center gap-2.5">
            <span
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full font-display text-sm transition-colors",
                scrolled ? "bg-navy text-canvas" : "bg-canvas/90 text-navy",
              )}
            >
              L
            </span>
            <span
              className={cn(
                "font-display text-base leading-none tracking-tightest transition-colors md:text-lg",
                scrolled ? "text-anthracite" : "text-canvas drop-shadow",
              )}
            >
              Len&apos;s Barber Shop
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-anthracite/80 hover:bg-navy/5 hover:text-navy"
                    : "text-canvas/90 hover:bg-white/10 hover:text-canvas",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className={cn(
                "hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors md:inline-flex",
                scrolled ? "text-navy hover:bg-navy/5" : "text-canvas hover:bg-white/10",
              )}
            >
              <Icon name="phone" size={16} />
              <span className="tabular-nums">{SITE.phone}</span>
            </a>
            <Link
              href="/reserver"
              className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink shadow-gold transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Prendre rendez-vous
            </Link>

            {/* Burger mobile */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full lg:hidden",
                scrolled ? "text-navy hover:bg-navy/5" : "text-canvas hover:bg-white/10",
              )}
            >
              <div className="space-y-1.5">
                <span className={cn("block h-0.5 w-5 bg-current transition-all", open && "translate-y-2 rotate-45")} />
                <span className={cn("block h-0.5 w-5 bg-current transition-all", open && "opacity-0")} />
                <span className={cn("block h-0.5 w-5 bg-current transition-all", open && "-translate-y-2 -rotate-45")} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container-x mt-2 lg:hidden"
          >
            <div className="glass rounded-3xl p-4 shadow-glass">
              <nav className="grid gap-1">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-anthracite hover:bg-navy/5"
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  href="/reserver"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-2xl bg-gold px-4 py-3 text-center text-sm font-semibold text-ink"
                >
                  Prendre rendez-vous
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
