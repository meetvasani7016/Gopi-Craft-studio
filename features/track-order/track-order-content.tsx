"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Package, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { trackOrder } from "@/lib/supabase/actions";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const performTracking = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await trackOrder(num.trim());
      if (res.success) {
        setOrder(res.order);
      } else {
        setOrder(null);
      }
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = searchParams.get("order");
    if (initial) {
      performTracking(initial);
    }
  }, [searchParams]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    performTracking(orderNumber);
  };

  return (
    <div className="pt-20 section-padding">
      <div className="container-site max-w-2xl">
        <h1 className="font-serif text-3xl text-center">Track Your Order</h1>
        <p className="mt-3 text-center text-text-muted">Enter your order number to see delivery status</p>

        <form onSubmit={handleTrack} className="mt-8 flex gap-3">
          <Input
            placeholder="e.g. GCS-2026-00142"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="flex-1"
            aria-label="Order number"
          />
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
          </Button>
        </form>

        {loading && (
          <div className="flex justify-center mt-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        )}

        {searched && !order && !loading && (
          <p className="mt-8 text-center text-text-muted" role="alert">
            No order found with number &ldquo;{orderNumber}&rdquo;
          </p>
        )}

        {order && !loading && (
          <div className="mt-10 space-y-8">
            <div className="rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-sm text-text-muted">Placed on {formatDate(order.createdAt)}</p>
                </div>
                {order.trackingNumber && (
                  <p className="text-sm">
                    Tracking: <span className="font-medium">{order.trackingNumber}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-lg mb-6">Delivery Timeline</h2>
              <ol className="space-y-0">
                {order.timeline.map((event: any, i: number) => (
                  <li key={event.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {event.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-border shrink-0" />
                      )}
                      {i < order.timeline.length - 1 && (
                        <div className={cn("w-px flex-1 my-1", event.completed ? "bg-success" : "bg-border")} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={cn("font-medium text-sm", !event.completed && "text-text-muted")}>
                        {event.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">{event.description}</p>
                      {event.date && (
                        <p className="text-xs text-text-light mt-1">{formatDate(event.date)}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {order.estimatedDelivery && (
              <p className="text-sm text-center text-accent">
                Estimated delivery: {formatDate(order.estimatedDelivery)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
