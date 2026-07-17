import Link from "next/link";
import type { FAQSection as FAQData } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";

interface FAQSectionProps {
  data: FAQData;
}

export function FAQSection({ data }: FAQSectionProps) {
  return (
    <section className="section-padding" aria-labelledby="faq-title">
      <div className="container-site max-w-3xl">
        <FadeIn>
          <SectionHeader
            id="faq-title"
            title={data.title}
            subtitle={data.subtitle}
          />
        </FadeIn>

        <FadeIn delay={0.2}>
          <Accordion type="single" collapsible className="mt-10">
            {data.items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {data.cta && (
            <p className="mt-8 text-center text-sm text-text-muted">
              Have more questions?{" "}
              <Link href={data.cta.href} className="font-medium text-accent hover:underline">
                {data.cta.label}
              </Link>
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
