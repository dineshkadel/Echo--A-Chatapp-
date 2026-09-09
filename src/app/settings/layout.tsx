"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import SettingsSidebar from "@/src/modules/settings/settings-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Settings Top Bar */}
      <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>Back to Chat</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Settings size={16} />
            </div>
            <h1 className="text-sm font-bold text-slate-100">Settings & Account</h1>
          </div>
        </div>
      </header>

      {/* Main Settings Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6">
        <SettingsSidebar />
        <div className="flex-1 bg-slate-900/50 border border-slate-800/90 rounded-2xl p-6 md:p-8 min-h-125">
          {children}
        </div>
      </main>
    </div>
  );
}
