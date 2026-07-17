import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductDetail } from "@/features/product/product-detail";
import { ProductCard } from "@/components/shared/product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/supabase/queries";
import { generateProductMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/motion/fade-in";

export const revalidate = 3600; // Enable ISR caching

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return generateProductMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { label: "Shop", href: "/shop" },
              { label: product.category.name, href: `/categories/${product.category.slug}` },
              { label: product.name },
            ]}
          />
          <ProductDetail product={product} />

          {related.length > 0 && (
            <section className="mt-20" aria-labelledby="related-products">
              <FadeIn>
                <h2 id="related-products" className="font-serif text-2xl">You May Also Like</h2>
              </FadeIn>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
