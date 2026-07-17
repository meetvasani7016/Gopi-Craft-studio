-- Gopi Craft-Studio Scalable normalized database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Theme Settings
CREATE TABLE theme_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_color VARCHAR(50) DEFAULT '#ffffff',
    accent_color VARCHAR(50) DEFAULT '#c4a265',
    fonts JSONB DEFAULT '{"serif": "Playfair Display", "sans": "Inter"}'::jsonb,
    logo_url TEXT,
    logo_text VARCHAR(100) DEFAULT 'Gopi Craft-Studio',
    favicon_url TEXT,
    border_radius VARCHAR(20) DEFAULT '0.5rem',
    button_style VARCHAR(50) DEFAULT 'default',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Website Settings
CREATE TABLE website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_text TEXT DEFAULT 'Free shipping on orders above ₹2,999',
    announcement_visible BOOLEAN DEFAULT TRUE,
    whatsapp_number VARCHAR(20) DEFAULT '+918733844948',
    whatsapp_message TEXT DEFAULT 'Hello! I am interested in your products.',
    instagram_handle VARCHAR(50) DEFAULT 'gopicraftstudio_38',
    email VARCHAR(255) DEFAULT 'hello@gopicraftstudio.com',
    phone VARCHAR(20) DEFAULT '+91 8733844948',
    address JSONB DEFAULT '{"street": "Craft Lane, Heritage District", "city": "Ahmedabad", "state": "Gujarat", "pincode": "380001", "country": "India"}'::jsonb,
    currency VARCHAR(10) DEFAULT 'INR',
    currency_symbol VARCHAR(5) DEFAULT '₹',
    free_shipping_threshold NUMERIC DEFAULT 2999,
    tagline TEXT DEFAULT 'Where Tradition Meets Elegance',
    business_hours VARCHAR(100) DEFAULT 'Mon - Sat: 9:00 AM - 6:00 PM',
    google_maps_url TEXT,
    social_links JSONB DEFAULT '{"instagram": "gopicraftstudio_38", "pinterest": "", "facebook": "", "youtube": ""}'::jsonb,
    seo_defaults JSONB DEFAULT '{"title": "Gopi Craft-Studio | Luxury Indian Decor", "description": "Premium handcrafted traditional Indian decor, pooja accessories, and heritage artifacts."}'::jsonb,
    footer_settings JSONB DEFAULT '{"copyright": "© 2026 Gopi Craft-Studio. All rights reserved.", "column1": "Shop", "column2": "Company", "column3": "Support"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SEO Settings
CREATE TABLE seo_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    keywords TEXT[],
    og_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Homepage Versions (for rollback)
CREATE TABLE homepage_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sections_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    active BOOLEAN DEFAULT FALSE
);

-- 5. Homepage Sections (the active block-based layout)
CREATE TABLE homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL, -- 'hero', 'featured-categories', 'product-grid', etc.
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    cta_label VARCHAR(100),
    cta_href TEXT,
    secondary_cta_label VARCHAR(100),
    secondary_cta_href TEXT,
    settings JSONB DEFAULT '{}'::jsonb, -- custom parameters like stats, handles, placeholders, layout, animation
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Navigation Items
CREATE TABLE navigation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(100) NOT NULL,
    href VARCHAR(255) NOT NULL,
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Footer Links
CREATE TABLE footer_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    column_name VARCHAR(50) NOT NULL, -- 'shop', 'company', 'support'
    label VARCHAR(100) NOT NULL,
    href VARCHAR(255) NOT NULL,
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    seo_title TEXT,
    seo_description TEXT,
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Collections (Festival, Limited Edition, etc.)
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    description TEXT,
    price_amount NUMERIC NOT NULL,
    price_compare_at NUMERIC,
    images JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of objects: {src: "", alt: ""}
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    tags TEXT[] DEFAULT '{}',
    badges VARCHAR(50)[] DEFAULT '{}', -- 'new', 'bestseller', 'limited', 'sale'
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INTEGER DEFAULT 0,
    reserved_stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    variants_definition JSONB DEFAULT '[]'::jsonb, -- e.g. [{"name": "Color", "values": ["Gold", "Silver"]}, {"name": "Size", "values": ["Medium", "Large"]}]
    sku VARCHAR(100),
    material VARCHAR(100),
    occasion TEXT[] DEFAULT '{}',
    customizable BOOLEAN DEFAULT FALSE,
    customization_options JSONB DEFAULT '[]'::jsonb, -- color, size, text customization schemas
    specs JSONB DEFAULT '[]'::jsonb, -- array of {label: "", value: ""}
    shipping_info JSONB DEFAULT '{}'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    related_product_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10b. Product Variants (unlimited variants per product)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g. "Brass Diya - Gold / Medium"
    options JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"color": "Gold", "size": "Medium"}
    sku VARCHAR(100) UNIQUE NOT NULL,
    price NUMERIC, -- overrides product price if set
    stock_count INTEGER DEFAULT 0,
    reserved_stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    images JSONB DEFAULT '[]'::jsonb, -- array of {src: "", alt: ""}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10c. Inventory History (logging changes in stock levels)
