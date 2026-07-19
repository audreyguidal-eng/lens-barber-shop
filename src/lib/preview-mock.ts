/* Mock Prisma pour l'APERÇU uniquement (activé par PREVIEW_MOCK=1).
   Ne sert QUE à afficher le design sans base de données. Aucun impact en prod. */

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

const reviews = [
  { id: "r1", author: "Karim B.", rating: 5, source: "Google", text: "Le meilleur barbier du coin, sans hésiter. Dégradé parfait à chaque fois et une ambiance très pro." },
  { id: "r2", author: "Thomas L.", rating: 5, source: "Google", text: "Accueil au top, on ne se sent pas pressé, le résultat est net. Je recommande à 100%." },
  { id: "r3", author: "Mehdi R.", rating: 5, source: "Google", text: "Très bon travail sur la barbe, précis et à l'écoute. Le salon est propre et moderne." },
  { id: "r4", author: "Julien P.", rating: 4, source: "Google", text: "Bonne coupe, prix corrects. Un peu d'attente le samedi mais ça vaut le coup." },
  { id: "r5", author: "Anthony M.", rating: 5, source: "Google", text: "Mon fils adore y aller, ils sont patients avec les enfants. Coupe impeccable." },
  { id: "r6", author: "Sofiane D.", rating: 5, source: "Google", text: "Vrai savoir-faire, dégradé afro parfaitement maîtrisé. Je ne vais plus ailleurs." },
];

const gallery = Array.from({ length: 14 }).map((_, i) => ({
  id: `g${i}`, url: `/images/g${String(i + 1).padStart(2, "0")}.jpg`,
  alt: "Réalisation Len's Barber Shop", order: i, featured: i === 0,
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
  notification: model([]),
  blockedSlot: model([]),
  vacation: model([]),
  user: model([]),
  $transaction: async (fn: any) => (typeof fn === "function" ? fn(previewPrisma) : Promise.all(fn)),
  $disconnect: async () => {},
};
