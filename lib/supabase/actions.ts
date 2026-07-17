"use server";

import * as queries from "./queries";
import { createClient } from "./server";

async function logActivity(action: string, resourceId: string, details: any = {}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        admin_email: user.email,
        action,
        resource_id: resourceId,
        details
      });
    }
  } catch (err) {
    console.error("Activity logging failed:", err);
  }
}

export async function fetchProducts() {
  return await queries.getProducts(true);
}

export async function fetchCategories() {
  return await queries.getCategories();
}

export async function fetchFaqs() {
  return await queries.getFaqs();
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const isConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!isConfigured) {
    return { success: true, message: "Mock success submission" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("custom_orders").insert({
      name: data.name,
      phone: data.phone || "",
      email: data.email,
      description: `[Contact Form Submission] Subject: ${data.subject}\n\n${data.message}`,
      status: "pending"
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Contact submission error:", err);
    return { success: false, error: err.message || "Failed to submit message" };
  }
}

export async function submitProductReview(data: {
  productId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
}) {
  const isConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!isConfigured) {
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("reviews").insert({
      product_id: data.productId,
      author: data.author,
      rating: data.rating,
      title: data.title,
      content: data.content,
      verified: true
    });

    if (error) throw error;
    
    // Increment review count and update rating
    const { data: product } = await supabase
      .from("products")
      .select("rating, review_count")
      .eq("id", data.productId)
      .single();

    if (product) {
      const newCount = (product.review_count || 0) + 1;
      const newRating = (((Number(product.rating) || 5) * (product.review_count || 0)) + data.rating) / newCount;
      
      await supabase
        .from("products")
        .update({
          review_count: newCount,
          rating: Number(newRating.toFixed(1))
        })
        .eq("id", data.productId);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Review submission error:", err);
    return { success: false, error: err.message };
  }
}

export async function adminSignIn(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile || !["super_admin", "admin", "editor"].includes(profile.role)) {
      await supabase.auth.signOut();
      return { success: false, error: "Not authorized as admin" };
    }

    await logActivity("LOGIN", data.user.id, { email });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to sign in" };
  }
}

export async function adminSignOut() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await logActivity("LOGOUT", user.id, { email: user.email });
    }
    await supabase.auth.signOut();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchAdminData() {
  const [
    products,
    categories,
    orders,
    faqs,
    testimonials,
    blogs,
    theme,
    website
  ] = await Promise.all([
    queries.getProducts(),
    queries.getCategories(),
    queries.getOrders(),
    queries.getFaqs(),
    queries.getTestimonials(),
    queries.getBlogPosts(),
    queries.getThemeSettings(),
    queries.getWebsiteSettings()
  ]);

  // Derived or mock collections & reviews for CMS dashboard
  const collections = [
    { id: "col1", name: "Best Seller", slug: "bestseller" },
    { id: "col2", name: "Festival Collection", slug: "festival" },
    { id: "col3", name: "New Arrivals", slug: "newest" },
    { id: "col4", name: "Limited Edition", slug: "limited-edition" }
  ];

  const reviews: any[] = [];

  return {
    products,
    categories,
    collections,
    orders,
    faqs,
    testimonials,
    blogs,
    reviews,
    theme,
    website
  };
}

