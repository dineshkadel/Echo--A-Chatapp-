"use client";

import React, { useRef, useState } from "react";
import { User, Camera, Loader2 } from "lucide-react";

interface AvatarUploaderProps {
  avatar: string;
  username: string;
  onAvatarUpdated: (newAvatarUrl: string) => void;
  onError: (errorMsg: string) => void;
  onSuccess: (successMsg: string) => void;
}

export default function AvatarUploader({
  avatar,
  username,
  onAvatarUpdated,
  onError,
  onSuccess,
}: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onError("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.error || "Failed to upload avatar");
        return;
      }

      onAvatarUpdated(data.avatarUrl);
      onSuccess("Avatar uploaded successfully!");
    } catch (err) {
      console.error("Avatar upload error:", err);
      onError("An error occurred while uploading your avatar.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        Profile Avatar
      </label>
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 shrink-0">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-blue-500 overflow-hidden flex items-center justify-center font-bold text-xl text-blue-300 shadow-md">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              username.slice(0, 2).toUpperCase() || <User size={28} />
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-slate-950/75 flex items-center justify-center backdrop-blur-xs">
              <Loader2 size={20} className="animate-spin text-blue-400" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload a photo from your device. Supported formats: PNG, JPG (Max 5MB).
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarSelect}
            className="hidden"
            id="avatar-upload-input"
          />
          <label
            htmlFor="avatar-upload-input"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 cursor-pointer transition-all active:scale-95 shadow-xs"
          >
            <Camera size={15} />
            {avatar ? "Change Photo" : "Upload Photo"}
          </label>
        </div>
      </div>
    </div>
  );
}
