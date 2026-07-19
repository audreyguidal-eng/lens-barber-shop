/**
 * Préparation de la base AVANT le build Next.js (exécuté sur Vercel).
 * - Si une vraie base PostgreSQL est connectée : crée/actualise les tables
 *   (prisma db push) puis initialise le catalogue si la base est vide.
 * - Sinon (mode démo, pas de DATABASE_URL) : ne fait rien, le site tourne
 *   avec des données d'exemple.
 * Ne bloque JAMAIS le build : toute erreur est loguée mais tolérée.
 */
import { execSync } from "node:child_process";

const pooled = process.env.DATABASE_URL || "";
// Pour la création des tables (DDL) et le seed, on privilégie une connexion
// DIRECTE si le fournisseur en expose une (Neon = DATABASE_URL_UNPOOLED),
// car le « pooler » (PgBouncer) gère mal les migrations.
const direct =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DIRECT_URL ||
  pooled;

const isPostgres = /^postgres(ql)?:\/\//.test(pooled);

if (!isPostgres) {
  console.log("ℹ️  Pas de base PostgreSQL détectée → mode démo. Étape DB ignorée.");
  process.exit(0);
}

function run(cmd) {
  console.log(`$ ${cmd}`);
  // On force DATABASE_URL sur la connexion directe le temps de l'opération.
  execSync(cmd, { stdio: "inherit", env: { ...process.env, DATABASE_URL: direct } });
}

try {
  run("prisma db push --skip-generate");
  run("tsx prisma/seed-init.ts");
  console.log("✅ Base prête.");
} catch (e) {
  console.error("⚠️  Étape DB non complétée :", e?.message || e);
  // On ne bloque pas le build : le site se déploiera quand même.
  process.exit(0);
}
