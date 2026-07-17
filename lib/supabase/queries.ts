import { createClient } from "./server";
import { 
  homePageData, 
  aboutPageData, 
  allFaqs, 
  testimonials, 
  blogPosts, 
  instagramPosts, 
  policies 
} from "@/data/content";
import { 
  products as mockProducts, 
  categories as mockCategories 
} from "@/data/products";
import { mockOrders } from "@/data/orders";
import type { 
  Product, 
  Category, 
  HomeSection, 
  FAQItem, 
  Testimonial, 
  BlogPost, 
  InstagramPost, 
  PolicyPage, 
  Order, 
  SEOData 
} from "@/types";

// Helper to check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// 1. Theme Settings
export async function getThemeSettings() {
  if (!isSupabaseConfigured()) {
    return {
      primaryColor: "#ffffff",
      accentColor: "#c4a265",
      borderRadius: "0.5rem",
      buttonStyle: "default",
      logoText: "Gopi Craft-Studio",
      fonts: { serif: "Playfair Display", sans: "Inter" },
      faviconUrl: null
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("theme_settings")
      .select("*")
      .eq("active", true)
      .limit(1)
      .maybeSingle();

    if (error || !data) throw new Error(error?.message || "No active theme");

    return {
      primaryColor: data.primary_color,
      accentColor: data.accent_color,
      borderRadius: data.border_radius,
      buttonStyle: data.button_style,
      logoText: data.logo_text,
      fonts: typeof data.fonts === "string" ? JSON.parse(data.fonts) : data.fonts,
      faviconUrl: data.favicon_url
    };
  } catch (err) {
    console.warn("Theme settings fetch failed, falling back to defaults:", err);
    return {
      primaryColor: "#ffffff",
      accentColor: "#c4a265",
      borderRadius: "0.5rem",
      buttonStyle: "default",
      logoText: "Gopi Craft-Studio",
      fonts: { serif: "Playfair Display", sans: "Inter" },
      faviconUrl: null
    };
  }
}

// 2. Website Settings
export async function getWebsiteSettings() {
  if (!isSupabaseConfigured()) {
    return {
      announcementText: "Free shipping on orders above ₹2,999",
      announcementVisible: true,
      whatsappNumber: "+918733844948",
      whatsappMessage: "Hello! I am interested in your products.",
      instagramHandle: "gopicraftstudio_38",
      email: "hello@gopicraftstudio.com",
      phone: "+91 8733844948",
      address: {
        street: "Craft Lane, Heritage District",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
        country: "India"
      },
      currency: "INR",
      currencySymbol: "₹",
      freeShippingThreshold: 2999,
      tagline: "Where Tradition Meets Elegance",
      businessHours: "Mon - Sat: 9:00 AM - 6:00 PM",
      googleMapsUrl: "",
      socialLinks: { instagram: "gopicraftstudio_38", pinterest: "", facebook: "", youtube: "" },
      seoDefaults: { title: "Gopi Craft-Studio | Luxury Indian Decor", description: "Premium handcrafted traditional Indian decor, pooja accessories, and heritage artifacts." },
      footerSettings: { copyright: "© 2026 Gopi Craft-Studio. All rights reserved.", column1: "Shop", "column2": "Company", "column3": "Support" }
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("website_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) throw new Error(error?.message || "No site settings");

    return {
      announcementText: data.announcement_text,
      announcementVisible: data.announcement_visible,
      whatsappNumber: data.whatsapp_number,
      whatsappMessage: data.whatsapp_message,
      instagramHandle: data.instagram_handle,
      email: data.email,
      phone: data.phone,
      address: typeof data.address === "string" ? JSON.parse(data.address) : data.address,
      currency: data.currency,
      currencySymbol: data.currency_symbol,
      freeShippingThreshold: Number(data.free_shipping_threshold),
      tagline: data.tagline || "Where Tradition Meets Elegance",
      businessHours: data.business_hours || "Mon - Sat: 9:00 AM - 6:00 PM",
      googleMapsUrl: data.google_maps_url || "",
      socialLinks: typeof data.social_links === "string" ? JSON.parse(data.social_links) : (data.social_links || { instagram: "gopicraftstudio_38", pinterest: "", facebook: "", youtube: "" }),
      seoDefaults: typeof data.seo_defaults === "string" ? JSON.parse(data.seo_defaults) : (data.seo_defaults || { title: "Gopi Craft-Studio | Luxury Indian Decor", description: "Premium handcrafted traditional Indian decor, pooja accessories, and heritage artifacts." }),
      footerSettings: typeof data.footer_settings === "string" ? JSON.parse(data.footer_settings) : (data.footer_settings || { copyright: "© 2026 Gopi Craft-Studio. All rights reserved.", column1: "Shop", "column2": "Company", "column3": "Support" })
    };
  } catch (err) {
    console.warn("Website settings fetch failed, falling back to defaults:", err);
    return {
      announcementText: "Free shipping on orders above ₹2,999",
      announcementVisible: true,
      whatsappNumber: "+918733844948",
      whatsappMessage: "Hello! I am interested in your products.",
      instagramHandle: "gopicraftstudio_38",
      email: "hello@gopicraftstudio.com",
      phone: "+91 8733844948",
      address: {
        street: "Craft Lane, Heritage District",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
        country: "India"
      },
      currency: "INR",
      currencySymbol: "₹",
      freeShippingThreshold: 2999,
      tagline: "Where Tradition Meets Elegance",
      businessHours: "Mon - Sat: 9:00 AM - 6:00 PM",
      googleMapsUrl: "",
      socialLinks: { instagram: "gopicraftstudio_38", pinterest: "", facebook: "", youtube: "" },
      seoDefaults: { title: "Gopi Craft-Studio | Luxury Indian Decor", description: "Premium handcrafted traditional Indian decor, pooja accessories, and heritage artifacts." },
      footerSettings: { copyright: "© 2026 Gopi Craft-Studio. All rights reserved.", column1: "Shop", "column2": "Company", "column3": "Support" }
    };
  }
}

// 3. Navigation Items
export async function getNavigationItems() {
  if (!isSupabaseConfigured()) {
    return [
      { label: "Shop", href: "/shop" },
      { label: "Categories", href: "/categories" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Limited Edition", href: "/shop?collection=limited-edition" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" }
    ];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("navigation_items")
      .select("*")
      .eq("visible", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) throw new Error(error?.message || "No nav items");

    return data.map(item => ({
      label: item.label,
      href: item.href
    }));
  } catch (err) {
    console.warn("Navigation fetch failed, using fallback:", err);
    return [
      { label: "Shop", href: "/shop" },
      { label: "Categories", href: "/categories" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Limited Edition", href: "/shop?collection=limited-edition" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" }
    ];
  }
}

// 4. Footer Links
export async function getFooterLinks() {
  const fallback = {
    shop: [
      { label: "All Products", href: "/shop" },
      { label: "Temple Decor", href: "/categories/temple-decor" },
      { label: "Festival Collection", href: "/categories/festival" },
      { label: "Wedding Gifts", href: "/categories/wedding-gifts" },
      { label: "Home Decor", href: "/categories/home-decor" },
      { label: "Limited Edition", href: "/shop?collection=limited-edition" }
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Craft Story", href: "/about#craft-story" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" }
    ],
    support: [
      { label: "Shipping Policy", href: "/policies/shipping" },
      { label: "Return Policy", href: "/policies/returns" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
      { label: "Track Order", href: "/track-order" }
    ]
  };

  if (!isSupabaseConfigured()) return fallback;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("footer_links")
      .select("*")
      .eq("visible", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) throw new Error(error?.message || "No footer items");

    const result = {
      shop: [] as { label: string; href: string }[],
      company: [] as { label: string; href: string }[],
      support: [] as { label: string; href: string }[]
    };

    data.forEach(item => {
      const col = item.column_name as keyof typeof result;
      if (result[col]) {
        result[col].push({ label: item.label, href: item.href });
      }
    });

    return result;
  } catch (err) {
    console.warn("Footer fetch failed, using fallback:", err);
    return fallback;
  }
}

// 5. SEO Settings
export async function getSeoSettings(path: string): Promise<SEOData> {
  const defaultSeo: SEOData = {
    title: "Gopi Craft-Studio | Where Tradition Meets Elegance",
    description: "Luxury handcrafted Indian decor, temple essentials, and artisan gifts. Premium heritage pieces for modern homes.",
    keywords: ["indian decor", "temple decor", "brass diyas", "wedding gifts", "luxury handicrafts"],
    ogImage: "/images/placeholder-hero.jpg"
  };

  if (!isSupabaseConfigured()) {
    if (path === "/about") return aboutPageData.seo;
    return defaultSeo;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("page_path", path)
      .maybeSingle();

    if (error || !data) return defaultSeo;

    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords || [],
      ogImage: data.og_image
    };
  } catch {
    return defaultSeo;
  }
}

// 6. Homepage Sections
export async function getHomepageSections(): Promise<HomeSection[]> {
  if (!isSupabaseConfigured()) {
    return homePageData.sections;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .eq("visible", true)
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) throw new Error(error?.message || "No sections");

    // Fetch dependencies for sections (products & categories)
    const productsList = await getProducts();
    const categoriesList = await getCategories();

    return data.map(section => {
      const settings = typeof section.settings === "string" ? JSON.parse(section.settings) : (section.settings || {});
      const type = section.type;

      switch (type) {
        case "hero":
          return {
            type: "hero",
            headline: section.title || "",
            subheadline: section.subtitle || "",
            cta: { label: section.cta_label || "Explore Collection", href: section.cta_href || "/shop" },
            secondaryCta: section.secondary_cta_label ? { label: section.secondary_cta_label, href: section.secondary_cta_href || "" } : undefined,
            image: { src: section.image_url || "/images/placeholder-hero.jpg", alt: section.title || "Hero" },
            video: settings.video
          };
        case "featured-categories":
          return {
            type: "featured-categories",
            title: section.title || "Curated Collections",
            subtitle: section.subtitle,
            categories: categoriesList.filter(c => c.featured)
          };
        case "product-grid":
          let filteredProducts: Product[] = [];
          if (settings.filterType === "bestseller") {
            filteredProducts = productsList.filter(p => p.badges?.includes("bestseller"));
          } else if (settings.filterType === "festival") {
            filteredProducts = productsList.filter(p => p.tags?.includes("festival") || p.occasion?.includes("Diwali"));
          } else if (settings.filterType === "new") {
            filteredProducts = productsList.filter(p => p.badges?.includes("new"));
          } else if (settings.filterType === "limited") {
            filteredProducts = productsList.filter(p => p.badges?.includes("limited"));
          } else {
            filteredProducts = productsList.slice(0, 4);
          }
          return {
            type: "product-grid",
            title: section.title || "Products",
            subtitle: section.subtitle,
            products: filteredProducts,
            cta: section.cta_label ? { label: section.cta_label, href: section.cta_href || "/shop" } : undefined
          };
        case "craft-story":
          return {
            type: "craft-story",
            title: section.title || "The Craft Story",
            subtitle: section.subtitle || "",
            content: section.content || "",
            image: { src: section.image_url || "/images/placeholder-story.jpg", alt: section.title || "Story" },
            cta: { label: section.cta_label || "Read Our Story", href: section.cta_href || "/about" },
            stats: settings.stats || []
          };
        case "customization":
          return {
            type: "customization",
            title: section.title || "Make It Yours",
            subtitle: section.subtitle || "",
            description: section.content || "",
            image: { src: section.image_url || "/images/placeholder-custom.jpg", alt: section.title || "Customization" },
            features: settings.features || [],
            cta: { label: section.cta_label || "Explore Customization", href: section.cta_href || "/shop?customizable=true" }
          };
        case "instagram":
          return {
            type: "instagram",
            title: section.title || "From Our Studio",
            subtitle: section.subtitle,
            handle: settings.handle || "gopicraftstudio_38",
            posts: settings.posts || instagramPosts
          };
        case "testimonials":
          return {
            type: "testimonials",
            title: section.title || "What Our Customers Say",
            subtitle: section.subtitle,
            testimonials: settings.testimonials || testimonials
          };
        case "faq":
          return {
            type: "faq",
            title: section.title || "Frequently Asked Questions",
            subtitle: section.subtitle,
            items: settings.items || allFaqs.slice(0, 4),
            cta: section.cta_label ? { label: section.cta_label, href: section.cta_href || "/faq" } : undefined
          };
        case "newsletter":
          return {
            type: "newsletter",
            title: section.title || "Join Our Circle",
            subtitle: section.subtitle || "",
            placeholder: settings.placeholder || "Your email address",
            buttonLabel: section.cta_label || "Subscribe"
          };
        default:
          return null;
      }
    }).filter(Boolean) as HomeSection[];
  } catch (err) {
    console.warn("Homepage sections fetch failed, using fallback:", err);
    return homePageData.sections;
  }
}

// 7. Categories
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return mockCategories;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (error || !data) throw new Error(error?.message || "No categories");

    return data.map(item => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description || "",
      image: { src: item.image_url || "/images/placeholder-category.jpg", alt: item.name },
      productCount: item.product_count || 0,
      featured: item.featured || false,
      parentId: item.parent_id,
      seo: {
        title: item.seo_title || `${item.name} | Gopi Craft-Studio`,
        description: item.seo_description || `Explore our ${item.name} collection`
      }
    }));
  } catch (err) {
    console.warn("Categories fetch failed, using fallback:", err);
    return mockCategories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const list = await getCategories();
  return list.find(c => c.slug === slug) || null;
}

