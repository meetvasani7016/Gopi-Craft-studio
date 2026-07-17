import type { HomeSection } from "@/types";
import { HeroSection } from "./hero-section";
import { FeaturedCategoriesSection } from "./featured-categories-section";
import { ProductGridSection } from "./product-grid-section";
import { CraftStorySection } from "./craft-story-section";
import { CustomizationSection } from "./customization-section";
import { InstagramSection } from "./instagram-section";
import { TestimonialsSection } from "./testimonials-section";
import { FAQSection } from "./faq-section";
import { NewsletterSection } from "./newsletter-section";

interface HomeSectionsProps {
  sections: HomeSection[];
}

export function HomeSections({ sections }: HomeSectionsProps) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={`${section.type}-${index}`} data={section} />;
          case "featured-categories":
            return <FeaturedCategoriesSection key={`${section.type}-${index}`} data={section} />;
          case "product-grid":
            return <ProductGridSection key={`${section.type}-${index}`} data={section} />;
          case "craft-story":
            return <CraftStorySection key={`${section.type}-${index}`} data={section} />;
          case "customization":
            return <CustomizationSection key={`${section.type}-${index}`} data={section} />;
          case "instagram":
            return <InstagramSection key={`${section.type}-${index}`} data={section} />;
          case "testimonials":
            return <TestimonialsSection key={`${section.type}-${index}`} data={section} />;
          case "faq":
            return <FAQSection key={`${section.type}-${index}`} data={section} />;
          case "newsletter":
            return <NewsletterSection key={`${section.type}-${index}`} data={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
