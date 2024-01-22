import { Conversation, Message, User, Lead, Preset } from "@prisma/client";

export type FullMessageType = Message & {
  hasSeen: User[];
  sender?: User;
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
  lead: Lead;
};

export type LeadConversationType = Conversation & {
  lead: Lead;
  messages: Message[];
};


export type PresetFormValues = {
  type: Preset;
  content: string;
};