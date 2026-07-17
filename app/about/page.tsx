import Image from "next/image";
import Link from "next/link";
import { HandHeart, Users, Gem, ShieldCheck } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { CraftStorySection } from "@/features/home/craft-story-section";
import { aboutPageData } from "@/data/content";
import { generateMetadata as genMeta } from "@/lib/seo";
import { getSeoSettings } from "@/lib/supabase/queries";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export const revalidate = 3600; // Enable ISR caching

export async function generateMetadata() {
  const seo = await getSeoSettings("/about");
  return genMeta({ data: seo });
}

const iconMap = {
  "hand-heart": HandHeart,
  users: Users,
  gem: Gem,
  "shield-check": ShieldCheck,
};

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={aboutPageData.hero.image.src}
            alt={aboutPageData.hero.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container-site relative z-10 py-20">
          <FadeIn>
            <h1 className="font-serif text-4xl text-white whitespace-pre-line md:text-5xl max-w-xl">
              {aboutPageData.hero.title}
            </h1>
            <p className="mt-6 text-white/80 max-w-lg leading-relaxed">
              {aboutPageData.hero.subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-site max-w-3xl text-center">
          <FadeIn>
            <h2 className="font-serif text-2xl md:text-3xl">{aboutPageData.mission.title}</h2>
            <p className="mt-6 text-text-muted leading-relaxed">{aboutPageData.mission.content}</p>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/50">
        <div className="container-site">
          <FadeIn>
            <h2 className="font-serif text-2xl text-center">Our Values</h2>
          </FadeIn>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {aboutPageData.values.map((value) => {
              const Icon = iconMap[value.icon as keyof typeof iconMap] || Gem;
              return (
                <FadeIn key={value.title}>
                  <div className="text-center">
                    <Icon className="mx-auto h-8 w-8 text-accent" />
                    <h3 className="mt-4 font-serif text-lg">{value.title}</h3>
                    <p className="mt-2 text-sm text-text-muted">{value.description}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <CraftStorySection data={aboutPageData.craftStory} />
    </MainLayout>
  );
}
