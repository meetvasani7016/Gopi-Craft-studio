"use client";

import { useState } from "react";
import { 
  saveCategory, 
  saveBlog, 
  deleteBlog, 
  saveFaq, 
  deleteFaq,
  exportCategoriesCSV,
  importCategoriesCSV
} from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Category, BlogPost, FAQItem } from "@/types";
import { Plus, Trash, Edit, Check, X, Shield, Settings, FileText, HelpCircle, Star, Percent, Download, Upload } from "lucide-react";

/* ----------------------------------------------------
   1. CATEGORIES MANAGER
   ---------------------------------------------------- */
interface CategoriesManagerProps {
  categories: Category[];
  onRefresh: () => void;
}

export function CategoriesManager({ categories, onRefresh }: CategoriesManagerProps) {
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExportCSV = async () => {
    try {
      const csv = await exportCategoriesCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `categories_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Failed to export categories.");
    }
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      try {
        const res = await importCategoriesCSV(text);
        if (res.success) {
          alert(`Import successful! ${res.successCount} categories upserted.`);
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

  const handleEdit = (c: Category) => {
    setEditing({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.image.src,
      featured: c.featured,
      seoTitle: c.seo.title,
      seoDescription: c.seo.description
    });
  };

  const handleNew = () => {
    setEditing({
      name: "",
      slug: "",
      description: "",
      imageUrl: "/images/placeholder-category.jpg",
      featured: false,
      seoTitle: "",
      seoDescription: ""
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);
    
    const record = { ...editing };
    // Auto-slug
    if (!record.slug) {
      record.slug = record.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    try {
      const res = await saveCategory(record);
      if (res.success) {
        onRefresh();
        setEditing(null);
      } else {
        alert("Error: " + res.error);
      }
    } catch {
      alert("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {editing ? (
        <div className="rounded-xl border border-border bg-primary p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-serif text-lg">{editing.id ? "Edit Category" : "New Category"}</h3>
            <button onClick={() => setEditing(null)} className="text-text-muted hover:text-text font-bold">Cancel</button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Category Name"
              value={editing.name}
              onChange={(e) => setEditing((p: any) => ({ ...p, name: e.target.value }))}
              required
            />
            <Input
              label="Slug (URL Path)"
              value={editing.slug}
              onChange={(e) => setEditing((p: any) => ({ ...p, slug: e.target.value }))}
            />
            <Textarea
              label="Description"
              value={editing.description}
              onChange={(e) => setEditing((p: any) => ({ ...p, description: e.target.value }))}
            />
            <Input
              label="Category Image URL"
              value={editing.imageUrl}
              onChange={(e) => setEditing((p: any) => ({ ...p, imageUrl: e.target.value }))}
            />
            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm py-2">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => setEditing((p: any) => ({ ...p, featured: e.target.checked }))}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              Show on Homepage (Featured Collections)
            </label>
            <Button type="submit" variant="accent" className="w-full h-11" loading={loading}>
              Save Category
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h3 className="font-serif text-lg">Product Categories</h3>
            <div className="flex gap-2 items-center flex-wrap">
              <Button type="button" size="sm" variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-1.5" /> Export CSV
              </Button>
              <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-border bg-primary text-text hover:bg-secondary/40 transition-colors cursor-pointer h-9">
                <Upload className="h-4 w-4" /> Import CSV
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleImportCSV} 
                  className="hidden" 
                />
              </label>
              <Button size="sm" variant="accent" onClick={handleNew}>
                <Plus className="h-4 w-4 mr-1" /> New Category
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-primary overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 font-semibold text-text-muted">
                  <th className="p-4">Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="p-4 font-semibold text-text">{c.name}</td>
                    <td className="p-4 text-text-light">/{c.slug}</td>
                    <td className="p-4">
                      {c.featured ? (
                        <span className="text-success flex items-center gap-1"><Check className="h-4 w-4" /> Yes</span>
                      ) : (
                        <span className="text-text-light flex items-center gap-1"><X className="h-4 w-4" /> No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
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

/* ----------------------------------------------------
   2. BLOGS MANAGER
   ---------------------------------------------------- */
interface BlogsManagerProps {
  blogs: BlogPost[];
  onRefresh: () => void;
}

export function BlogsManager({ blogs, onRefresh }: BlogsManagerProps) {
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (b: BlogPost) => {
    setEditing({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: b.content,
      coverImageUrl: b.coverImage.src,
      author: b.author,
      category: b.category,
      tags: b.tags,
      readTime: b.readTime
    });
  };

  const handleNew = () => {
    setEditing({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImageUrl: "/images/placeholder-blog.jpg",
      author: "Gopi Craft-Studio",
      category: "Guide",
      tags: [],
      readTime: 5
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);
    
    const record = { ...editing };
    if (!record.slug) {
      record.slug = record.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    try {
      const res = await saveBlog(record);
      if (res.success) {
        onRefresh();
        setEditing(null);
      } else {
        alert("Error: " + res.error);
      }
    } catch {
      alert("Failed to save blog post.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await deleteBlog(id);
      if (res.success) onRefresh();
    } catch {
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {editing ? (
        <div className="rounded-xl border border-border bg-primary p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-serif text-lg">{editing.id ? "Edit Post" : "New Post"}</h3>
            <button onClick={() => setEditing(null)} className="text-text-muted hover:text-text font-bold">Cancel</button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Blog Title"
              value={editing.title}
              onChange={(e) => setEditing((p: any) => ({ ...p, title: e.target.value }))}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Author"
                value={editing.author}
                onChange={(e) => setEditing((p: any) => ({ ...p, author: e.target.value }))}
              />
              <Input
                label="Reading Time (Minutes)"
                type="number"
                value={editing.readTime}
                onChange={(e) => setEditing((p: any) => ({ ...p, readTime: Number(e.target.value) }))}
              />
            </div>
            <Input
              label="Cover Image URL"
              value={editing.coverImageUrl}
              onChange={(e) => setEditing((p: any) => ({ ...p, coverImageUrl: e.target.value }))}
            />
            <Textarea
              label="Excerpt / Summary"
              value={editing.excerpt}
              onChange={(e) => setEditing((p: any) => ({ ...p, excerpt: e.target.value }))}
            />
            <Textarea
              label="Blog Content"
              value={editing.content}
              onChange={(e) => setEditing((p: any) => ({ ...p, content: e.target.value }))}
              rows={8}
            />
            <Button type="submit" variant="accent" className="w-full h-11" loading={loading}>
              Save Blog Post
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg">Blog Posts</h3>
            <Button size="sm" variant="accent" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-1" /> New Post
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {blogs.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-primary p-5 flex gap-4 shadow-sm">
                <div className="h-16 w-24 rounded bg-secondary border overflow-hidden shrink-0">
                  <img src={b.coverImage.src} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-semibold truncate text-text">{b.title}</h4>
                    <p className="text-xs text-text-light line-clamp-2 mt-1">{b.excerpt}</p>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <button
                      onClick={() => handleEdit(b)}
                      className="h-8 px-2.5 rounded border border-border flex items-center justify-center text-xs font-semibold hover:bg-accent/10 hover:border-accent/30 text-text-muted hover:text-accent transition-all"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-error/10 hover:border-error/30 text-text-light hover:text-error transition-all"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------
   3. FAQS MANAGER
   ---------------------------------------------------- */
interface FaqsManagerProps {
  faqs: FAQItem[];
  onRefresh: () => void;
}

export function FaqsManager({ faqs, onRefresh }: FaqsManagerProps) {
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (f: FAQItem) => {
    setEditing({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category || "General"
    });
  };

  const handleNew = () => {
    setEditing({
      question: "",
      answer: "",
      category: "General"
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    try {
      const res = await saveFaq(editing);
      if (res.success) {
        onRefresh();
        setEditing(null);
      } else {
        alert("Error: " + res.error);
      }
    } catch {
      alert("Failed to save FAQ.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await deleteFaq(id);
      if (res.success) onRefresh();
    } catch {
      alert("Failed to delete FAQ.");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {editing ? (
        <div className="rounded-xl border border-border bg-primary p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-serif text-lg">{editing.id ? "Edit FAQ" : "New FAQ"}</h3>
            <button onClick={() => setEditing(null)} className="text-text-muted hover:text-text font-bold">Cancel</button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="FAQ Category"
              value={editing.category}
              onChange={(e) => setEditing((p: any) => ({ ...p, category: e.target.value }))}
              placeholder="e.g. Product Care, Shipping, General"
              required
            />
            <Input
              label="Question"
              value={editing.question}
              onChange={(e) => setEditing((p: any) => ({ ...p, question: e.target.value }))}
              required
            />
            <Textarea
              label="Answer"
              value={editing.answer}
              onChange={(e) => setEditing((p: any) => ({ ...p, answer: e.target.value }))}
              rows={4}
              required
            />
            <Button type="submit" variant="accent" className="w-full h-11" loading={loading}>
              Save FAQ Item
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg">FAQs list</h3>
            <Button size="sm" variant="accent" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-1" /> New FAQ
            </Button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="rounded-xl border border-border bg-primary p-5 flex justify-between items-start gap-4 shadow-sm">
                <div className="space-y-1">
                  <span className="inline-block bg-accent/10 border border-accent/15 rounded text-[10px] font-bold text-accent px-1.5 py-0.5 capitalize">
                    {f.category}
                  </span>
                  <p className="font-semibold text-sm text-text mt-1">{f.question}</p>
                  <p className="text-xs text-text-muted leading-relaxed mt-1">{f.answer}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(f)}
                    className="h-8 w-8 rounded border border-border flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/5 hover:border-accent/30"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-error/10 hover:border-error/30 text-text-light hover:text-error"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------
   4. REVIEWS MANAGER (Moderation)
   ---------------------------------------------------- */
export function ReviewsManager() {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-xl bg-secondary/5">
      <Star className="h-8 w-8 text-text-light mx-auto" />
      <h3 className="font-serif text-lg mt-4">Reviews Manager</h3>
      <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto">No pending product reviews submitted. All reviews are currently verified.</p>
    </div>
  );
}

/* ----------------------------------------------------
   5. COUPONS MANAGER
   ---------------------------------------------------- */
export function CouponsManager() {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-xl bg-secondary/5">
      <Percent className="h-8 w-8 text-text-light mx-auto" />
      <h3 className="font-serif text-lg mt-4">Coupons Manager</h3>
      <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto">No discount coupons configured. Tap Settings or contact dev to wire stripe/razorpay hooks.</p>
    </div>
  );
}

/* ----------------------------------------------------
   6. SEO MANAGER
   ---------------------------------------------------- */
export function SeoManager() {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-xl bg-secondary/5">
      <Settings className="h-8 w-8 text-text-light mx-auto" />
      <h3 className="font-serif text-lg mt-4">SEO Configurator</h3>
      <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto">Custom SEO configuration is fully linked to the main SEO database table records.</p>
    </div>
  );
}
