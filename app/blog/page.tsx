import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import { getBlogPosts } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";

export const revalidate = 3600; // Enable ISR caching

export const metadata = {
  title: "Blog",
  description: "Stories, guides, and inspiration from Gopi Craft-Studio.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site">
          <FadeIn>
            <h1 className="font-serif text-3xl md:text-4xl">Blog</h1>
            <p className="mt-3 text-text-muted">Stories, guides, and craft inspiration</p>
          </FadeIn>

          <StaggerContainer className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={post.coverImage.src}
                      alt={post.coverImage.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wider text-accent">{post.category}</p>
                    <h2 className="mt-2 font-serif text-lg group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-text-muted line-clamp-2">{post.excerpt}</p>
                    <p className="mt-3 text-xs text-text-light">
                      {formatDate(post.publishedAt)} · {post.readTime} min read
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </MainLayout>
  );
}
