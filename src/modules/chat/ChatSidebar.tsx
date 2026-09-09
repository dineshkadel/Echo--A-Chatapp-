"use client";

import React from "react";
import type { ConversationItem, Participant } from "./chat-types";

interface ChatSidebarProps {
  conversations: ConversationItem[];
  selectedConversation: ConversationItem | null;
  loadingConversations: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  showNewChat: boolean;
  onToggleNewChat: () => void;
  newUserSearch: string;
  onNewUserSearchChange: (value: string) => void;
  userResults: Participant[];
  creatingChatFor: string | null;
  newChatError: string;
  onStartConversation: (userId: string) => void;
  onSelectConversation: (conversation: ConversationItem) => void;
  getConversationName: (conversation: ConversationItem) => string;
  getConversationInitials: (conversation: ConversationItem) => string;
  isPartnerOnline: (conversation: ConversationItem) => boolean;
  formatTime: (date: string) => string;
}

export default function ChatSidebar({
  conversations,
  selectedConversation,
  loadingConversations,
  search,
  onSearchChange,
  showNewChat,
  onToggleNewChat,
  newUserSearch,
  onNewUserSearchChange,
  userResults,
  creatingChatFor,
  newChatError,
  onStartConversation,
  onSelectConversation,
  getConversationName,
  getConversationInitials,
  isPartnerOnline,
  formatTime,
}: ChatSidebarProps) {
  const filteredConversations = conversations.filter((conversation) =>
    getConversationName(conversation).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="flex w-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:w-80">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Conversations ({conversations.length})
        </h2>
        <button
          type="button"
          onClick={onToggleNewChat}
          className="text-xs font-semibold text-blue-400 transition-all hover:text-blue-300"
        >
          {showNewChat ? "Cancel" : "+ New"}
        </button>
      </div>

      {showNewChat && (
        <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-slate-700 bg-slate-800/50 p-2">
          <input
            type="search"
            value={newUserSearch}
            onChange={(event) => onNewUserSearchChange(event.target.value)}
            placeholder="Search by name or username..."
            autoFocus
            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {newUserSearch.trim().length < 2 ? (
            <p className="p-2 text-center text-xs text-slate-500">
              Type at least 2 characters to search.
            </p>
          ) : newChatError ? (
            <p className="p-2 text-center text-xs text-red-300">{newChatError}</p>
          ) : userResults.length === 0 ? (
            <p className="p-2 text-center text-xs text-slate-500">No users found.</p>
          ) : (
            userResults.map((user) => (
              <button
                key={user._id}
                type="button"
                disabled={creatingChatFor !== null}
                onClick={() => onStartConversation(user._id)}
                className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-all hover:bg-slate-700/50 disabled:opacity-60"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-blue-300">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-200">
                    {user.fullname || user.username}
                  </p>
                  <p className="text-[10px] text-slate-500">@{user.username}</p>
                </div>
                <span className="text-[10px] font-semibold text-blue-400">
                  {creatingChatFor === user._id ? "Adding..." : "Add"}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      <input
        type="search"
        placeholder="Search conversations..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {loadingConversations ? (
          <div className="p-4 text-center text-xs text-slate-500">Loading conversations...</div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            {conversations.length === 0
              ? "No conversations yet. Start one!"
              : "No conversations match your search."}
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = selectedConversation?._id === conversation._id;
            const online = isPartnerOnline(conversation);

            return (
              <button
                key={conversation._id}
                type="button"
                onClick={() => onSelectConversation(conversation)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-blue-500/40 bg-blue-600/20 text-slate-100"
                    : "border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80"
                }`}
              >
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-blue-300">
                    {getConversationInitials(conversation)}
                  </div>
                  {!conversation.isGroup && (
                    <span
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-slate-900 ${
                        online ? "bg-emerald-500" : "bg-slate-600"
                      }`}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold">
                    {getConversationName(conversation)}
                  </div>
                  <div className="truncate text-[11px] text-slate-400">
                    {conversation.lastMessage
                      ? `${conversation.lastMessage.sender.username}: ${conversation.lastMessage.content}`
                      : "No messages yet"}
                  </div>
                </div>
                {conversation.lastMessage && (
                  <span className="shrink-0 text-[10px] text-slate-500">
                    {formatTime(conversation.lastMessage.createdAt)}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
