import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PATCH /api/admin/appointments/[id] -> modifier / confirmer / terminer / annuler / déplacer
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const data: any = {};

  if (body.status) data.status = body.status; // PENDING|CONFIRMED|DONE|CANCELLED
  if (body.notes != null) data.notes = body.notes;

  // Déplacement (drag & drop) : nouveau start -> recalcul du end
  if (body.start) {
    const appt = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: { service: true },
    });
    if (!appt) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

    const newStart = new Date(body.start);
    const newEnd = new Date(newStart.getTime() + appt.service.durationMin * 60000);

    // Contrôle de collision
    const conflict = await prisma.appointment.findFirst({
      where: {
        id: { not: params.id },
        status: { not: "CANCELLED" },
        start: { lt: newEnd },
        end: { gt: newStart },
      },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Ce créneau chevauche un autre rendez-vous." },
        { status: 409 },
      );
    }
    data.start = newStart;
    data.end = newEnd;
  }

  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data,
    include: { service: true, client: true },
  });
  return NextResponse.json({ ok: true, appointment: updated });
}

// DELETE /api/admin/appointments/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  await prisma.appointment.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
