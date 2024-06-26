import { Conversation, Message, User, Chat, ChatMessage, Lead } from "@prisma/client";

import { FullLeadNoConvo } from "./lead";

export type FullMessage = Message & {
  sender?: User | null;
};

// CHAT
export type ShortConvo = Conversation & {
  lead:Lead,
  lastMessage:Message | null
};
export type ShortConversation = {
  id: string;
  firstName: string;
  lastName: string;
  disposition: string;
  cellPhone: string;
  message: string;
  updatedAt: Date;
  unread: number;
};

export type FullConversation = Conversation & {
  lead: FullLeadNoConvo;
  messages: FullMessage[];
};

export type LeadAndConversation =   Conversation & {
    lead: Lead;
  };

// CHAT
export type ShortChat = Chat & {
  userOne: User;
  userTwo: User;
  lastMessage:ChatMessage | null
};
export type FullChat = ShortChat & {
  messages: FullChatMessage[];
};
export type FullChatMessage = ChatMessage & {
  sender: User;
};
export type UnreadShortChat = Chat & {
  userOne: User;
  userTwo: User;
  lastMessage:FullChatMessage | null  
};
