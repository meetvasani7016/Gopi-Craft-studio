"use client";

import { useState } from "react";
import type { NewsletterSection as NewsletterData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/motion/fade-in";

interface NewsletterSectionProps {
  data: NewsletterData;
}

export function NewsletterSection({ data }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="section-padding bg-text text-primary" aria-labelledby="newsletter-title">
      <div className="container-site max-w-2xl text-center">
        <FadeIn>
          <h2 id="newsletter-title" className="font-serif text-2xl md:text-3xl">
            {data.title}
          </h2>
          <p className="mt-4 text-sm text-white/70 md:text-base">{data.subtitle}</p>

          {status === "success" ? (
            <p className="mt-8 text-accent-light" role="status">
              Thank you for subscribing! Welcome to our circle.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0">
              <Input
                type="email"
                name="email"
                placeholder={data.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-md sm:rounded-r-none border-white/20 bg-white/10 text-white placeholder:text-white/50"
                aria-label="Email address"
              />
              <Button
                type="submit"
                variant="accent"
                loading={status === "loading"}
                className="sm:rounded-l-none"
              >
                {data.buttonLabel}
              </Button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
