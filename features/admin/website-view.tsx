"use client";

import { useState, useEffect } from "react";
import { 
  saveHomepageSections, 
  publishHomepageVersion, 
  rollbackHomepageVersion, 
  getHomepageVersions 
} from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, Trash, ArrowUp, ArrowDown, Eye, EyeOff, Edit, 
  History, Check, RefreshCw, Layout, Save 
} from "lucide-react";

interface WebsiteViewProps {
  initialSections: any[];
  onRefresh: () => void;
}

export function WebsiteView({ initialSections, onRefresh }: WebsiteViewProps) {
  const [sections, setSections] = useState<any[]>([]);
  const [editingSection, setEditingSection] = useState<any | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [rollingBack, setRollingBack] = useState(false);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  useEffect(() => {
    getHomepageVersions().then(setVersions);
  }, []);

  const refreshVersions = () => {
    getHomepageVersions().then(setVersions);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    
    setSections(updated);
  };

  const handleToggleVisibility = (index: number) => {
    const updated = [...sections];
    updated[index].visible = updated[index].visible === false ? true : false;
    setSections(updated);
  };

  const handleDelete = (index: number) => {
    if (!confirm("Remove this section from the homepage?")) return;
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleAddSection = (type: string) => {
    const newSection = {
      type,
      title: "New " + type.replace("-", " ") + " Section",
      subtitle: "",
      content: "",
      image: { src: "/images/placeholder.jpg", alt: "" },
      cta: { label: "Explore", href: "/" },
      visible: true
    };
    setSections([...sections, newSection]);
  };

  const handleEdit = (section: any, index: number) => {
    setEditingSection(JSON.parse(JSON.stringify(section))); // deep copy
    setEditingIndex(index);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null || !editingSection) return;

    const updated = [...sections];
    updated[editingIndex] = editingSection;
    setSections(updated);
    setEditingSection(null);
    setEditingIndex(null);
  };

  const handlePublish = async () => {
    const name = prompt("Enter a description for this version (e.g. 'Diwali Prep', 'Normal Winter Theme'):");
    if (!name?.trim()) return;

    setPublishing(true);
    try {
      const res = await publishHomepageVersion(name, sections);
      if (res.success) {
        alert("Website layout published successfully!");
        refreshVersions();
        onRefresh();
      } else {
        alert("Error publishing: " + res.error);
      }
    } catch {
      alert("Failed to publish website version.");
    } finally {
      setPublishing(false);
    }
  };

  const handleRollback = async (versionId: string, versionName: string) => {
    if (!confirm(`Are you sure you want to roll back the homepage to: "${versionName}"?`)) return;
    setRollingBack(true);
    try {
      const res = await rollbackHomepageVersion(versionId);
      if (res.success) {
        alert("Layout rolled back successfully!");
        setSections(res.sections);
        setShowVersions(false);
        onRefresh();
      } else {
        alert("Error rolling back: " + res.error);
      }
    } catch {
      alert("Failed to roll back version.");
    } finally {
      setRollingBack(false);
    }
  };

  const getSectionIcon = (type: string) => {
    return <Layout className="h-5 w-5 text-accent shrink-0" />;
  };

  return (
    <div className="space-y-6">
      {/* Version History Modal / Drawer */}
      {showVersions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-primary rounded-xl border border-border p-6 shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-serif text-xl">Version History</h3>
              <button onClick={() => setShowVersions(false)} className="text-text-muted hover:text-text font-bold">Close</button>
            </div>
            
            {versions.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-8">No saved versions found.</p>
            ) : (
              <div className="space-y-3">
                {versions.map((ver) => (
                  <div key={ver.id} className={`flex items-center justify-between p-4 border rounded-lg ${ver.active ? "border-accent bg-accent/5" : "border-border"}`}>
                    <div>
                      <p className="font-semibold text-sm">{ver.name}</p>
                      <p className="text-xs text-text-light mt-0.5">{new Date(ver.created_at).toLocaleString()}</p>
                    </div>
                    {ver.active ? (
                      <span className="text-xs font-semibold text-accent flex items-center gap-1">
                        <Check className="h-4 w-4" /> Active Now
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRollback(ver.id, ver.name)}
                        disabled={rollingBack}
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Rollback
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Block Editor Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-primary rounded-xl border border-border p-6 shadow-xl space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-serif text-xl">Edit Block: <span className="capitalize">{editingSection.type}</span></h3>
              <button onClick={() => setEditingSection(null)} className="text-text-muted hover:text-text font-bold">Close</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <Input
                label="Section Heading / Title"
                value={editingSection.title || editingSection.headline || ""}
                onChange={(e) => setEditingSection((prev: any) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Handcrafted Heritage"
              />

              <Input
                label="Subheading / Subtitle"
                value={editingSection.subtitle || editingSection.subheadline || ""}
                onChange={(e) => setEditingSection((prev: any) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g. Crafted with devotion, designed for life"
              />

              {(editingSection.type === "craft-story" || editingSection.type === "customization") && (
                <Textarea
                  label="Description / Text Content"
                  value={editingSection.content || editingSection.description || ""}
                  onChange={(e) => setEditingSection((prev: any) => ({ ...prev, content: e.target.value }))}
                  placeholder="Insert block description..."
                  rows={4}
                />
              )}

              {["hero", "craft-story", "customization"].includes(editingSection.type) && (
                <Input
                  label="Image URL"
                  value={editingSection.image?.src || editingSection.image_url || ""}
                  onChange={(e) => setEditingSection((prev: any) => ({ 
                    ...prev, 
                    image: { ...prev.image, src: e.target.value } 
                  }))}
                  placeholder="Paste URL of image"
                />
              )}

              {["hero", "craft-story", "customization", "faq"].includes(editingSection.type) && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Button Label"
                    value={editingSection.cta?.label || ""}
                    onChange={(e) => setEditingSection((prev: any) => ({ 
                      ...prev, 
                      cta: { ...prev.cta, label: e.target.value } 
                    }))}
                    placeholder="e.g. Shop Now"
                  />
                  <Input
                    label="Button Link"
                    value={editingSection.cta?.href || ""}
                    onChange={(e) => setEditingSection((prev: any) => ({ 
                      ...prev, 
                      cta: { ...prev.cta, href: e.target.value } 
                    }))}
                    placeholder="e.g. /shop"
                  />
                </div>
              )}

              {editingSection.type === "product-grid" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text">Display Products Mapped By</label>
                  <select
                    value={editingSection.settings?.filterType || "bestseller"}
                    onChange={(e) => setEditingSection((prev: any) => ({ 
                      ...prev, 
                      settings: { ...prev.settings, filterType: e.target.value } 
                    }))}
                    className="w-full h-11 px-3 border border-border rounded-md bg-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="bestseller">Best Sellers</option>
                    <option value="festival">Festival Collection</option>
                    <option value="new">New Arrivals</option>
                    <option value="limited">Limited Editions</option>
                  </select>
                </div>
              )}

              <Button type="submit" variant="accent" className="w-full h-11 mt-4">
                <Save className="h-4 w-4 mr-2" />
                Apply Changes
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div>
          <h2 className="font-serif text-xl">Homepage Layout Builder</h2>
          <p className="text-sm text-text-muted mt-1">Configure layout blocks and version release</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowVersions(true)}>
            <History className="h-4 w-4 mr-2" />
            Versions
          </Button>
          <Button variant="accent" onClick={handlePublish} disabled={publishing}>
            Publish Page Layout
          </Button>
        </div>
      </div>

      {/* Blocks stack */}
      <div className="space-y-4 max-w-2xl">
        {sections.map((sec, index) => (
          <div
            key={index}
            className={`rounded-xl border p-5 flex items-center gap-4 bg-primary shadow-sm transition-all ${
              sec.visible === false ? "border-dashed border-text-light opacity-50 bg-secondary/5" : "border-border"
            }`}
          >
            {getSectionIcon(sec.type)}

            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase font-bold text-accent tracking-wider">{sec.type}</p>
              <h4 className="font-serif text-sm font-semibold truncate text-text mt-1">{sec.title || sec.headline || "Untitled Section"}</h4>
              <p className="text-xs text-text-light truncate mt-0.5">{sec.subtitle || sec.subheadline || "No subtitle"}</p>
            </div>

            {/* Tactical controls */}
            <div className="flex gap-1">
              <button
                onClick={() => handleMove(index, "up")}
                disabled={index === 0}
                className="h-8 w-8 rounded border border-border flex items-center justify-center text-text-muted hover:text-text hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Move Up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleMove(index, "down")}
                disabled={index === sections.length - 1}
                className="h-8 w-8 rounded border border-border flex items-center justify-center text-text-muted hover:text-text hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Move Down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleToggleVisibility(index)}
                className="h-8 w-8 rounded border border-border flex items-center justify-center text-text-muted hover:text-text hover:bg-secondary"
                aria-label={sec.visible === false ? "Show Section" : "Hide Section"}
              >
                {sec.visible === false ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => handleEdit(sec, index)}
                className="h-8 w-8 rounded border border-border flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/5 hover:border-accent/30"
                aria-label="Edit Section details"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="h-8 w-8 rounded border border-border flex items-center justify-center text-text-muted hover:text-error hover:bg-error/5 hover:border-error/30"
                aria-label="Remove Section"
              >
                <Trash className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new blocks drawer */}
      <div className="border-t border-border pt-6 max-w-2xl space-y-3">
        <h3 className="text-sm font-semibold">Add Section Block</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["hero", "featured-categories", "product-grid", "craft-story", "customization", "testimonials", "faq"].map((type) => (
            <Button
              key={type}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddSection(type)}
              className="text-xs font-semibold capitalize justify-start h-10"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {type.replace("-", " ")}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
