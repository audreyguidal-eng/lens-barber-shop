import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/availability";
import { toDateKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * POST /api/bookings
 * body: { serviceId, start (ISO), name, phone, email?, notes? }
 * Crée un rendez-vous en garantissant l'absence de double réservation.
 */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const { serviceId, start, name, phone, email, notes } = body ?? {};

  if (!serviceId || !start || !name || !phone) {
    return NextResponse.json(
      { error: "Champs requis : prestation, créneau, nom et téléphone." },
      { status: 400 },
    );
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    return NextResponse.json({ error: "Prestation introuvable." }, { status: 404 });
  }

  const startDate = new Date(start);
  if (isNaN(startDate.getTime())) {
    return NextResponse.json({ error: "Créneau invalide." }, { status: 400 });
  }

  // Refus des créneaux passés
  if (startDate.getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "Impossible de réserver un créneau passé." },
      { status: 409 },
    );
  }

  const endDate = new Date(startDate.getTime() + service.durationMin * 60000);

  // Re-vérification serveur : le créneau est-il toujours proposé et libre ?
  const { open, slots } = await getAvailableSlots(
    toDateKey(startDate),
    service.durationMin,
  );
  const match = slots.find(
    (s) => new Date(s.start).getTime() === startDate.getTime(),
  );
  if (!open || !match || !match.available) {
    return NextResponse.json(
      { error: "Ce créneau vient d'être pris. Merci d'en choisir un autre." },
      { status: 409 },
    );
  }

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      // Verrou logique : re-contrôle du chevauchement dans la transaction
      const conflict = await tx.appointment.findFirst({
        where: {
          status: { not: "CANCELLED" },
          start: { lt: endDate },
          end: { gt: startDate },
        },
      });
      if (conflict) {
        throw new Error("SLOT_TAKEN");
      }

      // Client : dédupliqué par téléphone
      const normalizedPhone = String(phone).replace(/\s+/g, "");
      const existing = await tx.client.findUnique({
        where: { phone: normalizedPhone },
      });
      const isNewClient = !existing;
      const client = await tx.client.upsert({
        where: { phone: normalizedPhone },
        update: {
          name,
          email: email || undefined,
        },
        create: {
          name,
          phone: normalizedPhone,
          email: email || null,
        },
      });

      const created = await tx.appointment.create({
        data: {
          start: startDate,
          end: endDate,
          status: "CONFIRMED",
          priceCents: service.priceCents,
          notes: notes || "",
          serviceId: service.id,
          clientId: client.id,
        },
        include: { service: true, client: true },
      });

      // Notification : nouveau client (première réservation) en priorité,
      // sinon notification de nouvelle réservation.
      if (isNewClient) {
        await tx.notification.create({
          data: {
            type: "NEW_CLIENT",
            title: "🎉 Nouveau client !",
            message: `${client.name} vient de réserver pour la première fois — ${service.name} le ${startDate.toLocaleString(
              "fr-FR",
              { dateStyle: "long", timeStyle: "short" },
            )}`,
          },
        });
      } else {
        await tx.notification.create({
          data: {
            type: "NEW_BOOKING",
            title: "Nouvelle réservation",
            message: `${client.name} — ${service.name} le ${startDate.toLocaleString(
              "fr-FR",
              { dateStyle: "long", timeStyle: "short" },
            )}`,
          },
        });
      }

      return created;
    });

    // TODO (prévu) : envoi email + SMS de confirmation ici.

    return NextResponse.json({ ok: true, appointment }, { status: 201 });
  } catch (e: any) {
    if (e?.message === "SLOT_TAKEN") {
      return NextResponse.json(
        { error: "Ce créneau vient d'être pris. Merci d'en choisir un autre." },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Une erreur est survenue. Merci de réessayer." },
      { status: 500 },
    );
  }
}
