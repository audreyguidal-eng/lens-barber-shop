import { SITE, FAQ } from "@/lib/site";

/** JSON-LD : HairSalon (LocalBusiness) + FAQPage + Breadcrumb */
export function JsonLd() {
  const hoursMap: Record<string, string> = {
    Lundi: "Monday",
    Mardi: "Tuesday",
    Mercredi: "Wednesday",
    Jeudi: "Thursday",
    Vendredi: "Friday",
    Samedi: "Saturday",
    Dimanche: "Sunday",
  };

  const openingHoursSpecification = SITE.hours
    .filter((h) => h.value !== "Fermé")
    .map((h) => {
      const [open, close] = h.value.split("–").map((s) => s.trim().replace("h", ":"));
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${hoursMap[h.day]}`,
        opens: open,
        closes: close,
      };
    });

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    description: SITE.description,
    image: `${SITE.url}/opengraph-image`,
    url: SITE.url,
    telephone: SITE.phone,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Espèces, Carte bancaire",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    hasMap: SITE.mapsQuery,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.rating.value,
      reviewCount: SITE.rating.count,
      bestRating: 5,
    },
    openingHoursSpecification,
    sameAs: [SITE.facebook].filter(Boolean),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Prestations", item: `${SITE.url}/#prestations` },
      { "@type": "ListItem", position: 3, name: "Réserver", item: `${SITE.url}/reserver` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
