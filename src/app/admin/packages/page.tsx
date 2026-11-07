"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { PACKAGES as DEFAULT_PACKAGES } from "@/lib/catalogue-data";
import { PackageItem } from "@/types/catalogue";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  RefreshCw,
  Power,
  Layers,
  Check,
  X,
  AlertCircle,
  Upload,
  Loader2,
  Sparkles,
  Zap,
  ShieldCheck,
  Tag,
  ListPlus,
} from "lucide-react";

const STORAGE_KEY = "stg_admin_packages";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formPkg, setFormPkg] = useState<Partial<PackageItem>>({});
  const [formIncludedItems, setFormIncludedItems] = useState<string[]>([]);
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Upload package image via /api/upload
  const handlePackageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setFormPkg((prev) => ({
        ...prev,
        image: data.url,
      }));
      notify("Package image uploaded successfully!");
    } catch (err: any) {
      alert(`Image upload error: ${err.message || err}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Load packages from API -> LocalStorage -> defaults
  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.packages) && data.packages.length > 0) {
          setPackages(data.packages);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.packages));
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch /api/packages, checking localStorage:", err);
    }

    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPackages(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not parse cached packages:", e);
    }

    const defaults = DEFAULT_PACKAGES.map((p) => ({ ...p, isActive: p.isActive ?? true }));
    setPackages(defaults);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const notify = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Toggle Active / Disabled
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const updated = packages.map((p) => (p.id === id ? { ...p, isActive: nextStatus } : p));
    setPackages(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id, isActive: nextStatus }),
      });
      notify(`Package ${nextStatus ? "enabled and public" : "disabled and hidden"}.`);
    } catch (e) {
      notify("Status updated locally.", "success");
    }
  };

  // Open modal for Adding New Package
  const handleOpenAddModal = () => {
    setIsEditing(false);
    // Explicitly set image to undefined so no preview is shown
    setFormPkg({
      id: `pkg-custom-${Date.now()}`,
      name: "",
      slug: "",
      systemSize: "",
      price: "",
      badge: "Special Price",
      shortDesc: "",
      description: "",
      idealFor: "Canberra homes looking to slash electricity bills with turnkey solar + battery.",
      estimatedOutput: "25-35 kWh/day average Canberra solar yield",
      warrantySummary: "25-Year Solar Panel Output + 10-Year Inverter & Battery Warranty",
      rebateEligible: true,
      featured: false,
      isActive: true,
      image: undefined,
    });
    setFormIncludedItems([
      "Tier 1 N-Type High Efficiency Solar Modules",
      "Smart Hybrid Inverter with WiFi Energy Monitoring",
      "Modular High-Voltage Home Battery Storage System",
      "Full ACT Certified Installation & Commissioning",
    ]);
    setFormFeatures([
      "Emergency Blackout Backup Circuit Protection",
      "EV Charger & Smart Hot Water Integration Ready",
      "Real-time Smartphone Energy Dashboard & Telemetry",
    ]);
    setIsModalOpen(true);
  };

  // Open modal for Editing Existing Package
  const handleOpenEditModal = (pkg: PackageItem) => {
    setIsEditing(true);
    setFormPkg({ ...pkg });
    setFormIncludedItems(Array.isArray(pkg.includedItems) && pkg.includedItems.length > 0 ? [...pkg.includedItems] : [""]);
    setFormFeatures(Array.isArray(pkg.features) && pkg.features.length > 0 ? [...pkg.features] : [""]);
    setIsModalOpen(true);
  };

  // Save package
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPkg.name?.trim()) {
      alert("Package title is required.");
      return;
    }
    if (!formPkg.systemSize?.trim()) {
      alert("System size (e.g. 6.6kW + 14kWh) is required.");
      return;
    }

    const generatedSlug =
      formPkg.slug?.trim() ||
      formPkg.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const cleanedIncluded = formIncludedItems.map((s) => s.trim()).filter(Boolean);
    const cleanedFeatures = formFeatures.map((s) => s.trim()).filter(Boolean);

    const completePkg: PackageItem = {
      id: formPkg.id || `pkg-custom-${Date.now()}`,
      name: formPkg.name.trim(),
      slug: generatedSlug,
      systemSize: formPkg.systemSize.trim(),
      price: formPkg.price?.trim() || undefined,
      badge: formPkg.badge?.trim() || undefined,
      shortDesc: formPkg.shortDesc?.trim() || `${formPkg.name} complete turnkey installation for Canberra residences.`,
      description:
        formPkg.description?.trim() ||
        `${formPkg.name} engineered specifically for the Canberra climate, combining premium Tier 1 solar panels with high-voltage battery storage for total energy resilience.`,
      includedItems: cleanedIncluded.length > 0 ? cleanedIncluded : ["Full turnkey solar & battery installation"],
      features: cleanedFeatures.length > 0 ? cleanedFeatures : ["Full ACT compliance certification"],
      idealFor: formPkg.idealFor?.trim() || "Canberra homes seeking reliable solar power and battery backup.",
      estimatedOutput: formPkg.estimatedOutput?.trim() || "High-yield daily solar generation",
      warrantySummary: formPkg.warrantySummary?.trim() || "Comprehensive manufacturer and installation warranties",
      rebateEligible: formPkg.rebateEligible !== undefined ? formPkg.rebateEligible : true,
      featured: Boolean(formPkg.featured),
      isActive: formPkg.isActive !== undefined ? formPkg.isActive : true,
      image: formPkg.image?.trim() || "/images/products/turnkey-6kw.jpg",
    };

    setIsSaving(true);
    let updated: PackageItem[];

    if (isEditing) {
      updated = packages.map((p) => (p.id === completePkg.id ? completePkg : p));
    } else {
      updated = [completePkg, ...packages];
    }

    setPackages(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEditing ? "edit" : "add",
          pkg: completePkg,
        }),
      });
      notify(isEditing ? "Package successfully updated!" : "New package deal successfully created!");
    } catch (e) {
      notify("Saved locally.", "success");
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  // Delete package
  const handleDeletePackage = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the package "${name}"?`)) {
      return;
    }
    const updated = packages.filter((p) => p.id !== id);
    setPackages(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      notify(`Package "${name}" deleted.`);
    } catch (e) {
      notify("Deleted locally.", "success");
    }
  };

  // Reset to original defaults
  const handleResetDefaults = async () => {
    if (!confirm("Reset all packages back to initial default deals? Custom packages will be replaced.")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.packages)) {
          setPackages(data.packages);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.packages));
          notify("Packages reset to original defaults.");
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not reset via API, applying local defaults:", e);
    }

    const defaults = DEFAULT_PACKAGES.map((p) => ({ ...p, isActive: true }));
    setPackages(defaults);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    } catch {}
    notify("Packages reset to original defaults.");
    setIsLoading(false);
  };

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Status filter
      if (statusFilter === "active" && pkg.isActive === false) return false;
      if (statusFilter === "disabled" && pkg.isActive !== false) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pkg.name.toLowerCase().includes(q);
        const matchesSize = pkg.systemSize.toLowerCase().includes(q);
        const matchesPrice = (pkg.price || "").toLowerCase().includes(q);
        const matchesDesc = (pkg.shortDesc || "").toLowerCase().includes(q);
        const matchesIdeal = (pkg.idealFor || "").toLowerCase().includes(q);
        return matchesName || matchesSize || matchesPrice || matchesDesc || matchesIdeal;
      }
      return true;
    });
  }, [packages, searchQuery, statusFilter]);

  // Metrics
  const activeCount = packages.filter((p) => p.isActive !== false).length;
  const disabledCount = packages.length - activeCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-sm font-semibold transition-all animate-bounce ${
            statusMessage.type === "success"
              ? "bg-[#071522] text-white border-orange-strong/40"
              : "bg-red-900/90 text-white border-red-500/50"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={18} className="text-orange-strong" />
          ) : (
            <AlertCircle size={18} className="text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-strong/10 text-orange-strong">
              <Package size={22} />
            </span>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Turnkey Clean Energy Packages
            </h1>
          </div>
          <p className="text-slate-500 text-sm mt-1.5 ml-1">
            Manage bundled turnkey deals, locked-in prices, inclusions, and visibility on the St George storefront.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            title="Reset to factory packages"
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={13} />
            <span>Reset Defaults</span>
          </button>

          <Link
            href="/packages"
            target="_blank"
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#071522] text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <span>Public Packages</span>
            <ExternalLink size={13} />
          </Link>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-orange-strong hover:bg-orange-dark text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Package</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#071522]/5 text-[#071522] flex items-center justify-center font-black">
            <Package size={24} className="text-[#071522]" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#071522]">{packages.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Packages</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">{activeCount}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active &amp; Public</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-strong/10 text-orange-strong flex items-center justify-center font-black">
            <Tag size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-orange-strong">Special Prices</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {packages.filter((p) => p.price).length} Packages Discounted
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by package name, size (e.g. 6.6kW), price..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:border-orange-strong focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Status:</span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs w-full sm:w-auto justify-center">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                statusFilter === "all" ? "bg-white text-[#071522] shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All ({packages.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                statusFilter === "active" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter("disabled")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                statusFilter === "disabled" ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Disabled ({disabledCount})
            </button>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm">
          <Loader2 size={32} className="animate-spin text-orange-strong mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-semibold">Loading turnkey packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
          <Package size={40} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#071522]">No packages found</h3>
          <p className="text-slate-500 text-xs mt-1">Try adjusting your search criteria or add a new package deal.</p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 bg-orange-strong text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Package Deal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const isActive = pkg.isActive !== false;
            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                  isActive ? "border-slate-200 hover:border-orange-strong/50" : "border-slate-300/80 opacity-70 bg-slate-50/70"
                }`}
              >
                <div>
                  {/* Package Image Banner */}
                  <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                    {pkg.image ? (
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/products/turnkey-6kw.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                        <Package size={36} className="text-slate-300 mb-1" />
                        <span className="text-[11px] font-semibold">No Image Provided</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur ${
                          isActive
                            ? "bg-emerald-600/90 text-white"
                            : "bg-slate-800/90 text-slate-300"
                        }`}
                      >
                        {isActive ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        {isActive ? "Active" : "Disabled"}
                      </span>
                    </div>

                    {/* Marketing Badge */}
                    {pkg.badge && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#071522]/90 text-white shadow-sm backdrop-blur">
                          <Sparkles size={11} className="text-orange-strong" />
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    {/* Special Price Pill */}
                    {pkg.price && (
                      <div className="absolute bottom-3 right-3 z-10">
                        <span className="px-3.5 py-1.5 rounded-xl font-black text-sm bg-red-600 text-white shadow-md flex items-center gap-1 tracking-tight">
                          {pkg.price}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-black text-orange-strong uppercase tracking-wider">
                        {pkg.systemSize}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-[#071522] leading-tight mb-2">
                      {pkg.name}
                    </h3>

                    <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2">
                      {pkg.shortDesc}
                    </p>

                    {/* Key Specs Pill Box */}
                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs mb-4">
                      <div className="flex items-start gap-1.5">
                        <Zap size={14} className="text-orange-strong shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#071522] font-semibold">Daily Gen: </strong>
                          <span className="text-slate-700">{pkg.estimatedOutput}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#071522] font-semibold">Warranty: </strong>
                          <span className="text-slate-700 line-clamp-1">{pkg.warrantySummary}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Sparkles size={14} className="text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#071522] font-semibold">Ideal For: </strong>
                          <span className="text-slate-700 line-clamp-1">{pkg.idealFor}</span>
                        </div>
                      </div>
                    </div>

                    {/* Inclusions count */}
                    {Array.isArray(pkg.includedItems) && pkg.includedItems.length > 0 && (
                      <div className="text-[11px] text-slate-500 font-semibold mb-2">
                        Includes {pkg.includedItems.length} bundled components &amp; certified ACT installation
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Toolbar */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(pkg.id, isActive)}
                      title={isActive ? "Disable package" : "Enable package"}
                      className={`p-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1 ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"
                      }`}
                    >
                      <Power size={13} />
                      <span className="hidden sm:inline">{isActive ? "Active" : "Disabled"}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(pkg)}
                      title="Edit package"
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Edit2 size={13} className="text-orange-strong" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                      title="Delete package"
                      className="p-2 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 text-xs font-bold transition-colors shadow-sm"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <Link
                    href={`/packages/${pkg.slug}`}
                    target="_blank"
                    className="text-xs font-bold text-orange-strong hover:text-orange-dark inline-flex items-center gap-1 transition-colors px-2 py-1"
                  >
                    <span>View Live</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071522]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-orange-strong/10 text-orange-strong">
                  {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-[#071522]">
                    {isEditing ? "Edit Turnkey Package" : "Add New Package"}
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {isEditing
                      ? "Update pricing, inclusions, specifications, and presentation for this deal."
                      : "Create a brand new turnkey solar + battery package deal for the storefront."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSavePackage} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Package Title & System Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Package Title / Name *</label>
                  <input
                    type="text"
                    required
                    value={formPkg.name || ""}
                    onChange={(e) => setFormPkg({ ...formPkg, name: e.target.value })}
                    placeholder="e.g. 6.6kW Solar + 14kWh Battery System"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">System Size Tag *</label>
                  <input
                    type="text"
                    required
                    value={formPkg.systemSize || ""}
                    onChange={(e) => setFormPkg({ ...formPkg, systemSize: e.target.value })}
                    placeholder="e.g. 6.6kW + 14kWh"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-medium"
                  />
                </div>
              </div>

              {/* Price, Badge & URL Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Special Installed Price</label>
                  <input
                    type="text"
                    value={formPkg.price || ""}
                    onChange={(e) => setFormPkg({ ...formPkg, price: e.target.value })}
                    placeholder="e.g. $6,799"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-bold text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Marketing Badge</label>
                  <input
                    type="text"
                    value={formPkg.badge || ""}
                    onChange={(e) => setFormPkg({ ...formPkg, badge: e.target.value })}
                    placeholder="e.g. Special Price, Popular"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formPkg.slug || ""}
                    onChange={(e) => setFormPkg({ ...formPkg, slug: e.target.value })}
                    placeholder="auto-generated-from-name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Package Image Upload & Preview */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold mb-1">
                  Package Image (File Upload or URL)
                </label>

                {formPkg.image ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video max-h-52 border border-slate-200 bg-slate-100 flex items-center justify-center group">
                    <img
                      src={formPkg.image}
                      alt="Package preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/products/turnkey-6kw.jpg";
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
                          onChange={handlePackageImageUpload}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormPkg({ ...formPkg, image: undefined })}
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
                      {isUploadingImage ? "Uploading package photo..." : "Add Image (Click to browse file)"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Upload high-res JPG, PNG, or WebP package banner
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePackageImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={formPkg.image || ""}
                    onChange={(e) => setFormPkg({ ...formPkg, image: e.target.value })}
                    placeholder="Or enter image URL: /images/products/turnkey-6kw.jpg"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-mono"
                  />
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl cursor-pointer border border-slate-200 transition-colors flex items-center gap-1 shrink-0">
                    <Upload size={12} />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePackageImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Estimated Yield & Best For */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estimated Daily Generation</label>
                  <input
                    type="text"
                    value={formPkg.estimatedOutput || ""}
                    onChange={(e) => setFormPkg({ ...formPkg, estimatedOutput: e.target.value })}
                    placeholder="e.g. 26.4 kWh/day average Canberra yield"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ideal Household / Use Case</label>
                  <input
                    type="text"
                    value={formPkg.idealFor || ""}
                    onChange={(e) => setFormPkg({ ...formPkg, idealFor: e.target.value })}
                    placeholder="e.g. Medium 3-4 bedroom Canberra homes"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-medium"
                  />
                </div>
              </div>

              {/* Warranty Summary */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Warranty Summary</label>
                <input
                  type="text"
                  value={formPkg.warrantySummary || ""}
                  onChange={(e) => setFormPkg({ ...formPkg, warrantySummary: e.target.value })}
                  placeholder="e.g. 25-Year Panel Output + 10-Year Inverter & Battery Warranty"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong font-medium"
                />
              </div>

              {/* Included Hardware Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-slate-700 font-bold">
                    Included Equipment &amp; Scope ({formIncludedItems.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormIncludedItems([...formIncludedItems, ""])}
                    className="text-orange-strong hover:text-orange-dark font-bold text-xs inline-flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Inclusion
                  </button>
                </div>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 max-h-48 overflow-y-auto">
                  {formIncludedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[11px] w-5 text-right">{idx + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...formIncludedItems];
                          updated[idx] = e.target.value;
                          setFormIncludedItems(updated);
                        }}
                        placeholder="e.g. 15 x Tier 1 440W N-Type Solar Modules"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-[#071522] focus:outline-none focus:border-orange-strong"
                      />
                      <button
                        type="button"
                        onClick={() => setFormIncludedItems(formIncludedItems.filter((_, i) => i !== idx))}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove inclusion"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-slate-700 font-bold">
                    Key Highlights &amp; Features ({formFeatures.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormFeatures([...formFeatures, ""])}
                    className="text-orange-strong hover:text-orange-dark font-bold text-xs inline-flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Feature
                  </button>
                </div>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 max-h-48 overflow-y-auto">
                  {formFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[11px] w-5 text-right">{idx + 1}.</span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...formFeatures];
                          updated[idx] = e.target.value;
                          setFormFeatures(updated);
                        }}
                        placeholder="e.g. Blackout emergency backup circuit protection"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-[#071522] focus:outline-none focus:border-orange-strong"
                      />
                      <button
                        type="button"
                        onClick={() => setFormFeatures(formFeatures.filter((_, i) => i !== idx))}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove feature"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Description (Preview Cards)</label>
                <textarea
                  rows={2}
                  value={formPkg.shortDesc || ""}
                  onChange={(e) => setFormPkg({ ...formPkg, shortDesc: e.target.value })}
                  placeholder="Concise 1-2 sentence overview for cards..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Detailed Description (Detail Page)</label>
                <textarea
                  rows={4}
                  value={formPkg.description || ""}
                  onChange={(e) => setFormPkg({ ...formPkg, description: e.target.value })}
                  placeholder="In-depth technical breakdown and Canberra climate performance description..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-strong"
                />
              </div>

              {/* Options */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPkg.isActive !== false}
                    onChange={(e) => setFormPkg({ ...formPkg, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-strong border-slate-300 focus:ring-orange-strong"
                  />
                  <span className="font-bold text-slate-700">Active &amp; Visible in Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPkg.rebateEligible !== false}
                    onChange={(e) => setFormPkg({ ...formPkg, rebateEligible: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-strong border-slate-300 focus:ring-orange-strong"
                  />
                  <span className="font-bold text-slate-700">Eligible for ACT &amp; Federal Rebates (STCs)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formPkg.featured)}
                    onChange={(e) => setFormPkg({ ...formPkg, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-strong border-slate-300 focus:ring-orange-strong"
                  />
                  <span className="font-bold text-slate-700">Highlight as Featured Deal</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-orange-strong hover:bg-orange-dark text-white font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  <span>{isEditing ? "Save Changes" : "Create Package Deal"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
