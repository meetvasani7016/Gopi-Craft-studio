-- Gopi Craft-Studio Comprehensive Demo Seeding Script

-- 1. Seed theme_settings
INSERT INTO public.theme_settings (id, primary_color, accent_color, fonts, logo_text, border_radius, button_style, active)
VALUES ('00000000-0000-0000-0000-000000000001', '#ffffff', '#c4a265', '{"serif": "Playfair Display", "sans": "Inter"}'::jsonb, 'Gopi Craft-Studio', '0.5rem', 'default', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed website_settings
INSERT INTO public.website_settings (id, announcement_text, announcement_visible, whatsapp_number, whatsapp_message, instagram_handle, email, phone, free_shipping_threshold)
VALUES ('00000000-0000-0000-0000-000000000001', 'Free shipping on orders above ₹2,999', TRUE, '+918733844948', 'Hello! I am interested in your products.', 'gopicraftstudio_38', 'hello@gopicraftstudio.com', '+91 8733844948', 2999)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed SEO settings
INSERT INTO public.seo_settings (page_path, title, description, keywords, og_image) VALUES
('/', 'Gopi Craft-Studio | Where Tradition Meets Elegance', 'Luxury handcrafted Indian decor, temple essentials, and artisan gifts. Premium heritage pieces for modern homes.', ARRAY['indian decor', 'temple decor', 'brass diyas', 'wedding gifts', 'luxury handicrafts'], '/logo.jpeg'),
('/about', 'About Us | Gopi Craft-Studio', 'Our story of preserving Indian craftsmanship for modern homes.', ARRAY['about', 'heritage', 'craftsmanship', 'artisans'], '/images/placeholder-about.jpg'),
('/contact', 'Contact Us | Gopi Craft-Studio', 'Get in touch for custom orders, bulk inquiries, or support.', ARRAY['contact', 'email', 'support', 'whatsapp'], NULL),
('/faq', 'Frequently Asked Questions | Gopi Craft-Studio', 'Find answers to common questions about our products, shipping, returns, and more.', ARRAY['faq', 'shipping', 'returns', 'payments'], NULL),
('/shop', 'Shop All Products | Gopi Craft-Studio', 'Browse our complete collection of handcrafted Indian decor, temple essentials, and artisan gifts.', ARRAY['shop', 'handicrafts', 'buy brass', 'indian art'], NULL)
ON CONFLICT (page_path) DO NOTHING;

-- 4. Seed categories
INSERT INTO public.categories (id, slug, name, description, featured, seo_title, seo_description) VALUES
('c1a11111-1111-1111-1111-111111111111', 'temple-decor', 'Temple Decor', 'Sacred pieces for your home sanctuary, crafted with reverence.', TRUE, 'Temple Decor | Gopi Craft-Studio', 'Sacred pieces for your home sanctuary, crafted with reverence.'),
('c2a22222-2222-2222-2222-222222222222', 'home-decor', 'Home Decor', 'Heritage statements that blend seamlessly with modern aesthetics.', TRUE, 'Home Decor | Gopi Craft-Studio', 'Heritage statements that blend seamlessly with modern aesthetics.'),
('c3a33333-3333-3333-3333-333333333333', 'wedding-gifts', 'Wedding & Gifting', 'Memorable tokens of blessings for your loved ones.', TRUE, 'Wedding & Gifting | Gopi Craft-Studio', 'Memorable tokens of blessings for your loved ones.')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed products
INSERT INTO public.products (id, slug, name, short_description, description, price_amount, price_compare_at, images, category_id, tags, badges, rating, review_count, in_stock, stock_count, reserved_stock, low_stock_threshold, sku, material, customizable, customization_options, specs, variants_definition) VALUES
('p1a11111-1111-1111-1111-111111111111', 'heritage-brass-diya-set', 'Heritage Brass Diya Set', 'A pair of hand-carved solid brass diyas for your home alter.', 'Every single contour of these solid brass diyas has been hand-chiseled by our master metalsmiths in Moradabad. Coated in an anti-tarnish golden finish, they are weighted perfectly for everyday prayer rituals.', 1499.00, 1899.00, '[{"src": "/images/placeholder-product-1.jpg", "alt": "Heritage Brass Diya Set"}]'::jsonb, 'c1a11111-1111-1111-1111-111111111111', ARRAY['brass', 'diya', 'temple'], ARRAY['bestseller', 'new'], 5.0, 12, TRUE, 25, 0, 5, 'SKU-BRASS-DIYA-01', 'Brass', TRUE, '[{"name": "Engraving Name", "type": "text", "maxLength": 15}]'::jsonb, '[{"label": "Weight", "value": "450g per piece"}, {"label": "Height", "value": "6 inches"}]'::jsonb, '[{"name": "Color", "values": ["Gold", "Antique Gold"]}]'::jsonb),
('p2a22222-2222-2222-2222-222222222222', 'handcrafted-wooden-mandir', 'Handcrafted Wooden Mandir', 'Sheesham wood home temple cabinet with intricate latticework.', 'Exquisitely hand-carved from seasoned Sheesham (rosewood), this mandir features classic floral jail patterns. Complete with a slide-out tray for offerings and drawer cabinets for prayer items.', 8999.00, 10500.00, '[{"src": "/images/placeholder-product-2.jpg", "alt": "Handcrafted Wooden Mandir"}]'::jsonb, 'c1a11111-1111-1111-1111-111111111111', ARRAY['wooden', 'mandir', 'temple'], ARRAY['limited'], 4.9, 8, TRUE, 4, 0, 2, 'SKU-WOOD-MANDIR-01', 'Sheesham Wood', TRUE, '[{"name": "Drawer Finish", "type": "select", "options": ["Teak", "Natural Rosewood"]}]'::jsonb, '[{"label": "Dimensions", "value": "18 x 12 x 24 inches"}]'::jsonb, '[]'::jsonb),
('p3a33333-3333-3333-3333-333333333333', 'engraved-gift-plaque', 'Engraved Gift Plaque', 'Silver-plated home blessing plaque in premium velvet box.', 'A timeless housewarming or wedding gift. The plate is plated in pure sterling silver and can be customized with family names, dates, or bespoke messages in elegant calligraphy.', 2499.00, 2999.00, '[{"src": "/images/placeholder-product-3.jpg", "alt": "Engraved Gift Plaque"}]'::jsonb, 'c3a33333-3333-3333-3333-333333333333', ARRAY['silver', 'gift', 'plaque'], ARRAY['sale'], 4.8, 15, TRUE, 50, 0, 10, 'SKU-SILVER-PLAQUE-01', 'Silver-plated Brass', TRUE, '[{"name": "Bespoke Engraving Message", "type": "text", "maxLength": 50}]'::jsonb, '[{"label": "Size", "value": "8 x 10 inches"}]'::jsonb, '[]'::jsonb);

-- 6. Seed product_variants
INSERT INTO public.product_variants (product_id, name, options, sku, price, stock_count, reserved_stock, low_stock_threshold) VALUES
('p1a11111-1111-1111-1111-111111111111', 'Heritage Brass Diya Set - Gold', '{"Color": "Gold"}'::jsonb, 'SKU-BRASS-DIYA-01-GLD', 1499.00, 15, 0, 3),
('p1a11111-1111-1111-1111-111111111111', 'Heritage Brass Diya Set - Antique Gold', '{"Color": "Antique Gold"}'::jsonb, 'SKU-BRASS-DIYA-01-ANT', 1650.00, 10, 0, 3);

-- 7. Seed shipping_rules
INSERT INTO public.shipping_rules (zone_name, regions, base_charge, free_shipping_min, estimated_days, active) VALUES
('Local Gujarat', ARRAY['GJ'], 60.00, 1999.00, '2-3 business days', TRUE),
('Domestic Standard', ARRAY['MH', 'KA', 'DL', 'HR', 'UP', 'TN', 'AP', 'TS', 'KL', 'WB', 'MP', 'RJ', 'PB'], 120.00, 2999.00, '5-7 business days', TRUE),
('Rest of India', ARRAY['*'], 180.00, 3999.00, '7-9 business days', TRUE);

-- 8. Seed navigation items
INSERT INTO public.navigation_items (label, href, order_index) VALUES
('Shop', '/shop', 10),
('Categories', '/categories', 20),
('New Arrivals', '/shop?sort=newest', 30),
('Limited Edition', '/shop?collection=limited-edition', 40),
('About', '/about', 50),
('Blog', '/blog', 60),
('Contact', '/contact', 70);

-- 9. Seed footer links
INSERT INTO public.footer_links (column_name, label, href, order_index) VALUES
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

-- 10. Seed testimonials
INSERT INTO public.testimonials (name, location, content, rating, product_name) VALUES
('Priya Sharma', 'Mumbai', 'The brass diya set exceeded every expectation. The craftsmanship is extraordinary — you can feel the artisan''s hand in every curve. It''s become the centerpiece of our daily aarti.', 5, 'Heritage Brass Diya Set'),
('Ananya & Rohit', 'Bangalore', 'We ordered the engraved gift plaque for our housewarming and it was the highlight of the evening. Beautiful packaging, impeccable quality. Gopi Craft-Studio is now our go-to for gifting.', 5, 'Engraved Gift Plaque'),
('Meera Patel', 'Ahmedabad', 'The wooden mandir transformed our living room. It''s modern yet deeply traditional — exactly what we were looking for. The team was incredibly helpful with customization options.', 5, 'Handcrafted Wooden Mandir'),
('Divya Krishnan', 'Chennai', 'Fast shipping, beautiful products, and the WhatsApp support team answered all my questions before I ordered. Rare to find this level of care in online shopping.', 5, NULL);

-- 11. Seed FAQs
INSERT INTO public.faqs (question, answer, category, order_index) VALUES
('Are your products genuinely handcrafted?', 'Yes. Every piece is handcrafted by skilled artisans across India. We work directly with artisan communities in Moradabad, Rajasthan, and Gujarat.', 'General', 10),
('Do you offer customization?', 'Many of our products support customization including engraving, size selection, and finish options. Look for the ''Customizable'' badge on product pages.', 'General', 20),
('What is your shipping policy?', 'We offer free shipping on orders above ₹2,999. Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available at checkout.', 'General', 30),
('Can I track my order?', 'Yes. Once your order ships, you''ll receive a tracking number via email and SMS. You can also track orders on our Track Order page.', 'General', 40),
('What payment methods do you accept?', 'We accept UPI, credit/debit cards, net banking, and popular wallets. Cash on delivery is available for select pin codes.', 'Orders & Payment', 50),
('What is your return policy?', 'We offer a 7-day return policy for unused products in original packaging. Customized items are non-returnable unless defective.', 'Returns', 60),
('How do I care for brass products?', 'Wipe with a soft dry cloth after use. For deeper cleaning, use a mixture of lemon juice and salt, then rinse and dry thoroughly.', 'Product Care', 70),
('Do you ship internationally?', 'Currently we ship within India only. International shipping is coming soon — subscribe to our newsletter for updates.', 'Shipping', 80);
