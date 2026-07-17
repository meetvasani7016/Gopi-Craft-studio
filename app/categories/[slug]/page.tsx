import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductCard } from "@/components/shared/product-card";
import { CategoryCard } from "@/components/shared/category-card";
import { getCategoryBySlug, getProducts, getCategories } from "@/lib/supabase/queries";
import { generateCategoryMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/motion/fade-in";

export const revalidate = 3600; // Enable ISR caching

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return generateCategoryMetadata(category);
}

export async function generateStaticParams() {
  const categoriesList = await getCategories();
  return categoriesList.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const allProducts = await getProducts();
  const products = allProducts.filter((p) => p.category.slug === slug);

  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site">
          <Breadcrumbs items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />

          <FadeIn>
            <div className="max-w-2xl">
              <h1 className="font-serif text-3xl md:text-4xl">{category.name}</h1>
              <p className="mt-4 text-text-muted leading-relaxed">{category.description}</p>
            </div>
          </FadeIn>

          <div className="mt-10">
            <p className="text-sm text-text-muted mb-6">{products.length} products</p>
            {products.length === 0 ? (
              <p className="text-center py-16 text-text-muted">No products in this category yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
