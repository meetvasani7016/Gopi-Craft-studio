import { MainLayout } from "@/components/layout/main-layout";
import { CheckoutContent } from "@/features/checkout/checkout-content";

export const metadata = {
  title: "Checkout",
  description: "Review your cart and proceed to checkout.",
};

export default function CheckoutPage() {
  return (
    <MainLayout>
      <CheckoutContent />
    </MainLayout>
  );
}
