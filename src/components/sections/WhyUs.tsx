"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { IMAGES } from "@/lib/images";

const points = [
  {
    icon: "scissors",
    title: "Un vrai savoir-faire",
    text: "Dégradés, ciseaux, rasoir : chaque coupe est réalisée avec précision, pour hommes, femmes et enfants, toutes textures de cheveux.",
  },
  {
    icon: "droplet",
    title: "Hygiène irréprochable",
    text: "Salon propre et matériel désinfecté après chaque client — un point que nos clients soulignent dans leurs avis.",
  },
  {
    icon: "check",
    title: "À l'écoute",
    text: "On prend le temps de vous conseiller pour un résultat qui vous ressemble vraiment. Accueil chaleureux garanti.",
  },
  {
    icon: "clock",
    title: "Réservation en ligne",
    text: "Choisissez votre créneau en 30 secondes, sans appeler. Confirmation immédiate, directement sur le site.",
  },
];

export function WhyUs() {
  return (
    <section id="atouts" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <span className="eyebrow">
                <span className="h-px w-8 bg-emerald" /> Pourquoi Len&apos;s Barber Shop
              </span>
              <h2 className="mt-4 text-4xl leading-[1.05] text-anthracite md:text-5xl">
                Le souci du détail,
                <span className="text-navy"> à chaque visite.</span>
              </h2>
              <p className="mt-5 max-w-lg text-lg text-anthracite/70">
                Le barbier de référence à Saintry-sur-Seine, noté {` `}
                <span className="font-semibold text-navy">4,7/5</span> sur Google.
                Voici ce qui fait la différence.
              </p>
            </Reveal>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {points.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="group h-full rounded-3xl border border-anthracite/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift">
                    <span className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-navy/5 text-navy transition-colors group-hover:bg-gold group-hover:text-ink">
                      <Icon name={p.icon} size={22} />
                    </span>
                    <h3 className="font-display text-lg text-anthracite">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-anthracite/60">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Image latérale */}
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-lift">
                <Image
                  src={IMAGES.heroPortrait}
                  alt="Barbier en pleine coupe chez Len's Barber Shop"
                  width={900}
                  height={1100}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -left-4 bottom-6 flex items-center gap-3 rounded-2xl border border-anthracite/10 bg-white/95 px-5 py-4 shadow-lift backdrop-blur">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald/10 text-emerald">
                  <Icon name="check" size={22} />
                </span>
                <div>
                  <div className="text-sm font-bold text-anthracite">Réservation immédiate</div>
                  <div className="text-xs text-anthracite/55">Sans appeler · confirmation directe</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