CREATE TABLE inventory_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    change_amount INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL, -- "Order placed", "Restock", "Manual adjustment", "Refund"
    user_id UUID, -- administrator email or ID
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10d. Shipping Rules
CREATE TABLE shipping_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name VARCHAR(100) NOT NULL,
    regions TEXT[] DEFAULT '{}', -- state codes (e.g. MH, KA) or zone regions
    base_charge NUMERIC NOT NULL DEFAULT 0,
    free_shipping_min NUMERIC, -- order value threshold for free shipping
    estimated_days VARCHAR(50) DEFAULT '5-7 business days',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10e. Activity Logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    admin_email VARCHAR(255),
    action VARCHAR(100) NOT NULL, -- "LOGIN", "PRODUCT_ADD", "ORDER_UPDATE", "SETTINGS_UPDATE"
    resource_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Product-Collection Relationship mapping
CREATE TABLE product_collection_relations (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, collection_id)
);

-- 12. Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Coupons
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed'
    discount_value NUMERIC NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Banners
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    subtitle TEXT,
    image_url TEXT NOT NULL,
    href TEXT,
    active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID, -- References Supabase Auth (auth.users)
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'
    subtotal NUMERIC NOT NULL,
    shipping NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL,
    shipping_address JSONB NOT NULL, -- {name, phone, line1, line2, city, state, pincode, country}
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    estimated_delivery TIMESTAMPTZ,
    timeline JSONB DEFAULT '[]'::jsonb, -- array of events
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    selected_options JSONB DEFAULT '{}'::jsonb -- customized inputs
);

-- 17. Wishlist
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- 18. Blogs
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image_url TEXT,
    author VARCHAR(100) DEFAULT 'Gopi Craft-Studio',
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    read_time INTEGER DEFAULT 5,
    seo_title TEXT,
    seo_description TEXT
);

-- 19. FAQs
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Testimonials
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image_url TEXT,
    product_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Instagram Posts
CREATE TABLE instagram_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    caption TEXT,
    likes INTEGER DEFAULT 0,
    url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. Custom Orders
CREATE TABLE custom_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    description TEXT NOT NULL,
    attachment_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'discussed', 'quoted', 'in_progress', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. Media Library
CREATE TABLE media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    folder_name VARCHAR(100) DEFAULT 'Root',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. Admin Users (Role mappings)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY, -- References auth.users.id
    role VARCHAR(50) DEFAULT 'editor', -- 'super_admin', 'admin', 'editor'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for optimization
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Create policy helpers: Admins can do anything
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on ALL tables (Public reads, Admin writes)
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collection_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Public Read / Select Policies
CREATE POLICY "Public read theme_settings" ON theme_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public read website_settings" ON website_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public read seo_settings" ON seo_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public read homepage_sections" ON homepage_sections FOR SELECT USING (TRUE);
CREATE POLICY "Public read navigation_items" ON navigation_items FOR SELECT USING (TRUE);
CREATE POLICY "Public read footer_links" ON footer_links FOR SELECT USING (TRUE);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Public read collections" ON collections FOR SELECT USING (TRUE);
CREATE POLICY "Public read products" ON products FOR SELECT USING (TRUE);
CREATE POLICY "Public read product_collection_relations" ON product_collection_relations FOR SELECT USING (TRUE);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (TRUE);
CREATE POLICY "Public read blogs" ON blogs FOR SELECT USING (TRUE);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (TRUE);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (TRUE);
CREATE POLICY "Public read instagram_posts" ON instagram_posts FOR SELECT USING (TRUE);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (TRUE);
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (TRUE);
CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (TRUE);
CREATE POLICY "Public read shipping_rules" ON shipping_rules FOR SELECT USING (TRUE);

