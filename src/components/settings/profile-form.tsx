"use client";

import React, { useState } from "react";
import AvatarUploader from "./avatar-uploader";

export interface UserProfileData {
  fullname: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  preferences: {
    soundEnabled: boolean;
    onlineStatusVisible: boolean;
    notificationsEnabled: boolean;
    theme: "light" | "dark";
  };
}

interface ProfileFormProps {
  initialData: UserProfileData;
  onProfileUpdated?: (updatedUser: Partial<UserProfileData>) => void;
  setMessage: (msg: { text: string; type: "success" | "error" } | null) => void;
}

export default function ProfileForm({
  initialData,
  onProfileUpdated,
  setMessage,
}: ProfileFormProps) {
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
        if (data.error && typeof data.error === "object") {
          const firstErrKey = Object.keys(data.error)[0];
          setMessage({ text: data.error[firstErrKey][0], type: "error" });
        } else {
          setMessage({ text: data.error || "Failed to update profile", type: "error" });
        }
        return;
      }

      setMessage({ text: "Profile updated successfully!", type: "success" });
      if (onProfileUpdated && data.user) {
        onProfileUpdated(data.user);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage({ text: "An error occurred while updating profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Uploader Component */}
      <AvatarUploader
        avatar={profile.avatar}
        username={profile.username}
        onAvatarUpdated={(newAvatarUrl) =>
          setProfile((p) => ({ ...p, avatar: newAvatarUrl }))
        }
        onError={(err) => setMessage({ text: err, type: "error" })}
        onSuccess={(msg) => setMessage({ text: msg, type: "success" })}
      />

      {/* Readonly Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Username
          </label>
          <input
            type="text"
            disabled
            value={profile.username}
            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Email Address
          </label>
          <input
            type="text"
            disabled
            value={profile.email}
            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed font-medium"
          />
        </div>
      </div>

      {/* Full Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            value={profile.fullname}
            onChange={(e) => setProfile((p) => ({ ...p, fullname: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Phone Number
          </label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+1234567890"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          Bio / About Me
        </label>
        <textarea
          rows={3}
          maxLength={200}
          value={profile.bio}
          onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
          placeholder="Tell people a little bit about yourself..."
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <p className="text-[10px] text-slate-500 text-right mt-1 font-mono">
          {profile.bio.length}/200
        </p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving Profile..." : "Save Profile Changes"}
        </button>
      </div>
    </form>
  );
}
