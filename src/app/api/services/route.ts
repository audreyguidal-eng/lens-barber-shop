import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/services -> catégories + prestations actives
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      services: {
        where: { active: true },
        orderBy: { order: "asc" },
      },
    },
  });
  return NextResponse.json({ categories });
}