// 8. Products
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return mockProducts;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), product_variants(*)");

    if (error || !data) throw new Error(error?.message || "No products");

    return data.map(item => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      shortDescription: item.short_description || "",
      description: item.description || "",
      price: {
        amount: Number(item.price_amount),
        currency: "INR",
        compareAt: item.price_compare_at ? Number(item.price_compare_at) : undefined
      },
      images: typeof item.images === "string" ? JSON.parse(item.images) : item.images,
      category: {
        id: item.categories?.id || "",
        slug: item.categories?.slug || "",
        name: item.categories?.name || ""
      },
      tags: item.tags || [],
      badges: item.badges || [],
      rating: Number(item.rating),
      reviewCount: item.review_count || 0,
      inStock: item.in_stock || false,
      stockCount: item.stock_count,
      reservedStock: item.reserved_stock || 0,
      lowStockThreshold: item.low_stock_threshold || 5,
      variantsDefinition: typeof item.variants_definition === "string" ? JSON.parse(item.variants_definition) : (item.variants_definition || []),
      variants: (item.product_variants || []).map((v: any) => ({
        id: v.id,
        productId: v.product_id,
        name: v.name,
        options: typeof v.options === "string" ? JSON.parse(v.options) : v.options,
        sku: v.sku,
        price: v.price ? Number(v.price) : undefined,
        stockCount: v.stock_count || 0,
        reservedStock: v.reserved_stock || 0,
        lowStockThreshold: v.low_stock_threshold || 5,
        images: typeof v.images === "string" ? JSON.parse(v.images) : v.images,
        createdAt: v.created_at,
        updatedAt: v.updated_at
      })),
      sku: item.sku || "",
      material: item.material,
      occasion: item.occasion || [],
      customizable: item.customizable || false,
      customizationOptions: typeof item.customization_options === "string" ? JSON.parse(item.customization_options) : item.customization_options,
      specs: typeof item.specs === "string" ? JSON.parse(item.specs) : item.specs,
      shipping: typeof item.shipping_info === "string" ? JSON.parse(item.shipping_info) : (item.shipping_info || { estimatedDays: "5-7 business days", freeAbove: 2999, methods: [] }),
      faqs: typeof item.faqs === "string" ? JSON.parse(item.faqs) : (item.faqs || []),
      relatedProductIds: item.related_product_ids || [],
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (err) {
    console.warn("Products fetch failed, using fallback:", err);
    return mockProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const list = await getProducts();
  return list.find(p => p.slug === slug) || null;
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const list = await getProducts();
  return list
    .filter(p => p.id !== product.id && (p.category.slug === product.category.slug || p.tags.some(t => product.tags.includes(t))))
    .slice(0, 4);
}

// 9. FAQs
export async function getFaqs(): Promise<FAQItem[]> {
  if (!isSupabaseConfigured()) {
    return allFaqs;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) throw new Error(error?.message || "No faqs");

    return data.map(item => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      category: item.category
    }));
  } catch (err) {
    console.warn("FAQs fetch failed, using fallback:", err);
    return allFaqs;
  }
}

