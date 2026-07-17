"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, RefreshCw, Search, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { 
  fetchShippingRules, 
  saveShippingRule, 
  deleteShippingRule 
} from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";

// ==============================================================================
// 1. SHIPPING RULES MANAGER
// ==============================================================================
export function ShippingManager() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [zoneName, setZoneName] = useState("");
  const [regions, setRegions] = useState("");
  const [baseCharge, setBaseCharge] = useState("");
  const [freeShippingMin, setFreeShippingMin] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [active, setActive] = useState(true);

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await fetchShippingRules();
      setRules(data);
    } catch (err) {
      alert("Failed to load shipping rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    setZoneName(rule.zone_name || rule.zoneName || "");
    setRegions((rule.regions || []).join(", "));
    setBaseCharge(String(rule.base_charge || rule.baseCharge || 0));
    setFreeShippingMin(rule.free_shipping_min || rule.freeShippingMin ? String(rule.free_shipping_min || rule.freeShippingMin) : "");
    setEstimatedDays(rule.estimated_days || rule.estimatedDays || "");
    setActive(rule.active !== false);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingRule(null);
    setZoneName("");
    setRegions("");
    setBaseCharge("");
    setFreeShippingMin("");
    setEstimatedDays("5-7 business days");
    setActive(true);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName || !baseCharge) {
      alert("Zone Name and Base Charge are required.");
      return;
    }

    const payload = {
      id: editingRule?.id,
      zoneName,
      regions: regions.split(",").map(r => r.trim()).filter(r => r !== ""),
      baseCharge: Number(baseCharge),
      freeShippingMin: freeShippingMin ? Number(freeShippingMin) : null,
      estimatedDays,
      active
    };

    setLoading(true);
    const res = await saveShippingRule(payload);
    if (res.success) {
      setShowForm(false);
      loadRules();
    } else {
      alert("Error saving shipping rule: " + res.error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipping rule?")) return;
    setLoading(true);
    const res = await deleteShippingRule(id);
    if (res.success) {
      loadRules();
    } else {
      alert("Error deleting shipping rule: " + res.error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-2xl text-text">Shipping Zones & Rules</h2>
          <p className="text-xs text-text-muted mt-1">Configure shipping rates by Indian states or region codes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadRules} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="accent" size="sm" onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Shipping Zone
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-primary p-6 shadow-sm max-w-xl">
          <h3 className="font-serif text-lg text-text mb-4">
            {editingRule ? "Edit Shipping Rule" : "Create New Shipping Rule"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Zone Name (e.g. Gujarat Local)" 
                value={zoneName} 
                onChange={(e) => setZoneName(e.target.value)} 
                required 
              />
              <Input 
                label="Estimated Delivery (e.g. 2-3 business days)" 
                value={estimatedDays} 
                onChange={(e) => setEstimatedDays(e.target.value)} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted">Regions/States (comma separated code e.g. GJ, MH, KA or * for fallback)</label>
              <Input 
                placeholder="e.g. GJ, MH, KA"
                value={regions} 
                onChange={(e) => setRegions(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Base Shipping Charge (₹)" 
                type="number" 
                value={baseCharge} 
                onChange={(e) => setBaseCharge(e.target.value)} 
                required 
              />
              <Input 
                label="Free Shipping Above Order (₹) - Optional" 
                type="number" 
                value={freeShippingMin} 
                onChange={(e) => setFreeShippingMin(e.target.value)} 
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                id="active" 
                type="checkbox" 
                checked={active} 
                onChange={(e) => setActive(e.target.checked)} 
                className="rounded border-border text-accent focus:ring-accent"
              />
              <label htmlFor="active" className="text-sm text-text font-medium">Activate Shipping Zone Rule</label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" size="sm" loading={loading}>
                Save Zone Rule
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading && rules.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-text-muted">
          <p className="text-sm">No shipping rules configured. Dynamic shipping defaults to standard charges.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-primary shadow-sm">
          <table className="w-full text-left text-sm text-text">
            <thead className="bg-secondary/40 text-xs font-semibold text-text-muted border-b border-border uppercase">
              <tr>
                <th className="px-6 py-4">Zone / Regions</th>
                <th className="px-6 py-4">Estimated Delivery</th>
                <th className="px-6 py-4">Rate</th>
                <th className="px-6 py-4">Free Shipping threshold</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rules.map((rule) => {
                const zone = rule.zone_name || rule.zoneName;
                const base = rule.base_charge || rule.baseCharge;
                const min = rule.free_shipping_min || rule.freeShippingMin;
                const days = rule.estimated_days || rule.estimatedDays;
                return (
                  <tr key={rule.id} className="hover:bg-secondary/10">
                    <td className="px-6 py-4 font-semibold">
                      <div>{zone}</div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        Regions: {rule.regions && rule.regions.length > 0 ? rule.regions.join(", ") : "All"}
                      </div>
                    </td>
                    <td className="px-6 py-4">{days || "N/A"}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(base)}</td>
                    <td className="px-6 py-4 text-text-muted">
                      {min ? `Free above ${formatPrice(min)}` : "None"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        rule.active 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {rule.active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(rule)}
                        className="text-text-muted hover:text-accent p-1"
                        title="Edit Zone"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(rule.id)}
                        className="text-text-muted hover:text-red-500 p-1"
                        title="Delete Zone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// 2. SYSTEM ACTIVITY AUDIT LOGS VIEW
// ==============================================================================
export function LogsManager() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadLogs = async () => {
    setLoading(true);
    try {
      const isConfigured = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      if (!isConfigured) {
        // Return Mock logs for preview
        setLogs([
          { id: "l1", admin_email: "superadmin@gopicraftstudio.com", action: "LOGIN", resource_id: "u1", details: { ip: "127.0.0.1" }, created_at: new Date().toISOString() },
          { id: "l2", admin_email: "superadmin@gopicraftstudio.com", action: "PRODUCT_ADD", resource_id: "p1", details: { name: "Heritage Brass Diya Set" }, created_at: new Date().toISOString() }
        ]);
        return;
      }

      const supabase = createClient();
      let query = supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`admin_email.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Fetch audit logs failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-2xl text-text">Administrative Audit Logs</h2>
          <p className="text-xs text-text-muted mt-1">Track modifications, sign-ins, and layout version updates across the CMS panel</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-primary border border-border p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search logs by email, login, or action name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-secondary/20 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {loading && logs.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-text-muted">
          <p className="text-sm">No activity logs recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-primary shadow-sm">
          <table className="w-full text-left text-sm text-text">
            <thead className="bg-secondary/40 text-xs font-semibold text-text-muted border-b border-border uppercase">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Resource ID</th>
                <th className="px-6 py-4">Context Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/10 font-mono text-xs">
                  <td className="px-6 py-4 whitespace-nowrap text-text-muted flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-text flex items-center gap-1.5 font-sans font-semibold">
                    <User className="h-3.5 w-3.5 text-text-light" />
                    {log.admin_email || "System/Trigger"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{log.resource_id || "N/A"}</td>
                  <td className="px-6 py-4 font-sans text-xs text-text-light">
                    {log.details ? JSON.stringify(log.details) : "{}"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
