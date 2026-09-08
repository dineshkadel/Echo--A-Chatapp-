"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/src/hooks/useSocket";
import { useNotifications } from "@/src/hooks/useNotifications";
import { getSocket } from "@/src/lib/socket";
import { parseJsonResponse } from "@/src/lib/apiResponse";
import ChatHeader from "@/src/components/chat/ChatHeader";
import ChatSidebar from "@/src/components/chat/ChatSidebar";
import ChatWindow from "@/src/components/chat/ChatWindow";
import type { ConversationItem, MessageItem, Participant } from "@/src/components/chat/chat-types";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const { sendMessage, markSeen, startTyping, stopTyping } = useSocket();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllRead,
  } = useNotifications();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [onlineStatus, setOnlineStatus] = useState<Record<string, boolean>>({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [userResults, setUserResults] = useState<Participant[]>([]);
  const [newUserSearch, setNewUserSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [creatingChatFor, setCreatingChatFor] = useState<string | null>(null);
  const [newChatError, setNewChatError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUserId = session?.user?.id || "";
  const currentUsername = session?.user?.username || "You";

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/conversations")
      .then((res) => parseJsonResponse<{ conversations?: ConversationItem[] }>(res))
      .then((data) => {
        if (!data.conversations) return;
        setConversations(data.conversations);
        const statusMap: Record<string, boolean> = {};
        for (const conversation of data.conversations) {
          for (const participant of conversation.participants) {
            if (participant._id !== currentUserId) {
              statusMap[participant._id] = participant.IsOnline || false;
            }
          }
        }
        setOnlineStatus(statusMap);
      })
      .catch(console.error)
      .finally(() => setLoadingConvos(false));
  }, [status, currentUserId]);

  useEffect(() => {
    const query = newUserSearch.trim();
    if (status !== "authenticated" || !showNewChat || query.length < 2) {
      setUserResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/users?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => parseJsonResponse<{ users?: Participant[] }>(res))
        .then((data) => setUserResults(data.users || []))
        .catch((error) => {
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            console.error(error);
          }
        });
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [status, showNewChat, newUserSearch]);

  useEffect(() => {
    if (!selectedConvo) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    fetch(`/api/conversations/${selectedConvo._id}/messages`)
      .then((res) => parseJsonResponse<{ messages?: MessageItem[] }>(res))
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
          markSeen(selectedConvo._id, currentUserId);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingMessages(false));
  }, [selectedConvo, currentUserId, markSeen]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const socket = getSocket();

    const handleNewMessage = (data: { conversationId: string; message: MessageItem }) => {
      if (selectedConvo && data.conversationId === selectedConvo._id) {
        setMessages((previous) => {
          if (previous.some((message) => message._id === data.message._id)) return previous;
          return [...previous, data.message];
        });
        if (data.message.sender._id !== currentUserId) {
          markSeen(data.conversationId, currentUserId);
        }
      }

      setConversations((previous) =>
        previous
          .map((conversation) =>
            conversation._id === data.conversationId
              ? {
                  ...conversation,
                  lastMessage: {
                    content: data.message.content,
                    sender: { username: data.message.sender.username },
                    createdAt: data.message.createdAt,
                  },
                  updatedAt: data.message.createdAt,
                }
              : conversation
          )
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );
    };

    const handleNewConversation = (conversation: ConversationItem) => {
      setConversations((previous) =>
        previous.some((item) => item._id === conversation._id)
          ? previous
          : [conversation, ...previous]
      );
    };

    const handleUserStatus = (data: { userId: string; isOnline: boolean }) => {
      setOnlineStatus((previous) => ({ ...previous, [data.userId]: data.isOnline }));
    };

    const handleTypingStart = (data: { conversationId: string; userId: string; username: string }) => {
      if (data.userId !== currentUserId) {
        setTypingUsers((previous) => ({ ...previous, [data.conversationId]: data.username }));
      }
    };

    const handleTypingStop = (data: { conversationId: string; userId: string }) => {
      if (data.userId !== currentUserId) {
        setTypingUsers((previous) => {
          const next = { ...previous };
          delete next[data.conversationId];
          return next;
        });
      }
    };

    const handleMessageSeen = (data: { conversationId: string; seenBy: string }) => {
      if (selectedConvo && data.conversationId === selectedConvo._id) {
        setMessages((previous) =>
          previous.map((message) => ({
            ...message,
            status: "seen" as const,
            seenBy: message.seenBy.includes(data.seenBy)
              ? message.seenBy
              : [...message.seenBy, data.seenBy],
          }))
        );
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:created", handleNewConversation);
    socket.on("user:status", handleUserStatus);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("message:seen", handleMessageSeen);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:created", handleNewConversation);
      socket.off("user:status", handleUserStatus);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("message:seen", handleMessageSeen);
    };
  }, [status, selectedConvo, currentUserId, markSeen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || !selectedConvo) return;

    sendMessage({
      conversationId: selectedConvo._id,
      senderId: currentUserId,
      senderName: currentUsername,
      content: input.trim(),
    });
    stopTyping(selectedConvo._id, currentUserId);
    setInput("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    if (!selectedConvo) return;

    startTyping(selectedConvo._id, currentUserId, currentUsername);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedConvo._id, currentUserId);
    }, 2000);
  };

  const startNewChat = async (userId: string) => {
    if (creatingChatFor) return;
    setCreatingChatFor(userId);
    setNewChatError("");

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: userId }),
      });
      const data = await parseJsonResponse<{ conversation?: ConversationItem; isNew?: boolean }>(response);
      if (!data.conversation) {
        setNewChatError("Could not start this conversation.");
        return;
      }

      const conversation = data.conversation;
      setConversations((previous) =>
        data.isNew
          ? [conversation, ...previous]
          : previous.map((item) => (item._id === conversation._id ? conversation : item))
      );
      setSelectedConvo(conversation);
      setShowNewChat(false);
      setNewUserSearch("");
      setUserResults([]);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setNewChatError(error instanceof Error ? error.message : "Could not start this conversation.");
    } finally {
      setCreatingChatFor(null);
    }
  };

  const getPartner = useCallback(
    (conversation: ConversationItem): Participant | null => {
      if (conversation.isGroup) return null;
      return conversation.participants.find((participant) => participant._id !== currentUserId) || null;
    },
    [currentUserId]
  );

  const getConversationName = useCallback(
    (conversation: ConversationItem) => {
      if (conversation.isGroup) return conversation.groupName || "Group";
      const partner = getPartner(conversation);
      return partner?.fullname || partner?.username || "Unknown";
    },
    [getPartner]
  );

  const getConversationInitials = useCallback(
    (conversation: ConversationItem) => {
      if (conversation.isGroup) return (conversation.groupName || "G").slice(0, 2).toUpperCase();
      const partner = getPartner(conversation);
      return (partner?.username || "?").slice(0, 2).toUpperCase();
    },
    [getPartner]
  );

  const isPartnerOnline = useCallback(
    (conversation: ConversationItem) => {
      if (conversation.isGroup) return false;
      const partner = getPartner(conversation);
      return partner ? onlineStatus[partner._id] ?? false : false;
    },
    [getPartner, onlineStatus]
  );

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3 text-sm">Loading Echo Chat...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <ChatHeader
        username={session?.user?.username || session?.user?.email}
        role={session?.user?.role}
        onlineCount={Object.values(onlineStatus).filter(Boolean).length}
        notifications={notifications}
        unreadCount={unreadCount}
        showNotifications={showNotifications}
        onToggleNotifications={() => setShowNotifications((value) => !value)}
        onFetchNotifications={() => fetchNotifications()}
        onMarkRead={markAsRead}
        onMarkAllRead={markAllRead}
        formatTime={formatTime}
      />
      <div className="flex min-h-0 flex-1 w-full max-w-7xl mx-auto gap-6 overflow-hidden p-4 md:p-6">
        <ChatSidebar
          conversations={conversations}
          selectedConversation={selectedConvo}
          loadingConversations={loadingConvos}
          search={search}
          onSearchChange={setSearch}
          showNewChat={showNewChat}
          onToggleNewChat={() => {
            setShowNewChat((value) => !value);
            setNewUserSearch("");
            setUserResults([]);
            setNewChatError("");
          }}
          newUserSearch={newUserSearch}
          onNewUserSearchChange={setNewUserSearch}
          userResults={userResults}
          creatingChatFor={creatingChatFor}
          newChatError={newChatError}
          onStartConversation={startNewChat}
          onSelectConversation={setSelectedConvo}
          getConversationName={getConversationName}
          getConversationInitials={getConversationInitials}
          isPartnerOnline={isPartnerOnline}
          formatTime={formatTime}
        />
        <ChatWindow
          conversation={selectedConvo}
          messages={messages}
          loadingMessages={loadingMessages}
          currentUserId={currentUserId}
          input={input}
          typingUser={selectedConvo ? typingUsers[selectedConvo._id] : undefined}
          messagesEndRef={messagesEndRef}
          onInputChange={handleInputChange}
          onSend={handleSend}
          getConversationName={getConversationName}
          getConversationInitials={getConversationInitials}
          isPartnerOnline={isPartnerOnline}
          formatTime={formatTime}
        />
      </div>
    </div>
  );
}
