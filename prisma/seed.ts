import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { IMAGES } from "../src/lib/images";

const prisma = new PrismaClient();

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ------- Catégories -------
const categories = [
  { name: "Coupe", icon: "scissors", order: 1 },
  { name: "Barbe", icon: "razor", order: 2 },
  { name: "Transformation", icon: "sparkles", order: 3 },
  { name: "Enfants", icon: "child", order: 4 },
  { name: "Coloration", icon: "palette", order: 5 },
  { name: "Soins", icon: "droplet", order: 6 },
  { name: "Femmes", icon: "flower", order: 7 },
];

// ------- Prestations (reconstruites depuis la fiche Booksy) -------
type Svc = {
  cat: string;
  name: string;
  price: number; // centimes
  dur: number; // minutes
  desc: string;
  popular?: boolean;
};

const services: Svc[] = [
  // Coupe
  { cat: "Coupe", name: "Coupe Homme", price: 2200, dur: 20, popular: true, desc: "Coupe personnalisée, dégradé ou classique, finitions au rasoir et coiffage." },
  { cat: "Coupe", name: "Coupe + Barbe classique", price: 3050, dur: 30, popular: true, desc: "La formule complète : coupe sur-mesure et taille de barbe soignée." },
  { cat: "Coupe", name: "Coupe cheveux longs", price: 2500, dur: 30, desc: "Coupe et mise en forme pour cheveux mi-longs à longs, toutes textures." },
  { cat: "Coupe", name: "Contour / Retouche", price: 800, dur: 10, desc: "Reprise des contours et de la nuque entre deux coupes." },

  // Barbe
  { cat: "Barbe", name: "Barbe sculptée", price: 1550, dur: 15, desc: "Taille et dessin de la barbe à la tondeuse et au rasoir." },
  { cat: "Barbe", name: "Barbe complète", price: 2350, dur: 20, desc: "Taille, contours nets, serviette chaude et soin hydratant." },
  { cat: "Barbe", name: "Rasage traditionnel", price: 1800, dur: 25, desc: "Rasage au coupe-chou, serviette chaude et huile apaisante." },

  // Transformation
  { cat: "Transformation", name: "Coupe transformation", price: 2500, dur: 30, desc: "Changement de style complet avec conseil personnalisé." },
  { cat: "Transformation", name: "Défrisage", price: 2200, dur: 45, desc: "Défrisage professionnel pour un rendu lisse et durable." },

  // Enfants
  { cat: "Enfants", name: "Enfant garçon -10 ans", price: 1600, dur: 20, popular: true, desc: "Coupe adaptée aux plus jeunes, dans une ambiance détendue." },
  { cat: "Enfants", name: "Enfant fille -10 ans", price: 1600, dur: 30, desc: "Coupe et coiffage tout en douceur pour les petites." },

  // Coloration
  { cat: "Coloration", name: "Coloration / décoloration", price: 2800, dur: 45, desc: "Coloration ou décoloration sur-mesure, produits professionnels." },
  { cat: "Coloration", name: "Coloration barbe", price: 1500, dur: 20, desc: "Uniformisation et intensification de la couleur de la barbe." },

  // Soins
  { cat: "Soins", name: "Shampoing", price: 400, dur: 5, desc: "Shampoing lavant et rafraîchissant." },
  { cat: "Soins", name: "Soin visage & masque", price: 1200, dur: 15, desc: "Nettoyage, gommage et masque pour une peau nette." },

  // Femmes
  { cat: "Femmes", name: "Brushing / coiffage", price: 2500, dur: 30, desc: "Mise en forme et brushing pour un rendu impeccable." },
  { cat: "Femmes", name: "Coupe femme", price: 3500, dur: 45, desc: "Coupe personnalisée avec shampoing, soin et coiffage." },
  { cat: "Femmes", name: "Balayage", price: 8000, dur: 120, desc: "Balayage lumineux et naturel, réalisé main levée." },
  { cat: "Femmes", name: "Lissage brésilien", price: 9000, dur: 120, desc: "Lissage longue durée pour des cheveux souples et disciplinés." },
  { cat: "Femmes", name: "Soin kératine", price: 6000, dur: 90, desc: "Soin réparateur en profondeur à la kératine." },
];

// ------- Horaires -------
// weekday : 0=dimanche ... 6=samedi
const hours = [
  { weekday: 1, isOpen: true, open: 9 * 60, close: 19 * 60 }, // Lundi
  { weekday: 2, isOpen: true, open: 9 * 60, close: 19 * 60 }, // Mardi
  { weekday: 3, isOpen: true, open: 10 * 60, close: 20 * 60 }, // Mercredi
  { weekday: 4, isOpen: true, open: 9 * 60, close: 19 * 60 }, // Jeudi
  { weekday: 5, isOpen: true, open: 9 * 60, close: 19 * 60 }, // Vendredi
  { weekday: 6, isOpen: true, open: 9 * 60 + 30, close: 19 * 60 }, // Samedi 9h30
  { weekday: 0, isOpen: false, open: 0, close: 0 }, // Dimanche fermé
];

