import { MainLayout } from "@/components/layout/main-layout";
import { CategoryCard } from "@/components/shared/category-card";
import { getCategories } from "@/lib/supabase/queries";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";

export const metadata = {
  title: "Categories",
  description: "Browse our curated collections of handcrafted Indian decor and artisan gifts.",
};

export default async function CategoriesPage() {
  const categoriesList = await getCategories();

  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site">
          <FadeIn>
            <h1 className="font-serif text-3xl md:text-4xl">Categories</h1>
            <p className="mt-3 text-text-muted">Explore our curated collections</p>
          </FadeIn>

          <StaggerContainer className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 md:gap-6">
            {categoriesList.map((category) => (
              <StaggerItem key={category.id}>
                <CategoryCard category={category} size="large" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </MainLayout>
  );
}
