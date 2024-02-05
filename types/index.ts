import { Conversation, Message, User, Lead, Preset, Call, Appointment } from "@prisma/client";

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

export type FullLead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  conversationId?: string;
  defaultNumber: string;
  autoChat: boolean;
  notes: string;
  calls?:Call[]
  lastCall?:Call
  appointments?:Appointment[]
  lastApp?:Appointment
  createdAt: Date;
  callCount?: number;
};

export type PresetFormValues = {
  type: Preset;
  content: string;
};

export type PhoneType = {
  value: string;
  state: string;
};

export type FullCall=Call& {
  lead: Lead;
};