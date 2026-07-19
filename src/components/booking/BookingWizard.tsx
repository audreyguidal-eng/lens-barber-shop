"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { RippleButton } from "@/components/ui/RippleButton";
import {
  formatPrice,
  formatDuration,
  formatDateLong,
  toDateKey,
  weekdayLabel,
} from "@/lib/utils";
import type { CategoryDTO, ServiceDTO } from "@/components/sections/Services";

type Slot = { time: string; start: string; available: boolean };

const STEPS = ["Prestation", "Coiffeur", "Date", "Heure", "Coordonnées", "Confirmation"];

export function BookingWizard({ categories }: { categories: CategoryDTO[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [service, setService] = useState<ServiceDTO | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [closedReason, setClosedReason] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les créneaux quand date + service sont choisis
  useEffect(() => {
    if (!service || !date) return;
    let cancel = false;
    setLoadingSlots(true);
    setClosedReason(null);
    setSlot(null);
    fetch(`/api/availability?date=${toDateKey(date)}&serviceId=${service.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancel) return;
        if (!data.open) {
          setSlots([]);
          setClosedReason(data.reason || "Fermé");
        } else {
          setSlots(data.slots);
        }
      })
      .catch(() => !cancel && setSlots([]))
      .finally(() => !cancel && setLoadingSlots(false));
    return () => {
      cancel = true;
    };
  }, [service, date]);

  const canNext = useMemo(() => {
    if (step === 0) return !!service;
    if (step === 1) return true;
    if (step === 2) return !!date;
    if (step === 3) return !!slot;
    if (step === 4)
      return form.name.trim().length > 1 && form.phone.replace(/\s+/g, "").length >= 8;
    return false;
  }, [step, service, date, slot, form]);

  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  async function submit() {
    if (!service || !slot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          start: slot.start,
          name: form.name,
          phone: form.phone,
          email: form.email,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        if (res.status === 409) {
          // créneau pris : revenir à l'étape heure
          setStep(3);
          setSlot(null);
          // recharger les créneaux
          if (service && date) {
            const r = await fetch(
              `/api/availability?date=${toDateKey(date)}&serviceId=${service.id}`,
            );
            const d = await r.json();
            setSlots(d.slots || []);
          }
        }
        setSubmitting(false);
        return;
      }
      const p = new URLSearchParams({
        service: service.name,
        date: slot.start,
        name: form.name,
        price: String(service.priceCents),
      });
      router.push(`/reserver/confirmation?${p.toString()}`);
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Barre d'étapes */}
      <Stepper step={step} />

      <div className="mt-8 overflow-hidden rounded-3xl border border-anthracite/10 bg-white shadow-soft">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 md:p-8"
          >
            {step === 0 && (
              <StepService
                categories={categories}
                selected={service}
                onSelect={(s) => {
                  setService(s);
                  setSlot(null);
                }}
              />
            )}
            {step === 1 && <StepBarber />}
            {step === 2 && <StepDate date={date} onSelect={setDate} />}
            {step === 3 && (
              <StepTime
                loading={loadingSlots}
                slots={slots}
                closedReason={closedReason}
                selected={slot}
                onSelect={setSlot}
                date={date}
              />
            )}
            {step === 4 && <StepForm form={form} setForm={setForm} />}
            {step === 5 && (
              <StepReview
                service={service}
                slot={slot}
                form={form}
                error={error}
                submitting={submitting}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Barre d'actions */}
        <div className="flex items-center justify-between gap-3 border-t border-anthracite/10 bg-canvas/50 px-6 py-4 md:px-8">
          <button
            onClick={goPrev}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-anthracite/70 transition hover:text-navy disabled:opacity-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            Retour
          </button>

          {service && (
            <div className="hidden text-right text-sm sm:block">
              <span className="text-anthracite/50">{service.name} · </span>
              <span className="font-mono font-semibold text-navy">
                {formatPrice(service.priceCents)}
              </span>
            </div>
          )}

          {step < 5 ? (
            <RippleButton
              variant="primary"
              onClick={goNext}
              disabled={!canNext}
              className="px-6"
            >
              Continuer
            </RippleButton>
          ) : (
            <RippleButton
              variant="gold"
              onClick={submit}
              disabled={submitting}
              className="px-6"
            >
              {submitting ? "Réservation…" : "Confirmer le rendez-vous"}
            </RippleButton>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex flex-1 items-center gap-1.5 md:gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition-all",
                  active
                    ? "bg-navy text-canvas ring-4 ring-navy/15"
                    : done
                      ? "bg-emerald text-canvas"
                      : "bg-anthracite/10 text-anthracite/50",
                ].join(" ")}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17.5 19 7" /></svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`hidden text-[10px] font-medium md:block ${active ? "text-navy" : "text-anthracite/40"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 rounded-full ${done ? "bg-emerald" : "bg-anthracite/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl text-anthracite md:text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-anthracite/60">{subtitle}</p>
    </div>
  );
}

function StepService({
  categories,
  selected,
  onSelect,
}: {
  categories: CategoryDTO[];
  selected: ServiceDTO | null;
  onSelect: (s: ServiceDTO) => void;
}) {
  const [cat, setCat] = useState(categories[0]?.id ?? "");
  const current = categories.find((c) => c.id === cat) ?? categories[0];
  return (
    <div>
      <StepHeading title="Quelle prestation ?" subtitle="Sélectionnez le service souhaité." />
      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={[
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
              cat === c.id
                ? "border-navy bg-navy text-canvas"
                : "border-anthracite/15 text-anthracite/70 hover:border-navy/40",
            ].join(" ")}
          >
            <Icon name={c.icon} size={14} />
            {c.name}
          </button>
        ))}
      </div>
      <div className="grid max-h-[46vh] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
        {current?.services.map((s) => {
          const active = selected?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={[
                "flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all",
                active
                  ? "border-gold bg-gold/5 ring-1 ring-gold"
                  : "border-anthracite/10 hover:border-navy/30 hover:bg-canvas/60",
              ].join(" ")}
            >
              <div className="min-w-0">
                <div className="truncate font-semibold text-anthracite">{s.name}</div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-anthracite/50">
                  <Icon name="clock" size={12} /> {formatDuration(s.durationMin)}
                </div>
              </div>
              <div className="price-tag shrink-0 font-bold text-navy">
                {formatPrice(s.priceCents)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepBarber() {
  return (
    <div>
      <StepHeading title="Avec qui ?" subtitle="Choisissez votre coiffeur." />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-gold bg-gold/5 p-5 ring-1 ring-gold">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-navy font-display text-xl text-gold">
            L
          </span>
          <div>
            <div className="font-semibold text-anthracite">Len</div>
            <div className="text-xs text-anthracite/55">Barbier · Maître artisan</div>
          </div>
          <span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-emerald text-canvas">
            <Icon name="check" size={16} />
          </span>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-dashed border-anthracite/20 p-5 text-anthracite/40">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-anthracite/5">
            <Icon name="scissors" size={22} />
          </span>
          <div>
            <div className="font-semibold">Nouveau coiffeur</div>
            <div className="text-xs">Bientôt disponible</div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-anthracite/45">
        L&apos;architecture est déjà prête à gérer plusieurs coiffeurs pour le futur.
      </p>
    </div>
  );
}

function StepDate({
  date,
  onSelect,
}: {
  date: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDow = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7; // lundi=0
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(month.getFullYear(), month.getMonth(), d));

  const canPrev = new Date(month.getFullYear(), month.getMonth(), 1) > today;

  return (
    <div>
      <StepHeading title="Quelle date ?" subtitle="Le salon est fermé le dimanche." />
      <div className="mx-auto max-w-sm">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => canPrev && setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            disabled={!canPrev}
            className="grid h-9 w-9 place-items-center rounded-full text-navy transition hover:bg-navy/5 disabled:opacity-30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <div className="font-display text-lg capitalize text-anthracite">
            {month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </div>
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="grid h-9 w-9 place-items-center rounded-full text-navy transition hover:bg-navy/5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-anthracite/40">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <div key={i} className="py-1">{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const isSunday = d.getDay() === 0;
            const isPast = d < today;
            const tooFar = d > maxDate;
            const disabled = isSunday || isPast || tooFar;
            const isSel = date && toDateKey(d) === toDateKey(date);
            const isToday = toDateKey(d) === toDateKey(today);
            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => onSelect(d)}
                className={[
                  "aspect-square rounded-xl text-sm font-medium transition-all",
                  isSel
                    ? "bg-navy text-canvas shadow-soft"
                    : disabled
                      ? "text-anthracite/20"
                      : "text-anthracite hover:bg-navy/5",
                  isToday && !isSel ? "ring-1 ring-gold" : "",
                ].join(" ")}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepTime({
  loading,
  slots,
  closedReason,
  selected,
  onSelect,
  date,
}: {
  loading: boolean;
  slots: Slot[];
  closedReason: string | null;
  selected: Slot | null;
  onSelect: (s: Slot) => void;
  date: Date | null;
}) {
  const available = slots.filter((s) => s.available);
  return (
    <div>
      <StepHeading
        title="À quelle heure ?"
        subtitle={date ? formatDateLong(date) : "Choisissez un créneau."}
      />
      {loading ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton h-11 rounded-xl" />
          ))}
        </div>
      ) : closedReason ? (
        <div className="rounded-2xl border border-anthracite/10 bg-canvas p-8 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-anthracite/5 text-anthracite/40">
            <Icon name="clock" size={24} />
          </div>
          <p className="font-semibold text-anthracite">Salon {closedReason.toLowerCase()} ce jour-là</p>
          <p className="mt-1 text-sm text-anthracite/55">Merci de choisir une autre date.</p>
        </div>
      ) : available.length === 0 ? (
        <div className="rounded-2xl border border-anthracite/10 bg-canvas p-8 text-center">
          <p className="font-semibold text-anthracite">Aucun créneau disponible</p>
          <p className="mt-1 text-sm text-anthracite/55">
            Tout est réservé ce jour-là. Essayez une autre date.
          </p>
        </div>
      ) : (
        <div className="grid max-h-[46vh] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
          {available.map((s) => {
            const active = selected?.start === s.start;
            return (
              <button
                key={s.start}
                onClick={() => onSelect(s)}
                className={[
                  "rounded-xl border py-3 font-mono text-sm font-semibold transition-all",
                  active
                    ? "border-gold bg-gold text-ink shadow-gold"
                    : "border-anthracite/15 text-anthracite hover:border-navy/40 hover:bg-navy/5",
                ].join(" ")}
              >
                {s.time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StepForm({
  form,
  setForm,
}: {
  form: { name: string; phone: string; email: string; notes: string };
  setForm: (f: typeof form) => void;
}) {
  const field = "w-full rounded-2xl border border-anthracite/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/10";
  return (
    <div>
      <StepHeading title="Vos coordonnées" subtitle="Pour confirmer votre rendez-vous." />
      <div className="grid gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-anthracite/70">Nom complet *</label>
          <input
            className={field}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex : Karim Benali"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-anthracite/70">Téléphone *</label>
            <input
              className={field}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="06 12 34 56 78"
              inputMode="tel"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-anthracite/70">Email (optionnel)</label>
            <input
              className={field}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@email.fr"
              inputMode="email"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-anthracite/70">Remarque (optionnel)</label>
          <textarea
            className={field}
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Une précision pour le barbier ?"
          />
        </div>
      </div>
    </div>
  );
}

function StepReview({
  service,
  slot,
  form,
  error,
  submitting,
}: {
  service: ServiceDTO | null;
  slot: Slot | null;
  form: { name: string; phone: string; email: string; notes: string };
  error: string | null;
  submitting: boolean;
}) {
  const start = slot ? new Date(slot.start) : null;
  return (
    <div>
      <StepHeading title="Récapitulatif" subtitle="Vérifiez et confirmez votre réservation." />
      <div className="overflow-hidden rounded-2xl border border-anthracite/10">
        <Row label="Prestation" value={service?.name ?? "—"} />
        <Row label="Coiffeur" value="Len" />
        <Row
          label="Date"
          value={start ? formatDateLong(start) : "—"}
        />
        <Row
          label="Heure"
          value={start ? start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"}
        />
        <Row label="Durée" value={service ? formatDuration(service.durationMin) : "—"} />
        <Row label="Client" value={`${form.name} · ${form.phone}`} />
        <Row
          label="Prix"
          value={service ? formatPrice(service.priceCents) : "—"}
          highlight
        />
      </div>
      {submitting && (
        <div className="mt-4 flex items-center gap-2 text-sm text-anthracite/60">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/20 border-t-navy" />
          Enregistrement du rendez-vous…
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <p className="mt-4 text-xs text-anthracite/45">
        En confirmant, un email et un SMS de rappel pourront vous être envoyés
        (fonctionnalité prévue). Aucun paiement en ligne : réglez sur place.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-anthracite/8 px-4 py-3 last:border-0">
      <span className="text-sm text-anthracite/55">{label}</span>
      <span
        className={
          highlight
            ? "price-tag text-lg font-bold text-navy"
            : "text-sm font-semibold text-anthracite"
        }
      >
        {value}
      </span>
    </div>
  );
}
