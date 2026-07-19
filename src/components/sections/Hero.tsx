"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";
import { Stars } from "@/components/ui/Stars";
import { RippleButton } from "@/components/ui/RippleButton";
import { Icon } from "@/components/ui/Icon";

const services =
  "Coupes modernes • Dégradés • Barbe • Enfants • Cheveux longs • Afro • Femmes";

export function Hero() {
  return (
    <section
      id="accueil"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Image de fond */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={IMAGES.hero}
          alt="Intérieur du salon Len's Barber Shop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dégradés subtils pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/70 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.15] mix-blend-overlay" />
      </div>

      <div className="container-x w-full pb-16 pt-28">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-canvas backdrop-blur"
          >
            <Icon name="pin" size={14} className="text-gold" />
            Saintry-sur-Seine · 91250
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[13vw] leading-[0.92] text-canvas sm:text-7xl lg:text-8xl"
          >
            LEN&apos;S
            <br />
            <span className="text-gold">BARBER</span> SHOP
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg text-canvas/90 md:text-xl"
          >
            {SITE.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-3 text-sm font-medium tracking-wide text-gold/90"
          >
            {services}
          </motion.p>

          {/* Note Google */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <Stars value={SITE.rating.value} animate />
              <span className="font-mono text-lg font-bold text-canvas">
                {SITE.rating.value.toLocaleString("fr-FR")}/5
              </span>
            </div>
            <span className="h-4 w-px bg-white/25" />
            <span className="text-sm text-canvas/85">
              {SITE.rating.count} avis Google
            </span>
            <span className="h-4 w-px bg-white/25" />
            <span className="text-sm font-semibold text-gold">
              Le mieux noté du secteur
            </span>
          </motion.div>

          {/* Boutons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <RippleButton href="/reserver" variant="gold" className="px-8 py-4 text-base">
              Prendre rendez-vous
            </RippleButton>
            <RippleButton
              href="/#le-salon"
              variant="ghost"
              className="border-white/30 bg-white/10 px-8 py-4 text-base text-canvas hover:bg-white/20"
            >
              Découvrir le salon
            </RippleButton>
          </motion.div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="h-2 w-1 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
