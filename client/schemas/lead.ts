import * as z from "zod";
import { Gender, MaritalStatus } from "@prisma/client";

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
});
export type LeadSchemaType = z.infer<typeof LeadSchema>;

export const LeadMainSchema = z.object({
  id: z.optional(z.string()),
  firstName: z.string(),
  lastName: z.string(),
  cellPhone: z.string(),
  email: z.optional(z.string()),
  address: z.string(),
  city: z.optional(z.string()),
  state: z.string(),
  zipCode: z.optional(z.string()),
});
export type LeadMainSchemaType = z.infer<typeof LeadMainSchema>;

export const LeadGeneralSchema = z.object({
  id: z.optional(z.string()),
  gender: z.enum([Gender.NA, Gender.Male, Gender.Female]),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  dateOfBirth: z.optional(z.string()),
  weight: z.optional(z.string()),
  height: z.optional(z.string()),
  income: z.optional(z.string()),
  smoker: z.boolean(),
});
export type LeadGeneralSchemaType = z.infer<typeof LeadGeneralSchema>;

export const LeadPolicySchema = z.object({
  leadId: z.string(),
  carrier: z.string(),
  policyNumber: z.string(),
  status: z.string(),
  ap: z.string(),
  commision: z.string(),
  coverageAmount: z.string(),
  startDate: z.optional(z.date()),
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
  id:z.optional(z.string()),
  leadId: z.string(),
  type: z.string(),
  name: z.string(),
  value: z.coerce.number(),
  notes: z.optional(z.string()).nullable(),
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
