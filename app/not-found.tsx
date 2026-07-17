import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site text-center py-20">
          <FadeIn>
            <p className="font-serif text-8xl text-accent/20">404</p>
            <h1 className="mt-4 font-serif text-2xl md:text-3xl">Page Not Found</h1>
            <p className="mt-4 text-text-muted max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild variant="accent" size="lg">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/shop">Browse Shop</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </MainLayout>
  );
}
