import { getProducts } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
import { SectionCTA } from "@/components/ui/SectionCTA";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCollection } from "@/components/home/HomeCollection";
import { TaskChooser } from "@/components/home/TaskChooser";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { SectionsPreview } from "@/components/home/SectionsPreview";
import { DoubleDutchPreview } from "@/components/home/DoubleDutchPreview";
import { EducationPreview } from "@/components/home/EducationPreview";
import { HomeFAQ } from "@/components/home/HomeFAQ";
export const metadata = pageMetadata(
  "Скакалки и экспертный подбор",
  "Профессиональный инвентарь DDRu, помощь тренерам и подбор скакалок под вашу задачу. От первых тренировок до командного Double Dutch.",
  "/",
);

export default function HomePage() {
  const products = getProducts();
  return (
    <>
      <HomeHero products={products} />
      <HomeCollection products={products} />
      <TaskChooser />
      <ExpertiseSection />
      <SectionsPreview />
      <DoubleDutchPreview />
      <EducationPreview />
      <HomeFAQ />
      <SectionCTA />
    </>
  );
}
