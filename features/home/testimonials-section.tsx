import { Star } from "lucide-react";
import type { TestimonialsSection as TestimonialsData } from "@/types";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";

interface TestimonialsSectionProps {
  data: TestimonialsData;
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section className="section-padding bg-secondary/50" aria-labelledby="testimonials-title">
      <div className="container-site">
        <FadeIn>
          <SectionHeader
            id="testimonials-title"
            title={data.title}
            subtitle={data.subtitle}
          />
        </FadeIn>

        <StaggerContainer className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {data.testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <blockquote className="flex h-full flex-col rounded-lg border border-border bg-primary p-6">
                <div className="flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < testimonial.rating ? "fill-accent text-accent" : "text-border"}`}
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <footer className="mt-4 border-t border-border-light pt-4">
                  <cite className="not-italic">
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-text-light">{testimonial.location}</p>
                    {testimonial.productName && (
                      <p className="mt-1 text-xs text-accent">{testimonial.productName}</p>
                    )}
                  </cite>
                </footer>
              </blockquote>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
