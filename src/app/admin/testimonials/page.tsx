"use client";

import { useEffect, useState } from "react";
import { errorMessage } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  MessageSquareQuote,
  Star,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  is_published: boolean;
  created_at: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setTestimonials(data || []);
      }
    } catch (e) {
      setErrorMsg(errorMessage(e));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleTogglePublished = async (item: Testimonial) => {
    const nextVal = !item.is_published;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("testimonials")
        .update({ is_published: nextVal })
        .eq("id", item.id);

      if (error) throw error;
      setTestimonials((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, is_published: nextVal } : t))
      );
    } catch (err) {
      alert(errorMessage(err));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestimonial?.name || !currentTestimonial?.text) {
      alert("Please provide customer name and testimonial text.");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        name: currentTestimonial.name,
        text: currentTestimonial.text,
        rating: Number(currentTestimonial.rating || 5),
        is_published: currentTestimonial.is_published ?? true,
      };

      if (currentTestimonial.id) {
        const { error } = await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", currentTestimonial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert([payload]);
        if (error) throw error;
      }

      setIsEditing(false);
      setCurrentTestimonial(null);
      await fetchTestimonials();
    } catch (err) {
      alert(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(errorMessage(err));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight flex items-center gap-2.5" style={{ fontFamily: "var(--font-heading)" }}>
            <MessageSquareQuote className="text-orange-strong" size={28} />
            Testimonials &amp; Customer Reviews
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish, edit and manage customer reviews shown across the website.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Link
            href="/testimonials"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span>View Public Page</span>
            <ExternalLink size={14} className="text-slate-400" />
          </Link>

          <button
            onClick={() => {
              setCurrentTestimonial({ name: "", text: "", rating: 5, is_published: true });
              setIsEditing(true);
            }}
            className="btn-primary !py-2 !px-4 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus size={16} />
            Add Testimonial
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Grid of Testimonials */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw size={24} className="animate-spin text-orange-strong" />
          <span className="text-sm">Loading testimonials...</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
          <MessageSquareQuote size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-[#071522]">No testimonials published</h3>
          <p className="text-xs text-slate-500 mt-1">Click &ldquo;Add Testimonial&rdquo; to add your first customer review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all hover:border-orange-strong/50 hover:shadow-md ${
                t.is_published ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < t.rating ? "currentColor" : "none"}
                        className={i < t.rating ? "text-amber-400" : "text-slate-200"}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleTogglePublished(t)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                      t.is_published
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {t.is_published ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                    {t.is_published ? "Published" : "Draft"}
                  </button>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#071522] text-xs">{t.name}</h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(t.created_at).toLocaleDateString("en-AU")}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setCurrentTestimonial(t);
                      setIsEditing(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-[#071522] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {isEditing && currentTestimonial && (
        <div className="fixed inset-0 z-50 bg-[#071522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#071522]">
                {currentTestimonial.id ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentTestimonial(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Customer Name &amp; Suburb *
              </label>
              <input
                type="text"
                required
                value={currentTestimonial.name || ""}
                onChange={(e) =>
                  setCurrentTestimonial((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. David M. - Gungahlin, ACT"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Rating (1 - 5 Stars) *
              </label>
              <select
                value={currentTestimonial.rating || 5}
                onChange={(e) =>
                  setCurrentTestimonial((prev) => ({
                    ...prev,
                    rating: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong cursor-pointer font-semibold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                <option value={2}>⭐⭐ (2 Stars)</option>
                <option value={1}>⭐ (1 Star)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Review Text *
              </label>
              <textarea
                required
                rows={4}
                value={currentTestimonial.text || ""}
                onChange={(e) =>
                  setCurrentTestimonial((prev) => ({ ...prev, text: e.target.value }))
                }
                placeholder="What the customer said about St George Electrical..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_published"
                checked={currentTestimonial.is_published ?? true}
                onChange={(e) =>
                  setCurrentTestimonial((prev) => ({ ...prev, is_published: e.target.checked }))
                }
                className="w-4 h-4 text-orange-strong focus:ring-orange-strong rounded cursor-pointer"
              />
              <label htmlFor="is_published" className="text-xs font-medium text-slate-700 cursor-pointer">
                Publish immediately to website
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentTestimonial(null);
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
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                <span>Save Review</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
