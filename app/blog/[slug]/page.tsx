import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { getBlogBySlug } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";
import { generateMetadata as genMeta } from "@/lib/seo";
import { FadeIn } from "@/components/motion/fade-in";

export const revalidate = 3600; // Enable ISR caching

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return genMeta({ data: post.seo });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <MainLayout>
      <article className="pt-20">
        <div className="relative aspect-[21/9] max-h-[50vh]">
          <Image
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="container-site max-w-3xl section-padding">
          <FadeIn>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <p className="mt-6 text-xs uppercase tracking-wider text-accent">{post.category}</p>
            <h1 className="mt-3 font-serif text-3xl md:text-4xl">{post.title}</h1>
            <p className="mt-4 text-sm text-text-muted">
              {formatDate(post.publishedAt)} · {post.readTime} min read · {post.author}
            </p>

            <div className="mt-10 prose prose-neutral max-w-none">
              <p className="text-lg leading-relaxed text-text-muted">{post.excerpt}</p>
              <p className="mt-6 leading-relaxed">{post.content}</p>
            </div>
          </FadeIn>
        </div>
      </article>
    </MainLayout>
  );
}
