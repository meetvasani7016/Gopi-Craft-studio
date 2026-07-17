import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { siteConfig, navigationConfig } from "@/config/site";
import { getWhatsAppUrl } from "@/lib/utils";

interface FooterProps {
  footerLinks?: {
    shop: { label: string; href: string }[];
    company: { label: string; href: string }[];
    support: { label: string; href: string }[];
  };
  logoText?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  instagramHandle?: string;
  phone?: string;
  email?: string;
}

export function Footer({
  footerLinks,
  logoText,
  whatsappNumber = siteConfig.whatsapp.number,
  whatsappMessage = siteConfig.whatsapp.message,
  instagramHandle = siteConfig.instagram.handle,
  phone = siteConfig.phone,
  email = siteConfig.email,
}: FooterProps) {
  const whatsappUrl = getWhatsAppUrl(whatsappNumber, whatsappMessage);
  const instagramUrl = `https://instagram.com/${instagramHandle}`;

  return (
    <footer className="border-t border-border bg-secondary/30" role="contentinfo">
      <div className="container-site section-padding">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-xl">
              {logoText || siteConfig.name}
            </Link>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              {siteConfig.tagline}
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors"
                aria-label={`Follow us on Instagram @${instagramHandle}`}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-[#25D366] transition-colors"
                aria-label={`Chat on WhatsApp ${siteConfig.whatsapp.display}`}
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-3">
              {(footerLinks?.shop || navigationConfig.footerNav.shop).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              {(footerLinks?.company || navigationConfig.footerNav.company).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-3">
              {(footerLinks?.support || navigationConfig.footerNav.support).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 text-sm text-text-muted">
              <p>
                <a href={`tel:${phone}`} className="hover:text-text transition-colors">
                  {phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${email}`} className="hover:text-text transition-colors">
                  {email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-text-light">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/policies/privacy" className="text-xs text-text-light hover:text-text transition-colors">
              Privacy
            </Link>
            <Link href="/policies/terms" className="text-xs text-text-light hover:text-text transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
