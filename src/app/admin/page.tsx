"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { formatPrice, formatTime, formatDuration } from "@/lib/utils";

type Stats = {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  revenueMonthCents: number;
  revenueWeekCents: number;
  totalClients: number;
  newClientsMonth: number;
  loyalClientsMonth: number;
  avgDurationMin: number;
  fillRate: number;
  todayAppointments: any[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-white md:text-3xl">Tableau de bord</h1>
        <p className="text-sm text-slate-400">Aperçu de votre activité en temps réel.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi loading={loading} label="RDV aujourd'hui" value={stats?.todayCount ?? 0} icon="clock" accent="gold" />
        <Kpi loading={loading} label="RDV cette semaine" value={stats?.weekCount ?? 0} icon="sparkles" accent="emerald" />
        <Kpi loading={loading} label="RDV ce mois" value={stats?.monthCount ?? 0} icon="scissors" accent="navy" />
        <Kpi
          loading={loading}
          label="CA estimé (mois)"
          value={stats ? formatPrice(stats.revenueMonthCents) : "—"}
          icon="card"
          accent="gold"
          isText
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi loading={loading} label="Nouveaux clients" value={stats?.newClientsMonth ?? 0} icon="woman" accent="emerald" />
        <Kpi loading={loading} label="Clients fidèles" value={stats?.loyalClientsMonth ?? 0} icon="check" accent="navy" />
        <Kpi
          loading={loading}
          label="Durée moyenne"
          value={stats ? formatDuration(stats.avgDurationMin) : "—"}
          icon="clock"
          accent="gold"
          isText
        />
        <FillRate loading={loading} rate={stats?.fillRate ?? 0} />
      </div>

      {/* RDV du jour */}
      <div className="mt-6 rounded-2xl border border-white/5 bg-[#0E1117] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-white">Rendez-vous du jour</h2>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
            {stats?.todayAppointments?.length ?? 0} RDV
          </span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : (stats?.todayAppointments?.length ?? 0) === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Aucun rendez-vous aujourd&apos;hui.
          </p>
        ) : (
          <div className="space-y-2">
            {stats!.todayAppointments.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 md:flex-nowrap"
              >
                <div className="grid h-12 w-16 shrink-0 place-items-center rounded-lg bg-navy/40 font-mono text-sm font-bold text-gold">
                  {formatTime(new Date(a.start))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-white">{a.client?.name}</div>
                  <div className="truncate text-xs text-slate-400">
                    {a.service?.name} · {formatPrice(a.priceCents)}
                  </div>
                </div>
                <StatusBadge status={a.status} />
                <div className="flex gap-1">
                  {a.status !== "DONE" && (
                    <ActionBtn label="Terminer" onClick={() => updateStatus(a.id, "DONE")} tone="emerald" />
                  )}
                  {a.status !== "CANCELLED" && (
                    <ActionBtn label="Annuler" onClick={() => updateStatus(a.id, "CANCELLED")} tone="red" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  icon,
  accent,
  loading,
  isText,
}: {
  label: string;
  value: number | string;
  icon: string;
  accent: "gold" | "emerald" | "navy";
  loading: boolean;
  isText?: boolean;
}) {
  const accents: Record<string, string> = {
    gold: "text-gold bg-gold/10",
    emerald: "text-emerald-400 bg-emerald-400/10",
    navy: "text-sky-300 bg-sky-300/10",
  };
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0E1117] p-4">
      <div className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${accents[accent]}`}>
        <Icon name={icon} size={18} />
      </div>
      {loading ? (
        <div className="skeleton h-7 w-16 rounded" />
      ) : (
        <div className="font-display text-2xl text-white">
          {isText ? value : Number(value).toLocaleString("fr-FR")}
        </div>
      )}
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

function FillRate({ rate, loading }: { rate: number; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0E1117] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">Taux de remplissage</span>
        <span className="font-display text-lg text-white">{loading ? "—" : `${rate}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${rate}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-emerald to-gold"
        />
      </div>
      <div className="mt-2 text-[11px] text-slate-500">Semaine en cours</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    CONFIRMED: { label: "Confirmé", cls: "bg-sky-400/10 text-sky-300" },
    PENDING: { label: "En attente", cls: "bg-amber-400/10 text-amber-300" },
    DONE: { label: "Terminé", cls: "bg-emerald-400/10 text-emerald-300" },
    CANCELLED: { label: "Annulé", cls: "bg-red-400/10 text-red-300" },
  };
  const s = map[status] ?? map.CONFIRMED;
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

function ActionBtn({
  label,
  onClick,
  tone,
}: {
  label: string;
  onClick: () => void;
  tone: "emerald" | "red";
}) {
  const cls =
    tone === "emerald"
      ? "border-emerald-400/20 text-emerald-300 hover:bg-emerald-400/10"
      : "border-red-400/20 text-red-300 hover:bg-red-400/10";
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${cls}`}
    >
      {label}
    </button>
  );
}
