import Link from "next/link";
import type { FeaturedCategoriesSection as FeaturedCategoriesData } from "@/types";
import { CategoryCard } from "@/components/shared/category-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";

interface FeaturedCategoriesSectionProps {
  data: FeaturedCategoriesData;
}

export function FeaturedCategoriesSection({ data }: FeaturedCategoriesSectionProps) {
  return (
    <section className="section-padding" aria-labelledby="featured-categories-title">
      <div className="container-site">
        <FadeIn>
          <SectionHeader
            id="featured-categories-title"
            title={data.title}
            subtitle={data.subtitle}
          />
        </FadeIn>

        <StaggerContainer className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {data.categories.map((category) => (
            <StaggerItem key={category.id}>
              <CategoryCard category={category} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
