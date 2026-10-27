"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Sliders,
  Save,
  RefreshCw,
  CheckCircle,
  Phone,
  Mail,
  Shield,
  Clock,
  MapPin,
  Award,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";

interface SettingItem {
  id?: string;
  key: string;
  value: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [customSettings, setCustomSettings] = useState<SettingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const defaultKeys = [
    { key: "phone", label: "Phone Number", icon: Phone, placeholder: BUSINESS.phone },
    { key: "email", label: "Primary Email", icon: Mail, placeholder: BUSINESS.email },
    { key: "licence", label: "Licence Numbers", icon: Shield, placeholder: BUSINESS.licence },
    { key: "operating_hours", label: "Operating Hours", icon: Clock, placeholder: "Mon - Fri: 7:00 AM - 5:00 PM (24/7 Emergency Service)" },
    { key: "service_area", label: "Service Area Coverage", icon: MapPin, placeholder: "Canberra, ACT & Capital Region" },
    { key: "badge_text", label: "Accreditation & Badges Text", icon: Award, placeholder: "CEC Accredited Installer" },
  ];

  const fetchSettings = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("site_settings").select("*");

      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        const dict: Record<string, string> = {};
        const customs: SettingItem[] = [];

        const defaultKeyNames = defaultKeys.map((k) => k.key);

        data.forEach((row) => {
          if (defaultKeyNames.includes(row.key)) {
            dict[row.key] = row.value;
          } else {
            customs.push({ id: row.id, key: row.key, value: row.value });
          }
        });

        // Fill in defaults if missing
        defaultKeys.forEach((k) => {
          if (!dict[k.key]) {
            dict[k.key] = k.placeholder;
          }
        });

        setSettings(dict);
        setCustomSettings(customs);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const supabase = createClient();

      // Combine standard settings and custom settings
      const upsertList: { key: string; value: string }[] = [];

      Object.entries(settings).forEach(([k, v]) => {
        upsertList.push({ key: k, value: v.trim() });
      });

      customSettings.forEach((item) => {
        if (item.key.trim()) {
          upsertList.push({ key: item.key.trim(), value: item.value.trim() });
        }
      });

      for (const item of upsertList) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(item, { onConflict: "key" });
        if (error) throw error;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await fetchSettings();
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Sliders className="text-green" size={26} />
            Business &amp; Website Site Settings
          </h1>
          <p className="text-sm text-gray-500">
            Centrally manage contact numbers, email addresses, business hours, and accreditation badges.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Reload
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle size={16} className="text-emerald-600" />
          <span>Site settings successfully updated and saved to Supabase!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Core Business Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-navy border-b border-gray-100 pb-3">
            Primary Contact &amp; Licensing Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {defaultKeys.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <Icon size={14} className="text-green" />
                    <span>{item.label}</span>
                  </label>
                  <input
                    type="text"
                    value={settings[item.key] || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, [item.key]: e.target.value }))
                    }
                    placeholder={item.placeholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent font-medium"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Key-Value Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-navy">Additional Site Variables</h2>
              <p className="text-xs text-gray-400">
                Custom keys read by website banners, footer, or dynamic components.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setCustomSettings((prev) => [...prev, { key: "", value: "" }])
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Add Key
            </button>
          </div>

          {customSettings.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No custom variables configured.</p>
          ) : (
            <div className="space-y-3">
              {customSettings.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Variable Key (e.g. holiday_hours)"
                    value={item.key}
                    onChange={(e) => {
                      const updated = [...customSettings];
                      updated[idx].key = e.target.value;
                      setCustomSettings(updated);
                    }}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Closed Dec 25 - Jan 2)"
                    value={item.value}
                    onChange={(e) => {
                      const updated = [...customSettings];
                      updated[idx].value = e.target.value;
                      setCustomSettings(updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCustomSettings((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-green hover:bg-green-light text-navy text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{isSaving ? "Saving Settings..." : "Save All Site Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
