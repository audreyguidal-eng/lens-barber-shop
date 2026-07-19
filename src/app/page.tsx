import { prisma } from "@/lib/prisma";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services, type CategoryDTO } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { Gallery } from "@/components/sections/Gallery";
import { Salon } from "@/components/sections/Salon";
import { Reviews, type ReviewDTO } from "@/components/sections/Reviews";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { IMAGES } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categoriesRaw, reviewsRaw, galleryRaw] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        services: { where: { active: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.review.findMany({ orderBy: { order: "asc" } }),
    prisma.gallery.findMany({ orderBy: { order: "asc" } }),
  ]);

  const categories: CategoryDTO[] = categoriesRaw
    .filter((c) => c.services.length > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      services: c.services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        priceCents: s.priceCents,
        durationMin: s.durationMin,
        popular: s.popular,
      })),
    }));

  const reviews: ReviewDTO[] = reviewsRaw.map((r) => ({
    id: r.id,
    author: r.author,
    rating: r.rating,
    text: r.text,
    source: r.source,
  }));

  const images =
    galleryRaw.length > 0
      ? galleryRaw.map((g, i) => ({ src: g.url, alt: g.alt, tall: i % 3 === 1 }))
      : IMAGES.gallery;

  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services categories={categories} />
        <WhyUs />
        <Salon />
        <Gallery images={images} />
        <Reviews reviews={reviews} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
