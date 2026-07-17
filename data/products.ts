import type { Category, Product, ProductSpec, ShippingInfo } from "@/types";
import { placeholderImages } from "./images";

const defaultShipping: ShippingInfo = {
  estimatedDays: "3-7 business days",
  freeAbove: 2999,
  methods: [
    { name: "Standard", price: 99, days: "5-7 days" },
    { name: "Express", price: 199, days: "2-3 days" },
  ],
};

export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "temple-decor",
    name: "Temple Decor",
    description: "Sacred essentials for your home temple — handcrafted with devotion.",
    image: placeholderImages.category1,
    productCount: 24,
    featured: true,
    seo: {
      title: "Temple Decor | Gopi Craft-Studio",
      description: "Premium handcrafted temple decor, pooja thalis, diyas, and sacred essentials.",
    },
  },
  {
    id: "cat-2",
    slug: "festival",
    name: "Festival Collection",
    description: "Celebrate every occasion with artisan festival decor.",
    image: placeholderImages.category2,
    productCount: 18,
    featured: true,
    seo: {
      title: "Festival Collection | Gopi Craft-Studio",
      description: "Luxury festival decor for Diwali, Navratri, and every celebration.",
    },
  },
  {
    id: "cat-3",
    slug: "wedding-gifts",
    name: "Wedding Gifts",
    description: "Thoughtful artisan gifts for weddings and housewarmings.",
    image: placeholderImages.category3,
    productCount: 15,
    featured: true,
    seo: {
      title: "Wedding Gifts | Gopi Craft-Studio",
      description: "Elegant wedding and housewarming gifts crafted with heritage artistry.",
    },
  },
  {
    id: "cat-4",
    slug: "home-decor",
    name: "Home Decor",
    description: "Timeless pieces that elevate your living spaces.",
    image: placeholderImages.category4,
    productCount: 20,
    featured: true,
    seo: {
      title: "Home Decor | Gopi Craft-Studio",
      description: "Premium Indian heritage home decor — brass, marble, and wood artistry.",
    },
  },
  {
    id: "cat-5",
    slug: "diyas-lamps",
    name: "Diyas & Lamps",
    description: "Illuminate your space with handcrafted light.",
    image: placeholderImages.product1,
    productCount: 12,
    featured: false,
    seo: {
      title: "Diyas & Lamps | Gopi Craft-Studio",
      description: "Handcrafted brass and ceramic diyas for daily worship and festivals.",
    },
  },
  {
    id: "cat-6",
    slug: "pooja-essentials",
    name: "Pooja Essentials",
    description: "Everything you need for daily worship rituals.",
    image: placeholderImages.product2,
    productCount: 16,
    featured: false,
    seo: {
      title: "Pooja Essentials | Gopi Craft-Studio",
      description: "Premium pooja thalis, kalash, incense holders, and ritual essentials.",
    },
  },
];

const defaultSpecs: ProductSpec[] = [
  { label: "Material", value: "Pure Brass" },
  { label: "Finish", value: "Antique Gold" },
  { label: "Origin", value: "Moradabad, India" },
  { label: "Care", value: "Wipe with soft dry cloth" },
];

