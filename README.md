# Len's Barber Shop — Site vitrine + réservation en ligne

Application **Next.js 14** (App Router) complète et prête pour la production :
site vitrine premium, **système de réservation intégré** (aucune redirection),
et **espace barbier privé** (dashboard type Stripe/Notion).

> Réalisé pour **Len's Barber Shop** — 141 Route de Melun, 91250 Saintry-sur-Seine · 09 80 67 44 20

---

## ✨ Fonctionnalités

**Site public**
- Hero plein écran, header glassmorphism au scroll, animations Framer Motion (fade / blur reveal / hover)
- Prestations réelles (récupérées de la fiche Booksy) classées par catégories, avec prix & durées
- Galerie masonry + lightbox, section « Le salon » (parking, CB, PMR, enfants, afro, femmes…)
- Avis clients (4,7/5 · 221 avis Google), FAQ, carte Google Maps, horaires
- **SEO local avancé** : JSON-LD `HairSalon` + `FAQPage` + `Breadcrumb`, OpenGraph, image OG générée, `sitemap.xml`, `robots.txt`

**Réservation (le cœur du site)**
- Tunnel en 6 étapes : prestation → coiffeur → date → heure → coordonnées → confirmation
- Créneaux générés **automatiquement** selon les horaires du salon
- **Aucune double réservation**, aucun créneau passé / fermé / en congés (revérifié côté serveur + transaction)
- Création automatique de la fiche client, page de confirmation animée

**Espace Barber (`/admin`)**
- Tableau de bord : RDV jour/semaine/mois, CA estimé, nouveaux/fidèles, durée moyenne, taux de remplissage
- **Agenda** vues jour/semaine avec **glisser-déposer** pour déplacer un RDV (confirmer / terminer / annuler / supprimer / bloquer un créneau)
- Gestion des **prestations** (CRUD, activation, tarifs), des **clients** (historique, total dépensé), des **horaires & congés**
- Notifications de nouvelles réservations

**Authentification (prête, désactivée pour l'instant)**
- NextAuth/Auth.js + Prisma + bcrypt + middleware + rôles
- **Accès libre** tant que `ADMIN_AUTH_ENABLED="false"`. Passez la variable à `"true"` et fournissez
  l'email + mot de passe définitifs pour verrouiller l'espace (voir plus bas).

---

## 🧱 Stack

Next.js 14 · TypeScript · TailwindCSS · Prisma · SQLite (dev) / PostgreSQL (prod) · NextAuth · Framer Motion.

---

## 🚀 Démarrage local

```bash
# 1. Installer les dépendances (génère aussi le client Prisma)
npm install

# 2. Créer le fichier d'environnement
cp .env.example .env

# 3. Créer la base SQLite + données de démo (prestations, horaires, avis, RDV démo)
npm run db:reset      # = prisma db push --force-reset && seed

# 4. Lancer
npm run dev
```

- Site : http://localhost:3000
- Espace Barber : http://localhost:3000/admin (accès libre en mode démo)

> Les polices (Archivo Black, Manrope, Space Mono) sont **auto-hébergées** (via `@fontsource`),
> donc aucune dépendance à Google Fonts au build.

---

## 🖼️ Remplacer les images par les vraies photos du salon

Tous les visuels sont centralisés dans **`src/lib/images.ts`**.
Par défaut, le site utilise des visuels premium « maison » (dans `public/images/`) pour un
rendu impeccable dès le premier lancement.

Pour mettre vos photos, **deux options** :
1. Déposez vos fichiers dans `public/images/` en gardant les mêmes noms (`hero.jpg`, `g01.jpg`, …) — rien d'autre à faire.
2. Ou remplacez la valeur par une URL dans `src/lib/images.ts` (les domaines Unsplash sont déjà autorisés dans `next.config.js`).

La galerie est aussi administrable côté base (table `Gallery`).

---

## 🔐 Activer la connexion de l'espace Barber (plus tard)

1. Dans `.env`, renseignez vos identifiants définitifs :
   ```env
   ADMIN_AUTH_ENABLED="true"
   ADMIN_EMAIL="votre-email@exemple.fr"
   ADMIN_PASSWORD="VotreMotDePasseSolide"
   NEXTAUTH_SECRET="..."   # openssl rand -base64 32
   ```
2. Recréez le compte barbier (le seed hashe le mot de passe avec bcrypt) :
   ```bash
   npm run db:seed
   ```
3. Désormais `/admin` exige une connexion via `/admin/login`. Le middleware protège
   `/admin/*` et `/api/admin/*`.

Tant que `ADMIN_AUTH_ENABLED` n'est pas `"true"`, l'espace reste en **accès libre** (pratique pour tester).

---

## ☁️ Déploiement sur Vercel

SQLite convient au développement. Pour la **production sur Vercel**, utilisez PostgreSQL :

1. Créez une base Postgres (Vercel Postgres, Neon, Supabase…).
2. Dans `prisma/schema.prisma`, passez le `datasource` de `sqlite` à `postgresql`.
3. Variables d'environnement Vercel : `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`,
   `ADMIN_AUTH_ENABLED`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. Appliquez le schéma et le seed :
   ```bash
   npx prisma db push
   npm run db:seed
   ```
5. `git push` → Vercel build (le client Prisma est généré au build).

---

## 📁 Structure

```
src/
├─ app/
│  ├─ page.tsx                 # Accueil (sections)
│  ├─ reserver/                # Tunnel de réservation + confirmation
│  ├─ admin/                   # Espace Barber (dashboard, agenda, prestations, clients, horaires, login)
│  ├─ api/                     # availability, bookings, services, admin/*, auth
│  ├─ sitemap.ts / robots.ts / opengraph-image.tsx
│  └─ layout.tsx / globals.css
├─ components/                 # sections/, ui/, admin/, booking/
├─ lib/                        # prisma, auth, availability, utils, site, images
└─ middleware.ts               # protection /admin (activable)
prisma/
├─ schema.prisma              # 12 modèles
└─ seed.ts                    # données réelles + démo
public/images/                # visuels (remplaçables)
```

## 🧩 Prochaines évolutions prévues (déjà câblées)
Envoi email/SMS de confirmation et rappel, gestion multi-coiffeurs, notifications push.

---
© Len's Barber Shop — RCS 878 914 530.
