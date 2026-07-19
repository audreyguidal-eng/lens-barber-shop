import webpush from "web-push";
import { prisma } from "./prisma";

/**
 * Envoi de notifications « Web Push » (vraies notifications système sur le
 * téléphone / l'ordinateur du barbier). Fonctionne dès que les clés VAPID
 * sont configurées ET qu'un appareil s'est abonné depuis l'espace barber.
 */

const PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:barber@lensbarbershop.fr";

let configured = false;
function ensureConfigured(): boolean {
  if (configured) return true;
  if (!PUBLIC || !PRIVATE) return false;
  webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE);
  configured = true;
  return true;
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

/**
 * Envoie une notification push à TOUS les appareils abonnés du barbier.
 * Silencieux si le push n'est pas configuré ou si aucun appareil n'est abonné,
 * pour ne jamais bloquer la création d'un rendez-vous.
 */
export async function sendPushToAll(payload: PushPayload): Promise<void> {
  try {
    if (!ensureConfigured()) return;
    // Le mock (mode démo) n'a pas de vrais abonnements : on sort proprement.
    const subs = await prisma.pushSubscription.findMany().catch(() => []);
    if (!subs || subs.length === 0) return;

    const data = JSON.stringify(payload);
    await Promise.all(
      subs.map(async (s: any) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: s.endpoint,
              keys: { p256dh: s.p256dh, auth: s.auth },
            },
            data,
          );
        } catch (err: any) {
          // 404 / 410 : l'abonnement n'est plus valide -> on le supprime.
          const code = err?.statusCode;
          if (code === 404 || code === 410) {
            await prisma.pushSubscription
              .delete({ where: { endpoint: s.endpoint } })
              .catch(() => {});
          }
        }
      }),
    );
  } catch {
    // On n'échoue jamais une réservation à cause d'une notification.
  }
}
