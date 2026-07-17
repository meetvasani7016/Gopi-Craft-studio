import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { getPolicyBySlug, getPolicies } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";
import { generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn } from "@/components/motion/fade-in";

export const revalidate = 3600; // Enable ISR caching

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = await getPolicyBySlug(slug);
  if (!policy) return { title: "Policy Not Found" };
  return genMeta({ data: policy.seo });
}

export async function generateStaticParams() {
  const list = await getPolicies();
  return list.map((p) => ({ slug: p.slug }));
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = await getPolicyBySlug(slug);
  if (!policy) notFound();

  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site max-w-3xl">
          <FadeIn>
            <h1 className="font-serif text-3xl md:text-4xl">{policy.title}</h1>
            <p className="mt-3 text-sm text-text-muted">
              Last updated: {formatDate(policy.lastUpdated)}
            </p>
            <div className="mt-10 prose prose-neutral max-w-none leading-relaxed text-text-muted">
              <p>{policy.content}</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </MainLayout>
  );
}