// 10. Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return testimonials;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) throw new Error(error?.message || "No testimonials");

    return data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.location || "",
      content: item.content,
      rating: item.rating || 5,
      image: item.image_url ? { src: item.image_url, alt: item.name } : undefined,
      productName: item.product_name
    }));
  } catch (err) {
    console.warn("Testimonials fetch failed, using fallback:", err);
    return testimonials;
  }
}

// 11. Blogs
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    return blogPosts;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) throw new Error(error?.message || "No blogs");

    return data.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt || "",
      content: item.content || "",
      coverImage: { src: item.cover_image_url || "/images/placeholder-blog.jpg", alt: item.title },
      author: item.author || "Gopi Craft-Studio",
      category: item.category || "General",
      tags: item.tags || [],
      publishedAt: item.published_at,
      readTime: item.read_time || 5,
      seo: {
        title: item.seo_title || `${item.title} | Gopi Craft-Studio Blog`,
        description: item.seo_description || item.excerpt || ""
      }
    }));
  } catch (err) {
    console.warn("Blogs fetch failed, using fallback:", err);
    return blogPosts;
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const list = await getBlogPosts();
  return list.find(b => b.slug === slug) || null;
}

// 12. Policies
export async function getPolicies(): Promise<PolicyPage[]> {
  if (!isSupabaseConfigured()) {
    return policies;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .like("page_path", "/policies/%");

    // Because policies are simple textual content, we can fetch from seo_settings page details, 
    // or map them to the mock static list if they aren't fully populated in DB.
    if (error || !data || data.length === 0) throw new Error("No policies in DB");

    return data.map(item => {
      const slug = item.page_path.replace("/policies/", "");
      const matchedMock = policies.find(p => p.slug === slug);
      return {
        slug,
        title: item.title.split(" | ")[0],
        content: matchedMock?.content || "Details for this policy are coming soon.",
        lastUpdated: "2026-01-01",
        seo: {
          title: item.title,
          description: item.description || ""
        }
      };
    });
  } catch {
    return policies;
  }
}

