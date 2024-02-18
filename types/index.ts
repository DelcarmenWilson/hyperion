import * as z from "zod";
import { LeadSchema } from "@/schemas";
import {
  Conversation,
  Message,
  User,
  Lead,
  Preset,
  Call,
  Appointment,
  Team,
  Organization,
  Feedback,
  Activity,
} from "@prisma/client";
export type FullUser = User & {
  calls: Call[];
  appointments: Appointment[];
  conversations: Conversation[];
  leads: Lead[];
};

export type FullUserReport = {
  id: string;
  image: string | null;
  userName: string;
  role: String;
  calls: number;
  appointments: number;
  conversations: number;
  revenue: number;
};
export type FullMessage = Message & {
  sender?: User | null;
};

export type FullConversation = Conversation & {
  lead: FullLeadNoConvo;
  messages: FullMessage[];
};

export type LeadConversationType = Conversation & {
  lead: Lead;
  messages: Message[];
};


export type FullLeadNoConvo = Lead & {
  calls: Call[];
  appointments: Appointment[];
  activities: Activity[];
};

export type FullLead = Lead & {
  conversation: Conversation | null;
  calls: Call[];
  appointments: Appointment[];
  activities: Activity[];
};

export type ImportLeadsFormValues = z.infer<typeof LeadSchema>;

export type PresetFormValues = {
  type: Preset;
  content: string;
};

export type PhoneType = {
  value: string;
  state: string;
};

export type FullCall = Call & {
  lead: Lead;
};

export type FullTeam = Team & {
  users: User[];
  organization: Organization;
  owner: User | null;
};

export type FullTeamReport = {
  id: string;
  name: string;
  image: string | null;
  banner: string | null;
  calls: number;
  appointments: number;
  conversations: number;
  revenue: number;
  organization: Organization;
  owner: User | null;
};

export type FullFeedback = Feedback & {
  user: User;
};

export type Voicemail = {
  id: string;
  lead?: Lead;
  from: string;
  recordUrl: string;
  updatedAt: string;
};
