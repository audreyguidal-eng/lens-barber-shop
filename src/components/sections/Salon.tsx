"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";

const amenities = [
  { icon: "parking", label: "Parking", desc: "Stationnement facile à proximité" },
  { icon: "card", label: "Carte bancaire", desc: "CB et espèces acceptées" },
  { icon: "wheelchair", label: "Accès PMR", desc: "Salon accessible à tous" },
  { icon: "child", label: "Enfants", desc: "Coupes garçons & filles" },
  { icon: "ruler", label: "Toutes longueurs", desc: "Du court au très long" },
  { icon: "afro", label: "Afro & texturés", desc: "Dégradés maîtrisés" },
  { icon: "woman", label: "Femmes", desc: "Coupe, couleur, soins" },
  { icon: "clock", label: "6j/7", desc: "Ouvert du lundi au samedi" },
];

export function Salon() {
  return (
    <section id="le-salon" className="relative bg-white py-24 md:py-32">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Colonne images */}
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-lift">
                <Image
                  src={IMAGES.salonPrimary}
                  alt="Le salon Len's Barber Shop"
                  width={900}
                  height={1100}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-4 hidden w-48 overflow-hidden rounded-2xl border-4 border-white shadow-lift sm:block md:w-56">
                <Image
                  src={IMAGES.salonSecondary}
                  alt="Détail du salon"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Badge note */}
              <div className="absolute -left-4 top-6 rounded-2xl bg-navy px-5 py-4 text-canvas shadow-lift">
                <div className="font-mono text-2xl font-bold text-gold">
                  {SITE.rating.value.toLocaleString("fr-FR")}/5
                </div>
                <div className="text-[11px] uppercase tracking-wider text-canvas/70">
                  {SITE.rating.count} avis
                </div>
              </div>
            </div>
          </Reveal>

          {/* Colonne texte */}
          <div>
            <Reveal>
              <span className="eyebrow">
                <span className="h-px w-8 bg-emerald" /> Le salon
              </span>
              <h2 className="mt-4 text-4xl leading-[1.05] text-anthracite md:text-5xl">
                Un lieu pensé pour
                <span className="text-navy"> se sentir bien.</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-anthracite/70">
                Au cœur de Saintry-sur-Seine, Len&apos;s Barber Shop réunit
                savoir-faire traditionnel et style contemporain. On prend le temps,
                on soigne le détail — hommes, femmes et enfants, toutes textures de
                cheveux sont les bienvenus.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {amenities.map((a, i) => (
                <Reveal key={a.label} delay={i * 0.05}>
                  <div className="flex items-start gap-3 rounded-2xl border border-anthracite/10 bg-canvas p-4 transition-colors hover:border-navy/25">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald/10 text-emerald">
                      <Icon name={a.icon} size={20} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-anthracite">
                        {a.label}
                      </div>
                      <div className="text-xs text-anthracite/55">{a.desc}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
