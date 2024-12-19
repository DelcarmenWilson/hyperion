import * as z from "zod";
export const CreateBluePrintSchema = z.object({
  id: z.optional(z.string()),
  callsTarget: z.coerce.number().min(1),
  appointmentsTarget: z.coerce.number().min(1),
  premiumTarget: z.coerce.number().min(1),
});
export type CreateBluePrintSchemaType = z.infer<typeof CreateBluePrintSchema>;

export const UpdateBluePrintWeekSchema = z.object({
  id: z.optional(z.string()),
  calls: z.coerce.number().min(1),
  appointments: z.coerce.number().min(1),
  premium: z.coerce.number().min(1),
});
export type UpdateBluePrintWeekSchemaType = z.infer<typeof UpdateBluePrintWeekSchema>;

export const CreateAgentWorkInfoSchema = z.object({
  workType: z.string().min(1),
  workingDays: z.string().min(1),
  workingHours: z.string().min(1),
  annualTarget: z.coerce.number(),
  targetType: z.string().min(1),
})

export type CreateAgentWorkInfoSchemaType = z.infer<typeof CreateAgentWorkInfoSchema>;

export const UpdateAgentWorkInfoSchema = z.object({
  userId:z.string(),
  workType: z.string().min(1),
  workingDays: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one day.",
  }),
  workingHours: z.string().min(1),
  annualTarget: z.coerce.number(),
  targetType: z.string().min(1),
})

export type UpdateAgentWorkInfoSchemaType = z.infer<typeof UpdateAgentWorkInfoSchema>;
