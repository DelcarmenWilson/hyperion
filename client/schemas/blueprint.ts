import * as z from "zod";
export const BluePrintSchema = z.object({
  id: z.optional(z.string()),
  callsTarget: z.coerce.number().min(1),
  appointmentsTarget: z.coerce.number().min(1),
  premiumTarget: z.coerce.number().min(1),
});
export type BluePrintSchemaType = z.infer<typeof BluePrintSchema>;

export const BluePrintWeekSchema = z.object({
  id: z.optional(z.string()),
  calls: z.coerce.number().min(1),
  appointments: z.coerce.number().min(1),
  premium: z.coerce.number().min(1),
});
export type BluePrintWeekSchemaType = z.infer<typeof BluePrintWeekSchema>;

export const AgentWorkInfoSchema = z.object({
  workType: z.string().min(1),
  workingDays: z.string().min(1),
  workingHours: z.string().min(1),
  annualTarget: z.coerce.number().min(40000).max(300000),
  targetType: z.string().min(1),
});
export type AgentWorkInfoSchemaType = z.infer<typeof AgentWorkInfoSchema>;
