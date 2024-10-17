import * as z from "zod";
import { Gender, MaritalStatus, Prisma } from "@prisma/client";
import {
  leadGetByIdBasicInfo,
  leadGetByIdCallInfo,
  leadGetByIdGeneral,
  leadGetByIdMain,
  leadGetByIdNotes,
} from "@/actions/lead";
import { leadPolicyGet } from "@/actions/lead/policy";

export const LeadSchema = z.object({
  id: z.optional(z.string()),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  homePhone: z.optional(z.string()),
  cellPhone: z.string().min(10, "required"),
  gender: z.enum([Gender.NA, Gender.Male, Gender.Female]),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  email: z.string().email(),
  dateOfBirth: z.optional(z.string()),
  weight: z.optional(z.string()),
  height: z.optional(z.string()),
  income: z.optional(z.string()),
  policyAmount: z.optional(z.string()),
  smoker: z.optional(z.boolean()),
  currentlyInsured: z.optional(z.boolean()),
  currentInsuranse: z.optional(z.string()),
  type: z.optional(z.string()),
  vendor: z.optional(z.string()),
  conversationId: z.optional(z.string()),
  recievedAt: z.optional(z.string()),
  statusId: z.optional(z.string()),
  assistantId: z.optional(z.string()),
  notes: z.optional(z.string()),
  adId: z.optional(z.string()),
  associatedLead: z.optional(z.string()),
  relationship: z.optional(z.string()),
});
export type LeadSchemaType = z.infer<typeof LeadSchema>;

export const LeadMainSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  cellPhone: z.string(),
  email: z.optional(z.string()),
  address: z.optional(z.string()),
  city: z.optional(z.string()),
  state: z.string(),
  zipCode: z.optional(z.string()),
  statusId: z.string(),
  quote: z.string(),
  textCode: z.optional(z.string()),
});
export type LeadMainSchemaType = z.infer<typeof LeadMainSchema>;
export type LeadMainSchemaTypeP = Prisma.PromiseReturnType<
  typeof leadGetByIdMain
>;

export const LeadGeneralSchema = z.object({
  id: z.string(),
  gender: z.enum([Gender.NA, Gender.Male, Gender.Female]),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  dateOfBirth: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
  weight: z.optional(z.string()),
  height: z.optional(z.string()),
  income: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
  smoker: z.boolean(),
  // leadName: z.optional(z.string()),
  // lastCall: z.optional(z.date()),
  // nextAppointment: z.optional(z.date()),
  // dob: z.optional(z.date()),
});
export type LeadGeneralSchemaType = z.infer<typeof LeadGeneralSchema>;
export type LeadGeneralSchemaTypeP = Prisma.PromiseReturnType<
  typeof leadGetByIdGeneral
>;

export const LeadPolicySchema = z.object({
  leadId: z.string({ required_error: "*" }),
  carrierId: z.string({ required_error: "*" }),
  policyNumber: z.string({ required_error: "*" }),
  status: z.string({ required_error: "*" }),
  ap: z.string({ required_error: "*" }),
  commision: z.string({ required_error: "*" }),

  // ap: z.coerce.number().min(1),
  // commision:z.coerce.number().min(1),
  coverageAmount: z.string({ required_error: "*" }),
  startDate: z.optional(z.date()),
  // createdAt: z.date(),
  // updatedAt: z.date(),
});
export type LeadPolicySchemaType = z.infer<typeof LeadPolicySchema>;

export const LeadBeneficiarySchema = z.object({
  id: z.optional(z.string()),
  leadId: z.string(),
  type: z.string(),
  relationship: z.string(),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.optional(z.string()),
  city: z.optional(z.string()),
  state: z.optional(z.string()),
  zipCode: z.optional(z.string()),
  cellPhone: z.optional(z.string()),
  gender: z.enum([Gender.NA, Gender.Male, Gender.Female]),
  email: z.optional(z.string().email()),
  dateOfBirth: z.optional(z.string()),
  ssn: z.optional(z.string()),
  share: z.optional(z.string()),

  notes: z.optional(z.string()),
});
export type LeadBeneficiarySchemaType = z.infer<typeof LeadBeneficiarySchema>;

export const LeadConditionSchema = z.object({
  id: z.optional(z.string()),
  leadId: z.string(),
  conditionId: z.string(),
  diagnosed: z.string(),
  medications: z.string(),
  notes: z.optional(z.string()),
});
export type LeadConditionSchemaType = z.infer<typeof LeadConditionSchema>;

export const LeadExpenseSchema = z.object({
  id: z.optional(z.string()),
  leadId: z.string(),
  type: z.string(),
  name: z.string(),
  value: z.coerce.number(),
  notes: z.optional(z.string()),
});
export type LeadExpenseSchemaType = z.infer<typeof LeadExpenseSchema>;

export const LeadExportSchema = z.object({
  userId: z.string(),
  type: z.string(),
  from: z.date(),
  to: z.date(),
  state: z.string(),
  vendor: z.string(),
});
export type LeadExportSchemaType = z.infer<typeof LeadExportSchema>;

export const LeadStatusSchema = z.object({
  id: z.optional(z.string()),
  status: z.string().min(2, "*"),
  description: z.optional(z.string()),
});
export type LeadStatusSchemaType = z.infer<typeof LeadStatusSchema>;

//INTAKE FORM SCHEMA

