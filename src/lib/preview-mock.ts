/* Mock Prisma pour l'APERÇU / mode démo (activé si PREVIEW_MOCK=1 ou pas de
   DATABASE_URL). Ne sert QU'À afficher le site sans base de données. */
import { IMAGES } from "./images";

const cats = [
  { name: "Coupe", icon: "scissors" },
  { name: "Barbe", icon: "razor" },
  { name: "Transformation", icon: "sparkles" },
  { name: "Enfants", icon: "child" },
  { name: "Coloration", icon: "palette" },
  { name: "Soins", icon: "droplet" },
  { name: "Femmes", icon: "flower" },
];

const svc = (categoryId: string, name: string, priceCents: number, durationMin: number, description: string, popular = false) => ({
  id: `${categoryId}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name, description, priceCents, durationMin, popular, active: true,
  image: `/images/cat-${categoryId}.jpg`, categoryId, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
});

const servicesByCat: Record<string, any[]> = {
  coupe: [
    svc("coupe", "Coupe Homme", 2200, 20, "Coupe personnalisée, dégradé ou classique, finitions au rasoir.", true),
    svc("coupe", "Coupe + Barbe classique", 3050, 30, "La formule complète : coupe sur-mesure et taille de barbe.", true),
    svc("coupe", "Coupe cheveux longs", 2500, 30, "Coupe et mise en forme pour cheveux mi-longs à longs."),
    svc("coupe", "Contour / Retouche", 800, 10, "Reprise des contours et de la nuque."),
  ],
  barbe: [
    svc("barbe", "Barbe sculptée", 1550, 15, "Taille et dessin de la barbe à la tondeuse et au rasoir."),
    svc("barbe", "Barbe complète", 2350, 20, "Taille, contours nets, serviette chaude et soin."),
    svc("barbe", "Rasage traditionnel", 1800, 25, "Rasage au coupe-chou, serviette chaude et huile."),
  ],
  transformation: [
    svc("transformation", "Coupe transformation", 2500, 30, "Changement de style complet avec conseil."),
    svc("transformation", "Défrisage", 2200, 45, "Défrisage professionnel pour un rendu lisse."),
  ],
  enfants: [
    svc("enfants", "Enfant garçon -10 ans", 1600, 20, "Coupe adaptée aux plus jeunes.", true),
    svc("enfants", "Enfant fille -10 ans", 1600, 30, "Coupe et coiffage tout en douceur."),
  ],
  coloration: [
    svc("coloration", "Coloration / décoloration", 2800, 45, "Coloration ou décoloration sur-mesure."),
    svc("coloration", "Coloration barbe", 1500, 20, "Uniformisation de la couleur de la barbe."),
  ],
  soins: [
    svc("soins", "Shampoing", 400, 5, "Shampoing lavant et rafraîchissant."),
    svc("soins", "Soin visage & masque", 1200, 15, "Nettoyage, gommage et masque."),
  ],
  femmes: [
    svc("femmes", "Brushing / coiffage", 2500, 30, "Mise en forme et brushing."),
    svc("femmes", "Coupe femme", 3500, 45, "Coupe personnalisée avec shampoing et coiffage."),
    svc("femmes", "Balayage", 8000, 120, "Balayage lumineux et naturel."),
    svc("femmes", "Lissage brésilien", 9000, 120, "Lissage longue durée."),
    svc("femmes", "Soin kératine", 6000, 90, "Soin réparateur à la kératine."),
  ],
};

const categories = cats.map((c, i) => {
  const key = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { id: key, name: c.name, slug: key, icon: c.icon, order: i, services: servicesByCat[key] || [] };
});

const allServices = categories.flatMap((c) => c.services);

// Vrais avis clients (récupérés en ligne) — verbatim, légèrement ponctués.
const reviews = [
  { id: "r1", author: "Alexis D.", rating: 5, source: "Avis vérifié", text: "Un grand merci à Cécile et Valente pour leur accueil, leur gentillesse et leur professionnalisme. Mon fils et moi-même sommes ravis de notre coupe de cheveux." },
  { id: "r2", author: "Maxime B.", rating: 5, source: "Avis vérifié", text: "Cela fait 2 fois que je vais chez ce coiffeur et je suis toujours très content du résultat, le coiffeur est très à l'écoute. Le salon est très propre." },
  { id: "r3", author: "Madeleine Y.", rating: 5, source: "Avis vérifié", text: "Très bons coiffeurs, Valente et Cécile toujours à l'écoute des clients. D'une extrême gentillesse, je conseille." },
  { id: "r4", author: "Andrea Q.", rating: 5, source: "Avis vérifié", text: "Un grand merci à Cécile, qui a su m'écouter et me conseiller au mieux pour la réalisation de ma couleur qui est super belle." },
];

const gallery = IMAGES.gallery.map((g, i) => ({
  id: `g${i}`, url: g.src, alt: g.alt, order: i, featured: i === 0,
}));

const hours = [
  { weekday: 1, isOpen: true, openMinutes: 540, closeMinutes: 1140, breakStart: null, breakEnd: null },
  { weekday: 2, isOpen: true, openMinutes: 540, closeMinutes: 1140, breakStart: null, breakEnd: null },
  { weekday: 3, isOpen: true, openMinutes: 600, closeMinutes: 1200, breakStart: null, breakEnd: null },
  { weekday: 4, isOpen: true, openMinutes: 540, closeMinutes: 1140, breakStart: null, breakEnd: null },
  { weekday: 5, isOpen: true, openMinutes: 540, closeMinutes: 1140, breakStart: null, breakEnd: null },
  { weekday: 6, isOpen: true, openMinutes: 570, closeMinutes: 1140, breakStart: null, breakEnd: null },
  { weekday: 0, isOpen: false, openMinutes: 0, closeMinutes: 0, breakStart: null, breakEnd: null },
];

const settings = {
  id: 1, shopName: "Len's Barber Shop", phone: "09 80 67 44 20",
  address: "141 Route de Melun, 91250 Saintry-sur-Seine", slotStepMin: 15, bufferMin: 0,
  facebook: "", instagram: "",
};

const model = (rows: any[]) => ({
  findMany: async () => rows,
  findFirst: async () => rows[0] ?? null,
  findUnique: async ({ where }: any = {}) =>
    rows.find((r) => (where?.id ? r.id === where.id : where?.weekday != null ? r.weekday === where.weekday : false)) ?? rows[0] ?? null,
  count: async () => rows.length,
  create: async ({ data }: any) => ({ id: "mock", ...data }),
  update: async ({ data }: any) => ({ id: "mock", ...data }),
  updateMany: async () => ({ count: 0 }),
  upsert: async ({ create }: any) => ({ id: "mock", ...create }),
  delete: async () => ({ id: "mock" }),
});

export const previewPrisma: any = {
  category: model(categories),
  service: model(allServices),
  review: model(reviews),
  gallery: model(gallery),
  openingHours: model(hours),
  settings: model([settings]),
  appointment: model([]),
  client: model([]),
  notification: model([
    { id: "n1", type: "NEW_CLIENT", title: "🎉 Nouveau client !", message: "Alexis D. vient de réserver pour la première fois — Coupe + Barbe classique.", read: false, createdAt: new Date(0) },
    { id: "n2", type: "NEW_BOOKING", title: "Nouvelle réservation", message: "Maxime B. — Coupe Homme aujourd'hui à 15h30.", read: false, createdAt: new Date(0) },
  ]),
  blockedSlot: model([]),
  vacation: model([]),
  user: model([]),
  $transaction: async (fn: any) => (typeof fn === "function" ? fn(previewPrisma) : Promise.all(fn)),
  $disconnect: async () => {},
};
