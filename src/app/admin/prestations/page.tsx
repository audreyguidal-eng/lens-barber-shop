"use client";

import { useEffect, useState } from "react";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

type Service = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  durationMin: number;
  active: boolean;
  popular: boolean;
  categoryId: string;
  category: { name: string };
};
type Category = { id: string; name: string };

export default function PrestationsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  const load = () =>
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((d) => {
        setServices(d.services);
        setCategories(d.categories);
      });

  useEffect(() => {
    load();
  }, []);

  async function toggle(s: Service) {
    await fetch(`/api/admin/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette prestation ?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    load();
  }

  const grouped = categories
    .map((c) => ({ ...c, items: services.filter((s) => s.categoryId === c.id) }))
    .filter((c) => c.items.length > 0);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white md:text-3xl">Prestations</h1>
          <p className="text-sm text-slate-400">Gérez vos services, tarifs et durées.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-ink hover:brightness-105"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Ajouter
        </button>
      </div>

      <div className="space-y-6">
        {grouped.map((c) => (
          <div key={c.id}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
              {c.name}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0E1117]">
              {c.items.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center gap-3 border-b border-white/5 px-4 py-3 last:border-0 md:flex-nowrap"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-white">{s.name}</span>
                      {s.popular && (
                        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          POP
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-slate-500">{s.description}</div>
                  </div>
                  <div className="font-mono text-sm font-bold text-gold">{formatPrice(s.priceCents)}</div>
                  <div className="w-16 text-right text-xs text-slate-400">{formatDuration(s.durationMin)}</div>
                  <button
                    onClick={() => toggle(s)}
                    className={`relative h-6 w-11 rounded-full transition ${s.active ? "bg-emerald" : "bg-white/10"}`}
                    title={s.active ? "Activée" : "Désactivée"}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${s.active ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                  <button onClick={() => setEditing(s)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                  </button>
                  <button onClick={() => remove(s.id)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-red-400/10 hover:text-red-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <ServiceModal
          service={editing}
          categories={categories}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={() => {
            setEditing(null);
            setCreating(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function ServiceModal({
  service,
  categories,
  onClose,
  onSaved,
}: {
  service: Service | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(service?.name ?? "");
  const [categoryId, setCategoryId] = useState(service?.categoryId ?? categories[0]?.id ?? "");
  const [price, setPrice] = useState(service ? (service.priceCents / 100).toString() : "");
  const [duration, setDuration] = useState(service ? service.durationMin.toString() : "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const payload = {
      name,
      categoryId,
      priceCents: Math.round(parseFloat(price || "0") * 100),
      durationMin: parseInt(duration || "0", 10),
      description,
    };
    if (service) {
      await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    onSaved();
  }

  const field = "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-gold/50";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#12151C] p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-xl text-white">
          {service ? "Modifier la prestation" : "Nouvelle prestation"}
        </h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Nom</label>
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Catégorie</label>
            <select className={field} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#12151C]">{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Prix (€)</label>
              <input className={field} value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Durée (min)</label>
              <input className={field} value={duration} onChange={(e) => setDuration(e.target.value)} inputMode="numeric" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Description</label>
            <textarea className={field} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5">
            Annuler
          </button>
          <button onClick={save} disabled={saving || !name} className="flex-1 rounded-xl bg-gold py-2.5 text-sm font-semibold text-ink hover:brightness-105 disabled:opacity-50">
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
