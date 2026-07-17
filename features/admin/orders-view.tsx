"use client";

import { useState } from "react";
import { updateOrderStatus, exportOrdersCSV } from "@/lib/supabase/actions";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import { Printer, MessageCircle, Package, Send, CheckCircle, Truck, XCircle, AlertCircle, Download } from "lucide-react";

interface OrdersViewProps {
  orders: Order[];
  onRefresh: () => void;
}

export function OrdersView({ orders, onRefresh }: OrdersViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleExportOrdersCSV = async () => {
    try {
      const csv = await exportOrdersCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Failed to export orders.");
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await updateOrderStatus(
        selectedOrder.id,
        status,
        status === "shipped" ? trackingNumber : undefined,
        status === "shipped" ? trackingUrl : undefined
      );
      if (res.success) {
        onRefresh();
        // Update local reference
        setSelectedOrder((prev) => 
          prev 
            ? { 
                ...prev, 
                status: status as any,
                trackingNumber: status === "shipped" ? trackingNumber : prev.trackingNumber,
                trackingUrl: status === "shipped" ? trackingUrl : prev.trackingUrl
              } 
            : null
        );
      } else {
        alert("Error: " + res.error);
      }
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleWhatsApp = (order: Order) => {
    const phone = order.shippingAddress.phone.replace(/[^0-9]/g, "");
    const cleanPhone = phone.startsWith("91") ? phone : "91" + phone;
    
    let text = `Hi ${order.shippingAddress.name},\n\n`;
    if (order.status === "pending") {
      text += `Thank you for your order #${order.orderNumber} at Gopi Craft-Studio! We have received your request and will confirm it shortly.`;
    } else if (order.status === "confirmed") {
      text += `Your order #${order.orderNumber} is confirmed! Our artisans are preparing your handcrafted heritage pieces.`;
    } else if (order.status === "packed") {
      text += `Great news! Your order #${order.orderNumber} has been packed with devotion and is ready for logistics.`;
    } else if (order.status === "shipped") {
      text += `Your order #${order.orderNumber} has been shipped! 🚚\nTracking Number: ${order.trackingNumber || "N/A"}\nTrack details: ${window.location.origin}/track-order?order=${order.orderNumber}`;
    } else if (order.status === "delivered") {
      text += `Your package for order #${order.orderNumber} has been delivered! We hope these handcrafted pieces bring warmth and elegance to your home. ✨`;
    } else {
      text += `Regarding your order #${order.orderNumber}: `;
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "confirmed": return "bg-accent/10 text-accent border-accent/20";
      case "packed": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "shipped": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "delivered": return "bg-success/10 text-success border-success/20";
      default: return "bg-error/10 text-error border-error/20";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Invoice Print Styling (Hidden on screen) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-invoice-area, #print-invoice-area * {
            visibility: visible;
          }
          #print-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Orders List */}
      <div className="lg:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl">Orders ({orders.length})</h2>
          <Button type="button" size="sm" variant="outline" onClick={handleExportOrdersCSV}>
            <Download className="h-4 w-4 mr-1.5" /> CSV
          </Button>
        </div>
        {orders.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-8">No orders placed yet.</p>
        ) : (
          orders.map((order) => (
            <button
              key={order.id}
              onClick={() => {
                setSelectedOrder(order);
                setTrackingNumber(order.trackingNumber || "");
                setTrackingUrl(order.trackingUrl || "");
              }}
              className={`w-full text-left rounded-xl border p-5 transition-all text-sm ${
                selectedOrder?.id === order.id
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border hover:border-accent/30 hover:bg-secondary/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text">#{order.orderNumber}</span>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-3 text-text-muted">
                <p className="font-medium text-text">{order.shippingAddress.name}</p>
                <p className="text-xs mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60">
                <span className="text-xs text-text-light">{order.items.length} Items</span>
                <span className="font-bold text-text">{formatPrice(order.total)}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Order Details Panel */}
      <div className="lg:col-span-2">
        {selectedOrder ? (
          <div className="rounded-xl border border-border bg-primary p-6 md:p-8 space-y-6 shadow-sm">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <h2 className="font-serif text-2xl">Order Detail</h2>
                <p className="text-sm text-text-muted mt-1">Number: <span className="font-semibold text-text">#{selectedOrder.orderNumber}</span></p>
                <p className="text-xs text-text-light mt-0.5">Date: {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleWhatsApp(selectedOrder)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
                  <Printer className="h-4 w-4 mr-2" />
                  Invoice
                </Button>
              </div>
            </div>

            {/* Workflow state buttons - WhatsApp style big buttons */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-text-muted">Quick Status Workflow</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleUpdateStatus("confirmed")}
                  disabled={updating}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold gap-1.5 transition-all ${
                    selectedOrder.status === "confirmed" 
                      ? "border-accent bg-accent/10 text-accent" 
                      : "border-border hover:border-accent/40 hover:bg-secondary/40"
                  }`}
                >
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Confirm Order
                </button>
                <button
                  onClick={() => handleUpdateStatus("packed")}
                  disabled={updating}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold gap-1.5 transition-all ${
                    selectedOrder.status === "packed" 
                      ? "border-blue-500 bg-blue-500/10 text-blue-500" 
                      : "border-border hover:border-blue-500/40 hover:bg-secondary/40"
                  }`}
                >
                  <Package className="h-5 w-5 text-blue-500" />
                  Pack Items
                </button>
                <button
                  onClick={() => handleUpdateStatus("shipped")}
                  disabled={updating}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold gap-1.5 transition-all ${
                    selectedOrder.status === "shipped" 
                      ? "border-purple-500 bg-purple-500/10 text-purple-500" 
                      : "border-border hover:border-purple-500/40 hover:bg-secondary/40"
                  }`}
                >
                  <Truck className="h-5 w-5 text-purple-500" />
                  Ship Package
                </button>
                <button
                  onClick={() => handleUpdateStatus("delivered")}
                  disabled={updating}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold gap-1.5 transition-all ${
                    selectedOrder.status === "delivered" 
                      ? "border-success bg-success/10 text-success" 
                      : "border-border hover:border-success/40 hover:bg-secondary/40"
                  }`}
                >
                  <CheckCircle className="h-5 w-5 text-success" />
                  Mark Delivered
                </button>
              </div>

              {/* Shipped options */}
              {selectedOrder.status === "shipped" && (
                <div className="mt-4 p-4 border border-border rounded-lg bg-secondary/20 space-y-4">
                  <h4 className="text-sm font-medium">Tracking Information</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs text-text-muted">Tracking Code</label>
                      <input
                        type="text"
                        placeholder="e.g. SF12345678"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full h-10 mt-1 px-3 border border-border rounded bg-primary text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted">Tracking URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="e.g. https://shipment-track.com"
                        value={trackingUrl}
                        onChange={(e) => setTrackingUrl(e.target.value)}
                        className="w-full h-10 mt-1 px-3 border border-border rounded bg-primary text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <Button size="sm" variant="accent" onClick={() => handleUpdateStatus("shipped")}>
                    Save Tracking
                  </Button>
                </div>
              )}
            </div>

            {/* Address and items details */}
            <div className="grid gap-6 md:grid-cols-2 border-t border-border pt-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Shipping Address</h3>
                <div className="text-sm text-text-muted space-y-1">
                  <p className="font-semibold text-text">{selectedOrder.shippingAddress.name}</p>
                  <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                  <p>{selectedOrder.shippingAddress.line1}</p>
                  {selectedOrder.shippingAddress.line2 && <p>{selectedOrder.shippingAddress.line2}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Order Notes</h3>
                <p className="text-sm text-text-muted italic bg-secondary/30 p-3 rounded border border-border/50">
                  {selectedOrder.notes || "No custom notes provided."}
                </p>
              </div>
            </div>

            {/* Items Summary Table */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold mb-4">Items Summary</h3>
              <div className="divide-y divide-border border-y border-border">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex py-3 justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-text">{item.product.name} × {item.quantity}</p>
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <p className="text-xs text-text-muted mt-1">
                          {Object.entries(item.selectedOptions).map(([key, val]) => `${key}: ${val}`).join(" | ")}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-text">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="flex justify-between border-t border-border pt-6 font-semibold text-base">
              <span className="text-text-muted">Total Paid</span>
              <span className="text-xl font-bold text-accent">{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>
        ) : (
          <div className="h-64 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6 bg-secondary/5">
            <AlertCircle className="h-8 w-8 text-text-light" />
            <h3 className="font-serif text-lg mt-4">No Order Selected</h3>
            <p className="text-sm text-text-muted mt-1 max-w-xs">Select an order from the list on the left to manage status and details.</p>
          </div>
        )}
      </div>

      {/* Invoice Area (Hidden on screen, styled for Print layout) */}
      {selectedOrder && (
        <div id="print-invoice-area" className="hidden p-8 space-y-6">
          <div className="flex justify-between border-b-2 border-text pb-6">
            <div>
              <h1 className="text-3xl font-serif">Gopi Craft-Studio</h1>
              <p className="text-sm text-text-muted mt-1">Where Tradition Meets Elegance</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">INVOICE</h2>
              <p className="text-sm mt-1">Invoice #: {selectedOrder.orderNumber}</p>
              <p className="text-sm">Date: {formatDate(selectedOrder.createdAt)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-4">
            <div>
              <h3 className="font-bold text-sm mb-2">BILLED TO:</h3>
              <p className="text-sm">{selectedOrder.shippingAddress.name}</p>
              <p className="text-sm">{selectedOrder.shippingAddress.line1}</p>
              {selectedOrder.shippingAddress.line2 && <p className="text-sm">{selectedOrder.shippingAddress.line2}</p>}
              <p className="text-sm">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
              <p className="text-sm">Phone: {selectedOrder.shippingAddress.phone}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-sm mb-2">SHIPPED FROM:</h3>
              <p className="text-sm">Gopi Craft-Studio</p>
              <p className="text-sm">Ahmedabad, Gujarat</p>
              <p className="text-sm">Email: hello@gopicraftstudio.com</p>
              <p className="text-sm">Phone: +91 8733844948</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mt-8">
            <thead>
              <tr className="border-b-2 border-text bg-secondary/50">
                <th className="py-2 text-sm font-bold">Item Description</th>
                <th className="py-2 text-sm font-bold text-center">Qty</th>
                <th className="py-2 text-sm font-bold text-right">Rate</th>
                <th className="py-2 text-sm font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {selectedOrder.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 text-sm">
                    <p className="font-semibold">{item.product.name}</p>
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <p className="text-xs text-text-muted mt-0.5">
                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-sm text-center">{item.quantity}</td>
                  <td className="py-3 text-sm text-right">{formatPrice(item.price)}</td>
                  <td className="py-3 text-sm text-right">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-6 border-t-2 border-text mt-8">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{selectedOrder.shipping === 0 ? "Free" : formatPrice(selectedOrder.shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-bold text-base">
                <span>Total Due</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
