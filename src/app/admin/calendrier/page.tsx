"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatPrice, formatTime, toDateKey, formatDateLong } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

type Appt = {
  id: string;
  start: string;
  end: string;
  status: string;
  priceCents: number;
  service: { name: string; durationMin: number };
  client: { name: string; phone: string };
};

const DAY_START = 8 * 60; // 08:00
const DAY_END = 20 * 60; // 20:00
const PX_PER_MIN = 1.1;
const SNAP = 15;

type View = "week" | "day";

export default function CalendarPage() {
  const [view, setView] = useState<View>("week");
  const [anchor, setAnchor] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [appts, setAppts] = useState<Appt[]>([]);
  const [selected, setSelected] = useState<Appt | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const days = useMemo(() => {
    if (view === "day") return [new Date(anchor)];
    const monday = new Date(anchor);
    const dow = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - dow);
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    }); // Lun-Sam
  }, [anchor, view]);

  const load = useCallback(async () => {
    const from = new Date(days[0]);
    from.setHours(0, 0, 0, 0);
    const to = new Date(days[days.length - 1]);
    to.setHours(23, 59, 59, 999);
    const r = await fetch(
      `/api/admin/appointments?from=${from.toISOString()}&to=${to.toISOString()}`,
    );
    const d = await r.json();
    setAppts(d.appointments || []);
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };

  async function moveAppt(id: string, day: Date, minutes: number) {
    const start = new Date(day);
    start.setHours(0, minutes, 0, 0);
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start: start.toISOString() }),
    });
    const data = await res.json();
    if (!res.ok) showToast(data.error || "Déplacement impossible");
    else showToast("Rendez-vous déplacé ✓");
    load();
  }

  async function act(id: string, body: any, msg: string) {
    const method = body === "DELETE" ? "DELETE" : "PATCH";
    await fetch(`/api/admin/appointments/${id}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === "DELETE" ? undefined : JSON.stringify(body),
    });
    setSelected(null);
    showToast(msg);
    load();
  }

  const totalMin = DAY_END - DAY_START;
  const hours = Array.from({ length: (DAY_END - DAY_START) / 60 + 1 }, (_, i) => DAY_START + i * 60);

  const shift = (dir: number) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + dir * (view === "day" ? 1 : 7));
    setAnchor(d);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-white md:text-3xl">Agenda</h1>
          <p className="text-sm text-slate-400">
            Glissez-déposez un rendez-vous pour le déplacer.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-white/5 p-1">
            {(["day", "week"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  view === v ? "bg-white/10 text-white" : "text-slate-400"
                }`}
              >
                {v === "day" ? "Jour" : "Semaine"}
              </button>
            ))}
          </div>
          <button onClick={() => shift(-1)} className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 hover:bg-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button
            onClick={() => {
              const d = new Date();
              d.setHours(0, 0, 0, 0);
              setAnchor(d);
            }}
            className="rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
          >
            Aujourd&apos;hui
          </button>
          <button onClick={() => shift(1)} className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 hover:bg-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      {/* Grille */}
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0E1117]">
        <div className="min-w-[720px]">
          {/* En-têtes jours */}
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}>
            <div className="border-b border-r border-white/5" />
            {days.map((d) => {
              const isToday = toDateKey(d) === toDateKey(new Date());
              return (
                <div key={d.toISOString()} className="border-b border-white/5 px-2 py-3 text-center">
                  <div className="text-[11px] uppercase text-slate-500">
                    {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                  </div>
                  <div className={`mx-auto mt-1 grid h-8 w-8 place-items-center rounded-full font-display text-sm ${isToday ? "bg-gold text-ink" : "text-white"}`}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Corps */}
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}>
            {/* Colonne heures */}
            <div className="relative" style={{ height: totalMin * PX_PER_MIN }}>
              {hours.map((h) => (
                <div
                  key={h}
                  className="absolute right-2 -translate-y-1/2 font-mono text-[10px] text-slate-500"
                  style={{ top: (h - DAY_START) * PX_PER_MIN }}
                >
                  {String(Math.floor(h / 60)).padStart(2, "0")}h
                </div>
              ))}
            </div>

            {/* Colonnes jours */}
            {days.map((day) => (
              <DayColumn
                key={day.toISOString()}
                day={day}
                appts={appts.filter((a) => toDateKey(new Date(a.start)) === toDateKey(day))}
                totalMin={totalMin}
                hours={hours}
                onSelect={setSelected}
                onDrop={(min) => dragId && moveAppt(dragId, day, min)}
                setDragId={setDragId}
              />
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-lift">
          {toast}
        </div>
      )}

      {/* Modal RDV */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#12151C] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl text-white">{selected.client.name}</h3>
                <p className="text-sm text-slate-400">{selected.client.phone}</p>
              </div>
              <button onClick={() => setSelected(null)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-white/5 p-4 text-sm">
              <Row label="Prestation" value={selected.service.name} />
              <Row label="Date" value={formatDateLong(new Date(selected.start))} />
              <Row label="Créneau" value={`${formatTime(new Date(selected.start))} – ${formatTime(new Date(selected.end))}`} />
              <Row label="Prix" value={formatPrice(selected.priceCents)} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <ModalBtn label="Confirmer" onClick={() => act(selected.id, { status: "CONFIRMED" }, "Rendez-vous confirmé ✓")} tone="sky" />
              <ModalBtn label="Terminer" onClick={() => act(selected.id, { status: "DONE" }, "Rendez-vous terminé ✓")} tone="emerald" />
              <ModalBtn label="Annuler" onClick={() => act(selected.id, { status: "CANCELLED" }, "Rendez-vous annulé")} tone="amber" />
              <ModalBtn label="Supprimer" onClick={() => act(selected.id, "DELETE", "Rendez-vous supprimé")} tone="red" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DayColumn({
  day,
  appts,
  totalMin,
  hours,
  onSelect,
  onDrop,
  setDragId,
}: {
  day: Date;
  appts: Appt[];
  totalMin: number;
  hours: number[];
  onSelect: (a: Appt) => void;
  onDrop: (min: number) => void;
  setDragId: (id: string | null) => void;
}) {
  const isSunday = day.getDay() === 0;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    let min = DAY_START + Math.round(y / PX_PER_MIN / SNAP) * SNAP;
    min = Math.max(DAY_START, Math.min(DAY_END - SNAP, min));
    onDrop(min);
  };

  return (
    <div
      className="relative border-l border-white/5"
      style={{ height: totalMin * PX_PER_MIN }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* lignes horaires */}
      {hours.map((h) => (
        <div
          key={h}
          className="absolute inset-x-0 border-t border-white/[0.04]"
          style={{ top: (h - DAY_START) * PX_PER_MIN }}
        />
      ))}
      {isSunday && (
        <div className="absolute inset-0 grid place-items-center text-xs text-slate-600">
          Fermé
        </div>
      )}

      {appts.map((a) => {
        const start = new Date(a.start);
        const min = start.getHours() * 60 + start.getMinutes();
        const top = (min - DAY_START) * PX_PER_MIN;
        const height = Math.max(24, a.service.durationMin * PX_PER_MIN - 2);
        const tones: Record<string, string> = {
          CONFIRMED: "bg-sky-500/15 border-sky-400/40 text-sky-100",
          PENDING: "bg-amber-500/15 border-amber-400/40 text-amber-100",
          DONE: "bg-emerald-500/15 border-emerald-400/40 text-emerald-100",
          CANCELLED: "bg-red-500/10 border-red-400/30 text-red-200 line-through",
        };
        return (
          <button
            key={a.id}
            draggable
            onDragStart={() => setDragId(a.id)}
            onDragEnd={() => setDragId(null)}
            onClick={() => onSelect(a)}
            className={`absolute inset-x-1 cursor-grab overflow-hidden rounded-lg border px-2 py-1 text-left text-[11px] leading-tight backdrop-blur active:cursor-grabbing ${tones[a.status] ?? tones.CONFIRMED}`}
            style={{ top, height }}
          >
            <div className="font-mono font-bold">{formatTime(start)}</div>
            <div className="truncate font-semibold">{a.client.name}</div>
            <div className="truncate opacity-80">{a.service.name}</div>
          </button>
        );
      })}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function ModalBtn({
  label,
  onClick,
  tone,
}: {
  label: string;
  onClick: () => void;
  tone: "sky" | "emerald" | "amber" | "red";
}) {
  const tones: Record<string, string> = {
    sky: "border-sky-400/30 text-sky-300 hover:bg-sky-400/10",
    emerald: "border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10",
    amber: "border-amber-400/30 text-amber-300 hover:bg-amber-400/10",
    red: "border-red-400/30 text-red-300 hover:bg-red-400/10",
  };
  return (
    <button onClick={onClick} className={`rounded-xl border py-2.5 text-sm font-semibold transition ${tones[tone]}`}>
      {label}
    </button>
  );
}
