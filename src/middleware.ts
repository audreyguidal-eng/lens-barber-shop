import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Protège l'espace barbier (/admin) et ses API (/api/admin).
 *
 * TANT QUE ADMIN_AUTH_ENABLED !== "true" : accès LIBRE (mode développement).
 * Passez la variable d'environnement à "true" pour exiger une connexion.
 */
export async function middleware(req: NextRequest) {
  const authEnabled = process.env.ADMIN_AUTH_ENABLED === "true";
  if (!authEnabled) {
    return NextResponse.next(); // accès libre pour l'instant
  }

  const { pathname } = req.nextUrl;

  // La page de connexion reste accessible
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isBarber = token?.role === "BARBER" || token?.role === "ADMIN";

  if (!token || !isBarber) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
