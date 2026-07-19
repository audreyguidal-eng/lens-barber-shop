import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/clients -> fiches clients enrichies (visites, total dépensé, dernière visite)
export async function GET() {
  const clients = await prisma.client.findMany({
    include: {
      appointments: {
        where: { status: { not: "CANCELLED" } },
        include: { service: true },
        orderBy: { start: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = clients.map((c) => {
    const visits = c.appointments.length;
    const totalCents = c.appointments.reduce((a, b) => a + b.priceCents, 0);
    const last = c.appointments[0]?.start ?? null;
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      notes: c.notes,
      visits,
      totalCents,
      lastVisit: last,
      history: c.appointments.slice(0, 8).map((a) => ({
        id: a.id,
        service: a.service.name,
        start: a.start,
        priceCents: a.priceCents,
        status: a.status,
      })),
    };
  });

  return NextResponse.json({ clients: enriched });
}
