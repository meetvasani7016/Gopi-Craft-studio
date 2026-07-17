import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gopicraftstudio.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/admin/login", "/admin/setup-wizard"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
