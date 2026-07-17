"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Folder, Upload, Trash, Search, Copy, Check, 
  FileImage, Edit2, Save, X, RefreshCw 
} from "lucide-react";
import { uploadMediaAction } from "@/lib/supabase/actions";

export function MediaView() {
  const [files, setFiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("Products");
  const [uploading, setUploading] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Metadata edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAlt, setEditAlt] = useState("");

  const folders = ["Products", "Hero", "Banners", "Blogs", "General"];

  const supabase = createClient();
  const isConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const loadMedia = async () => {
    if (!isConfigured) {
      setFiles([
        { id: "m1", name: "heritage-brass-diya.jpg", url: "/images/placeholder-product-1.jpg", folder: "Products", size: "124 KB", alt_text: "Handcrafted brass diya pair" },
        { id: "m2", name: "wooden-mandir-cabinet.jpg", url: "/images/placeholder-product-2.jpg", folder: "Products", size: "230 KB", alt_text: "Carved rosewood home temple" },
        { id: "m3", name: "festival-urli-set.jpg", url: "/images/placeholder-product-4.jpg", folder: "Products", size: "95 KB", alt_text: "Golden flower urli pot set" },
        { id: "m4", name: "homepage-hero-curtain.jpg", url: "/images/placeholder-hero.jpg", folder: "Hero", size: "450 KB", alt_text: "Luxury curtains context slider" },
        { id: "m5", name: "diwali-decor-post.jpg", url: "/images/placeholder-blog-1.jpg", folder: "Blogs", size: "115 KB", alt_text: "Traditional diwali lights blog card" },
      ]);
      return;
    }

    try {
      // 1. Fetch from media_library table first
      const { data: dbRecords, error: dbError } = await supabase
        .from("media_library")
        .select("*")
        .eq("folder_name", folder)
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;

      // 2. Fetch direct files from storage bucket to sync/fallback
      const { data: storageFiles, error: storageError } = await supabase.storage.from("media").list(folder);
      if (storageError) throw storageError;

      // 3. Construct unified list
      const formatted = (storageFiles || []).map((storageFile, idx) => {
        const publicUrl = supabase.storage.from("media").getPublicUrl(`${folder}/${storageFile.name}`).data.publicUrl;
        
        // Match with metadata from DB
        const dbMeta = dbRecords?.find(r => r.file_path.endsWith(storageFile.name));
        
        return {
          id: dbMeta?.id || `storage-${folder}-${idx}`,
          name: dbMeta?.name || storageFile.name,
          fileName: storageFile.name,
          url: publicUrl,
          folder,
          size: `${Math.round((storageFile.metadata?.size || 0) / 1024)} KB`,
          alt_text: dbMeta?.alt_text || "",
          hasDbMeta: !!dbMeta
        };
      });

      setFiles(formatted);
    } catch (err) {
      console.warn("Storage sync failed, fallback to mocked metadata:", err);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [folder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, replaceFileName?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple client side optimization warning
    if (file.size > 2 * 1024 * 1024) {
      console.log("Optimization Tip: Consider compressing images larger than 2MB for faster site load speeds.");
    }

    if (!isConfigured) {
      alert("Database config missing. Mocking upload!");
      if (replaceFileName) {
        setFiles(prev => prev.map(f => f.name === replaceFileName ? { ...f, url: URL.createObjectURL(file), size: `${Math.round(file.size / 1024)} KB` } : f));
      } else {
        setFiles((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            name: file.name,
            fileName: file.name,
            url: URL.createObjectURL(file),
            folder,
            size: `${Math.round(file.size / 1024)} KB`,
            alt_text: ""
          }
        ]);
      }
      setReplacingId(null);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      if (replaceFileName) {
        formData.append("replaceFileName", replaceFileName);
      }

      const res = await uploadMediaAction(formData);
      if (!res.success) {
        throw new Error(res.error);
      }

      loadMedia();
    } catch (err: any) {
      alert("File upload failed: " + err.message);
    } finally {
      setUploading(false);
      setReplacingId(null);
    }
  };

  const handleDelete = async (fileName: string, id: string) => {
    if (!confirm("Are you sure you want to delete this media file?")) return;

    if (!isConfigured) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      return;
    }

    try {
      // 1. Delete from Supabase Storage
      const { error: storageError } = await supabase.storage.from("media").remove([`${folder}/${fileName}`]);
      if (storageError) throw storageError;

      // 2. Delete metadata row if it exists
      if (!id.startsWith("storage-")) {
        await supabase.from("media_library").delete().eq("id", id);
      }

      loadMedia();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const startEditMetadata = (file: any) => {
    setEditingId(file.id);
    setEditName(file.name);
    setEditAlt(file.alt_text || "");
  };

  const saveMetadata = async (file: any) => {
    if (!isConfigured) {
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, name: editName, alt_text: editAlt } : f));
      setEditingId(null);
      return;
    }

    try {
      if (file.id.startsWith("storage-")) {
        // If file doesn't have metadata row yet, create one
        await supabase.from("media_library").insert({
          name: editName,
          file_path: `${folder}/${file.fileName}`,
          folder_name: folder,
          alt_text: editAlt
        });
      } else {
        // Update existing record
        const { error } = await supabase
          .from("media_library")
          .update({ name: editName, alt_text: editAlt })
          .eq("id", file.id);
        if (error) throw error;
      }
      setEditingId(null);
      loadMedia();
    } catch (err: any) {
      alert("Save failed: " + err.message);
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFiles = files.filter((f) => 
    f.folder === folder && 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="font-serif text-2xl text-text">Media Library</h2>
          <p className="text-xs text-text-muted mt-1">Upload brand assets, product variants, and track image alt texts</p>
        </div>

        {/* Upload Button */}
        <div className="relative h-10 px-5 rounded-md bg-accent text-white hover:bg-accent/90 font-semibold text-xs flex items-center justify-center gap-2 transition-colors">
          <Upload className="h-4 w-4" />
          {uploading && !replacingId ? "Uploading..." : "Upload Photo"}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={(e) => handleUpload(e)}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Folders & Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-primary p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-wrap gap-2">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFolder(f);
                setEditingId(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                folder === f 
                  ? "bg-accent border-accent text-white" 
                  : "bg-secondary/20 border-border text-text-muted hover:border-accent/40"
              }`}
            >
              <Folder className="h-3.5 w-3.5" />
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 border border-border rounded-lg bg-secondary/15 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Grid listing */}
      {filteredFiles.length === 0 ? (
        <div className="h-64 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6 bg-secondary/5">
          <FileImage className="h-10 w-10 text-text-light" />
          <h3 className="font-serif text-lg mt-4">Folder Empty</h3>
          <p className="text-sm text-text-muted mt-1 max-w-xs">Upload new brand files to the &ldquo;{folder}&rdquo; folder.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredFiles.map((file) => {
            const isEditing = editingId === file.id;
            return (
              <div key={file.id} className="group relative rounded-xl border border-border bg-primary overflow-hidden shadow-sm flex flex-col hover:border-accent/30 transition-all">
                {/* Image display */}
                <div className="relative aspect-video bg-secondary border-b border-border overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.alt_text || file.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Replace Image Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1.5">
                    <Upload className="h-4 w-4" />
                    Replace Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                      onChange={(e) => {
                        setReplacingId(file.id);
                        handleUpload(e, file.fileName);
                      }}
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Info and Metadata editing */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input 
                        label="Display Name" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        className="text-xs"
                      />
                      <Input 
                        label="Alt Text (SEO)" 
                        value={editAlt} 
                        onChange={(e) => setEditAlt(e.target.value)} 
                        className="text-xs"
                        placeholder="e.g. Handmade gold-plated diya tray"
                      />
                      <div className="flex gap-2 justify-end pt-1">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="default" size="sm" onClick={() => saveMetadata(file)}>
                          <Save className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-sm text-text truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <button 
                          onClick={() => startEditMetadata(file)}
                          className="text-text-muted hover:text-accent p-0.5"
                          title="Edit Details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <p className="text-[10px] text-text-light">Size: {file.size}</p>
                      
                      <div className="text-[10px] text-text-muted mt-2 border border-border/40 bg-secondary/10 px-2 py-1 rounded">
                        <span className="font-bold text-accent">Alt Text:</span> {file.alt_text || "None configured"}
                      </div>
                    </div>
                  )}

                  {/* Copy Link / Delete buttons row */}
                  <div className="flex gap-1.5 pt-3 border-t border-border/60">
                    <button
                      onClick={() => handleCopyLink(file.url, file.id)}
                      className="flex-1 h-8 rounded bg-secondary/60 hover:bg-accent/15 text-text-muted hover:text-accent border border-border/80 flex items-center justify-center gap-1 text-[10px] font-bold transition-all"
                    >
                      {copiedId === file.id ? (
                        <>
                          <Check className="h-3 w-3 text-success" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy Link
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(file.fileName, file.id)}
                      className="h-8 w-8 rounded bg-secondary/60 hover:bg-error/15 text-text-light hover:text-error border border-border/80 flex items-center justify-center transition-all"
                      aria-label="Delete Image"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
