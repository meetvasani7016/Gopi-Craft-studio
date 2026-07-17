"use client";

import Link from "next/link";
import Image from "next/image";
import type { HeroSection as HeroSectionData } from "@/types";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

interface HeroSectionProps {
  data: HeroSectionData;
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden" aria-label="Hero">
      <div className="absolute inset-0">
        <Image
          src={data.image.src}
          alt={data.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      <div className="container-site relative z-10 py-20">
        <div className="max-w-xl">
          <FadeIn delay={0.1}>
            <h1 className="font-serif text-4xl text-white whitespace-pre-line md:text-5xl lg:text-6xl">
              {data.headline}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mt-6 text-base leading-relaxed text-white/85 md:text-lg">
              {data.subheadline}
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild variant="accent" size="lg">
                <Link href={data.cta.href}>{data.cta.label}</Link>
              </Button>
              {data.secondaryCta && (
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  <Link href={data.secondaryCta.href}>{data.secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
