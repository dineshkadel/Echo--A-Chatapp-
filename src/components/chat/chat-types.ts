export interface Participant {
  _id: string;
  fullname: string;
  username: string;
  avatar?: string;
  IsOnline?: boolean;
  lastseen?: string;
}

export interface ConversationItem {
  _id: string;
  isGroup: boolean;
  groupName?: string;
  participants: Participant[];
  admin?: Participant;
  lastMessage?: {
    content: string;
    sender: { username: string };
    createdAt: string;
  };
  updatedAt: string;
}

export interface MessageItem {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    fullname: string;
    username: string;
    avatar?: string;
  };
  content: string;
  seenBy: string[];
  status: "sent" | "delivered" | "seen";
  createdAt: string;
}
