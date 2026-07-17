import type {
  AboutPageData,
  BlogPost,
  FAQItem,
  HomePageData,
  InstagramPost,
  PolicyPage,
  Testimonial,
} from "@/types";
import { siteConfig } from "@/config/site";
import { categories, getBestSellers, getFestivalProducts, getLimitedEdition, getNewArrivals } from "./products";
import { placeholderImages } from "./images";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    location: "Mumbai",
    content:
      "The brass diya set exceeded every expectation. The craftsmanship is extraordinary — you can feel the artisan's hand in every curve. It's become the centerpiece of our daily aarti.",
    rating: 5,
    productName: "Heritage Brass Diya Set",
  },
  {
    id: "t2",
    name: "Ananya & Rohit",
    location: "Bangalore",
    content:
      "We ordered the engraved gift plaque for our housewarming and it was the highlight of the evening. Beautiful packaging, impeccable quality. Gopi Craft-Studio is now our go-to for gifting.",
    rating: 5,
    productName: "Engraved Gift Plaque",
  },
  {
    id: "t3",
    name: "Meera Patel",
    location: "Ahmedabad",
    content:
      "The wooden mandir transformed our living room. It's modern yet deeply traditional — exactly what we were looking for. The team was incredibly helpful with customization options.",
    rating: 5,
    productName: "Handcrafted Wooden Mandir",
  },
  {
    id: "t4",
    name: "Divya Krishnan",
    location: "Chennai",
    content:
      "Fast shipping, beautiful products, and the WhatsApp support team answered all my questions before I ordered. Rare to find this level of care in online shopping.",
    rating: 5,
  },
];

export const instagramPosts: InstagramPost[] = [
  {
    id: "ig1",
    image: placeholderImages.product1,
    caption: "Morning light on brass ✨",
    likes: 342,
    url: `${siteConfig.instagram.url}/p/1`,
  },
  {
    id: "ig2",
    image: placeholderImages.product4,
    caption: "New mandir installation",
    likes: 567,
    url: `${siteConfig.instagram.url}/p/2`,
  },
  {
    id: "ig3",
    image: placeholderImages.product5,
    caption: "Urli season is here",
    likes: 289,
    url: `${siteConfig.instagram.url}/p/3`,
  },
  {
    id: "ig4",
    image: placeholderImages.product6,
    caption: "Diwali prep begins",
    likes: 891,
    url: `${siteConfig.instagram.url}/p/4`,
  },
  {
    id: "ig5",
    image: placeholderImages.craftStory,
    caption: "Behind the craft",
    likes: 445,
    url: `${siteConfig.instagram.url}/p/5`,
  },
  {
    id: "ig6",
    image: placeholderImages.product2,
    caption: "Marble mornings",
    likes: 312,
    url: `${siteConfig.instagram.url}/p/6`,
  },
];

export const homeFaqs: FAQItem[] = [
  {
    id: "hf1",
    question: "Are your products genuinely handcrafted?",
    answer:
      "Yes. Every piece is handcrafted by skilled artisans across India. We work directly with artisan communities in Moradabad, Rajasthan, and Gujarat.",
  },
  {
    id: "hf2",
    question: "Do you offer customization?",
    answer:
      "Many of our products support customization including engraving, size selection, and finish options. Look for the 'Customizable' badge on product pages.",
  },
  {
    id: "hf3",
    question: "What is your shipping policy?",
    answer:
      "We offer free shipping on orders above ₹2,999. Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available at checkout.",
  },
  {
    id: "hf4",
    question: "Can I track my order?",
    answer:
      "Yes. Once your order ships, you'll receive a tracking number via email and SMS. You can also track orders on our Track Order page.",
  },
];

