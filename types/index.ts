
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
  PhoneNumber,
  PipeLine,
  UserCarrier,
} from "@prisma/client";

export type HalfUser = {
  id: string;
  userName: string;
};
export type FullUser = User & {
  calls: Call[];
  leads: Lead[];
  appointments: Appointment[];
  conversations: Conversation[];
  team: Team;
};

export type FullUserReport = User & {
  phoneNumbers: PhoneNumber[];
  calls: Call[];
  leads: Lead[];
  conversations: Conversation[];
  appointments: Appointment[];
  team?: FullTeam | null;
};

export type FullUserTeamReport = {
  id: string;
  image: string | null;
  userName: string;
  role: String;
  calls: number;
  appointments: number;
  conversations: number;
  revenue: number;
};
export type FullPhoneNumber = PhoneNumber & {
  agent: { firstName: string; lastName: string } | null;
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



export type PhoneType = {
  value: string;
  state: string;
};

export type FullCall = Call & {
  lead: Lead;
};

export type FullTeam = Team & {
  users?: User[];
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
  userId: string;
  owner: User | null;
};

export type FullFeedback = Feedback & {
  user: User;
};

export type FullPipeline = PipeLine & {
  status: { status: string };
};
export type FullUserCarrier = UserCarrier & {
  carrier: { name: string };
};
