import {
  Chat,
  ChatMessage,
  ChatMessageReaction,
  Lead,
  LeadCommunication,
  LeadConversation,
  User,
} from "@prisma/client";

import { FullLeadNoConvo } from "./lead";

export type FullMessage = LeadCommunication & {
  sender?: User | null;
};

// CONVERSATIONS
export type ShortConvo = LeadConversation & {
  lead: Lead;
  lastCommunication: LeadCommunication | null;
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
  communications: FullMessage[];
};

export type FullConversationWithLead = LeadConversation & {
  lead: Lead;
  lastcommunication: LeadCommunication | null;
  communications: FullMessage[];
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
export type FullMiniMessage = ChatMessage & {
  sender: User;
  chat:{userOneId:string,userTwoId:string}
};
export type UnreadShortChat = Chat & {
  userOne: User;
  userTwo: User;
  lastMessage: FullChatMessage | null;
};
export enum MessageType{
  AGENT="AGENT",
  LEAD="LEAD",
  TITAN="TITAN",
  AI="AI",
  APPOINTMENT="APPOINTMENT"
}