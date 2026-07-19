/**
 * Seed IDEMPOTENT pour la PRODUCTION.
 * - Ne supprime jamais de données (contrairement à seed.ts qui fait un reset).
 * - Ne remplit le catalogue (catégories, prestations, horaires, avis, réglages,
 *   compte barbier) QUE si la base est vide.
 * - N'ajoute AUCUN rendez-vous de démonstration : l'agenda démarre vierge,
 *   prêt pour les vrais clients.
 * Peut être exécuté à chaque déploiement sans risque.
 */
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

const categories = [
  { name: "Coupe", icon: "scissors", order: 1 },
  { name: "Barbe", icon: "razor", order: 2 },
  { name: "Transformation", icon: "sparkles", order: 3 },
  { name: "Enfants", icon: "child", order: 4 },
  { name: "Coloration", icon: "palette", order: 5 },
  { name: "Soins", icon: "droplet", order: 6 },
  { name: "Femmes", icon: "flower", order: 7 },
];

type Svc = { cat: string; name: string; price: number; dur: number; desc: string; popular?: boolean };
const services: Svc[] = [
  { cat: "Coupe", name: "Coupe Homme", price: 2200, dur: 20, popular: true, desc: "Coupe personnalisée, dégradé ou classique, finitions au rasoir et coiffage." },
  { cat: "Coupe", name: "Coupe + Barbe classique", price: 3050, dur: 30, popular: true, desc: "La formule complète : coupe sur-mesure et taille de barbe soignée." },
  { cat: "Coupe", name: "Coupe cheveux longs", price: 2500, dur: 30, desc: "Coupe et mise en forme pour cheveux mi-longs à longs, toutes textures." },
  { cat: "Coupe", name: "Contour / Retouche", price: 800, dur: 10, desc: "Reprise des contours et de la nuque entre deux coupes." },
  { cat: "Barbe", name: "Barbe sculptée", price: 1550, dur: 15, desc: "Taille et dessin de la barbe à la tondeuse et au rasoir." },
  { cat: "Barbe", name: "Barbe complète", price: 2350, dur: 20, desc: "Taille, contours nets, serviette chaude et soin hydratant." },
  { cat: "Barbe", name: "Rasage traditionnel", price: 1800, dur: 25, desc: "Rasage au coupe-chou, serviette chaude et huile apaisante." },
  { cat: "Transformation", name: "Coupe transformation", price: 2500, dur: 30, desc: "Changement de style complet avec conseil personnalisé." },
  { cat: "Transformation", name: "Défrisage", price: 2200, dur: 45, desc: "Défrisage professionnel pour un rendu lisse et durable." },
  { cat: "Enfants", name: "Enfant garçon -10 ans", price: 1600, dur: 20, popular: true, desc: "Coupe adaptée aux plus jeunes, dans une ambiance détendue." },
  { cat: "Enfants", name: "Enfant fille -10 ans", price: 1600, dur: 30, desc: "Coupe et coiffage tout en douceur pour les petites." },
  { cat: "Coloration", name: "Coloration / décoloration", price: 2800, dur: 45, desc: "Coloration ou décoloration sur-mesure, produits professionnels." },
  { cat: "Coloration", name: "Coloration barbe", price: 1500, dur: 20, desc: "Uniformisation et intensification de la couleur de la barbe." },
  { cat: "Soins", name: "Shampoing", price: 400, dur: 5, desc: "Shampoing lavant et rafraîchissant." },
  { cat: "Soins", name: "Soin visage & masque", price: 1200, dur: 15, desc: "Nettoyage, gommage et masque pour une peau nette." },
  { cat: "Femmes", name: "Brushing / coiffage", price: 2500, dur: 30, desc: "Mise en forme et brushing pour un rendu impeccable." },
  { cat: "Femmes", name: "Coupe femme", price: 3500, dur: 45, desc: "Coupe personnalisée avec shampoing, soin et coiffage." },
  { cat: "Femmes", name: "Balayage", price: 8000, dur: 120, desc: "Balayage lumineux et naturel, réalisé main levée." },
  { cat: "Femmes", name: "Lissage brésilien", price: 9000, dur: 120, desc: "Lissage longue durée pour des cheveux souples et disciplinés." },
  { cat: "Femmes", name: "Soin kératine", price: 6000, dur: 90, desc: "Soin réparateur en profondeur à la kératine." },
];

const hours = [
  { weekday: 1, isOpen: true, open: 9 * 60, close: 19 * 60 },
  { weekday: 2, isOpen: true, open: 9 * 60, close: 19 * 60 },
  { weekday: 3, isOpen: true, open: 10 * 60, close: 20 * 60 },
  { weekday: 4, isOpen: true, open: 9 * 60, close: 19 * 60 },
  { weekday: 5, isOpen: true, open: 9 * 60, close: 19 * 60 },
  { weekday: 6, isOpen: true, open: 9 * 60 + 30, close: 19 * 60 },
  { weekday: 0, isOpen: false, open: 0, close: 0 },
];

const reviews = [
  { author: "Alexis D.", rating: 5, text: "Un grand merci à Cécile et Valente pour leur accueil, leur gentillesse et leur professionnalisme. Mon fils et moi-même sommes ravis de notre coupe de cheveux.", source: "Avis vérifié" },
  { author: "Maxime B.", rating: 5, text: "Cela fait 2 fois que je vais chez ce coiffeur et je suis toujours très content du résultat, le coiffeur est très à l'écoute. Le salon est très propre.", source: "Avis vérifié" },
  { author: "Madeleine Y.", rating: 5, text: "Très bons coiffeurs, Valente et Cécile toujours à l'écoute des clients. D'une extrême gentillesse, je conseille.", source: "Avis vérifié" },
  { author: "Andrea Q.", rating: 5, text: "Un grand merci à Cécile, qui a su m'écouter et me conseiller au mieux pour la réalisation de ma couleur qui est super belle.", source: "Avis vérifié" },
];

async function main() {
  const existing = await prisma.category.count();
  if (existing > 0) {
    console.log(`ℹ️  Base déjà initialisée (${existing} catégories). Seed ignoré.`);
    return;
  }
  console.log("🌱 Initialisation de la base (première fois)…");

  const email = process.env.ADMIN_EMAIL || "barber@lensbarbershop.fr";
  const password = process.env.ADMIN_PASSWORD || "ChangeMoi2026!";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Len", password: await bcrypt.hash(password, 10), role: "BARBER" },
  });

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
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

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const created = await prisma.category.create({
      data: { name: c.name, slug: slug(c.name), icon: c.icon, order: c.order },
    });
    catMap[c.name] = created.id;
  }

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

  for (const h of hours) {
    await prisma.openingHours.upsert({
      where: { weekday: h.weekday },
      update: {},
      create: { weekday: h.weekday, isOpen: h.isOpen, openMinutes: h.open, closeMinutes: h.close },
    });
  }

  let ro = 0;
  for (const r of reviews) {
    await prisma.review.create({ data: { ...r, order: ro++ } });
  }

  let go = 0;
  for (const g of IMAGES.gallery) {
    await prisma.gallery.create({ data: { url: g.src, alt: g.alt, order: go++, featured: go === 1 } });
  }

  console.log("✅ Base initialisée (catalogue prêt, agenda vierge).");
  console.log(`   Compte barbier : ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
