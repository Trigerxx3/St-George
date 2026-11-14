"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { GalleryItem } from "@/types/catalogue";
import { DEFAULT_GALLERY } from "@/lib/gallery-data";
import {
  Images,
  Upload,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  Loader2,
  Edit,
  Search,
  Eye,
  X,
  CheckCircle,
  Power,
  MapPin,
  Tag,
  Wrench,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const CATEGORY_OPTIONS: { id: GalleryItem["category"]; label: string }[] = [
  { id: "solar", label: "Solar & Battery" },
  { id: "ev", label: "EV Chargers" },
  { id: "electrical", label: "Switchboards & Electrical" },
  { id: "commercial", label: "Commercial & Industrial" },
  { id: "hvac", label: "Heating & Cooling" },
  { id: "security", label: "Security & CCTV" },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Modal State (Used for both Add and Edit)
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<GalleryItem["category"]>("solar");
  const [formSuburb, setFormSuburb] = useState("");
  const [formSystem, setFormSystem] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formResultsText, setFormResultsText] = useState("");
  const [formClientQuote, setFormClientQuote] = useState("");
  const [formClientName, setFormClientName] = useState("");
  const [formSortOrder, setFormSortOrder] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const notify = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery?all=true");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          setIsLoading(false);
          return;
        }
      }
      // Fallback to default gallery
      setItems(DEFAULT_GALLERY);
    } catch (err) {
      console.warn("Failed to load /api/gallery, using defaults:", err);
      setItems(DEFAULT_GALLERY);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormCategory("solar");
    setFormSuburb("Canberra, ACT");
    setFormSystem("");
    setFormDescription("");
    setFormImage("");
    setFormResultsText("");
    setFormClientQuote("");
    setFormClientName("");
    setFormSortOrder(items.length > 0 ? Math.max(...items.map((i) => i.sort_order || 0)) + 1 : 1);
    setFormIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category || "solar");
    setFormSuburb(item.suburb || "");
    setFormSystem(item.system || "");
    setFormDescription(item.description || "");
    setFormImage(item.image);
    setFormResultsText((item.results || []).join("\n"));
    setFormClientQuote(item.clientQuote || "");
    setFormClientName(item.clientName || "");
    setFormSortOrder(item.sort_order ?? 1);
    setFormIsActive(item.isActive !== false);
    setShowModal(true);
  };

  // Upload photo file via /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFormImage(data.url);
      if (!formTitle) {
        setFormTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
      notify("Photo uploaded successfully!");
    } catch (err: any) {
      alert(`Image upload error: ${err.message || err}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle active / disabled state
  const handleToggleActive = async (item: GalleryItem) => {
    const nextState = !(item.isActive !== false);
    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isActive: nextState } : i))
    );

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle",
          id: item.id,
          isActive: nextState,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to toggle status");
      }
      notify(nextState ? `"${item.title}" is now active on public site.` : `"${item.title}" has been disabled/hidden.`);
    } catch (err: any) {
      // Revert on error
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isActive: !nextState } : i))
      );
      notify(`Error: ${err.message || err}`, "error");
    }
  };

  // Save (Create or Edit)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert("Please provide a project title / caption.");
      return;
    }
    if (!formImage.trim()) {
      alert("Please select or enter an image URL.");
      return;
    }

    const catObj = CATEGORY_OPTIONS.find((c) => c.id === formCategory);
    const categoryLabel = catObj ? catObj.label : "Solar & Battery";

    const resultsArray = formResultsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<GalleryItem> = {
      title: formTitle.trim(),
      category: formCategory,
      categoryLabel,
      suburb: formSuburb.trim() || "Canberra, ACT",
      system: formSystem.trim() || undefined,
      description: formDescription.trim(),
      results: resultsArray,
      image: formImage.trim(),
      clientQuote: formClientQuote.trim() || undefined,
      clientName: formClientName.trim() || undefined,
      sort_order: Number(formSortOrder) || 1,
      isActive: formIsActive,
    };

    setIsSaving(true);
    try {
      if (editingItem) {
        // Edit existing
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "edit",
            item: { ...payload, id: editingItem.id },
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update project");
        }
        setItems(data.items);
        notify("Project updated successfully!");
      } else {
        // Add new
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add",
            item: payload,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to add project");
        }
        setItems(data.items);
        notify("New project added to gallery!");
      }

      setShowModal(false);
    } catch (err: any) {
      alert(`Error saving project: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (item: GalleryItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${item.title}" from the gallery?`)) {
      return;
    }

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          id: item.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete item");
      }
      setItems(data.items);
      notify(`"${item.title}" deleted.`);
    } catch (err: any) {
      alert(`Delete error: ${err.message || err}`);
    }
  };

  // Reorder items
  const handleMoveOrder = async (item: GalleryItem, direction: "up" | "down") => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const targetItem = items[targetIndex];
    const newCurrentOrder = targetItem.sort_order ?? targetIndex + 1;
    const newTargetOrder = item.sort_order ?? currentIndex + 1;

    const updated = items.map((i) => {
      if (i.id === item.id) return { ...i, sort_order: newCurrentOrder };
      if (i.id === targetItem.id) return { ...i, sort_order: newTargetOrder };
      return i;
    });

    setItems(updated);

    try {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit",
          item: { id: item.id, sort_order: newCurrentOrder },
        }),
      });
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit",
          item: { id: targetItem.id, sort_order: newTargetOrder },
        }),
      });
    } catch (e) {
      console.warn("Reorder failed silently:", e);
    }
  };

  // Filtered and searched items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status filter
      if (statusFilter === "active" && item.isActive === false) return false;
      if (statusFilter === "disabled" && item.isActive !== false) return false;

      // Category filter
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchSuburb = item.suburb?.toLowerCase().includes(q);
        const matchSystem = item.system?.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchSuburb || matchSystem;
      }

      return true;
    });
  }, [items, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${
            toastMsg.type === "success"
              ? "bg-[#071522] text-white border border-orange-strong/40"
              : "bg-red-600 text-white"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle size={18} className="text-orange-strong" />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight flex items-center gap-2.5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Images className="text-orange-strong" size={28} />
            Photo Gallery &amp; Project Showcase
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Display, edit, enable/disable, and delete verified solar, battery, EV, and electrical installation photos.
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or suburb..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {(
              [
                { id: "all", label: `All (${items.length})` },
                { id: "active", label: `Active (${items.filter((i) => i.isActive !== false).length})` },
                { id: "disabled", label: `Disabled (${items.filter((i) => i.isActive === false).length})` },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setStatusFilter(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === t.id
                    ? "bg-white text-[#071522] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 self-end sm:self-auto">
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
              categoryFilter === "all"
                ? "bg-[#071522] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === cat.id
                  ? "bg-orange-strong text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3 bg-white rounded-2xl border border-slate-200">
          <RefreshCw size={28} className="animate-spin text-orange-strong" />
          <span className="text-sm">Loading gallery photos &amp; projects...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 shadow-sm">
          <Images size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-[#071522]">
            {items.length === 0 ? "No photos in the gallery yet" : "No photos match your search or filter"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {items.length === 0
              ? 'Click "Upload New Photo" above to showcase your first solar, battery, or electrical job.'
              : "Try clearing your search query or switching filters above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const isActive = item.isActive !== false;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${
                  isActive ? "border-slate-200 hover:border-orange-strong/50" : "border-slate-200 bg-slate-50/60 opacity-80"
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Category & Status Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#071522]/90 text-white backdrop-blur-xs shadow-sm">
                      {item.categoryLabel || item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs ${
                        isActive
                          ? "bg-emerald-500/90 text-white"
                          : "bg-slate-700/90 text-slate-200"
                      }`}
                    >
                      {isActive ? "Live" : "Disabled"}
                    </span>
                  </div>

                  {/* Lightbox Quick View */}
                  <button
                    onClick={() => setLightboxUrl(item.image)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="View full image"
                  >
                    <Eye size={14} />
                  </button>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                      <MapPin size={13} className="text-orange-strong shrink-0" />
                      <span className="font-medium">{item.suburb || "Canberra, ACT"}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#071522] leading-snug mb-1">
                      {item.title}
                    </h3>

                    {item.system && (
                      <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[11px] rounded mb-2 border border-slate-200 font-medium">
                        {item.system}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.description || <span className="italic text-slate-400">No description provided.</span>}
                    </p>
                  </div>

                  {/* Out-comes / bullets indicator if present */}
                  {item.results && item.results.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{item.results.length} key outcomes</span> recorded
                    </div>
                  )}
                </div>

                {/* Action Buttons Toolbar */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Enable / Disable Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isActive ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                      title={isActive ? "Click to disable/hide on public site" : "Click to enable on public site"}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {isActive ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {/* Edit and Delete Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-orange-strong hover:text-orange-dark hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit photo, title & description"
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete project photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-[#071522]/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxUrl}
              alt="Installation Full Size"
              className="rounded-2xl max-w-full max-h-[85vh] object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-white text-[#071522] shadow-lg hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Upload & Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#071522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveItem}
            className="bg-white text-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#071522]">
                  {editingItem ? "Edit Project Showcase" : "Upload New Gallery Project"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingItem
                    ? "Update photo, title, category, description, and visibility."
                    : "Add high-resolution solar, battery, EV, or electrical installation."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Photo Selection / Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Project Photo *
              </label>

              {formImage ? (
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-slate-200 bg-slate-100">
                  <img
                    src={formImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 flex gap-2">
                    <label className="px-3 py-1.5 bg-[#071522]/90 hover:bg-[#071522] text-white text-xs font-bold rounded-xl backdrop-blur-xs cursor-pointer shadow transition-colors border border-white/10 flex items-center gap-1.5">
                      <Upload size={13} />
                      <span>{isUploading ? "Uploading..." : "Replace Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 hover:border-orange-strong/50 rounded-2xl p-6 text-center bg-slate-50 transition-colors">
                  <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700 mb-1">
                    Upload an installation photo
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">
                    PNG, JPG, WebP up to 5MB
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#071522] hover:bg-[#071522]/90 text-white text-xs font-bold rounded-xl cursor-pointer shadow transition-colors">
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{isUploading ? "Uploading..." : "Select File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Or manual Image URL */}
              <div className="pt-1">
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="Or paste image URL (e.g. /images/gallery/my-photo.jpg)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
                />
              </div>
            </div>

            {/* Title / Headline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Project Title / Caption *
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. 10kW High-Yield Solar + Tesla Powerwall 3"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
              />
            </div>

            {/* Row: Category & Suburb */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as GalleryItem["category"])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Suburb / Location
                </label>
                <input
                  type="text"
                  value={formSuburb}
                  onChange={(e) => setFormSuburb(e.target.value)}
                  placeholder="e.g. Gungahlin, ACT"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
                />
              </div>
            </div>

            {/* Equipment / System Specs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Installed Equipment / System
              </label>
              <input
                type="text"
                value={formSystem}
                onChange={(e) => setFormSystem(e.target.value)}
                placeholder="e.g. 23x Jinko N-Type TOPCon Panels + 13.5kWh Tesla Powerwall"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Project Description *
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                placeholder="Describe the installation, customer challenge, equipment installed, and power outcomes..."
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
              />
            </div>

            {/* Key Outcomes (one per line) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Key Outcomes (one per line)
              </label>
              <textarea
                value={formResultsText}
                onChange={(e) => setFormResultsText(e.target.value)}
                rows={2}
                placeholder={"Zero grid power drawn between 5:00 PM and 10:00 PM\nFull home EPS blackout protection\n0% interest loan approved"}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong font-mono"
              />
            </div>

            {/* Row: Active Status & Sort Order */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded text-orange-strong focus:ring-orange-strong w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Visible on public gallery page
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Order:</span>
                <input
                  type="number"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  min={1}
                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center font-mono focus:outline-none focus:ring-1 focus:ring-orange-strong"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary !py-2 !px-5 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                <span>{editingItem ? "Update Project" : "Add to Gallery"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
