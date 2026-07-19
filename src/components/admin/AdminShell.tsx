"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: "sparkles" },
  { href: "/admin/calendrier", label: "Agenda", icon: "clock" },
  { href: "/admin/prestations", label: "Prestations", icon: "scissors" },
  { href: "/admin/clients", label: "Clients", icon: "woman" },
  { href: "/admin/horaires", label: "Horaires", icon: "clock" },
];

export function AdminShell({
  children,
  authEnabled,
}: {
  children: ReactNode;
  authEnabled: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<{ unread: number; list: any[] }>({
    unread: 0,
    list: [],
  });
  const [showNotifs, setShowNotifs] = useState(false);
  const session = useSession();

  const loadNotifs = () =>
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => setNotifs({ unread: d.unread, list: d.notifications }))
      .catch(() => {});

  useEffect(() => {
    loadNotifs();
    const t = setInterval(loadNotifs, 30000);
    return () => clearInterval(t);
  }, []);

  const markRead = async () => {
    setShowNotifs((v) => !v);
    if (notifs.unread > 0) {
      await fetch("/api/admin/notifications", { method: "PATCH" });
      setNotifs((n) => ({ ...n, unread: 0 }));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0D12] text-slate-200">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-white/5 bg-[#0E1117] p-4 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2.5 px-2 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold font-display text-sm text-ink">
            L
          </span>
          <div>
            <div className="font-display text-sm text-white">Len&apos;s Barber</div>
            <div className="text-[11px] text-slate-500">Espace Barber</div>
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon name={l.icon} size={18} />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-4">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <Icon name="pin" size={18} /> Voir le site
          </Link>
          {authEnabled ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12H4M9 7l-5 5 5 5M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /></svg>
              Déconnexion
            </button>
          ) : (
            <div className="rounded-xl border border-gold/20 bg-gold/5 px-3 py-2 text-[11px] leading-snug text-gold/80">
              Mode démo · accès libre. L&apos;authentification est prête à être activée.
            </div>
          )}
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/5 bg-[#0B0D12]/80 px-4 py-3 backdrop-blur md:px-8">
          <button
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-300 hover:bg-white/5 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <div className="text-sm text-slate-400">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={markRead}
                className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-300 transition hover:bg-white/5"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10.5 20a1.5 1.5 0 0 0 3 0" /></svg>
                {notifs.unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                    {notifs.unread}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="fixed left-3 right-3 top-16 z-50 max-h-[75vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#12151C] p-2 shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-none sm:w-80">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Notifications
                  </div>
                  {notifs.list.length === 0 ? (
                    <p className="px-3 py-6 text-center text-sm text-slate-500">
                      Aucune notification.
                    </p>
                  ) : (
                    <div className="max-h-80 space-y-1 overflow-y-auto">
                      {notifs.list.map((n) => {
                        const isNew = n.type === "NEW_CLIENT";
                        return (
                          <div
                            key={n.id}
                            className={`rounded-xl px-3 py-2.5 hover:bg-white/5 ${isNew ? "border-l-2 border-gold bg-gold/[0.06]" : ""}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-white">{n.title}</div>
                              {isNew && (
                                <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold">
                                  Nouveau
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">{n.message}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/5 py-1 pl-1 pr-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-navy font-display text-xs text-gold">
                {(session.data?.user?.name ?? "L").charAt(0)}
              </span>
              <span className="text-sm font-medium text-white">
                {session.data?.user?.name ?? "Len"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