export const homePageData: HomePageData = {
  seo: {
    title: "Gopi Craft-Studio | Where Tradition Meets Elegance",
    description:
      "Luxury handcrafted Indian decor, temple essentials, and artisan gifts. Premium heritage pieces for modern homes.",
    keywords: ["indian decor", "temple decor", "brass diyas", "wedding gifts", "luxury handicrafts"],
    ogImage: placeholderImages.hero.src,
  },
  sections: [
    {
      type: "hero",
      headline: "Where Tradition\nMeets Elegance",
      subheadline:
        "Handcrafted heritage pieces for the modern home. Temple decor, festival essentials, and artisan gifts — made with devotion, designed for life.",
      cta: { label: "Explore Collection", href: "/shop" },
      secondaryCta: { label: "Our Story", href: "/about" },
      image: placeholderImages.hero,
    },
    {
      type: "featured-categories",
      title: "Curated Collections",
      subtitle: "Discover pieces crafted for every sacred moment",
      categories: categories.filter((c) => c.featured),
    },
    {
      type: "product-grid",
      title: "Best Sellers",
      subtitle: "Handcrafted favorites loved by our patrons",
      products: getBestSellers(),
      cta: { label: "View All", href: "/shop?sort=bestselling" },
    },
    {
      type: "craft-story",
      title: "The Craft Story",
      subtitle: "Three generations of artistry",
      content:
        "Every piece at Gopi Craft-Studio carries the soul of Indian craftsmanship. Our artisans in Moradabad, Rajasthan, and Gujarat work with techniques passed down through generations — hand-hammering brass, carving marble, and painting ceramics with a devotion that machines cannot replicate.",
      image: placeholderImages.craftStory,
      cta: { label: "Read Our Story", href: "/about" },
      stats: [
        { label: "Artisan Partners", value: "50+" },
        { label: "Handcrafted Pieces", value: "200+" },
        { label: "Happy Homes", value: "10,000+" },
      ],
    },
    {
      type: "customization",
      title: "Make It Yours",
      subtitle: "Personalized craftsmanship",
      description:
        "Add a personal touch with custom engraving, size selection, and finish options. Every customized piece is crafted to order by our master artisans.",
      image: placeholderImages.customization,
      features: [
        "Custom engraving on brass & silver",
        "Size & finish selection",
        "Gift wrapping with personalized note",
        "Preview before dispatch",
      ],
      cta: { label: "Explore Customization", href: "/shop?customizable=true" },
    },
    {
      type: "instagram",
      title: "From Our Studio",
      subtitle: "Follow our journey",
      handle: siteConfig.instagram.handle,
      posts: instagramPosts,
    },
    {
      type: "testimonials",
      title: "What Our Customers Say",
      subtitle: "Stories from homes we've touched",
      testimonials,
    },
    {
      type: "faq",
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know",
      items: homeFaqs,
      cta: { label: "View All FAQs", href: "/faq" },
    },
    {
      type: "newsletter",
      title: "Join Our Circle",
      subtitle: "Be the first to discover new collections, festival edits, and exclusive offers.",
      placeholder: "Your email address",
      buttonLabel: "Subscribe",
    },
  ],
};

export const allFaqs: FAQItem[] = [
  ...homeFaqs,
  {
    id: "f5",
    question: "What payment methods do you accept?",
    answer: "We accept UPI, credit/debit cards, net banking, and popular wallets. Cash on delivery is available for select pin codes.",
    category: "Orders & Payment",
  },
  {
    id: "f6",
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy for unused products in original packaging. Customized items are non-returnable unless defective.",
    category: "Returns",
  },
  {
    id: "f7",
    question: "How do I care for brass products?",
    answer: "Wipe with a soft dry cloth after use. For deeper cleaning, use a mixture of lemon juice and salt, then rinse and dry thoroughly.",
    category: "Product Care",
  },
  {
    id: "f8",
    question: "Do you ship internationally?",
    answer: "Currently we ship within India only. International shipping is coming soon — subscribe to our newsletter for updates.",
    category: "Shipping",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "diwali-decoration-ideas-2026",
    title: "Diwali Decoration Ideas for the Modern Home",
    excerpt: "Elevate your Diwali celebrations with these minimalist yet festive decor ideas.",
    content: "Full blog content would go here...",
    coverImage: placeholderImages.blog1,
    author: "Gopi Craft-Studio",
    category: "Festival",
    tags: ["diwali", "decoration", "festival"],
    publishedAt: "2026-10-01T00:00:00Z",
    readTime: 5,
    seo: {
      title: "Diwali Decoration Ideas 2026 | Gopi Craft-Studio Blog",
      description: "Modern Diwali decoration ideas for elegant, minimalist homes.",
    },
  },
  {
    id: "blog-2",
    slug: "home-temple-setup-guide",
    title: "The Complete Home Temple Setup Guide",
    excerpt: "Everything you need to create a serene and beautiful home temple space.",
    content: "Full blog content would go here...",
    coverImage: placeholderImages.blog2,
    author: "Gopi Craft-Studio",
    category: "Guide",
    tags: ["temple", "setup", "guide"],
    publishedAt: "2026-09-15T00:00:00Z",
    readTime: 8,
    seo: {
      title: "Home Temple Setup Guide | Gopi Craft-Studio Blog",
      description: "Step-by-step guide to setting up a beautiful home temple.",
    },
  },
  {
    id: "blog-3",
    slug: "art-of-brass-craftsmanship",
    title: "The Art of Brass Craftsmanship in Moradabad",
    excerpt: "Discover the centuries-old tradition behind our brass collection.",
    content: "Full blog content would go here...",
    coverImage: placeholderImages.craftStory,
    author: "Gopi Craft-Studio",
    category: "Craft Story",
    tags: ["brass", "craftsmanship", "artisan"],
    publishedAt: "2026-08-20T00:00:00Z",
    readTime: 6,
    seo: {
      title: "Brass Craftsmanship in Moradabad | Gopi Craft-Studio Blog",
      description: "The centuries-old art of brass crafting in Moradabad, India.",
    },
  },
];

