"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { CATEGORIES, PRODUCTS as DEFAULT_PRODUCTS } from "@/lib/catalogue-data";
import { ProductItem } from "@/types/catalogue";
import {
  Boxes,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Power,
  Layers,
  Check,
  X,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

const STORAGE_KEY = "stg_admin_products";

const INITIAL_SPEC_SUGGESTIONS = [
  { key: "Usable Capacity", value: "" },
  { key: "Continuous Power", value: "" },
  { key: "Efficiency", value: "" },
  { key: "Protection", value: "IP65 Weatherproof" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formProduct, setFormProduct] = useState<Partial<ProductItem>>({});
  const [formSpecs, setFormSpecs] = useState<{ key: string; value: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Upload product image to /api/upload
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
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

      setFormProduct((prev) => ({
        ...prev,
        images: [data.url],
      }));
      notify("Product photo uploaded successfully!");
    } catch (err: any) {
      alert(`Image upload error: ${err.message || err}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Load products from API or local storage or defaults
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // 1. Try server API
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.products));
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch /api/products, checking localStorage:", err);
    }

    // 2. Fallback to localStorage
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not parse cached products:", e);
    }

    // 3. Fallback to catalogue-data defaults
    const defaults = DEFAULT_PRODUCTS.map((p) => ({ ...p, isActive: p.isActive ?? true }));
    setProducts(defaults);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const notify = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Toggle Active / Disabled state
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const updated = products.map((p) => (p.id === id ? { ...p, isActive: nextStatus } : p));
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id, isActive: nextStatus }),
      });
      notify(`Product ${nextStatus ? "enabled and active" : "disabled and hidden"}.`);
    } catch (e) {
      notify("Status updated locally.", "success");
    }
  };

  // Open modal for Adding New Product
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormProduct({
      id: `prod-custom-${Date.now()}`,
      name: "",
      slug: "",
      categorySlug: CATEGORIES[0].slug,
      categoryName: CATEGORIES[0].name,
      shortDesc: "",
      description: "",
      images: [],
      warranty: "10-Year Comprehensive Warranty",
      efficiency: "",
      badge: "",
      price: "",
      isActive: true,
      featured: false,
    });
    setFormSpecs([
      { key: "Brand Tier", value: "Tier 1 Approved" },
      { key: "Warranty", value: "10-25 Years" },
      { key: "Efficiency", value: "98% Peak" },
    ]);
    setIsModalOpen(true);
  };

  // Open modal for Editing Existing Product
  const handleOpenEditModal = (prod: ProductItem) => {
    setIsEditing(true);
    setFormProduct({ ...prod });
    const specsList = prod.specs
      ? Object.entries(prod.specs).map(([key, value]) => ({ key, value }))
      : [];
    setFormSpecs(specsList.length > 0 ? specsList : [{ key: "Warranty", value: prod.warranty || "" }]);
    setIsModalOpen(true);
  };

  // Handle Spec key-value changes
  const handleSpecChange = (index: number, field: "key" | "value", text: string) => {
    setFormSpecs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: text };
      return next;
    });
  };

  const handleAddSpecField = () => {
    setFormSpecs((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleRemoveSpecField = (index: number) => {
    setFormSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProduct.name?.trim()) {
      alert("Product name is required.");
      return;
    }

    const catObj = CATEGORIES.find((c) => c.slug === formProduct.categorySlug) || CATEGORIES[0];
    const generatedSlug =
      formProduct.slug?.trim() ||
      formProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Build specs record
    const specsRecord: Record<string, string> = {};
    formSpecs.forEach((s) => {
      if (s.key.trim()) {
        specsRecord[s.key.trim()] = s.value.trim();
      }
    });

    const completeProduct: ProductItem = {
      id: formProduct.id || `prod-custom-${Date.now()}`,
      name: formProduct.name.trim(),
      slug: generatedSlug,
      categorySlug: catObj.slug,
      categoryName: catObj.name,
      shortDesc: formProduct.shortDesc?.trim() || `${formProduct.name} - premium electrical & solar hardware.`,
      description:
        formProduct.description?.trim() ||
        `${formProduct.name} professionally supplied and installed by Canberra's certified electrical team at St George Electrical.`,
      images:
        Array.isArray(formProduct.images) && formProduct.images.length > 0 && formProduct.images[0]
          ? formProduct.images
          : ["/images/products/solar-panel.jpg"],
      specs: specsRecord,
      warranty: formProduct.warranty?.trim() || "10-Year Comprehensive Warranty",
      efficiency: formProduct.efficiency?.trim() || undefined,
      badge: formProduct.badge?.trim() || undefined,
      price: formProduct.price?.trim() || undefined,
      isActive: formProduct.isActive !== undefined ? formProduct.isActive : true,
      featured: Boolean(formProduct.featured),
    };

    setIsSaving(true);
    let updated: ProductItem[];

    if (isEditing) {
      updated = products.map((p) => (p.id === completeProduct.id ? completeProduct : p));
    } else {
      updated = [completeProduct, ...products];
    }

    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEditing ? "edit" : "add",
          product: completeProduct,
        }),
      });
      notify(isEditing ? "Product successfully updated!" : "New product successfully added!");
    } catch (e) {
      notify("Saved locally.", "success");
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the catalogue?`)) {
      return;
    }
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      notify("Product deleted from catalogue.");
    } catch (e) {
      notify("Removed locally.", "success");
    }
  };

  // Reset to default factory items
  const handleResetDefaults = async () => {
    if (!confirm("Reset catalogue back to initial factory products? Any custom products will be reset.")) {
      return;
    }
    const defaults = DEFAULT_PRODUCTS.map((p) => ({ ...p, isActive: true }));
    setProducts(defaults);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    } catch {}

    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      notify("Catalogue reset to defaults.");
    } catch (e) {
      notify("Reset locally.", "success");
    }
  };

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = (p.shortDesc || "").toLowerCase().includes(q);
        const matchesCategory = (p.categoryName || "").toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      // Category filter
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }
      // Status filter
      const isActive = p.isActive !== false;
      if (statusFilter === "active" && !isActive) return false;
      if (statusFilter === "disabled" && isActive) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  // Counts
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isActive !== false).length;
  const disabledCount = totalCount - activeCount;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold transition-all border ${
            statusMessage.type === "success"
              ? "bg-[#0d2a1c] border-emerald-500/40 text-emerald-300"
              : "bg-[#2a0d0d] border-red-500/40 text-red-300"
          }`}
        >
          {statusMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight flex items-center gap-2.5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Boxes className="text-orange-strong" size={28} />
            Product Catalogue Manager
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Add new products, edit technical specifications, and enable or disable items live across the storefront.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition-colors"
          >
            <Eye size={14} className="text-slate-500" />
            <span>View Public Store</span>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>

          <button
            onClick={handleOpenAddModal}
            className="btn-primary !py-2 !px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Products</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#071522] mt-1">{totalCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="text-emerald-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active &amp; Live
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">{activeCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" /> Disabled / Hidden
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-400 mt-1">{disabledCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Categories</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-strong mt-1">{CATEGORIES.length}</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, category, or specs..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#071522]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] px-3 py-2 focus:outline-none focus:bg-white focus:border-orange-strong font-semibold"
          >
            <option value="all">All Categories ({totalCount})</option>
            {CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.categorySlug === cat.slug).length;
              return (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name} ({count})
                </option>
              );
            })}
          </select>

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "all" ? "bg-orange-strong text-white shadow-sm" : "text-slate-600 hover:text-[#071522]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "active" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-[#071522]"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter("disabled")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "disabled" ? "bg-slate-700 text-white shadow-sm" : "text-slate-600 hover:text-[#071522]"
              }`}
            >
              Disabled ({disabledCount})
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw size={18} className="animate-spin text-orange-strong" />
            Loading catalogue products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Boxes size={36} className="mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No products match your filter criteria.</p>
            <p className="text-xs text-slate-500">Try adjusting your search terms or category selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-16">Item</th>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Specs &amp; Warranty</th>
                  <th className="py-3.5 px-4 text-center">Enable / Disable</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map((prod) => {
                  const isActive = prod.isActive !== false;
                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        !isActive ? "opacity-60 bg-slate-50/40" : ""
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {prod.images?.[0] ? (
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <Boxes size={18} className="text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Product Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#071522] text-sm">{prod.name}</span>
                          {prod.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                              {prod.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                          {prod.shortDesc}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          slug: /{prod.categorySlug}/{prod.slug}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                          {prod.categoryName}
                        </span>
                      </td>

                      {/* Specs */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold">
                          {prod.efficiency || Object.values(prod.specs || {})[0] || "Standard"}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px] mt-0.5">
                          {prod.warranty}
                        </div>
                      </td>

                      {/* Status Toggle (Enable / Disable) */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(prod.id, isActive)}
                          className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                              : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                          }`}
                          title={`Click to ${isActive ? "Disable" : "Enable"} this product`}
                        >
                          <Power
                            size={12}
                            className={`transition-transform ${isActive ? "text-emerald-600 group-hover:scale-110" : "text-red-600"}`}
                          />
                          <span>{isActive ? "Active (Live)" : "Disabled"}</span>
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#071522] transition-colors border border-slate-200"
                            title="Edit Product"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors border border-red-200"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>

                          <Link
                            href={`/products/${prod.categorySlug}/${prod.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-strong hover:text-orange-dark transition-colors border border-orange-200"
                            title="Preview Public Page"
                          >
                            <ExternalLink size={13} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
        <div>Showing {filteredProducts.length} of {totalCount} total products</div>
        <button
          onClick={handleResetDefaults}
          className="text-slate-500 hover:text-orange-strong transition-colors underline font-medium"
        >
          Reset to Default Catalogue
        </button>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071522]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-strong">
                  {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#071522]">
                    {isEditing ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isEditing
                      ? "Update specifications, image, pricing or change visibility status."
                      : "Create a brand new hardware item to showcase in the storefront."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#071522] p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title / Model Name *</label>
                <input
                  type="text"
                  required
                  value={formProduct.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = !isEditing
                      ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                      : formProduct.slug;
                    setFormProduct({ ...formProduct, name, slug: autoSlug });
                  }}
                  placeholder="e.g. Sungrow SBR096 High Voltage Battery (9.6kWh)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong"
                />
              </div>

              {/* Slug & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formProduct.slug || ""}
                    onChange={(e) => setFormProduct({ ...formProduct, slug: e.target.value })}
                    placeholder="sungrow-sbr096-battery"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={formProduct.categorySlug || CATEGORIES[0].slug}
                    onChange={(e) => {
                      const cat = CATEGORIES.find((c) => c.slug === e.target.value);
                      setFormProduct({
                        ...formProduct,
                        categorySlug: e.target.value,
                        categoryName: cat ? cat.name : "Solar",
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] focus:outline-none focus:bg-white focus:border-orange-strong font-semibold"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Efficiency & Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Efficiency / Capacity Metric</label>
                  <input
                    type="text"
                    value={formProduct.efficiency || ""}
                    onChange={(e) => setFormProduct({ ...formProduct, efficiency: e.target.value })}
                    placeholder="e.g. 97.6% Peak Efficiency or 13.5 kWh"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Warranty Term</label>
                  <input
                    type="text"
                    value={formProduct.warranty || ""}
                    onChange={(e) => setFormProduct({ ...formProduct, warranty: e.target.value })}
                    placeholder="e.g. 10-Year Comprehensive Warranty"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong"
                  />
                </div>
              </div>

              {/* Badge & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Marketing Badge (Optional)</label>
                  <input
                    type="text"
                    value={formProduct.badge || ""}
                    onChange={(e) => setFormProduct({ ...formProduct, badge: e.target.value })}
                    placeholder="e.g. Most Popular, Canberra Pick, Best Value"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Display Price (Optional)</label>
                  <input
                    type="text"
                    value={formProduct.price || ""}
                    onChange={(e) => setFormProduct({ ...formProduct, price: e.target.value })}
                    placeholder="e.g. From $3,490 Installed"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong"
                  />
                </div>
              </div>

              {/* Product Image Upload & Preview */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold mb-1">
                  Product Image (File Upload or URL)
                </label>

                {formProduct.images?.[0] ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video max-h-48 border border-slate-200 bg-slate-100 flex items-center justify-center group">
                    <img
                      src={formProduct.images[0]}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/products/solar-panel.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="px-3 py-1.5 bg-orange-strong hover:bg-orange-dark text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-colors flex items-center gap-1.5">
                        {isUploadingImage ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Upload size={13} />
                        )}
                        <span>{isUploadingImage ? "Uploading..." : "Replace Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageUpload}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormProduct({ ...formProduct, images: [] })}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-orange-strong/60 rounded-2xl p-6 cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100">
                    {isUploadingImage ? (
                      <Loader2 size={28} className="animate-spin text-orange-strong mb-2" />
                    ) : (
                      <Upload size={28} className="text-slate-400 mb-2" />
                    )}
                    <span className="text-xs font-bold text-[#071522]">
                      {isUploadingImage ? "Uploading product photo..." : "Add Image (Click to browse file)"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Select JPG, PNG, or WebP photo to display for this product
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Direct Image Path / URL input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={formProduct.images?.[0] || ""}
                    onChange={(e) => setFormProduct({ ...formProduct, images: [e.target.value] })}
                    placeholder="Or enter direct image asset URL (e.g. /images/products/my-battery.jpg)"
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 flex-shrink-0">
                    <Upload size={13} className="text-orange-strong" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Description (Catalogue cards)</label>
                <textarea
                  rows={2}
                  value={formProduct.shortDesc || ""}
                  onChange={(e) => setFormProduct({ ...formProduct, shortDesc: e.target.value })}
                  placeholder="A concise 1-2 sentence overview of key features for catalogue display..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Detailed Description</label>
                <textarea
                  rows={3}
                  value={formProduct.description || ""}
                  onChange={(e) => setFormProduct({ ...formProduct, description: e.target.value })}
                  placeholder="In-depth technical breakdown and Canberra climate performance description..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong"
                />
              </div>

              {/* Dynamic Key-Value Specs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-bold flex items-center gap-1.5">
                    <SlidersHorizontal size={13} className="text-orange-strong" />
                    Technical Specifications (Key / Value)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpecField}
                    className="text-orange-strong hover:text-orange-dark text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Spec Field
                  </button>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {formSpecs.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                        placeholder="e.g. Continuous Output"
                        className="w-1/3 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong text-[11px]"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                        placeholder="e.g. 5.0 kW AC"
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecField(idx)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Remove spec"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active / Disabled Status Toggle in Modal */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#071522] text-xs">Catalogue Visibility Status</div>
                  <div className="text-[11px] text-slate-500">
                    {formProduct.isActive !== false
                      ? "Product is ACTIVE and visible on the public website."
                      : "Product is DISABLED and hidden from public shoppers."}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormProduct({
                      ...formProduct,
                      isActive: !(formProduct.isActive !== false),
                    })
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    formProduct.isActive !== false
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-red-50 text-red-700 border-red-300"
                  }`}
                >
                  <Power size={12} />
                  <span>{formProduct.isActive !== false ? "Active (Live)" : "Disabled (Hidden)"}</span>
                </button>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:text-[#071522] bg-slate-100 hover:bg-slate-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary !py-2 !px-5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  {isSaving ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  <span>{isEditing ? "Save Product Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
