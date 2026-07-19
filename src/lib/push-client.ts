/* Helpers côté navigateur pour les notifications push (barbier). */

export const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

export type PushState =
  | "unsupported" // navigateur sans support
  | "ios-needs-install" // iPhone : ajouter à l'écran d'accueil d'abord
  | "denied" // l'utilisateur a bloqué
  | "default" // pas encore demandé
  | "granted"; // activé et abonné

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1)
  );
}

function isStandalone(): boolean {
  return (
    (typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches) ||
    (typeof navigator !== "undefined" && (navigator as any).standalone === true)
  );
}

export function getPushState(): PushState {
  if (typeof window === "undefined") return "default";
  const supported =
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  // iPhone : le push web n'existe QUE si le site est ajouté à l'écran d'accueil.
  if (isIos() && !isStandalone()) return "ios-needs-install";
  if (!supported) return "unsupported";

  const perm = Notification.permission;
  if (perm === "denied") return "denied";
  if (perm === "granted") return "granted";
  return "default";
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing) return existing;
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

/**
 * Demande la permission, abonne l'appareil et envoie l'abonnement au serveur.
 * Retourne true si tout s'est bien passé.
 */
export async function enablePush(test = true): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!VAPID_PUBLIC) return { ok: false, error: "Clé VAPID manquante." };
    const reg = await registerServiceWorker();
    if (!reg) return { ok: false, error: "Service worker indisponible." };

    const perm = await Notification.requestPermission();
    if (perm !== "granted") return { ok: false, error: "Permission refusée." };

    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC) as BufferSource,
      });
    }

    const res = await fetch("/api/admin/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: sub.toJSON(),
        userAgent: navigator.userAgent,
        test,
      }),
    });
    if (!res.ok) return { ok: false, error: "Enregistrement serveur échoué." };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Erreur inconnue." };
  }
}

export async function disablePush(): Promise<void> {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await fetch(`/api/admin/push?endpoint=${encodeURIComponent(sub.endpoint)}`, {
        method: "DELETE",
      });
      await sub.unsubscribe();
    }
  } catch {
    /* ignore */
  }
}
