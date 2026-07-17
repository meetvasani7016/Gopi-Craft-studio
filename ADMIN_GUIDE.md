# Gopi Craft-Studio Administrative Panel Guide

Welcome to the **Gopi Control Hub**. This portal allows you to manage daily operations, track stock, fulfill customer orders, and publish content changes to your store.

## Dashboard Security Layout

- **Strict Access**: The admin panel is hidden and accessible ONLY via `/admin`.
- **First-Time Wizard**: If no admin accounts exist, loading `/admin` redirects you to `/admin/setup-wizard` to register the Super Admin email and credentials.
- **Lockdown**: Once a Super Admin is registered, the setup wizard page is locked down and redirects users to the login screen.
- **No Signup**: There is no public registration or signup link on the customer-facing website.

---

## Order Fulfillment Workflow
When a customer places an order via Cash on Delivery or requests WhatsApp confirmation:
1. **Pending Status**: The order appears in the **Orders** tab with a yellow warning tag.
2. **Reviewing Detail**: Click the order card to inspect items, customer addresses, contact numbers, and total shipping costs.
3. **Fulfillment Actions**:
   - **Confirm Order**: Tap **Confirm** to lock in stock levels.
   - **Pack Order**: Tap **Pack** when items are boxed and ready for transit.
   - **Ship Order**: Enter the shipping partner details, tracking number, and tracking URL, then tap **Ship** to notify the customer.
   - **WhatsApp Contact**: Use the quick-action **WhatsApp button** on the card to text pre-filled order status links directly to the customer's phone!

---

## Dynamic Shipping Configurations
In the **Shipping Rules** tab:
- Set specific zone rules for states or custom regions (e.g. Maharashtra, Gujarat local zones).
- Base charges are added automatically to order totals at checkout.
- You can configure free shipping thresholds (e.g., Free shipping for orders above ₹3,000).
- Standard fallback shipping rules handle regions that don't match any specific states.
