import {
  User,
  Lead,
  Team,
  Organization,
  Feedback,
  Pipeline,
  MedicalCondition,
  LeadPolicy,
  Carrier,
  CarrierCondition,
  Appointment,
  LeadCommunication,
} from "@prisma/client";

import { FullAppointment, CalendarEvent, CalendarLabel } from "./appointment";

import {
  AssociatedLead,
  HalfLeadNoConvo,
  FullLeadNoConvo,
  LeadConversationType,
  FullLead,
  FullLeadMedicalCondition,
  FullLeadPolicy,
  LeadMainInfo,
  LeadPolicyType,
  LeadPrevNext,
  PipelineLead,
  ExpenseType,
} from "./lead";

import {
  FullMessage,
  ShortConvo,
  ShortConversation,
  FullConversation,
  LeadAndConversation,
  ShortChat,
  FullChat,
  FullChatMessage,
  FullMiniMessage,
  UnreadShortChat,
  FullConversationWithLead,
} from "./message";
import { FullPhoneNumber, PhoneType } from "./phone";

import {
  HalfUser,
  ShortUser,
  SummaryUser,
  FullUser,
  FullUserReport,
  FullUserTeamReport,
  FullUserCarrier,
} from "./user";

import {
  TwilioNumber,
  TwilioCall,
  TwilioCallResult,
  TwilioSms,
  TwilioConference,
  TwilioShortConference,
  TwilioShortParticipant,
  TwilioParticipant,
  TwilioRecording,
  TwilioConferenceRecording,
} from "./twilio";
import { ItemProps, MonthProps, FileRecords, FileRecord } from "./item";
import {
  FullChatbotConversation,
  ShortChatbotConversation,
} from "./chat-bot/chatbot";
import {
  ShortPublicChatbotConversation,
  FullPublicChatbotConversation,
} from "./chat-bot/public-chatbot";

import { FullCampaign, FullAd } from "./facebook";
export type ShortCall = LeadCommunication & {
  lead: {
    id: string;
    firstName: string;
    lastName: string;
    cellPhone: string;
    email: string | null;
  } | null;
};
export type FullCall = LeadCommunication & {
  lead: {
    id: string;
    firstName: string;
    lastName: string;
    cellPhone: string;
    email: string | null;
  } | null;
  user?: {
    firstName: string;
  }|null;
  appointment?:Appointment|null
};

export type FullTeam = Team & {
  users?: User[];
  organization: Organization;
  owner?: User | null;
};

export type FullTeamReport = {
  id: string;
  name: string;
  logo: string | null;
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

export type FullPipeline = Pipeline & {
  status: { status: string };
};

export type PipelineAndLeads = {
  pipelines: FullPipeline[];
  leads: PipelineLead[];
};

export type Sales = Lead & {
  user: { firstName: string; lastName: string; image: string | null };
  policy?: LeadPolicy | null;
};

export type FullOrganization = Organization & {
  teams?: Team[];
};

//DAILER SETTINGS
export type DialerSettingsType = {
  matrix: number;
  pause: number;
};

//WEB SOCKETS
export type UserSocket = {
  id: string;
  sid: string;
  role: string;
  firstName: string;
  orgId:string
};
//TERM CARRIER
export type FullCarrierCondition = CarrierCondition & {
  carrier: Carrier;
  condition: MedicalCondition;
};

//APPOINTMENTS
export type { FullAppointment, CalendarEvent, CalendarLabel };

//LEAD
export type {
  AssociatedLead,
  HalfLeadNoConvo,
  FullLeadNoConvo,
  LeadConversationType,
  FullLead,
  FullLeadMedicalCondition,
  FullLeadPolicy,
  LeadMainInfo,
  LeadPolicyType,
  LeadPrevNext,
  PipelineLead,
  ExpenseType,
};

//MESSAGE
export type {
  FullMessage,
  ShortConvo,
  ShortConversation,
  FullConversation,
  FullConversationWithLead,
  LeadAndConversation,
  ShortChat,
  FullChat,
  FullChatMessage,FullMiniMessage,
  UnreadShortChat,
};
//PHONE
export type { FullPhoneNumber, PhoneType };

//USER
export type {
  HalfUser,
  ShortUser,
  SummaryUser,
  FullUser,
  FullUserReport,
  FullUserTeamReport,
  FullUserCarrier,
};

//TWILIO
export type {
  TwilioNumber,
  TwilioCall,
  TwilioCallResult,
  TwilioSms,
  TwilioConference,
  TwilioShortConference,
  TwilioShortParticipant,
  TwilioParticipant,
  TwilioRecording,
  TwilioConferenceRecording,
};

export type { ItemProps, FileRecords, FileRecord, MonthProps };

//CHATBOT
export type { ShortChatbotConversation, FullChatbotConversation };

//PUBLIC CHATBOT
export type { ShortPublicChatbotConversation, FullPublicChatbotConversation };

//FACEBOOK CAMPAIGN
export type { FullCampaign, FullAd };
