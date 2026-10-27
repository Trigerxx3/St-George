"use client";

import { useEffect, useState } from "react";
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
  ArrowUpDown,
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadOrder, setUploadOrder] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!uploadCaption) {
        setUploadCaption(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // 1. Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("site-assets")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (storageError) throw storageError;

      // 2. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("site-assets").getPublicUrl(storageData.path);

      // 3. Insert into gallery table
      const { error: dbError } = await supabase.from("gallery").insert([
        {
          image_url: publicUrl,
          caption: uploadCaption.trim() || null,
          sort_order: uploadOrder || items.length + 1,
        },
      ]);

      if (dbError) throw dbError;

      setShowModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadCaption("");
      await fetchGallery();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Are you sure you want to remove this photo from the gallery?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("gallery").delete().eq("id", item.id);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Images className="text-green" size={26} />
            Photo Gallery & Project Showcase
          </h1>
          <p className="text-sm text-gray-500">
            Upload installation photos to the Supabase Storage bucket and curate your gallery.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/gallery"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span>View Public Gallery</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={() => {
              setUploadOrder(items.length + 1);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green hover:bg-green-light text-navy text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
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

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
          <RefreshCw size={24} className="animate-spin text-green" />
          <span className="text-sm">Loading gallery photos...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          <Images size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-700">No gallery photos yet</h3>
          <p className="text-xs text-gray-400 mt-1">
            Click &ldquo;Upload New Photo&rdquo; to add solar, battery, or electrical job photos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.caption || "Gallery installation"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-navy/80 text-white backdrop-blur-xs">
                  #{item.sort_order}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between gap-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-700 truncate" title={item.caption || ""}>
                  {item.caption || "No caption"}
                </p>

                <button
                  onClick={() => handleDelete(item)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer flex-shrink-0"
                  title="Delete image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-navy">Upload Installation Photo</h3>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* File drop / select */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                Image File *
              </label>
              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden aspect-video border border-gray-200 mb-2">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded text-[11px] font-semibold cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-green rounded-xl p-8 cursor-pointer transition-colors bg-gray-50 hover:bg-green/5">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-700">
                    Click to select JPG, PNG, or WebP photo
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1">
                    Directly uploaded to Supabase Storage bucket
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Photo Caption
              </label>
              <input
                type="text"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="e.g. 10kW Rooftop Solar & Battery Installation in Gungahlin"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={uploadOrder}
                onChange={(e) => setUploadOrder(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="px-4 py-2 bg-green hover:bg-green-light text-navy text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploading && <Loader2 size={14} className="animate-spin" />}
                <span>{isUploading ? "Uploading..." : "Save to Gallery"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