export const aboutPageData: AboutPageData = {
  seo: {
    title: "About Us | Gopi Craft-Studio",
    description: "Our story of preserving Indian craftsmanship for modern homes.",
    ogImage: placeholderImages.about.src,
  },
  hero: {
    title: "Preserving Heritage,\nCrafting Tomorrow",
    subtitle:
      "Gopi Craft-Studio was born from a simple belief: that the soul of Indian craftsmanship deserves a place in every modern home.",
    image: placeholderImages.about,
  },
  mission: {
    title: "Our Mission",
    content:
      "We bridge the gap between traditional Indian artistry and contemporary living. By partnering directly with artisan communities, we ensure fair wages, preserve dying crafts, and deliver pieces of exceptional quality to homes that value both beauty and meaning.",
  },
  values: [
    {
      title: "Authentic Craft",
      description: "Every piece is genuinely handcrafted — never mass-produced.",
      icon: "hand-heart",
    },
    {
      title: "Fair Partnership",
      description: "We work directly with artisans, ensuring fair wages and sustainable livelihoods.",
      icon: "users",
    },
    {
      title: "Timeless Design",
      description: "Our aesthetic is minimal and modern — heritage pieces that fit contemporary homes.",
      icon: "gem",
    },
    {
      title: "Conscious Quality",
      description: "Premium materials, meticulous finishing, and rigorous quality checks on every piece.",
      icon: "shield-check",
    },
  ],
  craftStory: {
    type: "craft-story",
    title: "From Workshop to Your Home",
    subtitle: "The journey of a Gopi Craft-Studio piece",
    content:
      "It begins in the workshops of Moradabad, where brass has been shaped by hand for over 500 years. Our artisans select raw materials, hammer each curve, and apply finishes that develop character over time. In Rajasthan, marble carvers shape pooja thalis with Mughal-inspired precision. In Gujarat, women painters bring ceramic diyas to life with vibrant, traditional motifs. Every piece travels through multiple hands, each adding their mark of mastery, before it reaches your home.",
    image: placeholderImages.craftStory,
    cta: { label: "Explore Our Collection", href: "/shop" },
    stats: [
      { label: "Years of Heritage", value: "500+" },
      { label: "Artisan Families", value: "50+" },
      { label: "Craft Techniques", value: "12" },
    ],
  },
};

export const policies: PolicyPage[] = [
  {
    slug: "shipping",
    title: "Shipping Policy",
    lastUpdated: "2026-01-01",
    content: "We ship across India via trusted courier partners. Free shipping on orders above ₹2,999...",
    seo: { title: "Shipping Policy | Gopi Craft-Studio", description: "Our shipping rates, timelines, and delivery information." },
  },
  {
    slug: "returns",
    title: "Return & Refund Policy",
    lastUpdated: "2026-01-01",
    content: "We want you to love every purchase. If you're not satisfied, return within 7 days...",
    seo: { title: "Return Policy | Gopi Craft-Studio", description: "Our return and refund policy for all products." },
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    lastUpdated: "2026-01-01",
    content: "Your privacy matters to us. This policy explains how we collect, use, and protect your data...",
    seo: { title: "Privacy Policy | Gopi Craft-Studio", description: "How we handle your personal information." },
  },
  {
    slug: "terms",
    title: "Terms of Service",
    lastUpdated: "2026-01-01",
    content: "By using Gopi Craft-Studio, you agree to these terms and conditions...",
    seo: { title: "Terms of Service | Gopi Craft-Studio", description: "Terms and conditions for using our website and services." },
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((b) => b.slug === slug);
}

export function getPolicyBySlug(slug: string): PolicyPage | undefined {
  return policies.find((p) => p.slug === slug);
}
