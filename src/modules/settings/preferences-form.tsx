"use client";

import React, { useState } from "react";
import { Volume2, Eye, BellRing, Sun, Moon } from "lucide-react";
import { UserProfileData } from "./profile-form";
import { useTheme } from "@/src/context/ThemeContext";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

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

  const savePreferences = async (nextProfile: UserProfileData) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: nextProfile.fullname,
          phone: nextProfile.phone,
          avatar: nextProfile.avatar,
          bio: nextProfile.bio,
          preferences: nextProfile.preferences,
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

  const updatePreferences = (preferences: UserProfileData["preferences"]) => {
    const nextProfile = { ...profile, preferences };
    setProfile(nextProfile);
    setAppTheme(preferences.theme);
    void savePreferences(nextProfile);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <ToggleSwitch
          id="sound-notifications"
          label="Sound Notifications"
          description="Play a chime when new messages arrive"
          icon={<Volume2 size={18} />}
          checked={profile.preferences.soundEnabled}
          onChange={(checked) =>
            updatePreferences({ ...profile.preferences, soundEnabled: checked })
          }
        />

        <ToggleSwitch
          id="online-status-privacy"
          label="Online Status Privacy"
          description="Allow other users to see when you're online"
          icon={<Eye size={18} />}
          checked={profile.preferences.onlineStatusVisible}
          onChange={(checked) =>
            updatePreferences({ ...profile.preferences, onlineStatusVisible: checked })
          }
        />

        <ToggleSwitch
          id="push-notifications"
          label="Desktop & Push Notifications"
          description="Receive in-app popups for important alerts"
          icon={<BellRing size={18} />}
          checked={profile.preferences.notificationsEnabled}
          onChange={(checked) =>
            updatePreferences({ ...profile.preferences, notificationsEnabled: checked })
          }
        />

        {/* Appearance Theme — uses custom button toggle, not a checkbox */}
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
              onClick={() => updatePreferences({ ...profile.preferences, theme: "light" })}
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
              onClick={() => updatePreferences({ ...profile.preferences, theme: "dark" })}
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

      {loading && <p className="text-xs text-slate-500">Saving preference...</p>}
    </div>
  );
}
