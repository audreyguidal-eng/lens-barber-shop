import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookingWizard } from "@/components/booking/BookingWizard";
import type { CategoryDTO } from "@/components/sections/Services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description:
    "Réservez votre rendez-vous chez Len's Barber Shop à Saintry-sur-Seine en quelques secondes. Choisissez votre prestation, votre date et votre créneau.",
  alternates: { canonical: "/reserver" },
};

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const categoriesRaw = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { services: { where: { active: true }, orderBy: { order: "asc" } } },
  });

  const categories: CategoryDTO[] = categoriesRaw
    .filter((c) => c.services.length > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      services: c.services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        priceCents: s.priceCents,
        durationMin: s.durationMin,
        popular: s.popular,
      })),
    }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream to-canvas">
      <div className="container-x py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-anthracite/60 transition hover:text-navy"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          Retour au site
        </Link>
      </div>

      <div className="container-x pb-24">
        <div className="mb-8 text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-8 bg-emerald" /> Réservation en ligne
          </span>
          <h1 className="mt-3 font-display text-4xl text-anthracite md:text-5xl">
            Réservez en 30 secondes
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-anthracite/60">
            Sélectionnez votre prestation, votre date et votre créneau. Confirmation
            immédiate, sans redirection.
          </p>
        </div>

        <BookingWizard categories={categories} preselectServiceId={searchParams.service} />
      </div>
    </main>
  );
}
