import { MainLayout } from "@/components/layout/main-layout";
import { CartContent } from "@/features/cart/cart-content";

export const metadata = {
  title: "Shopping Cart",
  description: "Review your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site">
          <h1 className="font-serif text-3xl md:text-4xl">Your Cart</h1>
          <div className="mt-10">
            <CartContent />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
