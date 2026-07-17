import Link from "next/link";
import { Package, MapPin, Heart, Settings } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Account",
  description: "Manage your Gopi Craft-Studio account.",
};

const accountLinks = [
  { label: "Orders", href: "/orders", icon: Package, description: "View order history and track shipments" },
  { label: "Track Order", href: "/track-order", icon: MapPin, description: "Track your order by order number" },
  { label: "Wishlist", href: "/wishlist", icon: Heart, description: "View your saved items" },
];

export default function AccountPage() {
  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site max-w-2xl">
          <h1 className="font-serif text-3xl">My Account</h1>
          <p className="mt-3 text-text-muted">
            Account authentication ready — connect your auth provider via props
          </p>

          <div className="mt-10 space-y-4">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 rounded-lg border border-border p-5 transition-colors hover:border-accent/30 hover:bg-secondary/30"
              >
                <link.icon className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <p className="font-medium">{link.label}</p>
                  <p className="text-sm text-text-muted">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-dashed border-border p-8 text-center">
            <Settings className="mx-auto h-8 w-8 text-text-light" />
            <p className="mt-4 text-sm text-text-muted">
              Sign in to access your profile, addresses, and order history.
            </p>
            <Button variant="accent" className="mt-4" disabled>
              Sign In
            </Button>
            <p className="mt-2 text-xs text-text-light">Auth integration point</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
