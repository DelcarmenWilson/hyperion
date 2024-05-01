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
  Gender,
  MaritalStatus,
  LeadBeneficiary,
  LeadExpense,
  LeadMedicalCondition,
  MedicalCondition,
  LeadPolicy,
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
  leads: LeadPolicyType[];
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
export type ShortConversation = {
  id: string;
  firstName: string;
  lastName: string;
  disposition: string;
  cellPhone: string;
  message: string;
  updatedAt: Date;
  unread: number;
};
export type FullConversation = Conversation & {
  lead: FullLeadNoConvo;
  messages: FullMessage[];
};

export type LeadPolicyType = Lead & {
  policy?: LeadPolicy|null;
};
export type LeadConversationType = Conversation & {
  lead: Lead;
  messages: Message[];
};
export type HalfLeadNoConvo = Lead & {
  calls: Call[];
  appointments: Appointment[];
  activities: Activity[];
};

export type FullLeadNoConvo = Lead & {
  calls: Call[];
  appointments: Appointment[];
  activities?: Activity[];
  beneficiaries?:LeadBeneficiary[],
  expenses?:LeadExpense[]
  conditions?:FullLeadMedicalCondition[]
  policy:LeadPolicy|null;
};

export type FullLead = Lead & {
  conversation: Conversation | null;
  calls: Call[];
  appointments: Appointment[];
  activities: Activity[];
  beneficiaries?:LeadBeneficiary[];
  expenses?:LeadExpense[];
  conditions?:FullLeadMedicalCondition[];
  policy:LeadPolicy|null;
};
export type FullLeadMedicalCondition = LeadMedicalCondition & {
  condition:MedicalCondition
};

export type LeadMainInfo = {
  id: string;   
  firstName: string ;
  lastName: string ;
  cellPhone: string ;
  email?: string ;
  address?: string ;
  city?: string ;
  state: string ;
  zipCode?: string ;  
  status:string;
  quote: string ;

};
export type LeadGeneralInfo = {
  id: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  dateOfBirth?: string;
  weight?: string;
  height?: string ;
  income?: string;
  smoker: boolean;
  leadName?:string;
  lastCall?: Date;
  nextAppointment?: Date;
  dob?: Date;
};

export type LeadPolicyInfo = {
  leadId: string;
  carrier:string
  policyNumber:string
  status:string;
  ap: string ;
  commision: string ;
  coverageAmount: string;
  startDate?:Date;
  createdAt:Date;
  updatedAt:Date;
};

export type PhoneType = {
  value: string;
  state: string;
};

export type FullCall = Call & {
  lead: {
    id: string;
    firstName: string;
    lastName: string;
    cellPhone: string;
    email: string | null;
  } | null;
  user?:{
    firstName:string
  }
};

export type FullAppointment = Appointment & {
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

export type Sales = Lead & {
  user: { firstName: string; lastName: string; image: string | null };
  policy?:LeadPolicy| null;
};


