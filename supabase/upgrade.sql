-- Upgrade website_settings schema with additional configurations
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT 'Where Tradition Meets Elegance';
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS business_hours VARCHAR(100) DEFAULT 'Mon - Sat: 9:00 AM - 6:00 PM';
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{"instagram": "gopicraftstudio_38", "pinterest": "", "facebook": "", "youtube": ""}'::jsonb;
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS seo_defaults JSONB DEFAULT '{"title": "Gopi Craft-Studio | Luxury Indian Decor", "description": "Premium handcrafted traditional Indian decor, pooja accessories, and heritage artifacts."}'::jsonb;
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS footer_settings JSONB DEFAULT '{"copyright": "© 2026 Gopi Craft-Studio. All rights reserved.", "column1": "Shop", "column2": "Company", "column3": "Support"}'::jsonb;
