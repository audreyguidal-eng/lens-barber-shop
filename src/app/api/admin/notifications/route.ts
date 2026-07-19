import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/notifications
export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  const unread = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ notifications, unread });
}

// PATCH /api/admin/notifications  -> tout marquer comme lu
export async function PATCH() {
  await prisma.notification.updateMany({ data: { read: true } });
  return NextResponse.json({ ok: true });
}
