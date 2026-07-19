import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/availability?date=2026-07-21&serviceId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!date || !serviceId) {
    return NextResponse.json(
      { error: "Paramètres 'date' et 'serviceId' requis." },
      { status: 400 },
    );
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    return NextResponse.json({ error: "Prestation introuvable." }, { status: 404 });
  }

  const result = await getAvailableSlots(date, service.durationMin);
  return NextResponse.json(result);
}
