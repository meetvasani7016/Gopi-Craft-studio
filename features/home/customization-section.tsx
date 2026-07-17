import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import type { CustomizationSection as CustomizationData } from "@/types";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";

interface CustomizationSectionProps {
  data: CustomizationData;
}

export function CustomizationSection({ data }: CustomizationSectionProps) {
  return (
    <section className="section-padding bg-secondary/50" aria-labelledby="customization-title">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn direction="right">
            <SectionHeader
              id="customization-title"
              title={data.title}
              subtitle={data.subtitle}
              align="left"
            />
            <p className="mt-6 text-base leading-relaxed text-text-muted">{data.description}</p>

            <ul className="mt-8 space-y-3">
              {data.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button asChild variant="accent" className="mt-8">
              <Link href={data.cta.href}>{data.cta.label}</Link>
            </Button>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
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
        </div>
      </div>
    </section>
  );
}
