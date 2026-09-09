"use client";

import React, { useState } from "react";

interface SecurityFormProps {
  setMessage: (msg: { text: string; type: "success" | "error" } | null) => void;
}

export default function SecurityForm({ setMessage }: SecurityFormProps) {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && typeof data.error === "object") {
          const firstErrKey = Object.keys(data.error)[0];
          setMessage({ text: data.error[firstErrKey][0], type: "error" });
        } else {
          setMessage({ text: data.error || "Failed to change password", type: "error" });
        }
        return;
      }

      setMessage({ text: "Password changed successfully!", type: "success" });
      setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      console.error("Password change error:", err);
      setMessage({ text: "An error occurred while changing password.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          Current Password
        </label>
        <input
          type="password"
          required
          value={passwords.currentPassword}
          onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          New Password
        </label>
        <input
          type="password"
          required
          value={passwords.newPassword}
          onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Must be at least 8 characters with 1 number and 1 special character.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          Confirm New Password
        </label>
        <input
          type="password"
          required
          value={passwords.confirmNewPassword}
          onChange={(e) => setPasswords((p) => ({ ...p, confirmNewPassword: e.target.value }))}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {loading ? "Updating Password..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}
