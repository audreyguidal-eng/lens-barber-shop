/**
 * MANIFESTE D'IMAGES — Len's Barber Shop
 * ------------------------------------------------------------------
 * Par défaut : de VRAIES photos de barbier (Unsplash, libres de droit,
 * URLs vérifiées) — elles s'affichent sur le site en ligne.
 *
 * POUR METTRE LES VRAIES PHOTOS DU SALON plus tard :
 *   - déposez vos fichiers dans public/images/ et remplacez l'URL par
 *     un chemin local, ex : "/images/mon-salon.jpg"
 *   - ou collez une autre URL (les domaines Unsplash sont autorisés
 *     dans next.config.js).
 *
 * (En preview hors-ligne, NEXT_PUBLIC_USE_LOCAL_IMG=1 bascule sur des
 *  visuels locaux de secours — utilisé uniquement pour les captures.)
 */

const LOCAL = process.env.NEXT_PUBLIC_USE_LOCAL_IMG === "1";

// Photo Unsplash -> URL optimisée
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const up = (id: string, w = 1600) =>
  `https://plus.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// couple (url réelle, fallback local)
const pick = (real: string, local: string) => (LOCAL ? local : real);

export const IMAGES = {
  hero: pick(u("photo-1585747860715-2ba37e788b70", 2000), "/images/hero.jpg"),
  heroPortrait: pick(u("photo-1599351431202-1e0f0137899a", 1200), "/images/hero-portrait.jpg"),

  salonPrimary: pick(u("photo-1536520002442-39764a41e987", 1400), "/images/salon-primary.jpg"),
  salonSecondary: pick(u("photo-1621645582931-d1d3e6564943", 1000), "/images/salon-secondary.jpg"),

  // Galerie — vraies photos de barbier vérifiées
  gallery: [
    { real: u("photo-1503951914875-452162b0f3f1", 1200), local: "/images/g01.jpg", alt: "Client installé au fauteuil du barbier", tall: false },
    { real: u("photo-1585747860715-2ba37e788b70", 1200), local: "/images/g02.jpg", alt: "Fauteuil de barbier en cuir, mur de briques", tall: true },
    { real: u("photo-1593702275687-f8b402bf1fb5", 1200), local: "/images/g03.jpg", alt: "Barbier en pleine coupe", tall: false },
    { real: u("photo-1536520002442-39764a41e987", 1200), local: "/images/g04.jpg", alt: "Intérieur du salon, ambiance soignée", tall: true },
    { real: u("photo-1647140655214-e4a2d914971f", 1200), local: "/images/g05.jpg", alt: "Coupe aux ciseaux", tall: false },
    { real: u("photo-1567894340315-735d7c361db0", 1200), local: "/images/g06.jpg", alt: "Dégradé net à la tondeuse", tall: true },
    { real: u("photo-1630827020718-3433092696e7", 1200), local: "/images/g07.jpg", alt: "Barbe soignée poivre et sel", tall: false },
    { real: u("photo-1657105052497-f996284ffff8", 1200), local: "/images/g08.jpg", alt: "Contours de barbe à la tondeuse", tall: false },
    { real: u("photo-1621645582931-d1d3e6564943", 1200), local: "/images/g09.jpg", alt: "Fauteuil de barbier", tall: true },
    { real: u("photo-1629189784191-9afdcbcb0398", 1200), local: "/images/g10.jpg", alt: "Portrait, barbe travaillée", tall: false },
    { real: u("photo-1599351431202-1e0f0137899a", 1200), local: "/images/g11.jpg", alt: "Style et allure après coupe", tall: true },
    { real: up("premium_photo-1661645788141-8196a45fb483", 1200), local: "/images/g12.jpg", alt: "Soin et coiffage professionnel", tall: false },
    { real: u("photo-1519500528352-2d1460418d41", 1200), local: "/images/g13.jpg", alt: "Enseigne de barbier", tall: false },
    { real: u("photo-1622286342621-4bd786c2447c", 1200), local: "/images/g14.jpg", alt: "Poste de coiffage", tall: true },
  ].map((g) => ({ src: LOCAL ? g.local : g.real, alt: g.alt, tall: g.tall })),

  categories: {
    coupe: pick(u("photo-1647140655214-e4a2d914971f", 900), "/images/cat-coupe.jpg"),
    barbe: pick(u("photo-1657105052497-f996284ffff8", 900), "/images/cat-barbe.jpg"),
    transformation: pick(u("photo-1567894340315-735d7c361db0", 900), "/images/cat-transformation.jpg"),
    enfants: pick(u("photo-1593702275687-f8b402bf1fb5", 900), "/images/cat-enfants.jpg"),
    coloration: pick(u("photo-1560066984-138dadb4c035", 900), "/images/cat-coloration.jpg"),
    soins: pick(u("photo-1629189784191-9afdcbcb0398", 900), "/images/cat-soins.jpg"),
    femmes: pick(u("photo-1560869713-7d0a29430803", 900), "/images/cat-femmes.jpg"),
  } as Record<string, string>,
};

export type GalleryImage = (typeof IMAGES.gallery)[number];