export async function getPolicyBySlug(slug: string): Promise<PolicyPage | null> {
  const list = await getPolicies();
  return list.find(p => p.slug === slug) || null;
}

// 13. Orders
export async function getOrders(userId?: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return mockOrders;
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("orders").select("*, order_items(*, products(*))");
    
    if (userId) {
      query = query.eq("user_id", userId);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error || !data) throw new Error(error?.message || "No orders");

    return data.map(item => ({
      id: item.id,
      orderNumber: item.order_number,
      status: item.status,
      subtotal: Number(item.subtotal),
      shipping: Number(item.shipping),
      discount: Number(item.discount),
      total: Number(item.total),
      shippingAddress: typeof item.shipping_address === "string" ? JSON.parse(item.shipping_address) : item.shipping_address,
      trackingNumber: item.tracking_number,
      trackingUrl: item.tracking_url,
      estimatedDelivery: item.estimated_delivery,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      timeline: typeof item.timeline === "string" ? JSON.parse(item.timeline) : (item.timeline || []),
      items: item.order_items.map((oi: any) => ({
        id: oi.id,
        quantity: oi.quantity,
        price: Number(oi.price),
        selectedOptions: typeof oi.selected_options === "string" ? JSON.parse(oi.selected_options) : oi.selected_options,
        product: {
          id: oi.products?.id || "",
          name: oi.products?.name || "",
          slug: oi.products?.slug || "",
          images: typeof oi.products?.images === "string" ? JSON.parse(oi.products?.images) : (oi.products?.images || [])
        } as any
      }))
    }));
  } catch (err) {
    console.warn("Orders fetch failed, using fallback:", err);
    return mockOrders;
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const list = await getOrders();
  return list.find(o => o.orderNumber === orderNumber) || null;
}

