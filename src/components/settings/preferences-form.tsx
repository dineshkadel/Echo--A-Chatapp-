"use client";

import React, { useState } from "react";
import { Volume2, Eye, BellRing, Sun, Moon } from "lucide-react";
import { UserProfileData } from "./profile-form";
import { useTheme } from "@/src/context/ThemeContext";

interface PreferencesFormProps {
  initialData: UserProfileData;
  onProfileUpdated?: (updatedUser: Partial<UserProfileData>) => void;
  setMessage: (msg: { text: string; type: "success" | "error" } | null) => void;
}

export default function PreferencesForm({
  initialData,
  onProfileUpdated,
  setMessage,
}: PreferencesFormProps) {
  const { setTheme: setAppTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfileData>(initialData);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: profile.fullname,
          phone: profile.phone,
          avatar: profile.avatar,
          bio: profile.bio,
          preferences: profile.preferences,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Failed to save preferences", type: "error" });
        return;
      }

      setMessage({ text: "Preferences saved successfully!", type: "success" });
      if (onProfileUpdated && data.user) {
        onProfileUpdated(data.user);
      }
    } catch (err) {
      console.error("Preferences update error:", err);
      setMessage({ text: "An error occurred while saving preferences.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        {/* Sound Notifications */}
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Volume2 size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Sound Notifications</h4>
              <p className="text-[11px] text-slate-400">Play a chime when new messages arrive</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={profile.preferences.soundEnabled}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  preferences: { ...p.preferences, soundEnabled: e.target.checked },
                }))
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Online Status Privacy */}
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Eye size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Online Status Privacy</h4>
              <p className="text-[11px] text-slate-400">Allow other users to see when you're online</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={profile.preferences.onlineStatusVisible}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  preferences: { ...p.preferences, onlineStatusVisible: e.target.checked },
                }))
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <BellRing size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Desktop & Push Notifications</h4>
              <p className="text-[11px] text-slate-400">Receive in-app popups for important alerts</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={profile.preferences.notificationsEnabled}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  preferences: { ...p.preferences, notificationsEnabled: e.target.checked },
                }))
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Appearance Theme */}
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              {profile.preferences.theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Appearance</h4>
              <p className="text-[11px] text-slate-400">Switch between light and dark theme</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-full p-1">
            <button
              type="button"
              onClick={() => {
                setProfile((p) => ({
                  ...p,
                  preferences: { ...p.preferences, theme: "light" },
                }));
                setAppTheme("light");
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                profile.preferences.theme === "light"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sun size={13} />
              Light
            </button>
            <button
              type="button"
              onClick={() => {
                setProfile((p) => ({
                  ...p,
                  preferences: { ...p.preferences, theme: "dark" },
                }));
                setAppTheme("dark");
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                profile.preferences.theme === "dark"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Moon size={13} />
              Dark
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving Preferences..." : "Save Preferences"}
        </button>
      </div>
    </form>
  );
}
