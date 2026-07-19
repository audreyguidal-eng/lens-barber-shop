import { PrismaClient } from "@prisma/client";
import { previewPrisma } from "./preview-mock";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Mode DÉMO automatique : si aucune base n'est configurée (DATABASE_URL absent)
// ou si PREVIEW_MOCK=1, le site fonctionne avec des données d'exemple, SANS base.
// => permet un premier déploiement Vercel en 1 clic, sans rien configurer.
// Dès que vous ajoutez un vrai DATABASE_URL, le site bascule sur la vraie base.
const useMock =
  process.env.PREVIEW_MOCK === "1" || !process.env.DATABASE_URL;

export const prisma: PrismaClient = useMock
  ? (previewPrisma as PrismaClient)
  : globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production" && !useMock)
  globalForPrisma.prisma = prisma;
