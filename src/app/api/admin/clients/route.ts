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

// DELETE /api/admin/clients?id=xxx -> supprime définitivement une fiche client
// (et tous ses rendez-vous associés). Sert au ménage et à la gestion des clients.
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id requis." }, { status: 400 });
  }
  try {
    await prisma.appointment.deleteMany({ where: { clientId: id } });
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
}