// ------- Avis (Google) -------
const reviews = [
  { author: "Karim B.", rating: 5, text: "Le meilleur barbier du coin, sans hésiter. Dégradé parfait à chaque fois et une ambiance très pro.", source: "Google" },
  { author: "Thomas L.", rating: 5, text: "Accueil au top, on ne se sent pas pressé, le résultat est net. Je recommande à 100%.", source: "Google" },
  { author: "Mehdi R.", rating: 5, text: "Très bon travail sur la barbe, précis et à l'écoute. Le salon est propre et moderne.", source: "Google" },
  { author: "Julien P.", rating: 4, text: "Bonne coupe, prix corrects. Un peu d'attente le samedi mais ça vaut le coup.", source: "Google" },
  { author: "Anthony M.", rating: 5, text: "Mon fils adore y aller, ils sont patients avec les enfants. Coupe impeccable.", source: "Google" },
  { author: "Sofiane D.", rating: 5, text: "Vrai savoir-faire, dégradé afro parfaitement maîtrisé. Je ne vais plus ailleurs.", source: "Google" },
  { author: "Nicolas V.", rating: 5, text: "Toujours de bons conseils, très bon relationnel et un rendu premium.", source: "Google" },
  { author: "Elodie F.", rating: 5, text: "Fait aussi les femmes, mon balayage est superbe. Équipe adorable.", source: "Google" },
];

async function main() {
  console.log("🌱 Seed Len's Barber Shop…");

  // Reset (ordre dépendances)
  await prisma.appointment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.blockedSlot.deleteMany();
  await prisma.vacation.deleteMany();
  await prisma.client.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.review.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.openingHours.deleteMany();
  await prisma.user.deleteMany();
  await prisma.settings.deleteMany();

  // Admin (barbier)
  const email = process.env.ADMIN_EMAIL || "barber@lensbarbershop.fr";
  const password = process.env.ADMIN_PASSWORD || "ChangeMoi2026!";
  await prisma.user.create({
    data: {
      email,
      name: "Len",
      password: await bcrypt.hash(password, 10),
      role: "BARBER",
    },
  });

  // Réglages
  await prisma.settings.create({
    data: {
      id: 1,
      shopName: "Len's Barber Shop",
      phone: "09 80 67 44 20",
      address: "141 Route de Melun, 91250 Saintry-sur-Seine",
      slotStepMin: 15,
      bufferMin: 0,
      facebook: "https://www.facebook.com/people/Lens-Barber-Shop/",
      instagram: "",
    },
  });

  // Catégories
  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const created = await prisma.category.create({
      data: { name: c.name, slug: slug(c.name), icon: c.icon, order: c.order },
    });
    catMap[c.name] = created.id;
  }

  // Prestations
  let order = 0;
  for (const s of services) {
    await prisma.service.create({
      data: {
        name: s.name,
        slug: slug(`${s.cat}-${s.name}`),
        description: s.desc,
        priceCents: s.price,
        durationMin: s.dur,
        popular: !!s.popular,
        order: order++,
        categoryId: catMap[s.cat],
        image: IMAGES.categories[slug(s.cat)] || "",
      },
    });
  }

  // Horaires
  for (const h of hours) {
    await prisma.openingHours.create({
      data: {
        weekday: h.weekday,
        isOpen: h.isOpen,
        openMinutes: h.open,
        closeMinutes: h.close,
      },
    });
  }

  // Avis
  let ro = 0;
  for (const r of reviews) {
    await prisma.review.create({ data: { ...r, order: ro++ } });
  }

  // Galerie
  let go = 0;
  for (const g of IMAGES.gallery) {
    await prisma.gallery.create({
      data: { url: g.src, alt: g.alt, order: go++, featured: go === 1 },
    });
  }

  // Quelques RDV de démonstration (aujourd'hui / cette semaine)
  const anyService = await prisma.service.findFirst({ where: { name: "Coupe Homme" } });
  const anyService2 = await prisma.service.findFirst({ where: { name: "Coupe + Barbe classique" } });
  if (anyService && anyService2) {
    const demoClient = await prisma.client.create({
      data: { name: "Client Démo", phone: "0600000000", email: "demo@exemple.fr" },
    });
    const today = new Date();
    const mk = (dayOffset: number, hour: number, min: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + dayOffset);
      d.setHours(hour, min, 0, 0);
      return d;
    };
    const demos = [
      { s: anyService, start: mk(0, 11, 0), status: "CONFIRMED" },
      { s: anyService2, start: mk(0, 15, 30), status: "CONFIRMED" },
      { s: anyService, start: mk(1, 10, 0), status: "CONFIRMED" },
      { s: anyService2, start: mk(2, 16, 0), status: "PENDING" },
    ];
    for (const d of demos) {
      const end = new Date(d.start.getTime() + d.s.durationMin * 60000);
      await prisma.appointment.create({
        data: {
          start: d.start,
          end,
          status: d.status,
          priceCents: d.s.priceCents,
          serviceId: d.s.id,
          clientId: demoClient.id,
        },
      });
    }
    await prisma.notification.create({
      data: {
        type: "NEW_BOOKING",
        title: "Nouvelle réservation",
        message: "Client Démo — Coupe Homme aujourd'hui à 11h00",
      },
    });
  }

  console.log("✅ Seed terminé.");
  console.log(`   Admin : ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
