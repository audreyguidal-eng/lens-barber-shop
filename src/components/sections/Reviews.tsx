"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { Counter } from "@/components/ui/Counter";
import { SITE } from "@/lib/site";

export type ReviewDTO = {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: string;
};

export function Reviews({ reviews }: { reviews: ReviewDTO[] }) {
  return (
    <section id="avis" className="relative overflow-hidden bg-navy py-24 text-canvas md:py-32">
      {/* halos décoratifs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="container-x relative">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal className="max-w-xl">
            <span className="eyebrow text-gold">
              <span className="h-px w-8 bg-gold" /> Avis clients
            </span>
            <h2 className="mt-4 text-4xl leading-[1.05] text-canvas md:text-6xl">
              Ils nous font
              <span className="text-gold"> confiance.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex items-center gap-5 rounded-3xl border border-white/15 bg-white/5 px-6 py-5 backdrop-blur">
              <div className="text-center">
                <div className="font-display text-5xl text-gold">
                  <Counter to={SITE.rating.value} decimals={1} />
                </div>
                <Stars value={SITE.rating.value} animate />
              </div>
              <div className="h-14 w-px bg-white/15" />
              <div>
                <div className="font-mono text-2xl font-bold">
                  <Counter to={SITE.rating.count} />
                </div>
                <div className="text-sm text-canvas/70">avis Google</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Cartes d'avis */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 0.08}>
              <figure className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition-colors hover:border-gold/40 hover:bg-white/[0.09]">
                <Stars value={r.rating} size={16} />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-canvas/85">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/20 font-display text-sm text-gold">
                    {r.author.charAt(0)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-canvas">{r.author}</div>
                    <div className="text-xs text-canvas/50">via {r.source}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
