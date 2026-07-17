import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import type { InstagramSection as InstagramData } from "@/types";
import { siteConfig } from "@/config/site";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";

interface InstagramSectionProps {
  data: InstagramData;
}

export function InstagramSection({ data }: InstagramSectionProps) {
  return (
    <section className="section-padding" aria-labelledby="instagram-title">
      <div className="container-site">
        <FadeIn>
          <SectionHeader
            id="instagram-title"
            title={data.title}
            subtitle={data.subtitle}
            action={
              <Link
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent"
              >
                <Instagram className="h-4 w-4" />
                @{data.handle}
              </Link>
            }
          />
        </FadeIn>

        <StaggerContainer className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 md:gap-3">
          {data.posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-md"
              >
                <Image
                  src={post.image.src}
                  alt={post.image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <Instagram className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
