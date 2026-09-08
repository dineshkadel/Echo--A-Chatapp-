"use client";

import React from "react";
import { Check, CheckCheck, MoreVertical, Phone, Smile, Video } from "lucide-react";
import type { ConversationItem, MessageItem } from "./chat-types";

interface ChatWindowProps {
  conversation: ConversationItem | null;
  messages: MessageItem[];
  loadingMessages: boolean;
  currentUserId: string;
  input: string;
  typingUser?: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (event: React.FormEvent) => void;
  getConversationName: (conversation: ConversationItem) => string;
  getConversationInitials: (conversation: ConversationItem) => string;
  isPartnerOnline: (conversation: ConversationItem) => boolean;
  formatTime: (date: string) => string;
}

export default function ChatWindow({
  conversation,
  messages,
  loadingMessages,
  currentUserId,
  input,
  typingUser,
  messagesEndRef,
  onInputChange,
  onSend,
  getConversationName,
  getConversationInitials,
  isPartnerOnline,
  formatTime,
}: ChatWindowProps) {
  if (!conversation) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 text-slate-500">
        <div className="text-5xl opacity-30">•••</div>
        <span className="text-sm">Select a conversation or start a new one</span>
      </main>
    );
  }

  const online = isPartnerOnline(conversation);

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
      <header className="flex items-center gap-3 border-b border-slate-800 bg-slate-900/90 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/30 bg-blue-600/20 text-sm font-bold text-blue-300">
          {getConversationInitials(conversation)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-100">
            {getConversationName(conversation)}
          </h3>
          <p className="text-xs text-slate-400">
            {typingUser ? (
              <span className="text-blue-400">{typingUser} is typing...</span>
            ) : online ? (
              <span className="text-emerald-400">Online</span>
            ) : conversation.isGroup ? (
              `${conversation.participants.length} members`
            ) : (
              "Offline"
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" title="Start audio call" aria-label="Start audio call" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <Phone size={17} />
          </button>
          <button type="button" title="Start video call" aria-label="Start video call" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <Video size={18} />
          </button>
          <button type="button" title="Conversation options" aria-label="Conversation options" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-xs text-slate-500">
            <span>No messages yet. Start the conversation!</span>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.sender._id === currentUserId;
            return (
              <div key={message._id} className={`group flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[85%] flex-col ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && <span className="mb-1 px-1 text-[10px] font-medium text-slate-500">{message.sender.username}</span>}
                  <div className="flex items-end gap-2">
                    <div className={`px-4 py-3 text-sm shadow-sm ${isMe ? "rounded-2xl rounded-br-md bg-blue-600 text-white" : "rounded-2xl rounded-bl-md border border-slate-700/60 bg-slate-800 text-slate-100"}`}>
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <div className={`mt-1.5 flex items-center justify-end gap-1.5 text-[10px] ${isMe ? "text-blue-100" : "text-slate-500"}`}>
                        <span>{formatTime(message.createdAt)}</span>
                        {isMe && (message.status === "seen" ? <CheckCheck size={13} className="text-blue-200" /> : message.status === "delivered" ? <CheckCheck size={13} /> : <Check size={13} />)}
                      </div>
                    </div>
                    <button type="button" title="React to message" aria-label="React to message" className="mb-1 rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-500 opacity-0 transition-opacity hover:text-yellow-300 group-hover:opacity-100">
                      <Smile size={14} />
                    </button>
                  </div>
                  {isMe && message.status === "seen" && <span className="mt-1 px-1 text-[10px] text-blue-400">Seen</span>}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={onSend} className="flex gap-3 border-t border-slate-800 bg-slate-900/90 p-4">
        <input type="text" value={input} onChange={onInputChange} placeholder={`Message ${getConversationName(conversation)}...`} className="flex-1 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-500 active:scale-95">Send</button>
      </form>
    </main>
  );
}
