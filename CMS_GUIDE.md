# Gopi Craft-Studio CMS & Homepage Layout Guide

This guide details how to use the dynamic Website CMS to customize Gopi Craft-Studio layout, navigation, banners, and announcement texts.

## 1. Homepage Layout Builder
In the **Website** tab, under **Homepage Sections**:
- Drag and drop or edit layout blocks.
- **Section Types**:
  - `hero`: Header visual showcase with slider text.
  - `featured_categories`: Grid highlighting main collections (e.g., Brass, Rosewood).
  - `promo_banner`: Special offer layouts.
  - `product_grid`: Display specific collections (e.g. Diwali collection, New Arrivals).
- Click **Save Homepage Layout** to write changes to `homepage_sections` in database.
- Incremental Static Regeneration (ISR) will automatically rebuild the homepage in the background within an hour.

---

## 2. Dynamic Banner Manager
Inside **Website** -> **Banners**:
- Specify headline text, secondary taglines, action link slugs (e.g. `/shop?category=diya`), and background image URLs.
- Copy background image URLs directly from the **Media Library** tab.

---

## 3. Announcement Bar & Navigation Editor
- **Announcement Bar**: Edit the promotional text scrolling at the top of the site (e.g., "Festive Special: Free shipping on orders above ₹2,999!").
- **Navigation Editor**: Define top menu links, categories submenus, and footer columns.
- **Version History**: The `theme_settings_history` table stores layout snapshots. If a change breaks styling, restore a previous configuration version via the admin panel.
