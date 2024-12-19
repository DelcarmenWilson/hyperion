import {
  User,
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
  Carrier,
  LeadCommunication,
} from "@prisma/client";

export type AssociatedLead = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  relationship: string;
};

export type HalfLeadNoConvo = Lead & {
  calls: LeadCommunication[];
  appointments: Appointment[];
  activities: LeadActivity[];
};

export type FullLeadNoConvo = Lead & {
  calls: LeadCommunication[];
  appointments: Appointment[];
  activities?: LeadActivity[];
  beneficiaries?: LeadBeneficiary[];
  expenses?: LeadExpense[];
  conditions?: FullLeadMedicalCondition[];
  policy?: FullLeadPolicy | null;
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
  calls: LeadCommunication[];
  appointments: Appointment[];
  activities: LeadActivity[];
  beneficiaries?: LeadBeneficiary[];
  expenses?: LeadExpense[];
  conditions?: FullLeadMedicalCondition[];
  policy?: FullLeadPolicy | null;
  assistant?: User | null;
  sharedUser?: User | null;
  zone?: string;
  time?: string;
};

export type FullLeadPolicy = {
  leadId?: string;
  coverageAmount?: string;
  policyNumber?: string;
  status?: string;
  ap?: string;
  commision?: string;
  carrierId?: string;
  carrier?: Carrier | null;
  startDate?: Date | null;
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
  statusId: string;
  maritalStatus: string;
  dateOfBirth: Date | null;
  defaultNumber: string;
  address?: string | null;
  smoker: boolean;
  recievedAt: Date;
  zone?: string;
  time?: string;
  type: string;
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

export enum LeadType {
  General = "General",
  Final_Expense = "Final Expense",
  Mortgage_Protection = "Mortgage Protection",
  Iul = "Iul",
  Annuity = "Annuity",
}

export enum LeadVendor {
  Manually_Created = "Manually Created",
  Amm_Leads = "Amm Leads",
  Avalanche_Leads = "Avalanche Leads",
  Hyperion = "Hyperion",
  Integrity_Leads = "Integrity Leads",
  Leadrilla = "Leadrilla",
  Media_Alpha = "Media Alpha (Nector)",
  Mutual_Of_Omaha = "Mutual Of Omaha",
  Prime_Time_Leads = "Prime Time Leads",
  Prospect_For_Leads = "Prospect For Leads",
}

export enum LeadDefaultStatus {
  NEW = "clssh61710000hgo3esopwumj",
  DELETED = "cm2s8rui802jouo6fit19ljlj",
  DONOTCALL = "clsshj6p80007hgo3avc5s7oe",
  SOLD = "clsshj95h0008hgo3d6tbby9y",
}

export enum LeadActivityType {
  BENEFICIARY = "Beneficiary",
  CONDITION = "Condition",
  CALLERID = "Caller Id",
  GENERAL = "General",
  MAIN = "Main",
  NOTES = "Notes",
  QUOTE = "Quote",
  POLICY = "Policy",  
  TYPE = "Type",
  STATUS = "status",

}
