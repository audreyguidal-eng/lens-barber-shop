"use client";

import { useEffect, useState } from "react";
import { weekdayLabel, minutesToLabel, formatDateShort } from "@/lib/utils";

type Hours = {
  weekday: number;
  isOpen: boolean;
  openMinutes: number;
  closeMinutes: number;
  breakStart: number | null;
  breakEnd: number | null;
};
type Vacation = { id: string; startDate: string; endDate: string; reason: string };

// options 07:00 -> 21:00 par pas de 30 min
const TIME_OPTIONS = Array.from({ length: ((21 - 7) * 60) / 30 + 1 }, (_, i) => 7 * 60 + i * 30);

const ORDER = [1, 2, 3, 4, 5, 6, 0]; // Lun -> Dim

export default function HorairesPage() {
  const [hours, setHours] = useState<Hours[]>([]);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [vStart, setVStart] = useState("");
  const [vEnd, setVEnd] = useState("");
  const [vReason, setVReason] = useState("");
  const [saved, setSaved] = useState(false);

  const load = () =>
    fetch("/api/admin/hours")
      .then((r) => r.json())
      .then((d) => {
        setHours(d.hours);
        setVacations(d.vacations);
      });

  useEffect(() => {
    load();
  }, []);

  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  async function update(weekday: number, patch: Partial<Hours>) {
    setHours((hs) => hs.map((h) => (h.weekday === weekday ? { ...h, ...patch } : h)));
    await fetch("/api/admin/hours", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekday, ...patch }),
    });
    flash();
  }

  async function addVacation() {
    if (!vStart) return;
    await fetch("/api/admin/hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: vStart, endDate: vEnd || vStart, reason: vReason }),
    });
    setVStart("");
    setVEnd("");
    setVReason("");
    load();
  }

  async function delVacation(id: string) {
    await fetch(`/api/admin/hours?vacationId=${id}`, { method: "DELETE" });
    load();
  }

  const ordered = ORDER.map((w) => hours.find((h) => h.weekday === w)).filter(Boolean) as Hours[];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white md:text-3xl">Horaires & congés</h1>
          <p className="text-sm text-slate-400">Modifiez vos horaires d&apos;ouverture et vos absences.</p>
        </div>
        {saved && (
          <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            Enregistré ✓
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0E1117]">
        {ordered.map((h) => (
          <div key={h.weekday} className="flex flex-wrap items-center gap-3 border-b border-white/5 px-4 py-3 last:border-0">
            <div className="w-24 font-semibold text-white">{weekdayLabel(h.weekday)}</div>
            <button
              onClick={() => update(h.weekday, { isOpen: !h.isOpen })}
              className={`relative h-6 w-11 rounded-full transition ${h.isOpen ? "bg-emerald" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${h.isOpen ? "left-[22px]" : "left-0.5"}`} />
            </button>
            {h.isOpen ? (
              <div className="flex items-center gap-2 text-sm">
                <TimeSelect value={h.openMinutes} onChange={(v) => update(h.weekday, { openMinutes: v })} />
                <span className="text-slate-500">→</span>
                <TimeSelect value={h.closeMinutes} onChange={(v) => update(h.weekday, { closeMinutes: v })} />
              </div>
            ) : (
              <span className="text-sm text-slate-500">Fermé</span>
            )}
          </div>
        ))}
      </div>

      {/* Congés */}
      <div className="mt-6">
        <h2 className="mb-3 font-display text-lg text-white">Congés & fermetures exceptionnelles</h2>
        <div className="rounded-2xl border border-white/5 bg-[#0E1117] p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Du</label>
              <input type="date" value={vStart} onChange={(e) => setVStart(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Au</label>
              <input type="date" value={vEnd} onChange={(e) => setVEnd(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-slate-400">Motif</label>
              <input value={vReason} onChange={(e) => setVReason(e.target.value)} placeholder="Congés, formation…" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-gold/50" />
            </div>
            <button onClick={addVacation} className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-ink hover:brightness-105">
              Ajouter
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {vacations.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                <div>
                  <span className="font-medium text-white">
                    {formatDateShort(new Date(v.startDate))}
                    {v.endDate !== v.startDate && ` → ${formatDateShort(new Date(v.endDate))}`}
                  </span>
                  <span className="ml-2 text-slate-500">{v.reason}</span>
                </div>
                <button onClick={() => delVacation(v.id)} className="text-slate-400 hover:text-red-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
              </div>
            ))}
            {vacations.length === 0 && (
              <p className="py-3 text-center text-xs text-slate-500">Aucun congé programmé.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 font-mono text-white outline-none focus:border-gold/50"
    >
      {TIME_OPTIONS.map((t) => (
        <option key={t} value={t} className="bg-[#12151C]">
          {minutesToLabel(t)}
        </option>
      ))}
    </select>
  );
}
