import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/appointments?from=ISO&to=ISO
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = { status: { not: "CANCELLED" } };
  if (from || to) {
    where.start = {};
    if (from) where.start.gte = new Date(from);
    if (to) where.start.lte = new Date(to);
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: { service: true, client: true },
    orderBy: { start: "asc" },
  });
  return NextResponse.json({ appointments });
}

// POST /api/admin/appointments -> créneau exceptionnel / RDV manuel
export async function POST(req: Request) {
  const body = await req.json();
  const { serviceId, start, name, phone, block } = body ?? {};

  // Blocage de créneau
  if (block) {
    const { start: bStart, end: bEnd, reason } = body;
    const created = await prisma.blockedSlot.create({
      data: {
        start: new Date(bStart),
        end: new Date(bEnd),
        reason: reason || "Indisponible",
      },
    });
    return NextResponse.json({ ok: true, blocked: created }, { status: 201 });
  }

  if (!serviceId || !start) {
    return NextResponse.json({ error: "serviceId et start requis." }, { status: 400 });
  }
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return NextResponse.json({ error: "Prestation introuvable." }, { status: 404 });

  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + service.durationMin * 60000);

  const client = await prisma.client.upsert({
    where: { phone: (phone || "manuel-" + Date.now()).replace(/\s+/g, "") },
    update: { name: name || "Client" },
    create: { name: name || "Client", phone: (phone || "manuel-" + Date.now()).replace(/\s+/g, "") },
  });

  const appt = await prisma.appointment.create({
    data: {
      start: startDate,
      end: endDate,
      status: "CONFIRMED",
      priceCents: service.priceCents,
      serviceId: service.id,
      clientId: client.id,
    },
    include: { service: true, client: true },
  });
  return NextResponse.json({ ok: true, appointment: appt }, { status: 201 });
}
