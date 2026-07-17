import { MainLayout } from "@/components/layout/main-layout";
import { getFaqs, getSeoSettings } from "@/lib/supabase/queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/motion/fade-in";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

import { generateMetadata as genMeta } from "@/lib/seo";

export const revalidate = 3600; // Enable ISR caching

export async function generateMetadata() {
  const seo = await getSeoSettings("/faq");
  return genMeta({ data: seo });
}

export default async function FAQPage() {
  const faqsList = await getFaqs();
  const categories = [...new Set(faqsList.map((f) => f.category || "General"))];

  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site max-w-3xl">
          <FadeIn>
            <h1 className="font-serif text-3xl md:text-4xl text-center">FAQ</h1>
            <p className="mt-3 text-center text-text-muted">
              Everything you need to know about shopping with us
            </p>
          </FadeIn>

          {categories.map((category) => {
            const items = faqsList.filter((f) => (f.category || "General") === category);
            return (
              <FadeIn key={category} delay={0.1}>
                <div className="mt-12">
                  <h2 className="font-serif text-xl mb-6">{category}</h2>
                  <Accordion type="single" collapsible>
                    {items.map((item) => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </FadeIn>
            );
          })}

          <FadeIn delay={0.3}>
            <div className="mt-16 text-center">
              <p className="text-text-muted">Still have questions?</p>
              <div className="mt-4">
                <WhatsAppButton variant="inline" message="Hi, I have a question about your products." />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </MainLayout>
  );
}
