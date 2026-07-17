"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitOrder, calculateShippingCharge } from "@/lib/supabase/actions";
import { useEffect } from "react";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode required"),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CheckoutContent() {
  const { cart, clearCart, isHydrated } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [shippingCharge, setShippingCharge] = useState<number>(cart.shipping);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const watchedState = watch("state");

  useEffect(() => {
    if (!watchedState || watchedState.trim().length < 2) {
      setShippingCharge(cart.shipping);
      return;
    }
    const fetchShipping = async () => {
      try {
        const charge = await calculateShippingCharge(watchedState, cart.subtotal);
        setShippingCharge(charge);
      } catch (err) {
        console.error("Failed to fetch shipping charge:", err);
      }
    };
    const timer = setTimeout(fetchShipping, 400);
    return () => clearTimeout(timer);
  }, [watchedState, cart.subtotal, cart.shipping]);

  const onSubmit = async (formData: CheckoutForm) => {
    setSubmitting(true);
    const finalTotal = cart.subtotal + shippingCharge;
    try {
      const orderData = {
        subtotal: cart.subtotal,
        shipping: shippingCharge,
        discount: cart.discount,
        total: finalTotal,
        notes: formData.notes || "",
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          line1: formData.line1,
          line2: formData.line2 || "",
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: "India",
        },
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedOptions: item.selectedOptions,
        })),
      };

      const res = await submitOrder(orderData);
      if (res.success) {
        clearCart();
        router.push(`/orders?success=true&order=${res.orderNumber}`);
      } else {
        alert("Failed to submit order: " + res.error);
      }
    } catch {
      alert("An unexpected error occurred while placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isHydrated) return null;

  if (cart.items.length === 0) {
    return (
      <div className="pt-20 section-padding container-site text-center py-16">
        <h1 className="font-serif text-2xl">Nothing to checkout</h1>
        <Button asChild variant="accent" className="mt-6">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-20 section-padding">
      <div className="container-site max-w-4xl">
        <h1 className="font-serif text-3xl">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <fieldset>
              <legend className="font-serif text-lg mb-4">Contact Information</legend>
              <div className="space-y-4">
                <Input label="Full Name" {...register("name")} error={errors.name?.message} />
                <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
                <Input label="Phone" type="tel" {...register("phone")} error={errors.phone?.message} />
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-serif text-lg mb-4">Shipping Address</legend>
              <div className="space-y-4">
                <Input label="Address Line 1" {...register("line1")} error={errors.line1?.message} />
                <Input label="Address Line 2 (Optional)" {...register("line2")} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" {...register("city")} error={errors.city?.message} />
                  <Input label="State" {...register("state")} error={errors.state?.message} />
                </div>
                <Input label="Pincode" {...register("pincode")} error={errors.pincode?.message} />
                <Textarea label="Order Notes (Optional)" {...register("notes")} />
              </div>
            </fieldset>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border p-6 space-y-4 lg:sticky lg:top-24">
              <h2 className="font-serif text-lg">Order Summary</h2>
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-text-muted">{item.product.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Shipping</span>
                  <span>{shippingCharge === 0 ? "Free" : formatPrice(shippingCharge)}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2">
                  <span>Total</span>
                  <span>{formatPrice(cart.subtotal + shippingCharge)}</span>
                </div>
              </div>
              <Button type="submit" variant="default" size="lg" className="w-full" loading={submitting}>
                Place Order
              </Button>
              <p className="text-xs text-text-light text-center">
                Payment integration ready — connect your gateway via props
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
