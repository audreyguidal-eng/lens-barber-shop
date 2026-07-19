import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PATCH /api/admin/services/[id] -> modifier / activer / désactiver / réordonner
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const data: any = {};
  for (const k of ["name", "description", "image", "categoryId"]) {
    if (body[k] != null) data[k] = body[k];
  }
  if (body.priceCents != null) data.priceCents = Number(body.priceCents);
  if (body.durationMin != null) data.durationMin = Number(body.durationMin);
  if (body.order != null) data.order = Number(body.order);
  if (body.active != null) data.active = Boolean(body.active);
  if (body.popular != null) data.popular = Boolean(body.popular);

  const service = await prisma.service.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, service });
}

// DELETE /api/admin/services/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
