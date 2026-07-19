"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Stars } from "@/components/ui/Stars";
import { SITE } from "@/lib/site";

export function TrustBar() {
  return (
    <section className="relative z-10 -mt-10 md:-mt-14">
      <div className="container-x">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-anthracite/10 bg-anthracite/10 shadow-lift md:grid-cols-4">
            <Cell>
              <div className="flex items-center gap-2">
                <span className="font-display text-3xl text-navy md:text-4xl">
                  <Counter to={SITE.rating.value} decimals={1} />
                </span>
                <span className="text-lg text-anthracite/40">/5</span>
              </div>
              <div className="mt-1"><Stars value={SITE.rating.value} size={15} /></div>
              <div className="mt-1 text-xs font-medium text-anthracite/55">Note Google</div>
            </Cell>
            <Cell>
              <div className="font-display text-3xl text-navy md:text-4xl">
                <Counter to={SITE.rating.count} />
              </div>
              <div className="mt-2 text-xs font-medium text-anthracite/55">Avis clients</div>
            </Cell>
            <Cell>
              <div className="font-display text-3xl text-navy md:text-4xl">6<span className="text-emerald">j</span>/7</div>
              <div className="mt-2 text-xs font-medium text-anthracite/55">Ouvert du lundi au samedi</div>
            </Cell>
            <Cell>
              <div className="font-display text-2xl leading-tight text-navy md:text-3xl">Toutes<br className="hidden md:block" /> textures</div>
              <div className="mt-2 text-xs font-medium text-anthracite/55">Hommes · Femmes · Enfants</div>
            </Cell>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white px-4 py-7 text-center transition-colors hover:bg-cream/40">
      {children}
    </div>
  );
}
