import type { SEOData } from "@/types";
import { siteConfig } from "@/config/site";

interface SEOHeadProps {
  data: SEOData;
}

export function generateMetadata({ data }: SEOHeadProps) {
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraph: {
      title: data.title,
      description: data.description,
      url: data.canonical || siteConfig.url,
      siteName: siteConfig.name,
      images: data.ogImage ? [{ url: data.ogImage }] : [],
      locale: "en_IN",
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: data.title,
      description: data.description,
      images: data.ogImage ? [data.ogImage] : [],
    },
    alternates: {
      canonical: data.canonical || siteConfig.url,
    },
  };
}

export function generateProductMetadata(product: {
  name: string;
  shortDescription: string;
  images: { src: string }[];
  slug: string;
  price: { amount: number };
}) {
  return generateMetadata({
    data: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.shortDescription,
      ogImage: product.images[0]?.src,
      canonical: `${siteConfig.url}/products/${product.slug}`,
      keywords: [],
    }
  });
}

export function generateCategoryMetadata(category: {
  name: string;
  description: string;
  image: { src: string };
  slug: string;
  seo: SEOData;
}) {
  return generateMetadata({
    data: {
      title: category.seo.title || `${category.name} | ${siteConfig.name}`,
      description: category.seo.description || category.description,
      ogImage: category.image.src,
      canonical: `${siteConfig.url}/categories/${category.slug}`,
      keywords: category.seo.keywords || [],
    }
  });
}
