import * as z from "zod";
export const BluePrintSchema = z.object({
  id: z.optional(z.string()),

  plannedTarget: z.coerce.number(),

  type: z.string().min(1),
  period: z.string().min(1),
});
export type BluePrintSchemaType = z.infer<typeof BluePrintSchema>;

export const FullTimeInfoSchema = z.object({
  workType: z.string().min(1),
  workingDays: z.string().min(1),
  workingHours: z.string().min(1),
  annualTarget: z.coerce.number().min(40000).max(300000),
});
export type FullTimeInfoSchemaType = z.infer<typeof FullTimeInfoSchema>;
