"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

type Img = { src: string; alt: string; tall?: boolean };

export function Gallery({ images }: { images: Img[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = () => setOpen(null);
  const prev = () =>
    setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () =>
    setOpen((i) => (i === null ? null : (i + 1) % images.length));

  return (
    <section id="galerie" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">
            <span className="h-px w-8 bg-emerald" /> Galerie
          </span>
          <h2 className="mt-4 text-4xl leading-[1.05] text-anthracite md:text-6xl">
            L&apos;atelier
            <span className="text-navy"> en images.</span>
          </h2>
          <p className="mt-5 text-lg text-anthracite/70">
            Dégradés nets, barbes sculptées et ambiance soignée. Cliquez pour agrandir.
          </p>
        </Reveal>

        {/* Masonry */}
        <div className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {images.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
              className="group relative block w-full overflow-hidden rounded-2xl bg-mist"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={img.tall ? 1100 : 800}
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 right-3 translate-y-2 text-left text-xs font-medium text-canvas opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {img.alt}
              </span>
            </motion.button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-anthracite/50">
          Ces visuels sont remplaçables en un instant par les vraies photos du salon.
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur"
            onClick={close}
          >
            <button
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-canvas transition hover:bg-white/20"
              onClick={close}
              aria-label="Fermer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
            <button
              className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-canvas transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Précédent"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[open].src}
                alt={images[open].alt}
                width={1400}
                height={1000}
                className="mx-auto h-auto max-h-[85vh] w-auto rounded-2xl object-contain"
              />
              <p className="mt-3 text-center text-sm text-canvas/80">
                {images[open].alt}
              </p>
            </motion.div>
            <button
              className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-canvas transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Suivant"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
