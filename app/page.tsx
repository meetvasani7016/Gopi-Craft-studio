import { MainLayout } from "@/components/layout/main-layout";
import { HomeSections } from "@/features/home/home-sections";
import { getHomepageSections, getSeoSettings } from "@/lib/supabase/queries";
import { generateMetadata as genMeta } from "@/lib/seo";

export const revalidate = 3600; // Enable ISR caching

export async function generateMetadata() {
  const seo = await getSeoSettings("/");
  return genMeta({ data: seo });
}

export default async function HomePage() {
  const sections = await getHomepageSections();

  return (
    <MainLayout>
      <HomeSections sections={sections} />
    </MainLayout>
  );
}
