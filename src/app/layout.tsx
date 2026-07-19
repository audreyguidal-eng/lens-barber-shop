import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

// Polices auto-hébergées (via @fontsource) : pas de dépendance à Google Fonts
// au moment du build → plus fiable et plus rapide.
const archivo = localFont({
  src: "../fonts/archivo-black-400.woff2",
  weight: "400",
  variable: "--font-archivo",
  display: "swap",
});
const manrope = localFont({
  src: "../fonts/manrope-variable.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});
const spaceMono = localFont({
  src: [
    { path: "../fonts/space-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/space-mono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Barbier à Saintry-sur-Seine`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "barbier Saintry-sur-Seine",
    "coiffeur homme 91250",
    "dégradé",
    "taille de barbe",
    "coupe afro",
    "barbier Essonne",
    "Len's Barber Shop",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Barbier à Saintry-sur-Seine`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Barbier à Saintry-sur-Seine`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#2a1c11",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${manrope.variable} ${spaceMono.variable}`}
    >
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
