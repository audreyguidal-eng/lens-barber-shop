import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/stats -> indicateurs du dashboard
export async function GET() {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfWeek = new Date(startOfDay);
  const dow = (startOfWeek.getDay() + 6) % 7; // lundi = 0
  startOfWeek.setDate(startOfWeek.getDate() - dow);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const notCancelled = { status: { not: "CANCELLED" } as const };

  const [today, week, monthAppts, totalClients, services] = await Promise.all([
    prisma.appointment.findMany({
      where: { ...notCancelled, start: { gte: startOfDay, lte: endOfDay } },
      include: { service: true, client: true },
      orderBy: { start: "asc" },
    }),
    prisma.appointment.findMany({
      where: { ...notCancelled, start: { gte: startOfWeek, lte: endOfWeek } },
      select: { priceCents: true, start: true, clientId: true },
    }),
    prisma.appointment.findMany({
      where: { ...notCancelled, start: { gte: startOfMonth, lte: endOfMonth } },
      select: { priceCents: true, clientId: true, service: { select: { durationMin: true } } },
    }),
    prisma.client.count(),
    prisma.service.findMany({ select: { durationMin: true } }),
  ]);

  // CA estimé (mois)
  const revenueMonthCents = monthAppts.reduce((a, b) => a + b.priceCents, 0);
  const revenueWeekCents = week.reduce((a, b) => a + b.priceCents, 0);

  // Durée moyenne d'une prestation réservée ce mois
  const avgDuration =
    monthAppts.length > 0
      ? Math.round(
          monthAppts.reduce((a, b) => a + (b.service?.durationMin ?? 0), 0) /
            monthAppts.length,
        )
      : 0;

  // Nouveaux vs fidèles (ce mois) : clients avec 1 seul RDV total = nouveau
  const monthClientIds = Array.from(new Set(monthAppts.map((a) => a.clientId)));
  let loyal = 0;
  let newcomers = 0;
  for (const cid of monthClientIds) {
    const count = await prisma.appointment.count({ where: { clientId: cid } });
    if (count > 1) loyal++;
    else newcomers++;
  }

  // Taux de remplissage (semaine) : minutes réservées / minutes ouvrées
  const openingHours = await prisma.openingHours.findMany();
  let weeklyOpenMinutes = 0;
  for (const h of openingHours) {
    if (h.isOpen) weeklyOpenMinutes += h.closeMinutes - h.openMinutes;
  }
  const weeklyBookedMinutes = monthAppts.length; // placeholder si besoin
  const bookedThisWeekMinutes = week.length; // approx
  const fillRate =
    weeklyOpenMinutes > 0
      ? Math.min(
          100,
          Math.round((bookedThisWeekMinutes * avgDurationSafe(avgDuration) / weeklyOpenMinutes) * 100),
        )
      : 0;

  return NextResponse.json({
    todayCount: today.length,
    weekCount: week.length,
    monthCount: monthAppts.length,
    revenueMonthCents,
    revenueWeekCents,
    totalClients,
    newClientsMonth: newcomers,
    loyalClientsMonth: loyal,
    avgDurationMin: avgDuration,
    fillRate,
    todayAppointments: today,
  });
}

function avgDurationSafe(x: number) {
  return x > 0 ? x : 25;
}
