"use client";

import React, { useState } from "react";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import SecurityForm from "@/src/components/settings/security-form";

export default function SecuritySettingsPage() {
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-800/80 pb-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Lock size={18} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">Security & Password</h2>
          <p className="text-xs text-slate-400">Update your account password and security details</p>
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

      <SecurityForm setMessage={setMessage} />
    </div>
  );
}
