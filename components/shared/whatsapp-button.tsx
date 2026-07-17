"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getWhatsAppUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  number?: string;
  message?: string;
  productUrl?: string;
  className?: string;
  variant?: "floating" | "inline";
}

export function WhatsAppButton({
  number = siteConfig.whatsapp.number,
  message = siteConfig.whatsapp.message,
  productUrl,
  className,
  variant = "floating",
}: WhatsAppButtonProps) {
  const url = getWhatsAppUrl(number, message, productUrl);

  if (variant === "floating") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
          className
        )}
        aria-label={`Chat on WhatsApp: ${siteConfig.whatsapp.display}`}
      >
        <MessageCircle className="h-6 w-6" fill="currentColor" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#20BD5A]",
        className
      )}
      aria-label={`Chat on WhatsApp: ${siteConfig.whatsapp.display}`}
    >
      <MessageCircle className="h-4 w-4" fill="currentColor" />
      Chat on WhatsApp
    </a>
  );
}
