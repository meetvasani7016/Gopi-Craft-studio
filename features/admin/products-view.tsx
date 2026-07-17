"use client";

import { useState, useEffect } from "react";
import { 
  saveProduct, 
  deleteProduct, 
  exportProductsCSV, 
  importProductsCSV,
  saveProductVariants
} from "@/lib/supabase/actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Product, Category, DbProductVariant } from "@/types";
import { Plus, Trash, Edit, ArrowLeft, Image as ImageIcon, Save, ToggleLeft, ToggleRight, Download, Upload } from "lucide-react";

interface ProductFormState extends Partial<Product> {
  categoryId?: string;
  variants?: DbProductVariant[];
}

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
}

export function ProductsView({ products, categories, onRefresh }: ProductsViewProps) {
  const [editingProduct, setEditingProduct] = useState<ProductFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [optionInputs, setOptionInputs] = useState<{name: string, values: string}[]>([
    { name: "", values: "" }
  ]);

  useEffect(() => {
    if (editingProduct) {
      if (editingProduct.variantsDefinition && editingProduct.variantsDefinition.length > 0) {
        setOptionInputs(editingProduct.variantsDefinition.map((d: any) => ({
          name: d.name,
          values: d.values.join(", ")
        })));
      } else {
        setOptionInputs([{ name: "", values: "" }]);
      }
    }
  }, [editingProduct?.id]);

  const generateCombinations = () => {
    const validOptions = optionInputs.filter(o => o.name.trim() !== "" && o.values.trim() !== "");
    if (validOptions.length === 0) {
      alert("Please define at least one option with values.");
      return;
    }

    const definition = validOptions.map(o => ({
      name: o.name.trim(),
      values: o.values.split(",").map(v => v.trim()).filter(v => v !== "")
    }));

    setEditingProduct(prev => prev ? { ...prev, variantsDefinition: definition } : null);

    const cartesian = (...a: any[]) => a.reduce((b, c) => b.flatMap((d: any) => c.map((e: any) => [d, e].flat())));
    const valuesArray = definition.map(d => d.values);
    let combinations: string[][] = [];
    if (valuesArray.length === 1) {
      combinations = valuesArray[0].map(v => [v]);
    } else if (valuesArray.length > 1) {
      combinations = cartesian(...valuesArray);
    }

    const baseSku = editingProduct?.sku || "SKU";
    const generatedVariants: any[] = combinations.map((combo, idx) => {
      const name = `${editingProduct?.name || "Product"} - ${combo.join(" / ")}`;
      const optionsObj: Record<string, string> = {};
      combo.forEach((val, i) => {
        optionsObj[definition[i].name] = val;
      });

      const skuSuffix = combo.map(v => v.slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, "")).join("-");
      const sku = `${baseSku}-${skuSuffix}-${idx + 1}`;

      return {
        id: "",
        productId: editingProduct?.id || "",
        name,
        options: optionsObj,
        sku,
        price: editingProduct?.price?.amount,
        stockCount: 0,
        reservedStock: 0,
        lowStockThreshold: 5
      };
    });

    setEditingProduct(prev => prev ? { ...prev, variants: generatedVariants } : null);
  };

  const handleExportCSV = async () => {
    try {
      const csv = await exportProductsCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("CSV Export failed.");
    }
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      try {
        const res = await importProductsCSV(text);
        if (res.success) {
          alert(`Import successful! ${res.successCount} products upserted.`);
          onRefresh();
        } else {
          alert("Import failed: " + (res as any).error);
        }
      } catch (err: any) {
        alert("Import failed: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleEdit = (p: Product) => {
    // Map to simple form format
    setEditingProduct({
      ...p,
      categoryId: categories.find(c => c.name === p.category.name)?.id,
      variants: p.variants || []
    } as any);
  };

  const handleNew = () => {
    setEditingProduct({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      price: { amount: 0, currency: "INR" },
      images: [],
      categoryId: categories[0]?.id || "",
      tags: [],
      badges: [],
      inStock: true,
      stockCount: 0,
      sku: "",
      material: "",
      occasion: [],
      customizable: false,
      specs: [],
      faqs: [],
      relatedProductIds: [],
      variantsDefinition: [],
      variants: []
    } as any);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    
    // Auto-generate slug if missing
    if (!editingProduct.slug) {
      editingProduct.slug = editingProduct.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    try {
      const res = await saveProduct(editingProduct);
      if (res.success) {
        if (editingProduct.variants) {
          await saveProductVariants(res.id, editingProduct.variants);
        }
        onRefresh();
        setEditingProduct(null);
      } else {
        alert("Error saving: " + res.error);
      }
    } catch (err: any) {
      alert("Failed to save product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        onRefresh();
      } else {
        alert("Error deleting: " + res.error);
      }
    } catch {
      alert("Failed to delete product.");
    }
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    const currentImages = editingProduct?.images || [];
    setEditingProduct((prev) => 
      prev 
        ? { 
            ...prev, 
            images: [...currentImages, { src: imageUrl.trim(), alt: prev.name || "Product Image" }] 
          } 
        : null
    );
    setImageUrl("");
  };

  const removeImage = (index: number) => {
    const currentImages = editingProduct?.images || [];
    setEditingProduct((prev) => 
      prev 
        ? { 
            ...prev, 
            images: currentImages.filter((_, i) => i !== index) 
          } 
        : null
    );
  };

  return (
    <div className="space-y-6">
      {editingProduct ? (
        /* Edit/Create Form View */
        <div className="rounded-xl border border-border bg-primary p-6 md:p-8 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <button
              onClick={() => setEditingProduct(null)}
              className="flex items-center text-sm font-semibold text-text-muted hover:text-text gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="font-serif text-2xl">
              {editingProduct.id ? "Edit Product" : "New Product"}
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Product Name"
                value={editingProduct.name || ""}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="e.g. Heritage Brass Diya Set"
                required
              />

              <Input
                label="Slug (URL Path)"
                value={editingProduct.slug || ""}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, slug: e.target.value } : null)}
                placeholder="e.g. heritage-brass-diya-set"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-text">Category</label>
                <select
                  value={editingProduct.categoryId || ""}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, categoryId: e.target.value } : null)}
                  className="w-full h-11 px-3 border border-border rounded-md bg-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Price (₹)"
                type="number"
                value={editingProduct.price?.amount || 0}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: { ...prev.price!, amount: Number(e.target.value) } } : null)}
                required
              />

              <Input
                label="Compare At Price (₹ - Optional)"
                type="number"
                value={editingProduct.price?.compareAt || ""}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: { ...prev.price!, compareAt: e.target.value ? Number(e.target.value) : undefined } } : null)}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <Input
                label="SKU"
                value={editingProduct.sku || ""}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, sku: e.target.value } : null)}
                placeholder="e.g. GCS-BR-049"
              />

              <Input
                label="Material"
                value={editingProduct.material || ""}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, material: e.target.value } : null)}
                placeholder="e.g. Pure Brass"
              />

              <Input
                label="Stock Count"
                type="number"
                value={editingProduct.stockCount || 0}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stockCount: Number(e.target.value) } : null)}
              />
            </div>

            <div className="flex gap-6 items-center">
              <button
                type="button"
                onClick={() => setEditingProduct(prev => prev ? { ...prev, inStock: !prev.inStock } : null)}
                className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text"
              >
                {editingProduct.inStock ? (
                  <ToggleRight className="h-7 w-7 text-success" />
                ) : (
                  <ToggleLeft className="h-7 w-7 text-text-light" />
                )}
                In Stock & Available
              </button>

              <button
                type="button"
                onClick={() => setEditingProduct(prev => prev ? { ...prev, customizable: !prev.customizable } : null)}
                className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text"
              >
                {editingProduct.customizable ? (
                  <ToggleRight className="h-7 w-7 text-accent" />
                ) : (
                  <ToggleLeft className="h-7 w-7 text-text-light" />
                )}
                Supports Custom Engravings / Requests
              </button>
            </div>

            <Textarea
              label="Short Description"
              value={editingProduct.shortDescription || ""}
              onChange={(e) => setEditingProduct(prev => prev ? { ...prev, shortDescription: e.target.value } : null)}
              placeholder="e.g. Elegant pure brass hand-carved diya for your mandir centerpiece."
              required
            />

            <Textarea
              label="Long Description"
              value={editingProduct.description || ""}
              onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
              placeholder="Detailed description of the artisan craftsmanship, dimensions, care guide..."
              rows={5}
            />

            {/* Images Manager */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-medium text-text">Product Images</h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {editingProduct.images?.map((img, idx) => (
                  <div key={idx} className="relative aspect-square border border-border rounded-lg bg-secondary overflow-hidden group">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-error text-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste Image URL here (or upload via Media tab first)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 h-11 px-3 border border-border rounded-md bg-primary text-sm focus:outline-none"
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </div>
            </div>

            {/* Badges Checklist */}
            <div className="space-y-3 border-t border-border pt-6">
              <h3 className="text-sm font-medium">Badges</h3>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                {["new", "bestseller", "limited", "sale"].map((badge) => {
                  const currentBadges = editingProduct.badges || [];
                  const isChecked = currentBadges.includes(badge as any);
                  return (
                    <label key={badge} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const updated = isChecked
                            ? currentBadges.filter(b => b !== badge)
                            : [...currentBadges, badge];
                          setEditingProduct(prev => prev ? { ...prev, badges: updated as any } : null);
                        }}
                        className="h-4 w-4 border-border rounded text-accent focus:ring-accent"
                      />
                      <span className="capitalize">{badge}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Database Variants Configuration Editor */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-text">Database Product Variants</h3>
              <p className="text-xs text-text-muted">Define product options (e.g. Color, Size) and generate variant stock/pricing combinations.</p>
              
              <div className="space-y-3">
                {optionInputs.map((opt, optIdx) => (
                  <div key={optIdx} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input 
                        label="Option Name" 
                        placeholder="e.g. Color" 
                        value={opt.name} 
                        onChange={(e) => {
                          const updated = [...optionInputs];
                          updated[optIdx].name = e.target.value;
                          setOptionInputs(updated);
                        }} 
                      />
                    </div>
                    <div className="flex-[2]">
                      <Input 
                        label="Values (comma separated)" 
                        placeholder="e.g. Gold, Antique Gold" 
                        value={opt.values} 
                        onChange={(e) => {
                          const updated = [...optionInputs];
                          updated[optIdx].values = e.target.value;
                          setOptionInputs(updated);
                        }} 
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-11 hover:text-red-500"
                      onClick={() => {
                        setOptionInputs(optionInputs.filter((_, i) => i !== optIdx));
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setOptionInputs([...optionInputs, { name: "", values: "" }])}
                  >
                    <Plus className="h-4 w-4 mr-1.5" /> Add Option Row
                  </Button>
                  <Button 
                    type="button" 
                    variant="default" 
                    size="sm"
                    onClick={generateCombinations}
                  >
                    Generate Variant Combinations
                  </Button>
                </div>
              </div>

              {/* Variants Grid Table */}
              {editingProduct.variants && editingProduct.variants.length > 0 && (
                <div className="border border-border rounded-lg bg-secondary/10 overflow-hidden mt-4">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-secondary/40 border-b border-border text-text-muted font-semibold">
                        <th className="p-3">Variant Combination</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Price override (₹)</th>
                        <th className="p-3">Stock Count</th>
                        <th className="p-3">Low stock warning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-primary">
                      {editingProduct.variants.map((v: any, vIdx: number) => (
                        <tr key={vIdx}>
                          <td className="p-3 font-semibold text-text">{v.name}</td>
                          <td className="p-3">
                            <input 
                              type="text" 
                              value={v.sku} 
                              onChange={(e) => {
                                const updated = [...editingProduct.variants!];
                                updated[vIdx].sku = e.target.value;
                                setEditingProduct(prev => prev ? { ...prev, variants: updated } : null);
                              }}
                              className="w-full px-2 py-1 text-xs border border-border rounded focus:outline-none focus:border-accent"
                            />
                          </td>
                          <td className="p-3">
                            <input 
                              type="number" 
                              value={v.price !== undefined ? v.price : ""} 
                              placeholder="Default"
                              onChange={(e) => {
                                const updated = [...editingProduct.variants!];
                                updated[vIdx].price = e.target.value ? Number(e.target.value) : undefined;
                                setEditingProduct(prev => prev ? { ...prev, variants: updated } : null);
                              }}
                              className="w-24 px-2 py-1 text-xs border border-border rounded focus:outline-none focus:border-accent"
                            />
                          </td>
                          <td className="p-3">
                            <input 
                              type="number" 
                              value={v.stockCount !== undefined ? v.stockCount : 0} 
                              onChange={(e) => {
                                const updated = [...editingProduct.variants!];
                                const val = Number(e.target.value);
                                updated[vIdx].stockCount = val;
                                setEditingProduct(prev => prev ? { ...prev, variants: updated } : null);
                              }}
                              className="w-20 px-2 py-1 text-xs border border-border rounded focus:outline-none focus:border-accent"
                            />
                          </td>
                          <td className="p-3">
                            <input 
                              type="number" 
                              value={v.lowStockThreshold !== undefined ? v.lowStockThreshold : 5} 
                              onChange={(e) => {
                                const updated = [...editingProduct.variants!];
                                const val = Number(e.target.value);
                                updated[vIdx].lowStockThreshold = val;
                                setEditingProduct(prev => prev ? { ...prev, variants: updated } : null);
                              }}
                              className="w-16 px-2 py-1 text-xs border border-border rounded focus:outline-none focus:border-accent"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full h-13 font-semibold text-base mt-8"
              loading={saving}
            >
              <Save className="h-5 w-5 mr-2" />
              Save Product Record
            </Button>
          </form>
        </div>
      ) : (
        /* Listing View */
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="font-serif text-xl">Product Catalog ({products.length})</h2>
            <div className="flex gap-2 flex-wrap items-center">
              {/* CSV Export Button */}
              <Button type="button" variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-1.5" /> Export CSV
              </Button>
              
              {/* CSV Import Button Wrapper */}
              <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-border bg-primary text-text hover:bg-secondary/40 transition-colors cursor-pointer h-9">
                <Upload className="h-4 w-4" /> Import CSV
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleImportCSV} 
                  className="hidden" 
                />
              </label>

              <Button type="button" variant="accent" size="sm" onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Product
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-primary overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-sm font-semibold text-text-muted">
                  <th className="p-4 w-16">Photo</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="p-4">
                      <div className="h-10 w-10 rounded border border-border bg-secondary overflow-hidden">
                        {p.images[0]?.src ? (
                          <img src={p.images[0].src} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-text-light mx-auto my-2.5" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-text">{p.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">/{p.slug}</p>
                    </td>
                    <td className="p-4 text-text-light">{p.sku || "N/A"}</td>
                    <td className="p-4 text-text-muted">{p.category.name}</td>
                    <td className="p-4 font-semibold text-text">{formatPrice(p.price.amount)}</td>
                    <td className="p-4">
                      {(!p.inStock || (p.stockCount ?? 0) <= 0) ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">Out of Stock</span>
                      ) : (p.stockCount ?? 0) <= (p.lowStockThreshold ?? 5) ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Low Stock ({p.stockCount})</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">In Stock ({p.stockCount})</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="h-9 w-9 rounded-md border border-border flex items-center justify-center hover:bg-accent/10 hover:border-accent/40 text-text-muted hover:text-accent transition-all inline-flex"
                        aria-label="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="h-9 w-9 rounded-md border border-border flex items-center justify-center hover:bg-error/10 hover:border-error/40 text-text-muted hover:text-error transition-all inline-flex"
                        aria-label="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
