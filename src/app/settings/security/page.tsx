"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import SecurityForm from "@/src/modules/settings/security-form";
import { DismissableAlert } from "@/components/ui/dismissable-alert";

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
      <DismissableAlert
        type={message?.type ?? "error"}
        message={message?.text ?? null}
        onDismiss={() => setMessage(null)}
      />

      <SecurityForm setMessage={setMessage} />
    </div>
  );
}
