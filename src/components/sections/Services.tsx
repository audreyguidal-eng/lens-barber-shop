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
  const [active, setActive] = useState<string>("all");

  const visible =
    active === "all"
      ? categories
      : categories.filter((c) => c.id === active);

  return (
    <section id="prestations" className="relative bg-canvas py-24 md:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">
            <span className="h-px w-8 bg-emerald" /> Nos prestations
          </span>
          <h2 className="mt-4 text-4xl leading-[1.05] text-anthracite md:text-6xl">
            Un savoir-faire
            <br />
            <span className="text-navy">pour chaque style.</span>
          </h2>
          <p className="mt-5 text-lg text-anthracite/70">
            Coupe, barbe, transformation, enfants, coloration, soins et prestations
            femmes. Des tarifs clairs, un rendu premium à chaque visite.
          </p>
        </Reveal>

        {/* Filtres catégories */}
        <div className="mt-10 flex flex-wrap gap-2">
          <FilterChip
            label="Tout voir"
            active={active === "all"}
            onClick={() => setActive("all")}
          />
          {categories.map((c) => (
            <FilterChip
              key={c.id}
              label={c.name}
              icon={c.icon}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>

        {/* Cartes */}
        <div className="mt-12 space-y-16">
          <AnimatePresence mode="wait">
            {visible.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy/5 text-navy">
                    <Icon name={cat.icon} size={22} />
                  </span>
                  <h3 className="font-display text-2xl text-anthracite">{cat.name}</h3>
                  <span className="h-px flex-1 bg-anthracite/10" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.services.map((s, i) => (
                    <Reveal key={s.id} delay={i * 0.04}>
                      <ServiceCard service={s} />
                    </Reveal>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
        active
          ? "border-navy bg-navy text-canvas shadow-soft"
          : "border-anthracite/15 bg-white text-anthracite/75 hover:border-navy/40 hover:text-navy",
      ].join(" ")}
    >
      {icon && <Icon name={icon} size={16} />}
      {label}
    </button>
  );
}

function ServiceCard({ service }: { service: ServiceDTO }) {
  return (
    <Link
      href="/reserver"
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-anthracite/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
    >
      {/* halo doré au survol */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-display text-lg leading-tight text-anthracite">
            {service.name}
          </h4>
          {service.popular && (
            <span className="shrink-0 rounded-full bg-emerald/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald">
              Populaire
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-anthracite/60">
          {service.description}
        </p>
      </div>

      <div className="relative mt-6 flex items-end justify-between">
        <div>
          <div className="price-tag text-xl font-bold text-navy">
            {formatPrice(service.priceCents)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-anthracite/50">
            <Icon name="clock" size={13} />
            {formatDuration(service.durationMin)}
          </div>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy transition-all duration-300 group-hover:bg-gold group-hover:text-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
