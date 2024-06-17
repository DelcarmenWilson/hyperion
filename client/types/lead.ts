import {
    Conversation,
    User,
    Lead,
    Call,
    Appointment,
    Activity,
    Gender,
    MaritalStatus,
    LeadBeneficiary,
    LeadExpense,
    LeadMedicalCondition,
    MedicalCondition,
    LeadPolicy,
    Message,
  } from "@prisma/client";



  export type HalfLeadNoConvo = Lead & {
    calls: Call[];
    appointments: Appointment[];
    activities: Activity[];
  };
  
  export type FullLeadNoConvo = Lead & {
    calls: Call[];
    appointments: Appointment[];
    activities?: Activity[];
    beneficiaries?: LeadBeneficiary[];
    expenses?: LeadExpense[];
    conditions?: FullLeadMedicalCondition[];
    policy: LeadPolicy | null;
    assistant?: User | null;
    sharedUser?: User | null;
  };
  
  export type LeadConversationType = Conversation & {
    lead: Lead;
    messages: Message[];
  };
  
  export type FullLead = Lead & {
    conversation: Conversation | null;
    calls: Call[];
    appointments: Appointment[];
    activities: Activity[];
    beneficiaries?: LeadBeneficiary[];
    expenses?: LeadExpense[];
    conditions?: FullLeadMedicalCondition[];
    policy: LeadPolicy | null;
    assistant?: User | null;
    sharedUser?: User | null;
    zone?:string;
    time?:string
  };
  export type FullLeadMedicalCondition = LeadMedicalCondition & {
    condition: MedicalCondition;
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
  export type LeadGeneralInfo = {
    id: string;
    gender: Gender;
    maritalStatus: MaritalStatus;
    dateOfBirth?: string;
    weight?: string;
    height?: string;
    income?: string;
    smoker: boolean;
    leadName?: string;
    lastCall?: Date;
    nextAppointment?: Date;
    dob?: Date;
  };

  export type LeadPolicyType = Lead & {
    policy?: LeadPolicy | null;
  };
  
  export type ExpenseType = "Income" | "Expense";