export const IntakePersonalMainSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  homePhone: z.string(),
  cellPhone: z.string(),
  email: z.optional(z.string()),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  address: z.string(),
  city: z.optional(z.string()),
  state: z.string(),
  zipCode: z.optional(z.string()),
  dateOfBirth: z.optional(z.string()),
  placeOfBirth: z.optional(z.string()),
  stateOfBirth: z.optional(z.string()),
  ssn: z.optional(z.string()),
  licenseNumber: z.optional(z.string()),
  licenseState: z.optional(z.string()),
  licenseExpires: z.date(),
  annualIncome: z.coerce.number(),
  experience: z.string(),
  netWorth: z.coerce.number(),
  employer: z.optional(z.string()),
  employerAddress: z.optional(z.string()),
  employerPhone: z.optional(z.string()),
  occupation: z.optional(z.string()),
  greenCardNum: z.string(),
  citizenShip: z.string(),
  yearsInUs: z.coerce.number(),
  parentLiving: z.string(),
  fatherAge: z.coerce.number(),
  motherAge: z.coerce.number(),
  cuaseOfDeath: z.string(),
});
export type IntakePersonalMainSchemaType = z.infer<
  typeof IntakePersonalMainSchema
>;
export const IntakeGeneralSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  homePhone: z.string(),
  cellPhone: z.string(),
  email: z.optional(z.string()),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  address: z.string(),
  city: z.optional(z.string()),
  state: z.string(),
  zipCode: z.optional(z.string()),
  dateOfBirth: z.optional(z.string()),
  placeOfBirth: z.optional(z.string()),
  stateOfBirth: z.optional(z.string()),
});
export type IntakeGeneralSchemaType = z.infer<
  typeof IntakeGeneralSchema
>;
export const IntakePersonalSchema = z.object({
  id: z.string(),
  ssn: z.optional(z.string()),
  licenseNumber: z.optional(z.string()),
  licenseState: z.optional(z.string()),
  licenseExpires: z.date(),
 
});
export type IntakePersonalSchemaType = z.infer<
  typeof IntakePersonalSchema
>;
export const IntakeEmploymentSchema = z.object({
  id: z.string(),  
  annualIncome: z.coerce.number(),
  experience: z.string(),
  netWorth: z.coerce.number(),
  employer: z.optional(z.string()),
  employerAddress: z.optional(z.string()),
  employerPhone: z.optional(z.string()),
  occupation: z.optional(z.string()),
});
export type IntakeEmploymentSchemaType = z.infer<
  typeof IntakeEmploymentSchema
>;
export const IntakeMiscSchema = z.object({
  id: z.string(),
  greenCardNum: z.string(),
  citizenShip: z.string(),
  yearsInUs: z.coerce.number(),
  parentLiving: z.string(),
  fatherAge: z.coerce.number(),
  motherAge: z.coerce.number(),
  cuaseOfDeath: z.string(),
});
export type IntakeMiscSchemaType = z.infer<
  typeof IntakeMiscSchema
>;

export const IntakeDoctorInfoSchema = z.object({
  leadId: z.string(),
  name: z.string(),
  address: z.string(),
  lastVisit: z.date(),
  phone: z.string(),
  reasonForVisit: z.string(),
});

export type IntakeDoctorInfoSchemaType = z.infer<typeof IntakeDoctorInfoSchema>;

export const IntakeBankInfoSchema = z.object({
  leadId: z.string(),
  name: z.string(),
  routing: z.string(),
  account: z.string(),
  draftDate: z.date(),
  signature: z.string(),
  signedDate: z.date(),
});

export type IntakeBankInfoSchemaType = z.infer<typeof IntakeBankInfoSchema>;

export const IntakeOtherInfoSchema = z.object({
  id: z.string(),
  weight: z.optional(z.string()),
  weightLastYear: z.optional(z.string()),
  height: z.optional(z.string()),
  smoker: z.boolean(),
  yearsSmoking: z.number(),
  foreignVisited: z.optional(z.string()),
});

export type IntakeOtherInfoSchemaType = z.infer<typeof IntakeOtherInfoSchema>;

export const IntakeMedicalInfoSchema = z.object({
  leadId: z.string(),
  healthIssues: z.boolean(),
  prescription: z.boolean(),
  heartAttacks: z.boolean(),
  bloodThinners: z.boolean(),
  cancer: z.boolean(),
  diabetes: z.boolean(),
  gabapentin: z.boolean(),
  complications: z.boolean(),
  dateDisgnosed: z.date(),
  a1cReading: z.date(),
  aids: z.boolean(),
  highBloodPressure: z.boolean(),
  asthma: z.boolean(),
  copd: z.boolean(),
  anxiety: z.boolean(),
  bipolar: z.boolean(),
  hospitalizations: z.boolean(),
});

export type IntakeMedicalInfoSchemaType = z.infer<
  typeof IntakeMedicalInfoSchema
>;
export type LeadBasicInfoSchemaTypeP = Prisma.PromiseReturnType<
  typeof leadGetByIdBasicInfo
>;

export type LeadNotesSchemaTypeP = Prisma.PromiseReturnType<
  typeof leadGetByIdNotes
>;

export type LeadPolicySchemaTypeP = Prisma.PromiseReturnType<
  typeof leadPolicyGet
>;

export type LeadCallInfoSchemaTypeP = Prisma.PromiseReturnType<
  typeof leadGetByIdCallInfo
>;
