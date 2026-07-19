# 🚀 Déployer Len's Barber Shop sur Vercel (avec base Postgres)

Objectif : mettre le site en ligne avec une vraie base de données pour que
les réservations s'enregistrent, et pouvoir tester depuis ton téléphone.

Tu as besoin de : **Node.js** installé sur ton ordinateur + le dossier du projet
(décompresse `lens-barber-shop-FINAL.zip`). Compte ~10 minutes.

---

## Étape 1 — Créer la base de données (gratuit)

Le plus simple : **Neon** (Postgres gratuit).

1. Va sur **https://neon.tech** → crée un compte → **Create project**.
2. Une fois le projet créé, copie la **Connection string** (elle commence par
   `postgresql://…` et finit par `?sslmode=require`). Garde-la de côté.

> Alternative : dans le dashboard Vercel, onglet **Storage → Create Database →
> Postgres**. Vercel te donne aussi une URL de connexion et l'ajoute
> automatiquement aux variables d'environnement.

---

## Étape 2 — Préparer le projet en local

Ouvre un terminal dans le dossier `lens-barber-shop`, puis :

```bash
npm install
cp .env.example .env
```

Ouvre le fichier **`.env`** et renseigne :

```env
DATABASE_URL="postgresql://…ta connection string Neon…"
NEXTAUTH_SECRET="colle ici un secret aléatoire"   # génère-le : openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"               # tu mettras l'URL Vercel plus tard
ADMIN_AUTH_ENABLED="false"
ADMIN_EMAIL="ton-email@exemple.fr"
ADMIN_PASSWORD="TonMotDePasse"
```

---

## Étape 3 — Créer les tables + les données

Toujours dans le terminal :

```bash
npx prisma db push     # crée toutes les tables dans ta base Neon
npm run db:seed        # ajoute prestations, horaires, avis, RDV de démo
```

> Astuce : tu peux vérifier en lançant `npm run dev` puis en ouvrant
> http://localhost:3000 — le site doit s'afficher avec les prestations.

---

## Étape 4 — Déployer sur Vercel

```bash
npm i -g vercel        # installe l'outil Vercel (une seule fois)
vercel login           # connecte-toi à ton compte Vercel
vercel                 # lance le déploiement (réponds « yes » aux questions)
```

Vercel te donne une URL de prévisualisation. Ajoute ensuite les **variables
d'environnement** (dans le dashboard Vercel → ton projet → **Settings →
Environment Variables**), identiques à ton `.env` :

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` → **mets ici l'URL finale de ton site** (ex : `https://lens-barber-shop.vercel.app`)
- `ADMIN_AUTH_ENABLED` = `false`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`

Puis passe en production :

```bash
vercel --prod
```

🎉 **Ouvre l'URL `.vercel.app` sur ton téléphone** — tu peux naviguer, réserver,
et voir la réservation apparaître dans l'espace barber (`/admin`).

---

## Plus tard — Sécuriser l'espace Barber

Quand tu voudras verrouiller `/admin` :

1. Sur Vercel, passe `ADMIN_AUTH_ENABLED` à `true` et vérifie `ADMIN_EMAIL` /
   `ADMIN_PASSWORD` / `NEXTAUTH_SECRET`.
2. Recrée le compte : en local avec le `DATABASE_URL` de prod, lance `npm run db:seed`
   (⚠️ le seed réinitialise les données de démo — à faire **avant** d'avoir de vrais RDV).
3. Redéploie : `vercel --prod`.

L'accès à `/admin` demandera alors une connexion via `/admin/login`.

---

## Problèmes fréquents

- **« Environment variable not found: DATABASE_URL »** → variable non ajoutée sur
  Vercel, ou pas dans le bon environnement (Production/Preview). Ajoute-la puis redéploie.
- **Page prestations vide** → tu as oublié `npm run db:seed` (Étape 3).
- **Erreur Prisma au runtime** → vérifie que `DATABASE_URL` finit bien par
  `?sslmode=require` (Neon l'exige).

Besoin d'un coup de main sur une étape précise ? Donne-moi le message d'erreur exact.
