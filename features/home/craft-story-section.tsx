import Link from "next/link";
import Image from "next/image";
import type { CraftStorySection as CraftStoryData } from "@/types";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";

interface CraftStorySectionProps {
  data: CraftStoryData;
}

export function CraftStorySection({ data }: CraftStorySectionProps) {
  return (
    <section className="section-padding" aria-labelledby="craft-story-title">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn direction="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={data.image.src}
                alt={data.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <SectionHeader
              id="craft-story-title"
              title={data.title}
              subtitle={data.subtitle}
              align="left"
            />
            <p className="mt-6 text-base leading-relaxed text-text-muted">{data.content}</p>

            {data.stats && (
              <div className="mt-8 grid grid-cols-3 gap-6">
                {data.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-2xl text-accent md:text-3xl">{stat.value}</p>
                    <p className="mt-1 text-xs text-text-muted uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            <Button asChild variant="outline" className="mt-8">
              <Link href={data.cta.href}>{data.cta.label}</Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
