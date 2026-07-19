"use client";

import { useEffect, useState } from "react";
import {
  enablePush,
  disablePush,
  getPushState,
  registerServiceWorker,
  type PushState,
} from "@/lib/push-client";

/**
 * Bouton « Activer les notifications » pour le barbier.
 * Gère tous les cas : iPhone (à installer d'abord), Android/ordinateur,
 * permission refusée, déjà activé.
 */
export function PushToggle({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<PushState>("default");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setState(getPushState());
    registerServiceWorker().then(async (reg) => {
      const sub = await reg?.pushManager.getSubscription().catch(() => null);
      setSubscribed(Boolean(sub));
    });
  }, []);

  async function handleEnable() {
    setBusy(true);
    setMsg(null);
    const r = await enablePush(true);
    setBusy(false);
    if (r.ok) {
      setSubscribed(true);
      setState("granted");
      setMsg("Notifications activées ✓ Un test vient d'être envoyé.");
    } else {
      setMsg(r.error || "Impossible d'activer.");
      setState(getPushState());
    }
  }

  async function handleDisable() {
    setBusy(true);
    await disablePush();
    setBusy(false);
    setSubscribed(false);
    setMsg("Notifications désactivées sur cet appareil.");
  }

  // iPhone non installé : on explique comment faire.
  if (state === "ios-needs-install") {
    return (
      <div className={box(compact)}>
        <div className="flex items-start gap-2.5">
          <Bell />
          <div className="text-[13px] leading-snug text-slate-300">
            <div className="font-semibold text-white">Notifications sur iPhone</div>
            Pour les recevoir, ajoutez d&apos;abord le site à l&apos;écran d&apos;accueil :
            appuyez sur <span className="text-gold">Partager</span> puis
            <span className="text-gold"> « Sur l&apos;écran d&apos;accueil »</span>, ouvrez
            l&apos;icône Len&apos;s Barber, revenez ici et activez.
          </div>
        </div>
      </div>
    );
  }

  if (state === "unsupported") {
    return (
      <div className={box(compact)}>
        <div className="flex items-center gap-2.5 text-[13px] text-slate-400">
          <Bell />
          Ce navigateur ne gère pas les notifications. Essayez Chrome (Android) ou
          Safari (iPhone, site ajouté à l&apos;écran d&apos;accueil).
        </div>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className={box(compact)}>
        <div className="flex items-center gap-2.5 text-[13px] text-amber-300/90">
          <Bell />
          Notifications bloquées. Autorisez-les dans les réglages du navigateur
          pour cet appareil, puis rechargez la page.
        </div>
      </div>
    );
  }

  const active = state === "granted" && subscribed;

  return (
    <div className={box(compact)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Bell active={active} />
          <div className="text-[13px] leading-tight">
            <div className="font-semibold text-white">
              {active ? "Notifications activées" : "Notifications de rendez-vous"}
            </div>
            <div className="text-slate-400">
              {active
                ? "Cet appareil reçoit chaque nouveau RDV."
                : "Recevez chaque nouveau RDV sur ce téléphone."}
            </div>
          </div>
        </div>

        {active ? (
          <button
            onClick={handleDisable}
            disabled={busy}
            className="rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            Désactiver
          </button>
        ) : (
          <button
            onClick={handleEnable}
            disabled={busy}
            className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-ink transition hover:brightness-105 disabled:opacity-50"
          >
            {busy ? "Activation…" : "Activer"}
          </button>
        )}
      </div>
      {msg && <div className="mt-2 text-[12px] text-slate-400">{msg}</div>}
    </div>
  );
}

const box = (compact: boolean) =>
  `rounded-2xl border border-gold/20 bg-gold/[0.04] ${compact ? "p-3" : "p-4"}`;

function Bell({ active = false }: { active?: boolean }) {
  return (
    <span
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
        active ? "bg-gold/20 text-gold" : "bg-white/5 text-slate-300"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10.5 20a1.5 1.5 0 0 0 3 0" />
      </svg>
    </span>
  );
}
