import {
  User,
  Lead,
  Call,
  Team,
  Organization,
  Feedback,
  PipeLine,
  MedicalCondition,
  LeadPolicy,
  Carrier,
  CarrierCondition,
} from "@prisma/client";

import { FullAppointment, CalendarEvent, CalendarLabel } from "./appointment";

import {
  HalfLeadNoConvo,
  FullLeadNoConvo,
  LeadConversationType,
  FullLead,
  FullLeadMedicalCondition,
  LeadMainInfo,
  LeadPolicyType,
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
import { ItemProps,MonthProps, FileRecords, FileRecord } from "./item";
import { FullChatbotConversation, ShortChatbotConversation } from "./chatbot";
import { FullCampaign,FullAd } from "./facebook";


export type FullCall = Call & {
  lead: {
    id: string;
    firstName: string;
    lastName: string;
    cellPhone: string;
    email: string | null;
  } | null;
  user?: {
    firstName: string;
  };
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

export type Sales = Lead & {
  user: { firstName: string; lastName: string; image: string | null };
  policy?: LeadPolicy | null;
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
  HalfLeadNoConvo,
  FullLeadNoConvo,
  LeadConversationType,
  FullLead,
  FullLeadMedicalCondition,
  LeadMainInfo,
  LeadPolicyType,
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
  FullChatMessage,
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

export type { ItemProps, FileRecords, FileRecord,MonthProps };

//CHATBOT
export type {ShortChatbotConversation,FullChatbotConversation}

//FACEBOOK CAMPAIGN
export type {FullCampaign,FullAd}