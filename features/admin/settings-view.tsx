"use client";

import { useState } from "react";
import { updateWebsiteSettings, updateThemeSettings } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleLeft, ToggleRight, Save, Layout, Sliders, Volume2, Globe } from "lucide-react";

interface SettingsViewProps {
  theme: any;
  website: any;
  onRefresh: () => void;
}

export function SettingsView({ theme, website, onRefresh }: SettingsViewProps) {
  const [dbTheme, setDbTheme] = useState(theme);
  const [dbWebsite, setDbWebsite] = useState(website);
  const [savingTheme, setSavingTheme] = useState(false);
  const [savingWebsite, setSavingWebsite] = useState(false);

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTheme(true);
    try {
      const res = await updateThemeSettings(dbTheme);
      if (res.success) {
        alert("Theme settings saved! Refresh to see structural changes.");
        onRefresh();
      } else {
        alert("Error: " + res.error);
      }
    } catch {
      alert("Failed to save theme.");
    } finally {
      setSavingTheme(false);
    }
  };

  const handleSaveWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWebsite(true);
    try {
      const res = await updateWebsiteSettings(dbWebsite);
      if (res.success) {
        alert("Website settings saved!");
        onRefresh();
      } else {
        alert("Error: " + res.error);
      }
    } catch {
      alert("Failed to save website configurations.");
    } finally {
      setSavingWebsite(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
      {/* 1. Brand & Theme Engine Settings */}
      <div className="rounded-xl border border-border bg-primary p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Sliders className="h-5 w-5 text-accent" />
          <h3 className="font-serif text-lg">Theme & Styling Engine</h3>
        </div>

        <form onSubmit={handleSaveTheme} className="space-y-4">
          <Input
            label="Logo Brand Name"
            value={dbTheme.logoText || ""}
            onChange={(e) => setDbTheme((p: any) => ({ ...p, logoText: e.target.value }))}
            placeholder="e.g. Gopi Craft-Studio"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">Primary Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={dbTheme.primaryColor || "#ffffff"}
                  onChange={(e) => setDbTheme((p: any) => ({ ...p, primaryColor: e.target.value }))}
                  className="h-10 w-10 border border-border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={dbTheme.primaryColor || "#ffffff"}
                  onChange={(e) => setDbTheme((p: any) => ({ ...p, primaryColor: e.target.value }))}
                  className="flex-1 h-10 px-2 border border-border rounded text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">Accent Color (Gold)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={dbTheme.accentColor || "#c4a265"}
                  onChange={(e) => setDbTheme((p: any) => ({ ...p, accentColor: e.target.value }))}
                  className="h-10 w-10 border border-border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={dbTheme.accentColor || "#c4a265"}
                  onChange={(e) => setDbTheme((p: any) => ({ ...p, accentColor: e.target.value }))}
                  className="flex-1 h-10 px-2 border border-border rounded text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">Border Radius</label>
              <select
                value={dbTheme.borderRadius || "0.5rem"}
                onChange={(e) => setDbTheme((p: any) => ({ ...p, borderRadius: e.target.value }))}
                className="w-full h-11 px-3 border border-border rounded-md bg-primary text-sm focus:outline-none"
              >
                <option value="0px">Sharp (0px)</option>
                <option value="0.25rem">Minimal (0.25rem)</option>
                <option value="0.5rem">Standard (0.5rem)</option>
                <option value="0.75rem">Rounded (0.75rem)</option>
                <option value="1rem">Maximum (1rem)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">Button Style</label>
              <select
                value={dbTheme.buttonStyle || "default"}
                onChange={(e) => setDbTheme((p: any) => ({ ...p, buttonStyle: e.target.value }))}
                className="w-full h-11 px-3 border border-border rounded-md bg-primary text-sm focus:outline-none"
              >
                <option value="default">Default Theme style</option>
                <option value="flat">Sharp / Flat</option>
                <option value="pill">Pill Shape</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Favicon URL"
              value={dbTheme.faviconUrl || ""}
              onChange={(e) => setDbTheme((p: any) => ({ ...p, faviconUrl: e.target.value }))}
              placeholder="Favicon .ico link"
            />
            <Input
              label="Logo Image URL (Optional)"
              value={dbTheme.logoUrl || ""}
              onChange={(e) => setDbTheme((p: any) => ({ ...p, logoUrl: e.target.value }))}
              placeholder="e.g. /images/logo.png"
            />
          </div>

          <Button type="submit" variant="accent" className="w-full h-12" loading={savingTheme}>
            <Save className="h-4 w-4 mr-2" />
            Apply Theme Styles
          </Button>
        </form>
      </div>

      {/* 2. Global Site Configurations */}
      <div className="rounded-xl border border-border bg-primary p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Globe className="h-5 w-5 text-accent" />
          <h3 className="font-serif text-lg">Store Configurations</h3>
        </div>

        <form onSubmit={handleSaveWebsite} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Business Tagline"
              value={dbWebsite.tagline || ""}
              onChange={(e) => setDbWebsite((p: any) => ({ ...p, tagline: e.target.value }))}
              placeholder="Where Tradition Meets Elegance"
            />
            <Input
              label="Business Hours"
              value={dbWebsite.businessHours || ""}
              onChange={(e) => setDbWebsite((p: any) => ({ ...p, businessHours: e.target.value }))}
              placeholder="e.g. Mon - Sat: 9:00 AM - 6:00 PM"
            />
          </div>

          {/* Announcement toggle */}
          <div className="flex items-center justify-between py-2 border-b border-border/60">
            <span className="text-sm font-medium">Display Announcement Bar</span>
            <button
              type="button"
              onClick={() => setDbWebsite((p: any) => ({ ...p, announcementVisible: !p.announcementVisible }))}
            >
              {dbWebsite.announcementVisible ? (
                <ToggleRight className="h-8 w-8 text-accent" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-text-light" />
              )}
            </button>
          </div>

          {dbWebsite.announcementVisible && (
            <Input
              label="Announcement Bar Text"
              value={dbWebsite.announcementText || ""}
              onChange={(e) => setDbWebsite((p: any) => ({ ...p, announcementText: e.target.value }))}
              placeholder="e.g. Free shipping on orders above ₹2,999"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="WhatsApp Shop Number"
              value={dbWebsite.whatsappNumber || ""}
              onChange={(e) => setDbWebsite((p: any) => ({ ...p, whatsappNumber: e.target.value }))}
              placeholder="+918733844948"
            />
            <Input
              label="Instagram Handle"
              value={dbWebsite.instagramHandle || ""}
              onChange={(e) => setDbWebsite((p: any) => ({ ...p, instagramHandle: e.target.value }))}
              placeholder="gopicraftstudio_38"
            />
          </div>

          {/* Store Address Fields */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Store Address</h4>
            <Input
              label="Street Name"
              value={dbWebsite.address?.street || ""}
              onChange={(e) => setDbWebsite((p: any) => ({
                ...p,
                address: { ...(p.address || {}), street: e.target.value }
              }))}
              placeholder="Craft Lane, Heritage District"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="City"
                value={dbWebsite.address?.city || ""}
                onChange={(e) => setDbWebsite((p: any) => ({
                  ...p,
                  address: { ...(p.address || {}), city: e.target.value }
                }))}
                placeholder="Ahmedabad"
              />
              <Input
                label="State"
                value={dbWebsite.address?.state || ""}
                onChange={(e) => setDbWebsite((p: any) => ({
                  ...p,
                  address: { ...(p.address || {}), state: e.target.value }
                }))}
                placeholder="Gujarat"
              />
              <Input
                label="Pincode"
                value={dbWebsite.address?.pincode || ""}
                onChange={(e) => setDbWebsite((p: any) => ({
                  ...p,
                  address: { ...(p.address || {}), pincode: e.target.value }
                }))}
                placeholder="380001"
              />
            </div>
          </div>

          {/* Social Links Sub-Section */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Social Media handles</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Facebook Username"
                value={dbWebsite.socialLinks?.facebook || ""}
                onChange={(e) => setDbWebsite((p: any) => ({
                  ...p,
                  socialLinks: { ...(p.socialLinks || {}), facebook: e.target.value }
                }))}
                placeholder="gopicraft"
              />
              <Input
                label="Pinterest Username"
                value={dbWebsite.socialLinks?.pinterest || ""}
                onChange={(e) => setDbWebsite((p: any) => ({
                  ...p,
                  socialLinks: { ...(p.socialLinks || {}), pinterest: e.target.value }
                }))}
                placeholder="gopicraft"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
            <Input
              label="Store Contact Phone"
              value={dbWebsite.phone || ""}
              onChange={(e) => setDbWebsite((p: any) => ({ ...p, phone: e.target.value }))}
              placeholder="+91 8733844948"
            />
            <Input
              label="Store Email"
              value={dbWebsite.email || ""}
              onChange={(e) => setDbWebsite((p: any) => ({ ...p, email: e.target.value }))}
              placeholder="hello@gopicraftstudio.com"
            />
          </div>

          {/* Google Maps link */}
          <Input
            label="Google Maps Place Embed Link"
            value={dbWebsite.googleMapsUrl || ""}
            onChange={(e) => setDbWebsite((p: any) => ({ ...p, googleMapsUrl: e.target.value }))}
            placeholder="https://google.com/maps/embed/..."
          />

          {/* SEO Defaults Section */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Global SEO Mappings</h4>
            <Input
              label="SEO Title Pattern"
              value={dbWebsite.seoDefaults?.title || ""}
              onChange={(e) => setDbWebsite((p: any) => ({
                ...p,
                seoDefaults: { ...(p.seoDefaults || {}), title: e.target.value }
              }))}
              placeholder="Gopi Craft-Studio | Luxury Indian Decor"
            />
            <Input
              label="SEO Default Description"
              value={dbWebsite.seoDefaults?.description || ""}
              onChange={(e) => setDbWebsite((p: any) => ({
                ...p,
                seoDefaults: { ...(p.seoDefaults || {}), description: e.target.value }
              }))}
              placeholder="Premium handcrafted traditional Indian decor..."
            />
          </div>

          {/* Footer settings Section */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Footer Configurations</h4>
            <Input
              label="Copyright Disclaimer"
              value={dbWebsite.footerSettings?.copyright || ""}
              onChange={(e) => setDbWebsite((p: any) => ({
                ...p,
                footerSettings: { ...(p.footerSettings || {}), copyright: e.target.value }
              }))}
              placeholder="© 2026 Gopi Craft-Studio. All rights reserved."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Free Shipping Threshold (₹)"
              type="number"
              value={dbWebsite.freeShippingThreshold || 0}
              onChange={(e) => setDbWebsite((p: any) => ({ ...p, freeShippingThreshold: Number(e.target.value) }))}
            />
          </div>

          <Button type="submit" variant="accent" className="w-full h-12" loading={savingWebsite}>
            <Save className="h-4 w-4 mr-2" />
            Save Configurations
          </Button>
        </form>
      </div>
    </div>
  );
}
