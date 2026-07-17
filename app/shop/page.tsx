import { Suspense } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ShopPageContent } from "@/features/shop/shop-page-content";
import { ProductGridSkeleton } from "@/components/ui/skeleton";

import { getSeoSettings } from "@/lib/supabase/queries";
import { generateMetadata as genMeta } from "@/lib/seo";

export async function generateMetadata() {
  const seo = await getSeoSettings("/shop");
  return genMeta({ data: seo });
}

export default function ShopPage() {
  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site">
          <h1 className="font-serif text-3xl md:text-4xl">Shop</h1>
          <p className="mt-3 text-text-muted">Discover our handcrafted collection</p>
          <Suspense fallback={<ProductGridSkeleton />}>
            <ShopPageContent />
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
}
