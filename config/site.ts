export const siteConfig = {
  name: "Gopi Craft-Studio",
  tagline: "Where Tradition Meets Elegance",
  description:
    "Luxury handcrafted Indian decor, temple essentials, and artisan gifts. Premium heritage pieces for modern homes.",
  url: "https://gopicraftstudio.com",
  whatsapp: {
    number: "+918733844948",
    display: "+91 8733844948",
    message: "Hello! I'm interested in your products.",
  },
  instagram: {
    handle: "gopicraftstudio_38",
    url: "https://instagram.com/gopicraftstudio_38",
  },
  email: "hello@gopicraftstudio.com",
  phone: "+91 8733844948",
  address: {
    street: "Craft Lane, Heritage District",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380001",
    country: "India",
  },
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 2999,
} as const;

export const navigationConfig = {
  mainNav: [
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Limited Edition", href: "/shop?collection=limited-edition" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  footerNav: {
    shop: [
      { label: "All Products", href: "/shop" },
      { label: "Temple Decor", href: "/categories/temple-decor" },
      { label: "Festival Collection", href: "/categories/festival" },
      { label: "Wedding Gifts", href: "/categories/wedding-gifts" },
      { label: "Home Decor", href: "/categories/home-decor" },
      { label: "Limited Edition", href: "/shop?collection=limited-edition" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Craft Story", href: "/about#craft-story" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
    support: [
      { label: "Shipping Policy", href: "/policies/shipping" },
      { label: "Return Policy", href: "/policies/returns" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
} as const;

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "bestselling", label: "Best Selling" },
  { value: "rating", label: "Top Rated" },
] as const;

export const filterConfig = {
  priceRanges: [
    { min: 0, max: 999, label: "Under ₹999" },
    { min: 1000, max: 2499, label: "₹1,000 – ₹2,499" },
    { min: 2500, max: 4999, label: "₹2,500 – ₹4,999" },
    { min: 5000, max: 9999, label: "₹5,000 – ₹9,999" },
    { min: 10000, max: null, label: "₹10,000+" },
  ],
  materials: ["Brass", "Wood", "Marble", "Ceramic", "Silver", "Copper", "Resin"],
  occasions: ["Diwali", "Wedding", "Housewarming", "Temple", "Daily Worship", "Gifting"],
} as const;
