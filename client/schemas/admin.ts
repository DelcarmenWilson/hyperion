import * as z from "zod";

export const CarrierSchema = z.object({
  id: z.optional(z.string()),
  image: z.optional(z.string()),
  name: z.string().min(2, "*"),
  description: z.optional(z.string()),
  website: z.optional(z.string()),
  portal: z.optional(z.string()),
});
export type CarrierSchemaType = z.infer<typeof CarrierSchema>;

export const ScriptSchema = z.object({
  id: z.optional(z.string()),
  title: z.string().min(2, "*"),
  script: z.string().min(2, "*"),
});
export type ScriptSchemaType = z.infer<typeof ScriptSchema>;

export const MedicalConditionSchema = z.object({
  name: z.string().min(2, "*"),
  description: z.optional(z.string()),
});
export type MedicalConditionSchemaType = z.infer<typeof MedicalConditionSchema>;

export const QuoteSchema = z.object({
  quote: z.string().min(2, "*"),
  author: z.string(),
});
export type QuoteSchemaType = z.infer<typeof QuoteSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  headLine: z.string().min(2, "*"),
  description: z.string().min(2, "*"),
  status: z.string(),
  comments: z.optional(z.string().default("")),
  published: z.boolean(),
  startAt: z.date(),
  endAt: z.date(),
});
export type TaskSchemaType = z.infer<typeof TaskSchema>;


// HYEPRION LEADS

export const HyperionLeadSchema = z.object({  
  id: z.optional(z.string()),
  formId: z.optional(z.string()),
  adName: z.optional(z.string()),
  campaignName: z.optional(z.string()),
  firstName: z.string(),
  lastName: z.string(),
  address: z.optional(z.string()),
  city: z.optional(z.string()),
  state: z.optional(z.string()),
  cellPhone: z.optional(z.string()),
  gender: z.optional(z.string()),
  maritalStatus: z.optional(z.string()),
  email: z.optional(z.string()),
  dateOfBirth: z.optional(z.string()),
  weight: z.optional(z.string()),
  height: z.optional(z.string()),
  policyAmount: z.optional(z.string()),
  smoker: z.optional(z.string()),
});
export type HyperionLeadSchemaType = z.infer<typeof HyperionLeadSchema>;

//CARRIER CONDITIONS
export const CarrierConditionSchema = z.object({
  id: z.optional(z.string()),
  carrierId: z.string().min(2, "*"),
  conditionId: z.string().min(2, "*"),
  requirements:z.string().min(2, "*"),
  notes:z.optional(z.string()),
  condition:z.optional(z.string()),
});
export type CarrierConditionSchemaType = z.infer<typeof CarrierConditionSchema>;
