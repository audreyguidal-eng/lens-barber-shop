import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/reserver`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/#prestations`, lastModified: now, priority: 0.7 },
    { url: `${SITE.url}/#le-salon`, lastModified: now, priority: 0.6 },
    { url: `${SITE.url}/#galerie`, lastModified: now, priority: 0.6 },
    { url: `${SITE.url}/#avis`, lastModified: now, priority: 0.6 },
    { url: `${SITE.url}/#contact`, lastModified: now, priority: 0.6 },
  ];
}
