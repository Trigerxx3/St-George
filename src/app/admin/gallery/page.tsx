"use client";

import { useEffect, useState } from "react";
import { errorMessage } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Images,
  Upload,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  Loader2,
  Edit,
  ArrowUp,
  ArrowDown,
  Search,
  Eye,
  X,
  CheckCircle,
} from "lucide-react";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal State (Used for both Create and Edit)
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [modalCaption, setModalCaption] = useState("");
  const [modalOrder, setModalOrder] = useState<number>(0);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const fetchGallery = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setItems(data || []);
      }
    } catch (err) {
      setErrorMsg(errorMessage(err) || "Failed to load gallery items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setModalCaption("");
    setModalOrder(items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1);
    setModalImageUrl("");
    setSelectedFile(null);
    setFilePreview(null);
    setShowModal(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setModalCaption(item.caption || "");
    setModalOrder(item.sort_order);
    setModalImageUrl(item.image_url);
    setSelectedFile(null);
    setFilePreview(null);
    setShowModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      if (!modalCaption) {
        setModalCaption(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !modalImageUrl) {
      alert("Please select an image file or provide an image URL.");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      let finalImageUrl = modalImageUrl;

      // 1. If a new file was chosen, upload to Supabase Storage bucket 'site-assets'
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data: storageData, error: storageError } = await supabase.storage
          .from("site-assets")
          .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (storageError) throw storageError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("site-assets").getPublicUrl(storageData.path);

        finalImageUrl = publicUrl;
      }

      // 2. Insert or Update gallery table
      if (editingItem) {
        // UPDATE existing photo
        const { error: updateError } = await supabase
          .from("gallery")
          .update({
            image_url: finalImageUrl,
            caption: modalCaption.trim() || null,
            sort_order: Number(modalOrder) || 0,
          })
          .eq("id", editingItem.id);

        if (updateError) throw updateError;
      } else {
        // INSERT new photo
        const { error: insertError } = await supabase.from("gallery").insert([
          {
            image_url: finalImageUrl,
            caption: modalCaption.trim() || null,
            sort_order: Number(modalOrder) || items.length + 1,
          },
        ]);

        if (insertError) throw insertError;
      }

      setShowModal(false);
      setSelectedFile(null);
      setFilePreview(null);
      await fetchGallery();
    } catch (err) {
      alert(`Error saving photo: ${errorMessage(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Are you sure you want to delete "${item.caption || "this installation photo"}"?`)) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("gallery").delete().eq("id", item.id);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      alert(`Delete failed: ${errorMessage(err)}`);
    }
  };

  const handleMoveOrder = async (item: GalleryItem, direction: "up" | "down") => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const targetItem = items[targetIndex];
    const newCurrentOrder = targetItem.sort_order;
    const newTargetOrder = item.sort_order === targetItem.sort_order
      ? (direction === "up" ? item.sort_order - 1 : item.sort_order + 1)
      : item.sort_order;

    try {
      const supabase = createClient();
      await Promise.all([
        supabase.from("gallery").update({ sort_order: newCurrentOrder }).eq("id", item.id),
        supabase.from("gallery").update({ sort_order: newTargetOrder }).eq("id", targetItem.id),
      ]);
      await fetchGallery();
    } catch (e) {
      alert(`Reorder failed: ${errorMessage(e)}`);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.caption?.toLowerCase().includes(q) || item.image_url.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight flex items-center gap-2.5" style={{ fontFamily: "var(--font-heading)" }}>
            <Images className="text-orange-strong" size={28} />
            Photo Gallery &amp; Project Showcase
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload, edit, caption, and reorder verified solar, battery, and electrical installation photos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/gallery"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span>View Public Gallery</span>
            <ExternalLink size={14} className="text-slate-400" />
          </Link>

          <button
            onClick={openCreateModal}
            className="btn-primary !py-2 !px-4 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus size={16} />
            Upload New Photo
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption or location..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            Showing <strong className="text-[#071522]">{filteredItems.length}</strong> of {items.length} photos
          </span>
          <button
            onClick={fetchGallery}
            disabled={isLoading}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer"
            title="Refresh gallery"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-orange-strong" : ""} />
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3 bg-white rounded-2xl border border-slate-200">
          <RefreshCw size={28} className="animate-spin text-orange-strong" />
          <span className="text-sm">Loading gallery photos...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 shadow-sm">
          <Images size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-[#071522]">
            {items.length === 0 ? "No photos in the gallery yet" : "No photos match your search"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {items.length === 0
              ? "Click \"Upload New Photo\" to upload your first solar, battery, or electrical job."
              : "Try clearing your search query above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-orange-strong/50 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Photo Thumbnail */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.caption || "Gallery installation"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay Badge for Sort Order */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#071522]/90 text-orange-light backdrop-blur-xs shadow-sm border border-white/10">
                    #{item.sort_order}
                  </span>
                </div>

                {/* Quick Expand Button */}
                <button
                  onClick={() => setLightboxUrl(item.image_url)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="View full resolution"
                >
                  <Eye size={13} />
                </button>
              </div>

              {/* Caption Content */}
              <div className="p-4 space-y-1">
                <h3
                  className="text-xs font-bold text-[#071522] line-clamp-2 leading-snug"
                  title={item.caption || "No caption"}
                >
                  {item.caption || <span className="text-slate-400 italic font-normal">Untitled Installation</span>}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Added {new Date(item.created_at).toLocaleDateString("en-AU")}
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveOrder(item, "up")}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:text-[#071522] hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Move earlier"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(item, "down")}
                    disabled={index === items.length - 1}
                    className="p-1.5 text-slate-500 hover:text-[#071522] hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Move later"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-orange-strong hover:text-orange-dark hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit caption, order or photo"
                  >
                    <Edit size={12} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload & Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#071522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePhoto}
            className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#071522]">
                  {editingItem ? "Edit Installation Photo" : "Upload Installation Photo"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingItem
                    ? "Update photo caption, display order, or replace the photo."
                    : "Add high-resolution solar, battery, EV or electrical job photo."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Photo Selection / Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Installation Photo *
              </label>

              {filePreview || modalImageUrl ? (
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-slate-100">
                  <img
                    src={filePreview || modalImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <label className="px-3 py-1.5 bg-[#071522]/90 hover:bg-[#071522] text-white text-xs font-bold rounded-xl backdrop-blur-xs cursor-pointer shadow transition-colors border border-white/10">
                      <span>Replace Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-orange-strong/60 rounded-2xl p-8 cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100">
                  <Upload size={32} className="text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-[#071522]">
                    Click to select JPG, PNG, or WebP photo
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Directly uploaded to Supabase Storage bucket &ldquo;site-assets&rdquo;
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    required={!modalImageUrl}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}

              {/* Or paste direct URL */}
              <div className="pt-1">
                <input
                  type="text"
                  value={modalImageUrl}
                  onChange={(e) => {
                    setModalImageUrl(e.target.value);
                    if (selectedFile) setSelectedFile(null);
                    if (filePreview) setFilePreview(null);
                  }}
                  placeholder="Or paste direct image URL (e.g. /images/hero/hero-solar-home.jpg)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
                />
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Caption / Project Summary *
              </label>
              <textarea
                rows={3}
                required
                value={modalCaption}
                onChange={(e) => setModalCaption(e.target.value)}
                placeholder="e.g. 10kW Rooftop Solar + Tesla Powerwall 3 Installation in Gungahlin, ACT"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong leading-relaxed"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Display Order (#)
              </label>
              <input
                type="number"
                value={modalOrder}
                onChange={(e) => setModalOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[#071522] focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Lower numbers appear first on the public gallery.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary !py-2 !px-5 text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Photo...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    <span>{editingItem ? "Save Changes" : "Upload to Gallery"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* High-Resolution Lightbox Modal */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxUrl}
              alt="Enlarged preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-1 text-sm font-bold"
            >
              Close [✕]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
