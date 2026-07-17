export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface Price {
  amount: number;
  currency: string;
  compareAt?: number;
}

export interface DbProductVariant {
  id: string;
  productId: string;
  name: string;
  options: Record<string, string>;
  sku: string;
  price?: number;
  stockCount: number;
  reservedStock: number;
  lowStockThreshold: number;
  images?: ImageAsset[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier?: number;
  inStock: boolean;
  image?: ImageAsset;
}

export interface ProductOption {
  id: string;
  name: string;
  type: "select" | "color" | "size" | "text";
  required: boolean;
  variants: ProductVariant[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ShippingInfo {
  estimatedDays: string;
  freeAbove: number;
  methods: { name: string; price: number; days: string }[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: Price;
  images: ImageAsset[];
  category: CategoryRef;
  tags: string[];
  badges?: ("new" | "bestseller" | "limited" | "sale")[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  reservedStock?: number;
  lowStockThreshold?: number;
  variantsDefinition?: { name: string; values: string[] }[];
  variants?: DbProductVariant[];
  sku: string;
  material?: string;
  occasion?: string[];
  customizable: boolean;
  customizationOptions?: ProductOption[];
  specs: ProductSpec[];
  shipping: ShippingInfo;
  faqs: FAQItem[];
  relatedProductIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRef {
  id: string;
  slug: string;
  name: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: ImageAsset;
  productCount: number;
  featured: boolean;
  parentId?: string;
  seo: SEOData;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions: Record<string, string>;
  customization?: Record<string, string>;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  selectedOptions: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  notes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: ImageAsset;
  addresses: Address[];
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: ImageAsset;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  seo: SEOData;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: number;
  image?: ImageAsset;
  productName?: string;
}

export interface InstagramPost {
  id: string;
  image: ImageAsset;
  caption: string;
  likes: number;
  url: string;
}

export interface HeroSection {
  type: "hero";
  headline: string;
  subheadline: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image: ImageAsset;
  video?: string;
}

export interface FeaturedCategoriesSection {
  type: "featured-categories";
  title: string;
  subtitle?: string;
  categories: Category[];
}

export interface ProductGridSection {
  type: "product-grid";
  title: string;
  subtitle?: string;
  products: Product[];
  cta?: { label: string; href: string };
}

export interface CraftStorySection {
  type: "craft-story";
  title: string;
  subtitle: string;
  content: string;
  image: ImageAsset;
  cta: { label: string; href: string };
  stats?: { label: string; value: string }[];
}

export interface CustomizationSection {
  type: "customization";
  title: string;
  subtitle: string;
  description: string;
  image: ImageAsset;
  features: string[];
  cta: { label: string; href: string };
}

export interface InstagramSection {
  type: "instagram";
  title: string;
  subtitle?: string;
  handle: string;
  posts: InstagramPost[];
}

export interface TestimonialsSection {
  type: "testimonials";
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

export interface FAQSection {
  type: "faq";
  title: string;
  subtitle?: string;
  items: FAQItem[];
  cta?: { label: string; href: string };
}

export interface NewsletterSection {
  type: "newsletter";
  title: string;
  subtitle: string;
  placeholder: string;
  buttonLabel: string;
}

export type HomeSection =
  | HeroSection
  | FeaturedCategoriesSection
  | ProductGridSection
  | CraftStorySection
  | CustomizationSection
  | InstagramSection
  | TestimonialsSection
  | FAQSection
  | NewsletterSection;

export interface HomePageData {
  seo: SEOData;
  sections: HomeSection[];
}

export interface ShopFilters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  materials?: string[];
  occasions?: string[];
  inStock?: boolean;
  customizable?: boolean;
  search?: string;
  sort?: string;
  collection?: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface PolicyPage {
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
  seo: SEOData;
}

export interface AboutPageData {
  seo: SEOData;
  hero: {
    title: string;
    subtitle: string;
    image: ImageAsset;
  };
  mission: {
    title: string;
    content: string;
  };
  values: { title: string; description: string; icon: string }[];
  team?: { name: string; role: string; image: ImageAsset }[];
  craftStory: CraftStorySection;
}

export interface SearchResult {
  products: Product[];
  categories: Category[];
  blogs: BlogPost[];
  query: string;
}
