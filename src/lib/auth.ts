import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

/**
 * Configuration NextAuth / Auth.js — prête à l'emploi.
 *
 * L'espace barbier est protégé par ce système (Credentials + bcrypt + rôles),
 * MAIS l'accès reste LIBRE tant que ADMIN_AUTH_ENABLED n'est pas "true"
 * (voir src/middleware.ts). Il suffira de passer la variable à "true" et de
 * fournir l'email + mot de passe définitifs pour sécuriser l'accès.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Espace Barber",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        // Seuls les rôles BARBER / ADMIN peuvent se connecter à l'espace.
        if (user.role !== "BARBER" && user.role !== "ADMIN") return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "BARBER";
        token.id = (user as { id?: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  // Fallback en mode démo pour éviter tout crash si la variable n'est pas
  // encore définie. À REMPLACER par un vrai secret en production
  // (Vercel → Settings → Environment Variables → NEXTAUTH_SECRET).
  secret: process.env.NEXTAUTH_SECRET || "lens-barber-demo-secret-a-remplacer",
};

/** Interrupteur global : l'auth de l'espace barbier est-elle active ? */
export const ADMIN_AUTH_ENABLED = process.env.ADMIN_AUTH_ENABLED === "true";
