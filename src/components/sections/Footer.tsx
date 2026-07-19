import Link from "next/link";
import { SITE, NAV } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="relative bg-anthracite text-canvas">
      {/* Bandeau CTA */}
      <div className="container-x">
        <div className="relative -top-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy to-navy-deep px-8 py-12 shadow-lift md:px-14 md:py-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl leading-tight text-canvas md:text-4xl">
                Prêt pour votre
                <span className="text-gold"> nouvelle coupe ?</span>
              </h2>
              <p className="mt-2 text-canvas/70">
                Réservez en ligne en moins de 30 secondes.
              </p>
            </div>
            <Link
              href="/reserver"
              className="shrink-0 rounded-full bg-gold px-8 py-4 text-base font-semibold text-ink shadow-gold transition-transform hover:-translate-y-0.5"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </div>

      <div className="container-x -mt-6 pb-8">
        <div className="grid gap-10 pb-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gold font-display text-sm text-ink">
                L
              </span>
              <span className="font-display text-lg">Len&apos;s Barber Shop</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-canvas/60">
              Le barbier de référence à Saintry-sur-Seine. Coupes modernes, dégradés,
              barbe, enfants, cheveux longs, afro et femmes.
            </p>
            <div className="mt-5 flex gap-3">
              {SITE.facebook && (
                <a
                  href={SITE.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-canvas transition hover:bg-gold hover:text-ink"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3 0-1.3-.1-2.45-.1-2.42 0-4.05 1.48-4.05 4.2v2.2H7.8V13h2.7v8h3Z" /></svg>
                </a>
              )}
              {SITE.instagram && (
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-canvas transition hover:bg-gold hover:text-ink"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></svg>
                </a>
              )}
              <a
                href={SITE.phoneHref}
                aria-label="Téléphone"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-canvas transition hover:bg-gold hover:text-ink"
              >
                <Icon name="phone" size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-canvas/50">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm text-canvas/70 transition hover:text-gold">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/reserver" className="text-sm text-canvas/70 transition hover:text-gold">
                  Réserver
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-canvas/50">
              Coordonnées
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-canvas/70">
              <li className="flex gap-2">
                <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-gold" />
                {SITE.address.full}
              </li>
              <li className="flex gap-2">
                <Icon name="phone" size={16} className="mt-0.5 shrink-0 text-gold" />
                <a href={SITE.phoneHref} className="hover:text-gold">{SITE.phone}</a>
              </li>
              <li className="flex gap-2">
                <Icon name="clock" size={16} className="mt-0.5 shrink-0 text-gold" />
                Lun–Sam · Dimanche fermé
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de page */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-canvas/45 md:flex-row">
          <p>
            © {new Date().getFullYear()} Len&apos;s Barber Shop · RCS {SITE.rcs} ·
            Mentions légales
          </p>
          <div className="flex items-center gap-4">
            <span>Saintry-sur-Seine · 91250</span>
            {/* Lien discret vers l'espace barbier — tout en bas */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-canvas/30 transition-colors hover:text-gold"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              Espace Barber
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
