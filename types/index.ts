import { Conversation, Message, User, Lead, Preset } from "@prisma/client";

export type FullMessageType = Message & {
  sender?: User|null
};

export type FullConversationType = Conversation & {
  lead: Lead;
  messages: FullMessageType[];
};

export type LeadConversationType = Conversation & {
  lead: Lead;
  messages: Message[];
};

export type PresetFormValues = {
  type: Preset;
  content: string;
};

export type PhoneType = {
  value: string;
  state: string;
};
