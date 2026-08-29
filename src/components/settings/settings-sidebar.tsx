"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Lock, Bell } from "lucide-react";

const navItems = [
  {
    href: "/settings/profile",
    label: "Edit Profile",
    description: "Personal details and avatar",
    icon: User,
  },
  {
    href: "/settings/security",
    label: "Security & Password",
    description: "Manage login credentials",
    icon: Lock,
  },
  {
    href: "/settings/preferences",
    label: "App Preferences",
    description: "Sounds, notifications & theme",
    icon: Bell,
  },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3 flex flex-col gap-2 shrink-0">
      <div className="px-3 py-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </h3>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all border ${
                isActive
                  ? "bg-blue-600/15 border-blue-500/40 text-blue-400 font-semibold"
                  : "border-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  isActive
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-slate-800/80 text-slate-400"
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold leading-tight">
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