export async function getFrequentlyBoughtTogether(product: Product): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    const list = await getProducts();
    return list.filter(p => p.id !== product.id && p.category.slug === product.category.slug).slice(0, 3);
  }

  try {
    const supabase = await createClient();
    const { data: itemOrders, error: orderErr } = await supabase
      .from("order_items")
      .select("order_id")
      .eq("product_id", product.id);

    if (orderErr || !itemOrders || itemOrders.length === 0) {
      const list = await getProducts();
      return list.filter(p => p.id !== product.id && p.category.slug === product.category.slug).slice(0, 3);
    }

    const orderIds = itemOrders.map(item => item.order_id);

    const { data: siblingItems, error: siblingErr } = await supabase
      .from("order_items")
      .select("product_id")
      .in("order_id", orderIds)
      .neq("product_id", product.id);

    if (siblingErr || !siblingItems || siblingItems.length === 0) {
      const list = await getProducts();
      return list.filter(p => p.id !== product.id && p.category.slug === product.category.slug).slice(0, 3);
    }

    const frequencies: Record<string, number> = {};
    siblingItems.forEach(item => {
      frequencies[item.product_id] = (frequencies[item.product_id] || 0) + 1;
    });

    const sortedIds = Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]).slice(0, 3);

    const list = await getProducts();
    const recommended = list.filter(p => sortedIds.includes(p.id));

    if (recommended.length < 3) {
      const extra = list.filter(p => p.id !== product.id && p.category.slug === product.category.slug && !sortedIds.includes(p.id));
      return [...recommended, ...extra].slice(0, 3);
    }

    return recommended;
  } catch (err) {
    console.warn("Frequently bought together query failed, fallback to related:", err);
    const list = await getProducts();
    return list.filter(p => p.id !== product.id && p.category.slug === product.category.slug).slice(0, 3);
  }
}
