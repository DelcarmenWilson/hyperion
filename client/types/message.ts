import {
  Chat,
  ChatMessage,
  ChatMessageReaction,
  Lead,
  LeadConversation,
  LeadMessage,
  User,
} from "@prisma/client";

import { FullLeadNoConvo } from "./lead";

export type FullMessage = LeadMessage & {
  sender?: User | null;
};

// CONVERSATIONS
export type ShortConvo = LeadConversation & {
  lead: Lead;
  lastMessage: LeadMessage | null;
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

export type FullConversation = LeadConversation & {
  lead: FullLeadNoConvo;
  messages: FullMessage[];
};

export type FullConversationWithLead = LeadConversation & {
  lead: Lead;
  lastMessage: LeadMessage | null;
  messages: FullMessage[];
};

export type LeadAndConversation = LeadConversation & {
  lead: Lead;
};

// CHAT
export type ShortChat = Chat & {
  userOne: User;
  userTwo: User;
  lastMessage: ChatMessage | null;
};
export type FullChat = ShortChat & {
  messages: FullChatMessage[];
};
export type FullChatMessage = ChatMessage & {
  sender: User;
  reactions:ChatMessageReaction[]
};
export type UnreadShortChat = Chat & {
  userOne: User;
  userTwo: User;
  lastMessage: FullChatMessage | null;
};