-- Public Write / Insert Policies for checkout, reviews, and contact forms
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public insert custom_orders" ON custom_orders FOR INSERT WITH CHECK (TRUE);

-- User-specific Wishlist Policies
CREATE POLICY "Users can manage own wishlist" ON wishlist
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admin Write (ALL) Policies for configurations & catalogs
CREATE POLICY "Admin manage theme_settings" ON theme_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage website_settings" ON website_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage seo_settings" ON seo_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage homepage_versions" ON homepage_versions FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage homepage_sections" ON homepage_sections FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage navigation_items" ON navigation_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage footer_links" ON footer_links FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage categories" ON categories FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage collections" ON collections FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage products" ON products FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage product_collection_relations" ON product_collection_relations FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage reviews" ON reviews FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage banners" ON banners FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage orders" ON orders FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage order_items" ON order_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage wishlist" ON wishlist FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage blogs" ON blogs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage faqs" ON faqs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage testimonials" ON testimonials FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage instagram_posts" ON instagram_posts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage custom_orders" ON custom_orders FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage media_library" ON media_library FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage admin_users" ON admin_users FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage product_variants" ON product_variants FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage inventory_history" ON inventory_history FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage shipping_rules" ON shipping_rules FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage activity_logs" ON activity_logs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Trigger to auto-update update_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_theme_settings_modtime BEFORE UPDATE ON theme_settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_website_settings_modtime BEFORE UPDATE ON website_settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_seo_settings_modtime BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_homepage_sections_modtime BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- SEED MOCK DATA
-- Seed theme_settings
INSERT INTO theme_settings (primary_color, accent_color, fonts, logo_text, border_radius, button_style, active)
VALUES ('#ffffff', '#c4a265', '{"serif": "Playfair Display", "sans": "Inter"}'::jsonb, 'Gopi Craft-Studio', '0.5rem', 'default', TRUE);

-- Seed website_settings
INSERT INTO website_settings (announcement_text, announcement_visible, whatsapp_number, whatsapp_message, instagram_handle, email, phone, free_shipping_threshold)
VALUES ('Free shipping on orders above ₹2,999', TRUE, '+918733844948', 'Hello! I am interested in your products.', 'gopicraftstudio_38', 'hello@gopicraftstudio.com', '+91 8733844948', 2999);

-- Seed SEO settings
INSERT INTO seo_settings (page_path, title, description, keywords, og_image) VALUES
('/', 'Gopi Craft-Studio | Where Tradition Meets Elegance', 'Luxury handcrafted Indian decor, temple essentials, and artisan gifts. Premium heritage pieces for modern homes.', ARRAY['indian decor', 'temple decor', 'brass diyas', 'wedding gifts', 'luxury handicrafts'], '/images/placeholder-hero.jpg'),
('/about', 'About Us | Gopi Craft-Studio', 'Our story of preserving Indian craftsmanship for modern homes.', ARRAY['about', 'heritage', 'craftsmanship', 'artisans'], '/images/placeholder-about.jpg'),
('/contact', 'Contact Us | Gopi Craft-Studio', 'Get in touch for custom orders, bulk inquiries, or support.', ARRAY['contact', 'email', 'support', 'whatsapp'], NULL),
('/faq', 'Frequently Asked Questions | Gopi Craft-Studio', 'Find answers to common questions about our products, shipping, returns, and more.', ARRAY['faq', 'shipping', 'returns', 'payments'], NULL),
('/shop', 'Shop All Products | Gopi Craft-Studio', 'Browse our complete collection of handcrafted Indian decor, temple essentials, and artisan gifts.', ARRAY['shop', 'handicrafts', 'buy brass', 'indian art'], NULL);

-- Seed categories
INSERT INTO categories (id, slug, name, description, featured, seo_title, seo_description) VALUES
('c1a11111-1111-1111-1111-111111111111', 'temple-decor', 'Temple Decor', 'Sacred pieces for your home sanctuary, crafted with reverence.', TRUE, 'Temple Decor | Gopi Craft-Studio', 'Sacred pieces for your home sanctuary, crafted with reverence.'),
('c2a22222-2222-2222-2222-222222222222', 'home-decor', 'Home Decor', 'Heritage statements that blend seamlessly with modern aesthetics.', TRUE, 'Home Decor | Gopi Craft-Studio', 'Heritage statements that blend seamlessly with modern aesthetics.'),
('c3a33333-3333-3333-3333-333333333333', 'wedding-gifts', 'Wedding & Gifting', 'Memorable tokens of blessings for your loved ones.', TRUE, 'Wedding & Gifting | Gopi Craft-Studio', 'Memorable tokens of blessings for your loved ones.');

