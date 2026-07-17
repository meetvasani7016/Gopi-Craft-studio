"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn } from "@/components/motion/fade-in";
import { submitContactForm } from "@/lib/supabase/actions";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    try {
      const res = await submitContactForm(data);
      if (res.success) {
        setSubmitted(true);
        reset();
      } else {
        alert("Failed to submit contact request: " + res.error);
      }
    } catch {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 section-padding">
      <div className="container-site">
        <FadeIn>
          <h1 className="font-serif text-3xl md:text-4xl text-center">Contact Us</h1>
          <p className="mt-3 text-center text-text-muted max-w-lg mx-auto">
            We&apos;d love to hear from you. Reach out for custom orders, bulk inquiries, or any questions.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 max-w-5xl mx-auto">
          <FadeIn direction="left">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium">Phone / WhatsApp</p>
                  <a href={`tel:${siteConfig.phone}`} className="text-sm text-text-muted hover:text-accent">
                    {siteConfig.whatsapp.display}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-sm text-text-muted hover:text-accent">
                    {siteConfig.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium">Studio</p>
                  <p className="text-sm text-text-muted">
                    {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.pincode}
                  </p>
                </div>
              </div>
              <WhatsAppButton variant="inline" />
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            {submitted ? (
              <div className="rounded-lg border border-border p-8 text-center" role="status">
                <p className="font-serif text-lg">Thank you!</p>
                <p className="mt-2 text-sm text-text-muted">We&apos;ll get back to you within 24 hours.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Name" {...register("name")} error={errors.name?.message} />
                <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
                <Input label="Phone (Optional)" type="tel" {...register("phone")} />
                <Input label="Subject" {...register("subject")} error={errors.subject?.message} />
                <Textarea label="Message" {...register("message")} error={errors.message?.message} />
                <Button type="submit" variant="default" size="lg" className="w-full" loading={loading}>
                  Send Message
                </Button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
