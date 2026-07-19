/** Informations réelles du salon — source unique de vérité. */
export const SITE = {
  name: "Len's Barber Shop",
  tagline: "Le barbier de référence à Saintry-sur-Seine.",
  description:
    "Len's Barber Shop à Saintry-sur-Seine : coupes modernes, dégradés, barbe, enfants, cheveux longs, afro, femmes. Le salon le mieux noté du secteur — réservez en ligne en quelques secondes.",
  url: "https://lens-barber-shop.vercel.app",
  phone: "09 80 67 44 20",
  phoneHref: "tel:+33980674420",
  address: {
    street: "141 Route de Melun",
    postalCode: "91250",
    city: "Saintry-sur-Seine",
    country: "FR",
    full: "141 Route de Melun, 91250 Saintry-sur-Seine",
  },
  geo: { lat: 48.5731, lng: 2.4462 },
  rating: { value: 4.7, count: 221 },
  rcs: "878 914 530",
  facebook: "https://www.facebook.com/people/Lens-Barber-Shop/",
  instagram: "",
  mapsQuery:
    "https://www.google.com/maps/search/?api=1&query=Len%27s+Barber+Shop+141+Route+de+Melun+91250+Saintry-sur-Seine",
  hours: [
    { day: "Lundi", value: "09h00 – 19h00" },
    { day: "Mardi", value: "09h00 – 19h00" },
    { day: "Mercredi", value: "10h00 – 20h00" },
    { day: "Jeudi", value: "09h00 – 19h00" },
    { day: "Vendredi", value: "09h00 – 19h00" },
    { day: "Samedi", value: "09h30 – 19h00" },
    { day: "Dimanche", value: "Fermé" },
  ],
};

export const NAV = [
  { label: "Accueil", href: "/#accueil" },
  { label: "Prestations", href: "/#prestations" },
  { label: "Le salon", href: "/#le-salon" },
  { label: "Galerie", href: "/#galerie" },
  { label: "Avis", href: "/#avis" },
  { label: "Contact", href: "/#contact" },
];

export const FAQ = [
  {
    q: "Faut-il prendre rendez-vous ?",
    a: "La réservation en ligne est recommandée pour être sûr d'avoir votre créneau, mais nous accueillons aussi selon les disponibilités. Réservez en quelques secondes directement sur le site.",
  },
  {
    q: "Coupez-vous les cheveux afro et texturés ?",
    a: "Oui. Dégradés afro, cheveux texturés, toutes longueurs : notre savoir-faire couvre l'ensemble des types de cheveux.",
  },
  {
    q: "Recevez-vous les enfants et les femmes ?",
    a: "Absolument. Nous proposons des prestations enfants (garçons et filles) ainsi qu'une gamme complète pour les femmes : coupe, brushing, balayage, lissage et soins.",
  },
  {
    q: "Quels sont les moyens de paiement ?",
    a: "Nous acceptons la carte bancaire et les espèces. Le salon dispose d'un parking, d'un accès PMR et accueille les enfants.",
  },
  {
    q: "Où se situe le salon ?",
    a: "Len's Barber Shop se trouve au 141 Route de Melun, 91250 Saintry-sur-Seine. Parking disponible à proximité.",
  },
];
