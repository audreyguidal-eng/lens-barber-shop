"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push(callbackUrl);
    }
  }

  const field =
    "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/10";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0D12] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold font-display text-xl text-ink">
            L
          </span>
          <h1 className="mt-4 font-display text-2xl text-white">Espace Barber</h1>
          <p className="mt-1 text-sm text-slate-400">Réservé au barbier.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 rounded-3xl border border-white/10 bg-[#0E1117] p-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">Email</label>
            <input type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="barber@lensbarbershop.fr" required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">Mot de passe</label>
            <input type="password" className={field} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gold py-3 text-sm font-semibold text-ink transition hover:brightness-105 disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-gold">← Retour au site</Link>
        </p>
      </div>
    </div>
  );
}
