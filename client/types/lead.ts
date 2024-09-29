import {
  User,
  Call,
  Appointment,
  Lead,
  LeadActivity,
  LeadConversation,
  LeadBeneficiary,
  LeadExpense,
  LeadMedicalCondition,
  LeadMessage,
  MedicalCondition,
  LeadPolicy,
} from "@prisma/client";

export type HalfLeadNoConvo = Lead & {
  calls: Call[];
  appointments: Appointment[];
  activities: LeadActivity[];
};

export type FullLeadNoConvo = Lead & {
  calls: Call[];
  appointments: Appointment[];
  activities?: LeadActivity[];
  beneficiaries?: LeadBeneficiary[];
  expenses?: LeadExpense[];
  conditions?: FullLeadMedicalCondition[];
  policy: LeadPolicy | null;
  assistant?: User | null;
  sharedUser?: User | null;
};

export type LeadConversationType = LeadConversation & {
  lead: Lead;
  messages: LeadMessage[];
};

export type FullLead = Lead & {
  conversations: LeadConversation[] | null;
  conversation?: LeadConversation | null;
  calls: Call[];
  appointments: Appointment[];
  activities: LeadActivity[];
  beneficiaries?: LeadBeneficiary[];
  expenses?: LeadExpense[];
  conditions?: FullLeadMedicalCondition[];
  policy: LeadPolicy | null;
  assistant?: User | null;
  sharedUser?: User | null;
  zone?: string;
  time?: string;
};
export type FullLeadMedicalCondition = LeadMedicalCondition & {
  condition: MedicalCondition;
};

export type PipelineLead = {
  id: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  state: string;
  status: string;
  maritalStatus: string;
  dateOfBirth: string | null;
  defaultNumber: string;
  address?: string | null;
  smoker: boolean;
  recievedAt: Date;
  zone?: string;
  time?: string;
};

export type LeadMainInfo = {
  id: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  email?: string;
  address?: string;
  city?: string;
  state: string;
  zipCode?: string;
  status: string;
  quote: string;
};

export type LeadPolicyType = Lead & {
  policy?: LeadPolicy | null;
};

export type LeadPrevNext = {
  prev: { id: string; name: string; state: string; age: string } | null;
  next: { id: string; name: string; state: string; age: string } | null;
};
export type ExpenseType = "Income" | "Expense";
