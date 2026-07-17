-- Gopi Craft-Studio Compiled Row Level Security Policies

-- Public SELECT Policies
CREATE POLICY "Public SELECT theme_settings" ON public.theme_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT website_settings" ON public.website_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT seo_settings" ON public.seo_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT homepage_sections" ON public.homepage_sections FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT navigation_items" ON public.navigation_items FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT footer_links" ON public.footer_links FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT categories" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT collections" ON public.collections FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT products" ON public.products FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT product_collection_relations" ON public.product_collection_relations FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT reviews" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT banners" ON public.banners FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT blogs" ON public.blogs FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT faqs" ON public.faqs FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT testimonials" ON public.testimonials FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT instagram_posts" ON public.instagram_posts FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT orders" ON public.orders FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT order_items" ON public.order_items FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT product_variants" ON public.product_variants FOR SELECT USING (TRUE);
CREATE POLICY "Public SELECT shipping_rules" ON public.shipping_rules FOR SELECT USING (TRUE);

-- Public INSERT Policies for transactional operations
CREATE POLICY "Public INSERT orders" ON public.orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public INSERT order_items" ON public.order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public INSERT reviews" ON public.reviews FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public INSERT custom_orders" ON public.custom_orders FOR INSERT WITH CHECK (TRUE);

-- Customer Wishlist Self-Management
CREATE POLICY "Wishlist Owner All Access" ON public.wishlist
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admin CRUD Access controls
CREATE POLICY "Admin CRUD theme_settings" ON public.theme_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD website_settings" ON public.website_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD seo_settings" ON public.seo_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD homepage_versions" ON public.homepage_versions FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD homepage_sections" ON public.homepage_sections FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD navigation_items" ON public.navigation_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD footer_links" ON public.footer_links FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD categories" ON public.categories FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD collections" ON public.collections FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD products" ON public.products FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD product_collection_relations" ON public.product_collection_relations FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD reviews" ON public.reviews FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD banners" ON public.banners FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD orders" ON public.orders FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD order_items" ON public.order_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD wishlist" ON public.wishlist FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD blogs" ON public.blogs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD faqs" ON public.faqs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD testimonials" ON public.testimonials FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD instagram_posts" ON public.instagram_posts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD custom_orders" ON public.custom_orders FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD media_library" ON public.media_library FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD admin_users" ON public.admin_users FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD product_variants" ON public.product_variants FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD inventory_history" ON public.inventory_history FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD shipping_rules" ON public.shipping_rules FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin CRUD activity_logs" ON public.activity_logs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
