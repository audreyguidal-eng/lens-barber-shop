import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToAll } from "@/lib/push";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/push
 * Indique si le push est configuré côté serveur (clés VAPID présentes)
 * et combien d'appareils sont abonnés.
 */
export async function GET() {
  const enabled = Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY,
  );
  let count = 0;
  try {
    count = await prisma.pushSubscription.count();
  } catch {
    count = 0;
  }
  return NextResponse.json({ enabled, devices: count });
}

/**
 * POST /api/admin/push
 * body: { subscription: PushSubscriptionJSON, test?: boolean }
 * Enregistre l'appareil du barbier. Si test=true, envoie aussitôt une
 * notification de démonstration pour confirmer que tout fonctionne.
 */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const sub = body?.subscription;
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return NextResponse.json({ error: "Abonnement invalide." }, { status: 400 });
  }

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint: sub.endpoint },
      update: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
        userAgent: body?.userAgent || "",
      },
      create: {
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
        userAgent: body?.userAgent || "",
      },
    });
  } catch {
    // Mode démo (pas de base) : on ne peut pas mémoriser, mais on ne casse rien.
    return NextResponse.json(
      { ok: true, demo: true, warning: "Base non connectée — abonnement non mémorisé." },
      { status: 200 },
    );
  }

  if (body?.test) {
    await sendPushToAll({
      title: "🔔 Notifications activées",
      body: "Vous recevrez ici chaque nouveau rendez-vous, comme une vraie notification.",
      url: "/admin",
      tag: "push-test",
    });
  }

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/admin/push?endpoint=...
 * Désabonne un appareil.
 */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint");
  if (!endpoint) {
    return NextResponse.json({ error: "endpoint requis." }, { status: 400 });
  }
  try {
    await prisma.pushSubscription.delete({ where: { endpoint } });
  } catch {
    /* déjà absent */
  }
  return NextResponse.json({ ok: true });
}