export const products: Product[] = [
  {
    id: "prod-1",
    slug: "heritage-brass-diya-set",
    name: "Heritage Brass Diya Set",
    shortDescription: "Set of 5 hand-hammered brass diyas with antique gold finish.",
    description:
      "Each diya in this set is individually hand-hammered by master artisans in Moradabad. The antique gold finish develops a beautiful patina over time, making each piece uniquely yours. Perfect for daily aarti or festive celebrations.",
    price: { amount: 2499, currency: "INR", compareAt: 3299 },
    images: [placeholderImages.product1, placeholderImages.product2, placeholderImages.product3],
    category: { id: "cat-5", slug: "diyas-lamps", name: "Diyas & Lamps" },
    tags: ["brass", "diya", "festival", "daily-worship"],
    badges: ["bestseller", "sale"],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 45,
    sku: "GCS-BD-001",
    material: "Brass",
    occasion: ["Diwali", "Daily Worship"],
    customizable: true,
    customizationOptions: [
      {
        id: "opt-size",
        name: "Size",
        type: "select",
        required: true,
        variants: [
          { id: "v-small", name: "Small (3 inch)", value: "small", inStock: true },
          { id: "v-medium", name: "Medium (4 inch)", value: "medium", priceModifier: 500, inStock: true },
          { id: "v-large", name: "Large (5 inch)", value: "large", priceModifier: 1000, inStock: true },
        ],
      },
      {
        id: "opt-engraving",
        name: "Engraving",
        type: "text",
        required: false,
        variants: [
          { id: "v-none", name: "No Engraving", value: "none", inStock: true },
          { id: "v-custom", name: "Custom Text", value: "custom", priceModifier: 300, inStock: true },
        ],
      },
    ],
    specs: defaultSpecs,
    shipping: defaultShipping,
    faqs: [
      { id: "f1", question: "Is this suitable for daily use?", answer: "Yes, the brass is treated for daily aarti use." },
      { id: "f2", question: "How do I clean brass diyas?", answer: "Wipe with a soft dry cloth. Avoid harsh chemicals." },
    ],
    relatedProductIds: ["prod-2", "prod-3", "prod-5"],
    createdAt: "2025-11-01T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "prod-2",
    slug: "marble-pooja-thali",
    name: "Marble Pooja Thali",
    shortDescription: "Hand-carved white marble thali with gold inlay detailing.",
    description:
      "Carved from premium Makrana marble, this pooja thali features delicate gold inlay work inspired by Mughal artistry. A centerpiece for your daily worship ritual.",
    price: { amount: 4599, currency: "INR" },
    images: [placeholderImages.product2, placeholderImages.product1],
    category: { id: "cat-6", slug: "pooja-essentials", name: "Pooja Essentials" },
    tags: ["marble", "thali", "pooja", "premium"],
    badges: ["new"],
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    stockCount: 18,
    sku: "GCS-MT-002",
    material: "Marble",
    occasion: ["Daily Worship", "Temple"],
    customizable: false,
    specs: [
      { label: "Material", value: "Makrana Marble" },
      { label: "Diameter", value: "12 inches" },
      { label: "Weight", value: "1.2 kg" },
      { label: "Origin", value: "Rajasthan, India" },
    ],
    shipping: defaultShipping,
    faqs: [],
    relatedProductIds: ["prod-1", "prod-3"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "prod-3",
    slug: "silver-plated-kalash",
    name: "Silver Plated Kalash",
    shortDescription: "Elegant silver-plated kalash with lotus motif engraving.",
    description:
      "A symbol of abundance and prosperity, this kalash features intricate lotus motif engraving on premium silver-plated brass. Ideal for pooja ceremonies and wedding rituals.",
    price: { amount: 3299, currency: "INR", compareAt: 3999 },
    images: [placeholderImages.product3, placeholderImages.product2],
    category: { id: "cat-6", slug: "pooja-essentials", name: "Pooja Essentials" },
    tags: ["silver", "kalash", "wedding", "pooja"],
    badges: ["bestseller"],
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    stockCount: 32,
    sku: "GCS-SK-003",
    material: "Silver",
    occasion: ["Wedding", "Housewarming"],
    customizable: true,
    customizationOptions: [
      {
        id: "opt-size",
        name: "Size",
        type: "select",
        required: true,
        variants: [
          { id: "v-8", name: "8 inch", value: "8inch", inStock: true },
          { id: "v-10", name: "10 inch", value: "10inch", priceModifier: 800, inStock: true },
        ],
      },
    ],
    specs: [
      { label: "Material", value: "Silver Plated Brass" },
      { label: "Height", value: "8 inches" },
      { label: "Finish", value: "Polished Silver" },
    ],
    shipping: defaultShipping,
    faqs: [],
    relatedProductIds: ["prod-1", "prod-2"],
    createdAt: "2025-10-15T00:00:00Z",
    updatedAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "prod-4",
    slug: "handcrafted-wooden-mandir",
    name: "Handcrafted Wooden Mandir",
    shortDescription: "Teak wood home temple with brass accents and concealed lighting.",
    description:
      "A statement piece for your home — this teak wood mandir features hand-carved jaali work, brass deity accents, and optional concealed LED lighting. Designed for modern homes with traditional soul.",
    price: { amount: 18999, currency: "INR" },
    images: [placeholderImages.product4, placeholderImages.product5],
    category: { id: "cat-1", slug: "temple-decor", name: "Temple Decor" },
    tags: ["wood", "mandir", "temple", "premium"],
    badges: ["limited"],
    rating: 5.0,
    reviewCount: 34,
    inStock: true,
    stockCount: 5,
    sku: "GCS-WM-004",
    material: "Wood",
    occasion: ["Housewarming", "Temple"],
    customizable: true,
    customizationOptions: [
      {
        id: "opt-finish",
        name: "Wood Finish",
        type: "select",
        required: true,
        variants: [
          { id: "v-natural", name: "Natural Teak", value: "natural", inStock: true },
          { id: "v-walnut", name: "Walnut Stain", value: "walnut", inStock: true },
          { id: "v-ebony", name: "Ebony Stain", value: "ebony", priceModifier: 2000, inStock: true },
        ],
      },
    ],
    specs: [
      { label: "Material", value: "Solid Teak Wood" },
      { label: "Dimensions", value: "24 × 18 × 36 inches" },
      { label: "Weight", value: "12 kg" },
    ],
    shipping: { ...defaultShipping, estimatedDays: "7-14 business days" },
    faqs: [],
    relatedProductIds: ["prod-5", "prod-6"],
    createdAt: "2025-09-01T00:00:00Z",
    updatedAt: "2026-02-10T00:00:00Z",
  },
  {
    id: "prod-5",
    slug: "brass-urli-bowl",
    name: "Brass Urli Bowl",
    shortDescription: "Large decorative brass urli for floating flowers and diyas.",
    description:
      "A timeless centerpiece for your entrance or living room. This hand-beaten brass urli holds floating flowers, candles, or diyas — transforming any space into a sanctuary of calm.",
    price: { amount: 5999, currency: "INR" },
    images: [placeholderImages.product5, placeholderImages.product4],
    category: { id: "cat-4", slug: "home-decor", name: "Home Decor" },
    tags: ["brass", "urli", "decor", "festival"],
    badges: ["bestseller"],
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
    stockCount: 28,
    sku: "GCS-BU-005",
    material: "Brass",
    occasion: ["Diwali", "Housewarming"],
    customizable: false,
    specs: defaultSpecs,
    shipping: defaultShipping,
    faqs: [],
    relatedProductIds: ["prod-1", "prod-4"],
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "prod-6",
    slug: "ceramic-diwali-diya-collection",
    name: "Ceramic Diwali Diya Collection",
    shortDescription: "Set of 12 hand-painted ceramic diyas in festive colors.",
    description:
      "Celebrate Diwali with this vibrant collection of hand-painted ceramic diyas. Each piece is unique, painted by women artisans in Gujarat using traditional techniques passed down through generations.",
    price: { amount: 1299, currency: "INR" },
    images: [placeholderImages.product6, placeholderImages.product1],
    category: { id: "cat-2", slug: "festival", name: "Festival Collection" },
    tags: ["ceramic", "diya", "diwali", "festival"],
    badges: ["new", "sale"],
    rating: 4.5,
    reviewCount: 203,
    inStock: true,
    stockCount: 120,
    sku: "GCS-CD-006",
    material: "Ceramic",
    occasion: ["Diwali"],
    customizable: false,
    specs: [
      { label: "Material", value: "Ceramic" },
      { label: "Quantity", value: "12 pieces" },
      { label: "Origin", value: "Gujarat, India" },
    ],
    shipping: defaultShipping,
    faqs: [],
    relatedProductIds: ["prod-1", "prod-5"],
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "prod-7",
    slug: "engraved-gift-plaque",
    name: "Engraved Gift Plaque",
    shortDescription: "Personalized brass plaque with custom engraving for gifting.",
    description:
      "Make every gift memorable with a custom-engraved brass plaque. Perfect for weddings, anniversaries, and housewarmings. Choose your message and we craft it with precision.",
    price: { amount: 1999, currency: "INR" },
    images: [placeholderImages.customization, placeholderImages.product3],
    category: { id: "cat-3", slug: "wedding-gifts", name: "Wedding Gifts" },
    tags: ["brass", "gift", "custom", "wedding"],
    badges: ["new"],
    rating: 4.8,
    reviewCount: 45,
    inStock: true,
    stockCount: 50,
    sku: "GCS-EG-007",
    material: "Brass",
    occasion: ["Wedding", "Housewarming", "Gifting"],
    customizable: true,
    customizationOptions: [
      {
        id: "opt-message",
        name: "Engraving Message",
        type: "text",
        required: true,
        variants: [{ id: "v-custom", name: "Custom Text (up to 50 chars)", value: "custom", inStock: true }],
      },
    ],
    specs: defaultSpecs,
    shipping: defaultShipping,
    faqs: [],
    relatedProductIds: ["prod-3", "prod-1"],
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-03-05T00:00:00Z",
  },
  {
    id: "prod-8",
    slug: "copper-incense-holder",
    name: "Copper Incense Holder",
    shortDescription: "Minimal copper incense holder with ash catcher tray.",
    description:
      "A study in simplicity — this copper incense holder features a clean geometric design with an integrated ash catcher. Brings calm ritual to your daily practice.",
    price: { amount: 899, currency: "INR" },
    images: [placeholderImages.product1, placeholderImages.product6],
    category: { id: "cat-6", slug: "pooja-essentials", name: "Pooja Essentials" },
    tags: ["copper", "incense", "daily-worship"],
    badges: [],
    rating: 4.4,
    reviewCount: 78,
    inStock: true,
    stockCount: 85,
    sku: "GCS-CI-008",
    material: "Copper",
    occasion: ["Daily Worship"],
    customizable: false,
    specs: [
      { label: "Material", value: "Pure Copper" },
      { label: "Height", value: "4 inches" },
    ],
    shipping: defaultShipping,
    faqs: [],
    relatedProductIds: ["prod-1", "prod-2"],
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category.slug === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.badges?.includes("bestseller"));
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.badges?.includes("new"));
}

export function getLimitedEdition(): Product[] {
  return products.filter((p) => p.badges?.includes("limited"));
}

export function getFestivalProducts(): Product[] {
  return products.filter((p) => p.occasion?.includes("Diwali") || p.category.slug === "festival");
}
