"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminData, adminSignOut } from "@/lib/supabase/actions";
import { OrdersView } from "@/features/admin/orders-view";
import { ProductsView } from "@/features/admin/products-view";
import { WebsiteView } from "@/features/admin/website-view";
import { MediaView } from "@/features/admin/media-view";
import { SettingsView } from "@/features/admin/settings-view";
import { 
  CategoriesManager, 
  BlogsManager, 
  FaqsManager, 
  ReviewsManager, 
  SeoManager 
} from "@/features/admin/simple-crud-views";
import { ShippingManager, LogsManager } from "@/features/admin/shipping-logs-views";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, ShoppingBag, FolderHeart, LayoutGrid, 
  Truck, Star, BookOpen, Image as ImageIcon, Percent, Search, 
  Settings, LogOut, Menu, X, ArrowLeft 
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminData();
      setData(res);
    } catch {
      alert("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out?")) return;
    const res = await adminSignOut();
    if (res.success) {
      router.push("/admin/login");
      router.refresh();
    }
  };

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary/30">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-text-muted">Loading Gopi Studio Admin Control...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: Truck, badge: data.orders.filter((o: any) => o.status === "pending").length },
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "categories", label: "Categories", icon: LayoutGrid },
    { id: "shipping", label: "Shipping Rules", icon: Truck },
    { id: "website", label: "Website", icon: LayoutGrid },
    { id: "media", label: "Media Library", icon: ImageIcon },
    { id: "blogs", label: "Blogs", icon: BookOpen },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "faqs", label: "FAQs", icon: BookOpen },
    { id: "logs", label: "Activity Logs", icon: BookOpen },
    { id: "seo", label: "SEO Settings", icon: Settings },
    { id: "settings", label: "Global Settings", icon: Settings },
  ];

  // Compute quick stats
  const totalSales = data.orders
    .filter((o: any) => o.status !== "cancelled" && o.status !== "returned")
    .reduce((sum: number, o: any) => sum + Number(o.total), 0);
  const pendingOrders = data.orders.filter((o: any) => o.status === "pending").length;
  const inStockProducts = data.products.filter((p: any) => p.inStock).length;

  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-2xl text-text">Overview Stats</h2>
              <p className="text-xs text-text-muted mt-1">Realtime summary of shop performance</p>
            </div>
            
            {/* Quick Cards Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-primary p-6 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Sales</span>
                <span className="text-2xl font-bold text-accent mt-2">{formatPrice(totalSales)}</span>
                <span className="text-[10px] text-text-light mt-1">Excludes cancelled/refunded</span>
              </div>
              <div className="rounded-xl border border-border bg-primary p-6 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Pending Orders</span>
                <span className="text-2xl font-bold text-warning mt-2">{pendingOrders}</span>
                <span className="text-[10px] text-text-light mt-1">Requires packaging & shipping</span>
              </div>
              <div className="rounded-xl border border-border bg-primary p-6 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Active Catalog</span>
                <span className="text-2xl font-bold text-success mt-2">{inStockProducts} / {data.products.length}</span>
                <span className="text-[10px] text-text-light mt-1">Products currently in stock</span>
              </div>
            </div>

            {/* Quick Actions (WhatsApp Style Big Cards) */}
            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Studio Quick Controls</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className="rounded-xl border border-border bg-primary p-6 hover:border-accent/40 hover:bg-secondary/10 transition-all text-left flex items-start gap-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-semibold text-text">Process Orders</h4>
                    <p className="text-xs text-text-light mt-1">Click to confirm payments, update shipping codes, print invoices, and update customers.</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("website")}
                  className="rounded-xl border border-border bg-primary p-6 hover:border-accent/40 hover:bg-secondary/10 transition-all text-left flex items-start gap-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-semibold text-text">Homepage Layout Builder</h4>
                    <p className="text-xs text-text-light mt-1">Rearrange hero blocks, edit marketing texts, show or hide sliders, and restore version history.</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      case "orders":
        return <OrdersView orders={data.orders} onRefresh={loadData} />;
      case "products":
        return <ProductsView products={data.products} categories={data.categories} onRefresh={loadData} />;
      case "categories":
        return <CategoriesManager categories={data.categories} onRefresh={loadData} />;
      case "shipping":
        return <ShippingManager />;
      case "website":
        return <WebsiteView initialSections={data.theme.homepageSections || []} onRefresh={loadData} />;
      case "media":
        return <MediaView />;
      case "blogs":
        return <BlogsManager blogs={data.blogs} onRefresh={loadData} />;
      case "reviews":
        return <ReviewsManager />;
      case "faqs":
        return <FaqsManager faqs={data.faqs} onRefresh={loadData} />;
      case "logs":
        return <LogsManager />;
      case "seo":
        return <SeoManager />;
      case "settings":
        return <SettingsView theme={data.theme} website={data.website} onRefresh={loadData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col">
      {/* Admin Header Bar */}
      <header className="h-16 border-b border-border bg-primary flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10 flex items-center justify-center rounded-md border border-border lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-serif text-lg tracking-wide text-accent font-bold">Gopi Control Hub</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs font-semibold text-text-muted bg-secondary border border-border px-3 py-1.5 rounded-full capitalize">
            Signed in as Admin
          </span>
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center border border-border rounded-md hover:bg-error/10 hover:border-error/30 text-text-muted hover:text-error transition-all"
            aria-label="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-1 flex relative">
        {/* Navigation Sidebar (Desktop & Mobile drawer) */}
        <aside className={`
          absolute lg:static top-0 left-0 bottom-0 z-30 w-64 border-r border-border bg-primary p-4 overflow-y-auto transition-transform duration-300
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive 
                      ? "bg-accent text-white" 
                      : "text-text-muted hover:bg-secondary hover:text-text"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`h-5 px-1.5 min-w-[20px] text-[10px] font-bold rounded-full flex items-center justify-center ${
                      isActive ? "bg-white text-accent" : "bg-accent text-white"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {/* Back button for sub-editor tabs on mobile if activeTab != dashboard */}
          {activeTab !== "dashboard" && (
            <button
              onClick={() => setActiveTab("dashboard")}
              className="lg:hidden mb-6 flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-text border border-border bg-primary px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Main Menu
            </button>
          )}

          {renderActiveContent()}
        </main>
      </div>
    </div>
  );
}
