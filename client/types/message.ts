import { Conversation, Message, User, Chat, ChatMessage } from "@prisma/client";

import { FullLeadNoConvo } from "./lead";

export type FullMessage = Message & {
  sender?: User | null;
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

// CHAT
export type ShortChat = Chat & {
  userOne: User;
  userTwo: User;
};
export type FullChat = ShortChat & {
  userOne: User;
  userTwo: User;
  messages: FullChatMessage[];
};
export type FullChatMessage = ChatMessage & {
  sender: User;
};
