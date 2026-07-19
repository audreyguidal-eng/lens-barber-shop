import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/hours -> horaires + congés
export async function GET() {
  const [hours, vacations] = await Promise.all([
    prisma.openingHours.findMany({ orderBy: { weekday: "asc" } }),
    prisma.vacation.findMany({ orderBy: { startDate: "asc" } }),
  ]);
  return NextResponse.json({ hours, vacations });
}

// PATCH /api/admin/hours -> mise à jour d'un jour
export async function PATCH(req: Request) {
  const body = await req.json();
  const { weekday, isOpen, openMinutes, closeMinutes, breakStart, breakEnd } = body;
  if (weekday == null) {
    return NextResponse.json({ error: "weekday requis" }, { status: 400 });
  }
  const data: any = {};
  if (isOpen != null) data.isOpen = Boolean(isOpen);
  if (openMinutes != null) data.openMinutes = Number(openMinutes);
  if (closeMinutes != null) data.closeMinutes = Number(closeMinutes);
  if (breakStart !== undefined) data.breakStart = breakStart == null ? null : Number(breakStart);
  if (breakEnd !== undefined) data.breakEnd = breakEnd == null ? null : Number(breakEnd);

  const updated = await prisma.openingHours.update({ where: { weekday: Number(weekday) }, data });
  return NextResponse.json({ ok: true, day: updated });
}

// POST /api/admin/hours -> ajouter des congés
export async function POST(req: Request) {
  const body = await req.json();
  const { startDate, endDate, reason } = body;
  if (!startDate) return NextResponse.json({ error: "startDate requis" }, { status: 400 });
  const v = await prisma.vacation.create({
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDate || startDate),
      reason: reason || "Congés",
    },
  });
  return NextResponse.json({ ok: true, vacation: v }, { status: 201 });
}

// DELETE /api/admin/hours?vacationId=xxx
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("vacationId");
  if (!id) return NextResponse.json({ error: "vacationId requis" }, { status: 400 });
  await prisma.vacation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
