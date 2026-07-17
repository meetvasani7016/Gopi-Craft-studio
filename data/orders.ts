import type { Order } from "@/types";
import { products } from "./products";

export const mockOrders: Order[] = [
  {
    id: "order-1",
    orderNumber: "GCS-2026-00142",
    status: "shipped",
    items: [
      {
        id: "oi-1",
        product: products[0],
        quantity: 1,
        price: 2499,
        selectedOptions: { "opt-size": "medium" },
      },
      {
        id: "oi-2",
        product: products[5],
        quantity: 2,
        price: 1299,
        selectedOptions: {},
      },
    ],
    subtotal: 5097,
    shipping: 0,
    discount: 0,
    total: 5097,
    shippingAddress: {
      id: "addr-1",
      name: "Priya Sharma",
      phone: "+91 9876543210",
      line1: "42 Marine Drive",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      country: "India",
      isDefault: true,
    },
    trackingNumber: "TRK123456789IN",
    trackingUrl: "https://tracking.example.com/TRK123456789IN",
    estimatedDelivery: "2026-07-20",
    createdAt: "2026-07-10T10:30:00Z",
    updatedAt: "2026-07-12T14:00:00Z",
    timeline: [
      { status: "pending", title: "Order Placed", description: "Your order has been received", date: "2026-07-10T10:30:00Z", completed: true },
      { status: "confirmed", title: "Order Confirmed", description: "Payment confirmed", date: "2026-07-10T10:35:00Z", completed: true },
      { status: "processing", title: "Processing", description: "Your order is being prepared", date: "2026-07-11T09:00:00Z", completed: true },
      { status: "shipped", title: "Shipped", description: "Package dispatched via BlueDart", date: "2026-07-12T14:00:00Z", completed: true },
      { status: "out_for_delivery", title: "Out for Delivery", description: "Arriving soon", date: "2026-07-20T08:00:00Z", completed: false },
      { status: "delivered", title: "Delivered", description: "Package delivered", date: "", completed: false },
    ],
  },
];

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return mockOrders.find((o) => o.orderNumber === orderNumber);
}
