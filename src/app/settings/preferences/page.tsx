"use client";

import React, { useEffect, useState } from "react";
import { Bell, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import PreferencesForm from "@/src/modules/settings/preferences-form";
import { UserProfileData } from "@/src/modules/settings/profile-form";
import { useTheme } from "@/src/context/ThemeContext";

const DEFAULT_PREFERENCES = {
  soundEnabled: true,
  onlineStatusVisible: true,
  notificationsEnabled: true,
  theme: "dark" as const,
};

export default function PreferencesSettingsPage() {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          const userPrefs = { ...DEFAULT_PREFERENCES, ...data.user.preferences };
          setProfile({
            fullname: data.user.fullname || "",
            username: data.user.username || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            avatar: data.user.avatar || "",
            bio: data.user.bio || "",
            // Keep the active cookie theme when the database has an older value.
            preferences: { ...userPrefs, theme },
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching preferences:", err);
        setMessage({ text: "Failed to load preferences.", type: "error" });
      })
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
        <Loader2 size={24} className="animate-spin text-blue-500" />
        <span>Loading preferences...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
        Could not load preferences. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-800/80 pb-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Bell size={18} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">App Preferences</h2>
          <p className="text-xs text-slate-400">Customize sounds, privacy, notifications, and theme settings</p>
        </div>
      </div>

      {/* Alert Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-200"
              : "bg-red-950/60 border-red-800 text-red-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <PreferencesForm
        initialData={profile}
        setMessage={setMessage}
      />
    </div>
  );
}
