import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);

// GET /api/admin/services
export async function GET() {
  const [services, categories] = await Promise.all([
    prisma.service.findMany({ include: { category: true }, orderBy: { order: "asc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  return NextResponse.json({ services, categories });
}

// POST /api/admin/services -> créer une prestation
export async function POST(req: Request) {
  const body = await req.json();
  const { name, categoryId, priceCents, durationMin, description, image } = body ?? {};
  if (!name || !categoryId || priceCents == null || durationMin == null) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }
  const count = await prisma.service.count();
  const service = await prisma.service.create({
    data: {
      name,
      slug: slugify(name),
      categoryId,
      priceCents: Number(priceCents),
      durationMin: Number(durationMin),
      description: description || "",
      image: image || "",
      order: count,
    },
  });
  return NextResponse.json({ ok: true, service }, { status: 201 });
}
