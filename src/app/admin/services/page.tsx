"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ServiceCategory, ServiceSector } from "@/lib/supabase/types";
import {
  Wrench,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
  RefreshCw,
  Sun,
  Zap,
  Cpu,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  sector: ServiceSector;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setServices(data || []);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleActive = async (service: Service) => {
    try {
      const supabase = createClient();
      const nextActive = !service.is_active;
      const { error } = await supabase
        .from("services")
        .update({ is_active: nextActive })
        .eq("id", service.id);

      if (error) {
        alert(error.message);
      } else {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, is_active: nextActive } : s))
        );
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `services/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (error) {
        alert(`Image upload error: ${error.message}`);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("site-assets").getPublicUrl(data.path);

      setCurrentService((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService?.title || !currentService?.slug) {
      alert("Title and slug are required.");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        title: currentService.title,
        slug: currentService.slug.toLowerCase().replace(/\s+/g, "-"),
        category: (currentService.category || "solar_battery") as ServiceCategory,
        sector: (currentService.sector || "domestic") as ServiceSector,
        description: currentService.description || "",
        image_url: currentService.image_url || null,
        sort_order: Number(currentService.sort_order || 0),
        is_active: currentService.is_active ?? true,
      };

      if (currentService.id) {
        // Update
        const { error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", currentService.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from("services").insert([payload]);
        if (error) throw error;
      }

      setIsEditing(false);
      setCurrentService(null);
      await fetchServices();
    } catch (err: any) {
      alert(`Error saving service: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Wrench className="text-green" size={26} />
            Service Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage services across Solar & Battery, EV Chargers, and Electrical sectors.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchServices}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => {
              setCurrentService({
                title: "",
                slug: "",
                category: "solar_battery",
                sector: "domestic",
                description: "",
                sort_order: services.length + 1,
                is_active: true,
              });
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green hover:bg-green-light text-navy text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add New Service
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Services List Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-green" />
            <span className="text-sm">Loading services...</span>
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Wrench size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-700">No services in database</h3>
            <p className="text-xs text-gray-400 mt-1">Click &ldquo;Add New Service&rdquo; above to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Order</th>
                  <th className="py-3 px-4">Service Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4 text-center">Active Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-bold text-gray-400">
                      {s.sort_order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {s.image_url ? (
                          <img
                            src={s.image_url}
                            alt=""
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                            <ImageIcon size={16} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-navy text-sm">{s.title}</p>
                          <p className="text-[11px] font-mono text-gray-400">/{s.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                        {s.category.replace("_", " & ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                        {s.sector}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(s)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          s.is_active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {s.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {s.is_active ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setCurrentService(s);
                          setIsEditing(true);
                        }}
                        className="p-1.5 text-navy hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteService(s.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && currentService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveService}
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-navy">
                {currentService.id ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentService(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Service Title *
              </label>
              <input
                type="text"
                required
                value={currentService.title || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentService((prev) => ({
                    ...prev,
                    title: val,
                    slug: prev?.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                placeholder="Residential Solar & Battery"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={currentService.slug || ""}
                  onChange={(e) =>
                    setCurrentService((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                  placeholder="residential-solar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={currentService.sort_order ?? 0}
                  onChange={(e) =>
                    setCurrentService((prev) => ({
                      ...prev,
                      sort_order: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={currentService.category || "solar_battery"}
                  onChange={(e) =>
                    setCurrentService((prev) => ({
                      ...prev,
                      category: e.target.value as ServiceCategory,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                >
                  <option value="solar_battery">Solar & Battery</option>
                  <option value="ev_charger">EV Charger</option>
                  <option value="electrical">Electrical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Sector *
                </label>
                <select
                  value={currentService.sector || "domestic"}
                  onChange={(e) =>
                    setCurrentService((prev) => ({
                      ...prev,
                      sector: e.target.value as ServiceSector,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                >
                  <option value="domestic">Domestic</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={currentService.description || ""}
                onChange={(e) =>
                  setCurrentService((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                placeholder="Comprehensive description of the service and capabilities..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Service Photo (Supabase Storage)
              </label>
              <div className="flex items-center gap-3">
                {currentService.image_url && (
                  <img
                    src={currentService.image_url}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer border border-gray-300 transition-colors">
                  {uploadingImage ? (
                    <Loader2 size={14} className="animate-spin text-green" />
                  ) : (
                    <Upload size={14} />
                  )}
                  <span>{uploadingImage ? "Uploading..." : "Upload New Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              {currentService.image_url && (
                <input
                  type="text"
                  value={currentService.image_url}
                  onChange={(e) =>
                    setCurrentService((prev) => ({ ...prev, image_url: e.target.value }))
                  }
                  className="w-full mt-2 px-2 py-1 border border-gray-200 rounded text-[11px] font-mono text-gray-500"
                  placeholder="Or enter direct image URL"
                />
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={currentService.is_active ?? true}
                onChange={(e) =>
                  setCurrentService((prev) => ({ ...prev, is_active: e.target.checked }))
                }
                className="w-4 h-4 text-green focus:ring-green rounded"
              />
              <label htmlFor="is_active" className="text-xs font-medium text-gray-700">
                Active and visible on public website
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentService(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-green hover:bg-green-light text-navy text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                <span>Save Service</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
