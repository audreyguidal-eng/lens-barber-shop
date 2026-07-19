/**
 * MANIFESTE D'IMAGES — Len's Barber Shop
 * ------------------------------------------------------------------
 * Toutes les images du site sont centralisées ici pour être remplacées
 * TRÈS FACILEMENT par les vraies photos du salon.
 *
 * Par défaut, le site utilise des visuels premium "maison" (dégradés
 * sur-mesure aux couleurs de la marque, dans /public/images/) : ainsi
 * le site s'affiche parfaitement dès le premier déploiement, sans
 * dépendre d'un service externe.
 *
 * POUR METTRE VOS VRAIES PHOTOS :
 *   1) Déposez vos fichiers dans `public/images/`
 *      (ex : public/images/hero.jpg, public/images/g01.jpg, …)
 *      en gardant les mêmes noms → rien d'autre à faire.
 *   2) OU remplacez la valeur ci-dessous par une URL
 *      (ex : une photo Unsplash/Pexels). Les domaines Unsplash sont
 *      déjà autorisés dans next.config.js — ajoutez-en si besoin.
 *
 * Astuce : des exemples d'URL Unsplash sont proposés en commentaire.
 */

const local = (name: string) => `/images/${name}`;

export const IMAGES = {
  // hero: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=80",
  hero: local("hero.jpg"),
  heroPortrait: local("hero-portrait.jpg"),

  salonPrimary: local("salon-primary.jpg"),
  salonSecondary: local("salon-secondary.jpg"),

  // Galerie (style Pinterest / masonry) — remplaçable une à une
  gallery: [
    { src: local("g01.jpg"), alt: "Dégradé net réalisé au rasoir", tall: false },
    { src: local("g02.jpg"), alt: "Barbe sculptée et contours précis", tall: true },
    { src: local("g03.jpg"), alt: "Ambiance chaleureuse du salon", tall: false },
    { src: local("g04.jpg"), alt: "Fauteuil de barbier", tall: true },
    { src: local("g05.jpg"), alt: "Finitions soignées", tall: false },
    { src: local("g06.jpg"), alt: "Coupe homme moderne", tall: true },
    { src: local("g07.jpg"), alt: "Rasage traditionnel serviette chaude", tall: false },
    { src: local("g08.jpg"), alt: "Les outils du barbier", tall: false },
    { src: local("g09.jpg"), alt: "Détail du poste de coiffage", tall: true },
    { src: local("g10.jpg"), alt: "Soin de la barbe", tall: false },
    { src: local("g11.jpg"), alt: "Dégradé afro texturé", tall: true },
    { src: local("g12.jpg"), alt: "Style et allure", tall: false },
    { src: local("g13.jpg"), alt: "Produits de coiffage premium", tall: false },
    { src: local("g14.jpg"), alt: "Poste de coiffage et miroir", tall: true },
  ],

  // Photos d'illustration par catégorie de prestation
  categories: {
    coupe: local("cat-coupe.jpg"),
    barbe: local("cat-barbe.jpg"),
    transformation: local("cat-transformation.jpg"),
    enfants: local("cat-enfants.jpg"),
    coloration: local("cat-coloration.jpg"),
    soins: local("cat-soins.jpg"),
    femmes: local("cat-femmes.jpg"),
  } as Record<string, string>,
};

export type GalleryImage = (typeof IMAGES.gallery)[number];
