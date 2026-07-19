"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { formatPrice, formatDuration } from "@/lib/utils";

export type ServiceDTO = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  durationMin: number;
  popular: boolean;
};
export type CategoryDTO = {
  id: string;
  name: string;
  icon: string;
  services: ServiceDTO[];
};

export function Services({ categories }: { categories: CategoryDTO[] }) {
  const [active, setActive] = useState<string>(categories[0]?.id ?? "");
  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <section id="prestations" className="relative bg-canvas py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-8 bg-emerald" /> La carte
          </span>
          <h2 className="mt-4 text-4xl leading-[1.05] text-anthracite md:text-6xl">
            Nos prestations
          </h2>
          <p className="mt-5 text-lg text-anthracite/70">
            Choisissez une prestation et réservez en un geste. Prix clairs,
            durée indiquée — appuyez sur une ligne pour prendre rendez-vous.
          </p>
        </Reveal>

        {/* Onglets catégories */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                active === c.id
                  ? "border-navy bg-navy text-canvas shadow-soft"
                  : "border-anthracite/15 bg-white text-anthracite/75 hover:border-navy/40 hover:text-navy",
              ].join(" ")}
            >
              <Icon name={c.icon} size={16} />
              {c.name}
            </button>
          ))}
        </div>

        {/* La "carte" */}
        <div className="mx-auto mt-10 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-[2rem] border border-anthracite/10 bg-white shadow-lift"
            >
              {/* En-tête de la carte */}
              <div className="flex items-center gap-3 border-b border-dashed border-anthracite/15 bg-cream/50 px-6 py-5 md:px-8">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy text-gold">
                  <Icon name={current?.icon ?? "scissors"} size={22} />
                </span>
                <div>
                  <h3 className="font-display text-xl text-anthracite">{current?.name}</h3>
                  <p className="text-xs text-anthracite/50">
                    {current?.services.length} prestation
                    {(current?.services.length ?? 0) > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Lignes de menu */}
              <div className="divide-y divide-anthracite/8">
                {current?.services.map((s, i) => (
                  <MenuRow key={s.id} service={s} index={i} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="mt-6 text-center text-sm text-anthracite/50">
            Tous nos tarifs sont TTC · règlement sur place (CB ou espèces).
          </p>
        </div>
      </div>
    </section>
  );
}

function MenuRow({ service, index }: { service: ServiceDTO; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        href={`/reserver?service=${service.id}`}
        className="group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-gold/[0.06] md:px-8"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-base text-anthracite md:text-lg">
              {service.name}
            </span>
            {service.popular && (
              <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald">
                Populaire
              </span>
            )}
            {/* pointillés façon carte de resto */}
            <span className="mx-1 hidden flex-1 translate-y-[-3px] border-b border-dotted border-anthracite/25 sm:block" />
            <span className="hidden shrink-0 items-center gap-1 text-xs text-anthracite/45 sm:flex">
              <Icon name="clock" size={12} /> {formatDuration(service.durationMin)}
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-anthracite/55">
            {service.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="price-tag text-lg font-bold text-navy">
            {formatPrice(service.priceCents)}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald opacity-0 transition-opacity group-hover:opacity-100">
            Réserver
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