export async function updateWebsiteSettings(data: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    // Get first settings row ID
    const { data: existing } = await supabase.from("website_settings").select("id").limit(1).maybeSingle();
    
    const record = {
      announcement_text: data.announcementText,
      announcement_visible: data.announcementVisible,
      whatsapp_number: data.whatsappNumber,
      whatsapp_message: data.whatsappMessage,
      instagram_handle: data.instagramHandle,
      email: data.email,
      phone: data.phone,
      address: typeof data.address === "string" ? JSON.parse(data.address) : data.address,
      free_shipping_threshold: Number(data.freeShippingThreshold),
      tagline: data.tagline,
      business_hours: data.businessHours,
      google_maps_url: data.googleMapsUrl,
      social_links: typeof data.socialLinks === "string" ? JSON.parse(data.socialLinks) : data.socialLinks,
      seo_defaults: typeof data.seoDefaults === "string" ? JSON.parse(data.seoDefaults) : data.seoDefaults,
      footer_settings: typeof data.footerSettings === "string" ? JSON.parse(data.footerSettings) : data.footerSettings
    };

    if (existing?.id) {
      await supabase.from("website_settings").update(record).eq("id", existing.id);
      await logActivity("SETTINGS_UPDATE", existing.id, { announcementText: data.announcementText });
    } else {
      const { data: inserted } = await supabase.from("website_settings").insert(record).select("id").single();
      if (inserted) await logActivity("SETTINGS_UPDATE", inserted.id, { announcementText: data.announcementText });
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateThemeSettings(data: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    const { data: existing } = await supabase.from("theme_settings").select("id").limit(1).maybeSingle();
    
    const record = {
      primary_color: data.primaryColor,
      accent_color: data.accentColor,
      border_radius: data.borderRadius,
      button_style: data.buttonStyle,
      logo_text: data.logoText,
      fonts: data.fonts,
      favicon_url: data.faviconUrl
    };

    if (existing?.id) {
      await supabase.from("theme_settings").update(record).eq("id", existing.id);
      await logActivity("THEME_UPDATE", existing.id, { logoText: data.logoText });
    } else {
      const { data: inserted } = await supabase.from("theme_settings").insert(record).select("id").single();
      if (inserted) await logActivity("THEME_UPDATE", inserted.id, { logoText: data.logoText });
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveHomepageSections(sections: any[]) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    
    // Clear existing sections
    await supabase.from("homepage_sections").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // Insert new sections
    const insertRows = sections.map((sec, i) => ({
      type: sec.type,
      title: sec.title || sec.headline || null,
      subtitle: sec.subtitle || sec.subheadline || null,
      content: sec.content || sec.description || null,
      image_url: sec.image?.src || sec.image_url || null,
      cta_label: sec.cta?.label || sec.cta_label || null,
      cta_href: sec.cta?.href || sec.cta_href || null,
      secondary_cta_label: sec.secondaryCta?.label || sec.secondary_cta_label || null,
      secondary_cta_href: sec.secondaryCta?.href || sec.secondary_cta_href || null,
      settings: {
        video: sec.video,
        stats: sec.stats,
        features: sec.features,
        posts: sec.posts,
        testimonials: sec.testimonials,
        items: sec.items,
        handle: sec.handle,
        placeholder: sec.placeholder,
        filterType: sec.settings?.filterType
      },
      order_index: i,
      visible: sec.visible !== false
    }));

    const { error } = await supabase.from("homepage_sections").insert(insertRows);
    if (error) throw error;
    
    await logActivity("HOMEPAGE_PUBLISHED", "homepage", { sectionCount: sections.length });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function publishHomepageVersion(name: string, sections: any[]) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    
    // Save current layout
    await saveHomepageSections(sections);

    // Deactivate previous active versions
    await supabase.from("homepage_versions").update({ active: false }).eq("active", true);

    // Save as version
    const { error } = await supabase.from("homepage_versions").insert({
      name,
      sections_data: sections,
      active: true
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function rollbackHomepageVersion(versionId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    
    // Fetch version data
    const { data: ver, error } = await supabase
      .from("homepage_versions")
      .select("*")
      .eq("id", versionId)
      .single();

    if (error || !ver) throw new Error("Version not found");

    // Save layout sections
    const res = await saveHomepageSections(ver.sections_data);
    if (!res.success) throw new Error(res.error);

    // Set active status
    await supabase.from("homepage_versions").update({ active: false }).eq("active", true);
    await supabase.from("homepage_versions").update({ active: true }).eq("id", versionId);

    return { success: true, sections: ver.sections_data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getHomepageVersions() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("homepage_versions")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string, trackingNumber?: string, trackingUrl?: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();

    // Fetch current order timeline
    const { data: order } = await supabase.from("orders").select("timeline, order_number").eq("id", orderId).single();
    let timeline = order?.timeline || [];
    if (typeof timeline === "string") timeline = JSON.parse(timeline);

    const statusTitles: Record<string, string> = {
      pending: "Order Placed",
      confirmed: "Order Confirmed",
      packed: "Items Packed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      refunded: "Refunded"
    };

    const statusDescs: Record<string, string> = {
      pending: "We have received your order.",
      confirmed: "Your order is verified and ready for preparation.",
      packed: "Your artisan pieces have been carefully packed.",
      shipped: `Your package has been shipped via logistics. Tracking: ${trackingNumber || "N/A"}.`,
      delivered: "Your package has been delivered. Enjoy your heritage pieces!",
      cancelled: "This order was cancelled.",
      refunded: "Refund has been processed."
    };

    // Add event
    timeline.push({
      status,
      title: statusTitles[status] || "Status Update",
      description: statusDescs[status] || "Your order status was updated.",
      date: new Date().toISOString(),
      completed: true
    });

    const updateFields: any = {
      status,
      timeline,
      updated_at: new Date().toISOString()
    };

    if (trackingNumber) updateFields.tracking_number = trackingNumber;
    if (trackingUrl) updateFields.tracking_url = trackingUrl;

    const { error } = await supabase.from("orders").update(updateFields).eq("id", orderId);
    if (error) throw error;

    await logActivity("ORDER_STATUS_UPDATE", orderId, { status, orderNumber: order?.order_number });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveProduct(product: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true, id: product.id || "mock-id" };
  try {
    const supabase = await createClient();
    const record = {
      name: product.name,
      slug: product.slug,
      short_description: product.shortDescription,
      description: product.description,
      price_amount: Number(product.price.amount),
      price_compare_at: product.price.compareAt ? Number(product.price.compareAt) : null,
      images: product.images,
      category_id: product.categoryId,
      tags: product.tags || [],
      badges: product.badges || [],
      in_stock: product.inStock,
      stock_count: product.stockCount !== undefined ? Number(product.stockCount) : null,
      reserved_stock: product.reservedStock !== undefined ? Number(product.reservedStock) : 0,
      low_stock_threshold: product.lowStockThreshold !== undefined ? Number(product.lowStockThreshold) : 5,
      variants_definition: product.variantsDefinition || [],
      sku: product.sku,
      material: product.material,
      occasion: product.occasion || [],
      customizable: product.customizable || false,
      customization_options: product.customizationOptions || [],
      specs: product.specs || [],
      shipping_info: product.shipping || { estimatedDays: "5-7 business days", freeAbove: 2999, methods: [] },
      faqs: product.faqs || [],
      related_product_ids: product.relatedProductIds || [],
      status: product.status || "published"
    };

    if (product.id) {
      const { error } = await supabase.from("products").update(record).eq("id", product.id);
      if (error) throw error;
      await logActivity("PRODUCT_UPDATE", product.id, { name: product.name });
      return { success: true, id: product.id };
    } else {
      const { data, error } = await supabase.from("products").insert(record).select("id").single();
      if (error) throw error;
      await logActivity("PRODUCT_ADD", data.id, { name: product.name });
      return { success: true, id: data.id };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProduct(id: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    await logActivity("PRODUCT_DELETE", id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveCategory(category: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    const record = {
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.imageUrl,
      featured: category.featured || false,
      seo_title: category.seoTitle || `${category.name} | Gopi Craft`,
      seo_description: category.seoDescription || category.description
    };

    if (category.id) {
      await supabase.from("categories").update(record).eq("id", category.id);
      await logActivity("CATEGORY_UPDATE", category.id, { name: category.name });
    } else {
      const { data: newCat } = await supabase.from("categories").insert(record).select("id").single();
      if (newCat) await logActivity("CATEGORY_ADD", newCat.id, { name: category.name });
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveBlog(blog: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    const record = {
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      cover_image_url: blog.coverImageUrl,
      author: blog.author || "Gopi Craft-Studio",
      category: blog.category || "General",
      tags: blog.tags || [],
      read_time: Number(blog.readTime || 5),
      seo_title: blog.seoTitle || blog.title,
      seo_description: blog.seoDescription || blog.excerpt
    };

    if (blog.id) {
      await supabase.from("blogs").update(record).eq("id", blog.id);
      await logActivity("BLOG_UPDATE", blog.id, { title: blog.title });
    } else {
      const { data: newBlog } = await supabase.from("blogs").insert(record).select("id").single();
      if (newBlog) await logActivity("BLOG_ADD", newBlog.id, { title: blog.title });
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteBlog(id: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) throw error;
    await logActivity("BLOG_DELETE", id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveFaq(faq: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    const record = {
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "General",
      order_index: Number(faq.orderIndex || 0)
    };

    if (faq.id) {
      await supabase.from("faqs").update(record).eq("id", faq.id);
    } else {
      await supabase.from("faqs").insert(record);
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteFaq(id: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    await supabase.from("faqs").delete().eq("id", id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitOrder(orderData: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { success: true, orderNumber: `GCS-2026-${Math.floor(Math.random() * 90000 + 10000)}` };
  }

  try {
    const supabase = await createClient();
    const orderNumber = `GCS-2026-${Math.floor(Math.random() * 90000 + 10000)}`;

    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        status: "pending",
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        discount: orderData.discount || 0,
        total: orderData.total,
        shipping_address: orderData.shippingAddress,
        notes: orderData.notes || "",
        timeline: [
          {
            status: "pending",
            title: "Order Placed",
            description: "We have received your order.",
            date: new Date().toISOString(),
            completed: true
          }
        ]
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    const orderItemsRows = orderData.items.map((item: any) => ({
      order_id: newOrder.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      selected_options: item.selectedOptions
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsRows);
    if (itemsError) throw itemsError;

    // Deduct stock for each order item
    for (const item of orderData.items) {
      const { data: product } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("id", item.productId)
        .maybeSingle();

      if (product) {
        let matchedVariant: any = null;

        // Try to match selectedOptions against variant options definition
        if (product.product_variants && product.product_variants.length > 0) {
          matchedVariant = product.product_variants.find((v: any) => {
            const vOpts = typeof v.options === "string" ? JSON.parse(v.options) : v.options;
            return Object.entries(item.selectedOptions).every(([optName, optVal]) => {
              return vOpts[optName] === optVal;
            });
          });
        }

        if (matchedVariant) {
          // Deduct variant stock
          await supabase
            .from("product_variants")
            .update({
              stock_count: Math.max(0, (matchedVariant.stock_count || 0) - item.quantity)
            })
            .eq("id", matchedVariant.id);

          // Log variant stock change
          await supabase.from("inventory_history").insert({
            product_id: item.productId,
            variant_id: matchedVariant.id,
            change_amount: -item.quantity,
            reason: `Order #${orderNumber} placed`
          });
        }

        // Deduct base product stock
        const newStock = Math.max(0, (product.stock_count || 0) - item.quantity);
        await supabase
          .from("products")
          .update({
            stock_count: newStock,
            in_stock: newStock > 0
          })
          .eq("id", item.productId);

        if (!matchedVariant) {
          // Log product stock change
          await supabase.from("inventory_history").insert({
            product_id: item.productId,
            change_amount: -item.quantity,
            reason: `Order #${orderNumber} placed`
          });
        }
      }
    }

    return { success: true, orderNumber };
  } catch (err: any) {
    console.error("Order creation error:", err);
    return { success: false, error: err.message };
  }
}

export async function trackOrder(orderNumber: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Return mock order if matching
    const { mockOrders } = require("@/data/orders");
    const order = mockOrders.find((o: any) => o.orderNumber === orderNumber);
    return { success: true, order };
  }
  try {
    const supabase = await createClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(*))")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) throw error;
    if (!order) return { success: true, order: null };

    // Format DB response to match UI Order type
    const formatted = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      discount: Number(order.discount),
      total: Number(order.total),
      notes: order.notes,
      createdAt: order.created_at,
      estimatedDelivery: order.estimated_delivery,
      trackingNumber: order.tracking_number,
      trackingUrl: order.tracking_url,
      shippingAddress: typeof order.shipping_address === "string" ? JSON.parse(order.shipping_address) : order.shipping_address,
      timeline: typeof order.timeline === "string" ? JSON.parse(order.timeline) : (order.timeline || []),
      items: (order.order_items || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),
        selectedOptions: typeof item.selected_options === "string" ? JSON.parse(item.selected_options) : item.selected_options,
        product: item.products
      }))
    };

    return { success: true, order: formatted };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ------------------------------------------------------------------------------
// 10. PRODUCT VARIANTS MANAGEMENT
// ------------------------------------------------------------------------------

export async function fetchProductVariants(productId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Fetch product variants failed:", err);
    return [];
  }
}

export async function saveProductVariants(productId: string, variants: any[]) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    
    // 1. Get existing variant IDs in the database
    const { data: existing } = await supabase
      .from("product_variants")
      .select("id")
      .eq("product_id", productId);
    
    const existingIds = (existing || []).map(v => v.id);
    const incomingIds = variants.filter(v => v.id).map(v => v.id);

    // 2. Identify variants to delete
    const toDelete = existingIds.filter(id => !incomingIds.includes(id));
    if (toDelete.length > 0) {
      await supabase.from("product_variants").delete().in("id", toDelete);
    }

    // 3. Upsert incoming variants
    for (const v of variants) {
      const record = {
        product_id: productId,
        name: v.name,
        options: typeof v.options === "string" ? JSON.parse(v.options) : v.options,
        sku: v.sku,
        price: v.price ? Number(v.price) : null,
        stock_count: Number(v.stockCount || 0),
        reserved_stock: Number(v.reservedStock || 0),
        low_stock_threshold: Number(v.lowStockThreshold || 5),
        images: v.images || []
      };

      if (v.id) {
        await supabase.from("product_variants").update(record).eq("id", v.id);
      } else {
        await supabase.from("product_variants").insert(record);
      }
    }

    await logActivity("PRODUCT_VARIANTS_UPDATE", productId, { count: variants.length });
    return { success: true };
  } catch (err: any) {
    console.error("Save product variants failed:", err);
    return { success: false, error: err.message };
  }
}

// ------------------------------------------------------------------------------
// 11. SHIPPING RULES ENGINE
// ------------------------------------------------------------------------------

export async function fetchShippingRules() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [
      { id: "s1", zone_name: "Gujarat Local", regions: ["GJ"], base_charge: 60, free_shipping_min: 1999, estimated_days: "2-3 days" },
      { id: "s2", zone_name: "Domestic Standard", regions: ["MH", "KA", "DL"], base_charge: 120, free_shipping_min: 2999, estimated_days: "5-7 days" },
      { id: "s3", zone_name: "Rest of India", regions: ["*"], base_charge: 180, free_shipping_min: 3999, estimated_days: "7-9 days" }
    ];
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("shipping_rules").select("*").order("created_at");
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Fetch shipping rules failed:", err);
    return [];
  }
}

export async function saveShippingRule(rule: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    const record = {
      zone_name: rule.zoneName,
      regions: rule.regions || [],
      base_charge: Number(rule.baseCharge),
      free_shipping_min: rule.freeShippingMin ? Number(rule.freeShippingMin) : null,
      estimated_days: rule.estimatedDays,
      active: rule.active !== false
    };

    if (rule.id) {
      await supabase.from("shipping_rules").update(record).eq("id", rule.id);
      await logActivity("SHIPPING_RULE_UPDATE", rule.id, { zoneName: rule.zoneName });
    } else {
      const { data, error } = await supabase.from("shipping_rules").insert(record).select("id").single();
      if (error) throw error;
      await logActivity("SHIPPING_RULE_ADD", data.id, { zoneName: rule.zoneName });
    }
    return { success: true };
  } catch (err: any) {
    console.error("Save shipping rule failed:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteShippingRule(id: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: true };
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("shipping_rules").delete().eq("id", id);
    if (error) throw error;
    await logActivity("SHIPPING_RULE_DELETE", id);
    return { success: true };
  } catch (err: any) {
    console.error("Delete shipping rule failed:", err);
    return { success: false, error: err.message };
  }
}

export async function calculateShippingCharge(stateCode: string, orderTotal: number) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    if (orderTotal >= 2999) return 0;
    return 120;
  }
  try {
    const supabase = await createClient();
    const { data: rules } = await supabase.from("shipping_rules").select("*").eq("active", true);
    if (!rules || rules.length === 0) return 150; // Fallback charge

    // 1. Try to find an exact matching region state code
    const matchingRule = rules.find(r => 
      (r.regions || []).map((code: string) => code.toUpperCase()).includes(stateCode.toUpperCase())
    );

    if (matchingRule) {
      if (matchingRule.free_shipping_min && orderTotal >= Number(matchingRule.free_shipping_min)) {
        return 0;
      }
      return Number(matchingRule.base_charge);
    }

    // 2. Try to find the fallback rule (regions includes "*")
    const fallbackRule = rules.find(r => (r.regions || []).includes("*"));
    if (fallbackRule) {
      if (fallbackRule.free_shipping_min && orderTotal >= Number(fallbackRule.free_shipping_min)) {
        return 0;
      }
      return Number(fallbackRule.base_charge);
    }

    return 150; // default fallback
  } catch (err) {
    console.error("Calculate shipping charge failed:", err);
    return 150;
  }
}

// ------------------------------------------------------------------------------
// 12. CSV IMPORT/EXPORT ENGINE
// ------------------------------------------------------------------------------

function jsonToCSV(array: any[]) {
  if (array.length === 0) return "";
  const keys = Object.keys(array[0]);
  const csvRows = [];
  csvRows.push(keys.join(","));
  for (const row of array) {
    const values = keys.map(key => {
      const val = row[key];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  return csvRows.join("\n");
}

function csvToJSON(csvText: string) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, '').trim());
  const result: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const rowValues: string[] = [];
    let inQuotes = false;
    let currentVal = "";
    for (let charIdx = 0; charIdx < currentLine.length; charIdx++) {
      const char = currentLine[charIdx];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        rowValues.push(currentVal.trim());
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    rowValues.push(currentVal.trim());
    
    const obj: any = {};
    headers.forEach((header, index) => {
      let val = rowValues[index] || "";
      val = val.replace(/^"|"$/g, '').replace(/""/g, '"');
      obj[header] = val;
    });
    result.push(obj);
  }
  return result;
}

export async function exportProductsCSV() {
  const products = await queries.getProducts();
  const flatProducts = products.map(p => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    price: p.price.amount,
    compareAtPrice: p.price.compareAt || "",
    stockCount: p.stockCount || 0,
    reservedStock: p.reservedStock || 0,
    lowStockThreshold: p.lowStockThreshold || 5,
    categorySlug: p.category.slug,
    shortDescription: p.shortDescription,
    material: p.material || "",
    tags: (p.tags || []).join(";")
  }));
  return jsonToCSV(flatProducts);
}

export async function importProductsCSV(csvContent: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: false, error: "Supabase not configured" };
  try {
    const supabase = await createClient();
    const rows = csvToJSON(csvContent);
    let successCount = 0;
    const errors: string[] = [];

    // Retrieve categories map to resolve slugs to category IDs
    const categories = await queries.getCategories();
    const categoryMap: Record<string, string> = {};
    categories.forEach(c => {
      categoryMap[c.slug] = c.id;
    });

    for (const [idx, row] of rows.entries()) {
      if (!row.sku || !row.name || !row.slug) {
        errors.push(`Row ${idx + 1}: SKU, name and slug are required fields.`);
        continue;
      }

      const catId = categoryMap[row.categorySlug];
      if (!catId) {
        errors.push(`Row ${idx + 1}: Category slug '${row.categorySlug}' does not exist.`);
        continue;
      }

      const record = {
        sku: row.sku,
        name: row.name,
        slug: row.slug,
        price_amount: Number(row.price || 0),
        price_compare_at: row.compareAtPrice ? Number(row.compareAtPrice) : null,
        stock_count: Number(row.stockCount || 0),
        reserved_stock: Number(row.reservedStock || 0),
        low_stock_threshold: Number(row.lowStockThreshold || 5),
        category_id: catId,
        short_description: row.shortDescription || "",
        material: row.material || "",
        tags: row.tags ? row.tags.split(";").map((t: string) => t.trim()) : []
      };

      // Check if product SKU already exists
      const { data: existingProduct } = await supabase
        .from("products")
        .select("id")
        .eq("sku", row.sku)
        .maybeSingle();

      if (existingProduct) {
        // Update
        const { error } = await supabase.from("products").update(record).eq("id", existingProduct.id);
        if (error) {
          errors.push(`Row ${idx + 1}: Update failed: ${error.message}`);
        } else {
          successCount++;
        }
      } else {
        // Insert
        const { error } = await supabase.from("products").insert(record);
        if (error) {
          errors.push(`Row ${idx + 1}: Insert failed: ${error.message}`);
        } else {
          successCount++;
        }
      }
    }

    await logActivity("CSV_IMPORT_PRODUCTS", "products", { successCount, errorCount: errors.length });
    return { success: true, successCount, errors };
  } catch (err: any) {
    console.error("CSV product import failed:", err);
    return { success: false, error: err.message };
  }
}

export async function exportCategoriesCSV() {
  const categories = await queries.getCategories();
  const flatCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    imageUrl: c.image?.src || "",
    featured: c.featured ? "true" : "false"
  }));
  return jsonToCSV(flatCategories);
}

export async function importCategoriesCSV(csvContent: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: false, error: "Supabase not configured" };
  try {
    const supabase = await createClient();
    const rows = csvToJSON(csvContent);
    let successCount = 0;
    const errors: string[] = [];

    for (const [idx, row] of rows.entries()) {
      if (!row.name || !row.slug) {
        errors.push(`Row ${idx + 1}: Name and slug are required fields.`);
        continue;
      }

      const record = {
        name: row.name,
        slug: row.slug,
        description: row.description || "",
        image_url: row.imageUrl || "",
        featured: row.featured === "true"
      };

      // Check if category slug already exists
      const { data: existingCat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", row.slug)
        .maybeSingle();

      if (existingCat) {
        // Update
        const { error } = await supabase.from("categories").update(record).eq("id", existingCat.id);
        if (error) {
          errors.push(`Row ${idx + 1}: Update failed: ${error.message}`);
        } else {
          successCount++;
        }
      } else {
        // Insert
        const { error } = await supabase.from("categories").insert(record);
        if (error) {
          errors.push(`Row ${idx + 1}: Insert failed: ${error.message}`);
        } else {
          successCount++;
        }
      }
    }

    await logActivity("CSV_IMPORT_CATEGORIES", "categories", { successCount, errorCount: errors.length });
    return { success: true, successCount, errors };
  } catch (err: any) {
    console.error("CSV category import failed:", err);
    return { success: false, error: err.message };
  }
}

export async function exportOrdersCSV() {
  const orders = await queries.getOrders();
  const flatOrders = orders.map(o => ({
    orderNumber: o.orderNumber,
    status: o.status,
    createdAt: o.createdAt,
    total: o.total,
    subtotal: o.subtotal,
    shipping: o.shipping,
    discount: o.discount || 0,
    customerName: (o.shippingAddress as any)?.name || (o.shippingAddress as any)?.fullName || "",
    customerPhone: (o.shippingAddress as any)?.phone || "",
    customerEmail: (o.shippingAddress as any)?.email || "",
    customerState: (o.shippingAddress as any)?.state || "",
    trackingNumber: o.trackingNumber || ""
  }));
  return jsonToCSV(flatOrders);
}

// ------------------------------------------------------------------------------
// 13. BOOTSTRAP SETUP WIZARD ACTIONS
// ------------------------------------------------------------------------------

export async function checkSetupWizardStatus() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { locked: false };
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("admin_users")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return { locked: (count || 0) > 0 };
  } catch (err) {
    console.error("Check setup wizard failed:", err);
    return { locked: true }; // Default to safe locked state on errors
  }
}

export async function setupSuperAdmin(data: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { success: false, error: "Supabase not configured" };
  try {
    const supabase = await createClient();
    
    // 1. Verify that no admin users exist yet (security check)
    const { count, error: countErr } = await supabase
      .from("admin_users")
      .select("*", { count: "exact", head: true });
    
    if (countErr) throw countErr;
    if (count && count > 0) {
      return { success: false, error: "Setup wizard is locked. Super Admin already exists." };
    }

    // 2. Register the user in Supabase auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError || !authData.user) {
      throw authError || new Error("Auth user registration failed.");
    }

    // 3. Create the admin user role entry
    const { error: insertErr } = await supabase
      .from("admin_users")
      .insert({
        id: authData.user.id,
        role: "super_admin"
      });

    if (insertErr) throw insertErr;

    await logActivity("SUPER_ADMIN_SETUP", authData.user.id, { email: data.email });
    return { success: true };
  } catch (err: any) {
    console.error("Super Admin setup failed:", err);
    return { success: false, error: err.message || "Failed to create Super Admin account." };
  }
}


