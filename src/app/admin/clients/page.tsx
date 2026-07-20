"use client";

import { useEffect, useState } from "react";
import { formatPrice, formatDateShort } from "@/lib/utils";

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  visits: number;
  totalCents: number;
  lastVisit: string | null;
  history: { id: string; service: string; start: string; priceCents: number; status: string }[];
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Client | null>(null);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then((d) => setClients(d.clients));
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.phone.includes(q),
  );

  async function removeClient(c: Client) {
    if (!confirm(`Supprimer définitivement la fiche de ${c.name} ? Cette action est irréversible.`)) return;
    await fetch(`/api/admin/clients?id=${c.id}`, { method: "DELETE" });
    setClients((cs) => cs.filter((x) => x.id !== c.id));
    setOpen(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5">
        <h1 className="font-display text-2xl text-white md:text-3xl">Clients</h1>
        <p className="text-sm text-slate-400">
          Chaque réservation crée automatiquement une fiche client.
        </p>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un client…"
        className="mb-4 w-full max-w-sm rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/50"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setOpen(c)}
            className="rounded-2xl border border-white/5 bg-[#0E1117] p-4 text-left transition hover:border-white/15"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-navy font-display text-gold">
                {c.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <div className="truncate font-semibold text-white">{c.name}</div>
                <div className="text-xs text-slate-500">{c.phone}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat label="Visites" value={String(c.visits)} />
              <Stat label="Dépensé" value={formatPrice(c.totalCents)} />
              <Stat label="Dernière" value={c.lastVisit ? formatDateShort(new Date(c.lastVisit)) : "—"} />
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-slate-500">
            Aucun client pour l&apos;instant.
          </p>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" onClick={() => setOpen(null)}>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#12151C] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-navy font-display text-lg text-gold">
                {open.name.charAt(0)}
              </span>
              <div>
                <h3 className="font-display text-xl text-white">{open.name}</h3>
                <p className="text-sm text-slate-400">
                  {open.phone}
                  {open.email ? ` · ${open.email}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Stat label="Visites" value={String(open.visits)} boxed />
              <Stat label="Total dépensé" value={formatPrice(open.totalCents)} boxed />
              <Stat label="Fidélité" value={open.visits > 3 ? "★★★" : open.visits > 1 ? "★★" : "★"} boxed />
            </div>

            <h4 className="mt-5 text-sm font-semibold text-slate-300">Historique</h4>
            <div className="mt-2 max-h-56 space-y-1.5 overflow-y-auto">
              {open.history.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <div>
                    <div className="text-white">{h.service}</div>
                    <div className="text-xs text-slate-500">{formatDateShort(new Date(h.start))}</div>
                  </div>
                  <span className="font-mono text-gold">{formatPrice(h.priceCents)}</span>
                </div>
              ))}
              {open.history.length === 0 && (
                <p className="py-4 text-center text-xs text-slate-500">Aucun rendez-vous.</p>
              )}
            </div>

            <button
              onClick={() => removeClient(open)}
              className="mt-5 w-full rounded-xl border border-red-400/30 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
            >
              Supprimer ce client
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, boxed }: { label: string; value: string; boxed?: boolean }) {
  return (
    <div className={boxed ? "rounded-xl bg-white/5 p-3 text-center" : ""}>
      <div className="font-display text-sm text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
