import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductGridSection as ProductGridData } from "@/types";
import { ProductCard } from "@/components/shared/product-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";

interface ProductGridSectionProps {
  data: ProductGridData;
}

export function ProductGridSection({ data }: ProductGridSectionProps) {
  return (
    <section className="section-padding bg-secondary/50" aria-labelledby={`section-${data.title.toLowerCase().replace(/\s/g, "-")}`}>
      <div className="container-site">
        <FadeIn>
          <SectionHeader
            id={`section-${data.title.toLowerCase().replace(/\s/g, "-")}`}
            title={data.title}
            subtitle={data.subtitle}
            action={
              data.cta ? (
                <Link
                  href={data.cta.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all"
                >
                  {data.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : undefined
            }
          />
        </FadeIn>

        <StaggerContainer className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {data.products.map((product, i) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} priority={i < 4} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
