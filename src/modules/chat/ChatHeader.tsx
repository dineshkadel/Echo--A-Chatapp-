"use client";

import React from "react";
import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { NotificationItem } from "@/src/hooks/useNotifications";

interface ChatHeaderProps {
  username?: string | null;
  role?: string | null;
  onlineCount: number;
  notifications: NotificationItem[];
  unreadCount: number;
  showNotifications: boolean;
  onToggleNotifications: () => void;
  onFetchNotifications: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  formatTime: (date: string) => string;
}

export default function ChatHeader({
  username,
  role,
  onlineCount,
  notifications,
  unreadCount,
  showNotifications,
  onToggleNotifications,
  onFetchNotifications,
  onMarkRead,
  onMarkAllRead,
  formatTime,
}: ChatHeaderProps) {
  const toggleNotifications = () => {
    onToggleNotifications();
    if (!showNotifications) onFetchNotifications();
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md">E</div>
        <div>
          <h1 className="text-lg font-bold leading-tight">Echo Chat</h1>
          <p className="text-xs text-slate-400">Real-time messaging · {onlineCount} online</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button type="button" onClick={toggleNotifications} title="Notifications" aria-label="Notifications" className="relative rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 transition-all hover:bg-slate-700">
            <Bell size={19} />
            {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 p-3">
                <h3 className="text-sm font-bold text-slate-200">Notifications</h3>
                {unreadCount > 0 && <button type="button" onClick={onMarkAllRead} className="text-xs font-medium text-blue-400 hover:text-blue-300">Mark all read</button>}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">No notifications yet</div>
                ) : notifications.map((notification) => (
                  <button key={notification._id} type="button" onClick={() => { if (!notification.isRead) onMarkRead(notification._id); }} className={`w-full border-b border-slate-800/50 p-3 text-left transition-all hover:bg-slate-800/50 ${!notification.isRead ? "bg-blue-950/20" : ""}`}>
                    <div className="flex items-start gap-2">
                      {!notification.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-200">{notification.title}</p>
                        <p className="truncate text-[11px] text-slate-400">{notification.body}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{formatTime(notification.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link href="/settings" title="Settings & Profile" className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"><Settings size={19} /></Link>
        <div className="hidden text-right sm:flex sm:flex-col">
          <span className="text-sm font-semibold text-slate-200">{username}</span>
          <span className="text-xs font-medium capitalize text-blue-400">{role || "customer"}</span>
        </div>
        <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-all hover:bg-slate-700 hover:text-white">Sign Out</button>
      </div>
    </header>
  );
}
