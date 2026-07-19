import Link from "next/link";
import { formatPrice, formatDateLong, formatTime } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { ConfettiBurst } from "@/components/booking/ConfettiBurst";

export const dynamic = "force-dynamic";

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { service?: string; date?: string; name?: string; price?: string };
}) {
  const start = searchParams.date ? new Date(searchParams.date) : null;
  const price = searchParams.price ? Number(searchParams.price) : null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-navy to-navy-deep px-4 py-16 text-canvas">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <ConfettiBurst />

      <div className="relative w-full max-w-md">
        <div className="rounded-[2rem] border border-white/15 bg-white/5 p-8 text-center backdrop-blur-xl md:p-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald text-canvas shadow-lift">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17.5 19 7" /></svg>
          </div>

          <h1 className="mt-6 font-display text-3xl text-canvas">
            C&apos;est confirmé{searchParams.name ? `, ${searchParams.name.split(" ")[0]}` : ""} !
          </h1>
          <p className="mt-2 text-canvas/70">
            Votre rendez-vous chez Len&apos;s Barber Shop est bien enregistré.
          </p>

          <div className="mt-7 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
            {searchParams.service && (
              <Line label="Prestation" value={searchParams.service} />
            )}
            {start && <Line label="Date" value={formatDateLong(start)} />}
            {start && <Line label="Heure" value={formatTime(start)} />}
            {price != null && (
              <Line label="Prix" value={formatPrice(price)} gold />
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-white/[0.04] p-4 text-sm text-canvas/70">
            <p className="font-semibold text-canvas">Len&apos;s Barber Shop</p>
            <p className="mt-1">{SITE.address.full}</p>
            <a href={SITE.phoneHref} className="mt-1 inline-block text-gold hover:underline">
              {SITE.phone}
            </a>
          </div>

          <div className="mt-7 flex flex-col gap-2">
            <a
              href={SITE.mapsQuery}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-ink shadow-gold transition-transform hover:-translate-y-0.5"
            >
              Voir l&apos;itinéraire
            </a>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-canvas transition hover:bg-white/10"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-canvas/50">
          Un email et un SMS de rappel pourront vous être envoyés (fonctionnalité prévue).
        </p>
      </div>
    </main>
  );
}

function Line({
  label,
  value,
  gold,
}: {
  label: string;
  value: string;
  gold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 py-2 last:border-0">
      <span className="text-sm text-canvas/55">{label}</span>
      <span className={gold ? "price-tag font-bold text-gold" : "text-sm font-semibold text-canvas"}>
        {value}
      </span>
    </div>
  );
}
