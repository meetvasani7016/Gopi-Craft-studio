import { MainLayout } from "@/components/layout/main-layout";
import { WishlistContent } from "@/features/wishlist/wishlist-content";

export const metadata = {
  title: "Wishlist",
  description: "Your saved items at Gopi Craft-Studio.",
};

export default function WishlistPage() {
  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site">
          <h1 className="font-serif text-3xl md:text-4xl">Wishlist</h1>
          <div className="mt-10">
            <WishlistContent />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
