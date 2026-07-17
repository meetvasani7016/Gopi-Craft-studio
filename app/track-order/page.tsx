import { MainLayout } from "@/components/layout/main-layout";
import { TrackOrderContent } from "@/features/track-order/track-order-content";

export const metadata = {
  title: "Track Order",
  description: "Track the status of your handcrafted orders in real-time.",
};

export default function TrackOrderPage() {
  return (
    <MainLayout>
      <TrackOrderContent />
    </MainLayout>
  );
}
