import { Check } from "lucide-react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { getOrders } from "@/lib/supabase/queries";

export const metadata = {
  title: "My Orders",
  description: "View your order history at Gopi Craft-Studio.",
};

const statusColors: Record<string, string> = {
  pending: "text-warning",
  confirmed: "text-accent",
  processing: "text-accent",
  shipped: "text-success",
  delivered: "text-success",
  cancelled: "text-error",
};

interface OrdersPageProps {
  searchParams: Promise<{ success?: string; order?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { success, order } = await searchParams;
  const orders = await getOrders();

  return (
    <MainLayout>
      <div className="pt-20 section-padding">
        <div className="container-site max-w-3xl">
          <h1 className="font-serif text-3xl">My Orders</h1>

          {success === "true" && (
            <div className="mt-6 mb-8 rounded-lg border border-success/30 bg-success/5 p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-xl text-text">Order Placed Successfully!</h2>
              <p className="mt-2 text-sm text-text-muted max-w-md mx-auto">
                Thank you for your order {order ? `#${order}` : ""}. Our master artisans are preparing your handcrafted selections with care and devotion.
              </p>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-muted">No orders yet</p>
              <Button asChild variant="accent" className="mt-4">
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg border border-border p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">#{order.orderNumber}</p>
                      <p className="text-sm text-text-muted">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`text-sm font-medium capitalize ${statusColors[order.status]}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-text-muted">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"} · {formatPrice(order.total)}
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/track-order?order=${order.orderNumber}`}>Track Order</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
