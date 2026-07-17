import { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gopicraftstudio.com";
  
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/shop",
    "/blog",
    "/faq",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const dynamicPaths: any[] = [];
  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts()
    ]);

    categories.forEach((c) => {
      dynamicPaths.push({
        url: `${baseUrl}/categories/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    });

    products.forEach((p) => {
      dynamicPaths.push({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    });
  } catch (err) {
    console.error("Failed to generate dynamic sitemap paths:", err);
  }

  return [...staticPaths, ...dynamicPaths];
}
