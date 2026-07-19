"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { RippleButton } from "@/components/ui/RippleButton";
import { SITE, FAQ } from "@/lib/site";
import { useState } from "react";

export function Contact() {
  return (
    <section id="contact" className="relative bg-canvas py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Infos + horaires */}
          <div>
            <Reveal>
              <span className="eyebrow">
                <span className="h-px w-8 bg-emerald" /> Contact & horaires
              </span>
              <h2 className="mt-4 text-4xl leading-[1.05] text-anthracite md:text-5xl">
                Passez nous voir.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 space-y-3">
                <a
                  href={SITE.mapsQuery}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 rounded-2xl border border-anthracite/10 bg-white p-5 transition-colors hover:border-navy/30"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy/5 text-navy">
                    <Icon name="pin" size={20} />
                  </span>
                  <div>
                    <div className="font-semibold text-anthracite">Adresse</div>
                    <div className="text-sm text-anthracite/65">{SITE.address.full}</div>
                  </div>
                </a>
                <a
                  href={SITE.phoneHref}
                  className="flex items-start gap-4 rounded-2xl border border-anthracite/10 bg-white p-5 transition-colors hover:border-navy/30"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy/5 text-navy">
                    <Icon name="phone" size={20} />
                  </span>
                  <div>
                    <div className="font-semibold text-anthracite">Téléphone</div>
                    <div className="text-sm text-anthracite/65">{SITE.phone}</div>
                  </div>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-4 rounded-2xl border border-anthracite/10 bg-white p-5">
                <div className="mb-3 flex items-center gap-2 font-semibold text-anthracite">
                  <Icon name="clock" size={18} className="text-emerald" /> Horaires d&apos;ouverture
                </div>
                <ul className="divide-y divide-anthracite/5">
                  {SITE.hours.map((h) => {
                    const closed = h.value === "Fermé";
                    return (
                      <li key={h.day} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-anthracite/70">{h.day}</span>
                        <span className={closed ? "font-medium text-anthracite/40" : "font-mono text-anthracite"}>
                          {h.value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              {/* Le salon en pratique */}
              <div className="mt-4 rounded-2xl border border-anthracite/10 bg-white p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-anthracite/45">
                  Le salon en pratique
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: "parking", label: "Parking" },
                    { icon: "card", label: "Carte bancaire" },
                    { icon: "wheelchair", label: "Accès PMR" },
                    { icon: "child", label: "Enfants" },
                    { icon: "afro", label: "Afro & texturés" },
                    { icon: "woman", label: "Femmes" },
                  ].map((a) => (
                    <span
                      key={a.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-anthracite/10 bg-canvas px-3 py-1.5 text-xs font-medium text-anthracite/70"
                    >
                      <Icon name={a.icon} size={14} className="text-emerald" />
                      {a.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <RippleButton href="/reserver" variant="gold" className="px-8 py-4">
                  Réserver un créneau
                </RippleButton>
              </div>
            </Reveal>
          </div>

          {/* Carte + FAQ */}
          <div>
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-anthracite/10 shadow-soft">
                <iframe
                  title="Carte Len's Barber Shop"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    "Len's Barber Shop, " + SITE.address.full,
                  )}&output=embed`}
                  width="100%"
                  height="280"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-6">
                <h3 className="font-display text-xl text-anthracite">Questions fréquentes</h3>
                <div className="mt-3 space-y-2">
                  {FAQ.map((f, i) => (
                    <FaqItem key={i} q={f.q} a={f.a} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-anthracite/10 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-anthracite">{q}</span>
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy/5 text-navy transition-transform ${open ? "rotate-45" : ""}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm leading-relaxed text-anthracite/65">{a}</p>
        </div>
      </div>
    </div>
  );
}
