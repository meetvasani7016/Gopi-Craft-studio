"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
} from "lucide-react";
import { siteConfig, navigationConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useScrollPosition } from "@/hooks/use-media-query";

interface HeaderProps {
  navItems?: { label: string; href: string }[];
  logoText?: string;
  announcementText?: string;
  announcementVisible?: boolean;
}

export function Header({
  navItems,
  logoText,
  announcementText,
  announcementVisible,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const scrollY = useScrollPosition();
  const { cart } = useCart();
  const { items: wishlistItems } = useWishlist();

  const isScrolled = scrollY > 20;
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || !isHome
          ? "bg-primary/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent",
        isHome && !isScrolled && "text-white"
      )}
      role="banner"
    >
      {announcementVisible && announcementText && (
        <div className="bg-accent text-white text-center py-2 px-4 text-xs font-medium tracking-wide">
          {announcementText}
        </div>
      )}
      <div className="container-site">
        <div className="flex h-16 items-center justify-between md:h-18">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-lg tracking-wide md:text-xl"
            aria-label={`${logoText || siteConfig.name} - Home`}
          >
            {logoText || siteConfig.name}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {(navItems || navigationConfig.mainNav).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors link-underline",
                  pathname === item.href
                    ? "text-accent"
                    : isHome && !isScrolled
                      ? "text-white/90 hover:text-white"
                      : "text-text-muted hover:text-text"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="flex h-11 w-11 items-center justify-center transition-colors hover:text-accent"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/wishlist"
              className="relative flex h-11 w-11 items-center justify-center transition-colors hover:text-accent"
              aria-label={`Wishlist${wishlistItems.length > 0 ? `, ${wishlistItems.length} items` : ""}`}
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center transition-colors hover:text-accent"
              aria-label={`Cart${cart.itemCount > 0 ? `, ${cart.itemCount} items` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {cart.itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className="hidden sm:flex h-11 w-11 items-center justify-center transition-colors hover:text-accent"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav
          className="border-t border-border bg-primary md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="container-site py-4 space-y-1">
            {(navItems || navigationConfig.mainNav).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block py-3 text-base font-medium transition-colors",
                  pathname === item.href ? "text-accent" : "text-text hover:text-accent"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base font-medium text-text hover:text-accent"
            >
              Account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