-- Seed navigation items
INSERT INTO navigation_items (label, href, order_index) VALUES
('Shop', '/shop', 10),
('Categories', '/categories', 20),
('New Arrivals', '/shop?sort=newest', 30),
('Limited Edition', '/shop?collection=limited-edition', 40),
('About', '/about', 50),
('Blog', '/blog', 60),
('Contact', '/contact', 70);

-- Seed footer links
INSERT INTO footer_links (column_name, label, href, order_index) VALUES
('shop', 'All Products', '/shop', 10),
('shop', 'Temple Decor', '/categories/temple-decor', 20),
('shop', 'Festival Collection', '/categories/festival', 30),
('shop', 'Wedding Gifts', '/categories/wedding-gifts', 40),
('shop', 'Home Decor', '/categories/home-decor', 50),
('shop', 'Limited Edition', '/shop?collection=limited-edition', 60),
('company', 'About Us', '/about', 10),
('company', 'Craft Story', '/about#craft-story', 20),
('company', 'Blog', '/blog', 30),
('company', 'Contact', '/contact', 40),
('company', 'FAQ', '/faq', 50),
('support', 'Shipping Policy', '/policies/shipping', 10),
('support', 'Return Policy', '/policies/returns', 20),
('support', 'Privacy Policy', '/policies/privacy', 30),
('support', 'Terms of Service', '/policies/terms', 40),
('support', 'Track Order', '/track-order', 50);

-- Seed testimonials
INSERT INTO testimonials (name, location, content, rating, product_name) VALUES
('Priya Sharma', 'Mumbai', 'The brass diya set exceeded every expectation. The craftsmanship is extraordinary — you can feel the artisan''s hand in every curve. It''s become the centerpiece of our daily aarti.', 5, 'Heritage Brass Diya Set'),
('Ananya & Rohit', 'Bangalore', 'We ordered the engraved gift plaque for our housewarming and it was the highlight of the evening. Beautiful packaging, impeccable quality. Gopi Craft-Studio is now our go-to for gifting.', 5, 'Engraved Gift Plaque'),
('Meera Patel', 'Ahmedabad', 'The wooden mandir transformed our living room. It''s modern yet deeply traditional — exactly what we were looking for. The team was incredibly helpful with customization options.', 5, 'Handcrafted Wooden Mandir'),
('Divya Krishnan', 'Chennai', 'Fast shipping, beautiful products, and the WhatsApp support team answered all my questions before I ordered. Rare to find this level of care in online shopping.', 5, NULL);

-- Seed FAQs
INSERT INTO faqs (question, answer, category, order_index) VALUES
('Are your products genuinely handcrafted?', 'Yes. Every piece is handcrafted by skilled artisans across India. We work directly with artisan communities in Moradabad, Rajasthan, and Gujarat.', 'General', 10),
('Do you offer customization?', 'Many of our products support customization including engraving, size selection, and finish options. Look for the ''Customizable'' badge on product pages.', 'General', 20),
('What is your shipping policy?', 'We offer free shipping on orders above ₹2,999. Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available at checkout.', 'General', 30),
('Can I track my order?', 'Yes. Once your order ships, you''ll receive a tracking number via email and SMS. You can also track orders on our Track Order page.', 'General', 40),
('What payment methods do you accept?', 'We accept UPI, credit/debit cards, net banking, and popular wallets. Cash on delivery is available for select pin codes.', 'Orders & Payment', 50),
('What is your return policy?', 'We offer a 7-day return policy for unused products in original packaging. Customized items are non-returnable unless defective.', 'Returns', 60),
('How do I care for brass products?', 'Wipe with a soft dry cloth after use. For deeper cleaning, use a mixture of lemon juice and salt, then rinse and dry thoroughly.', 'Product Care', 70),
('Do you ship internationally?', 'Currently we ship within India only. International shipping is coming soon — subscribe to our newsletter for updates.', 'Shipping', 80);
