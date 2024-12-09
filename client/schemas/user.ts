import * as z from "zod";

export const UserAboutMeSchema = z.object({
  id: z.string(),
  aboutMe: z.optional(z.string()),
  title: z.optional(z.string()),
});
export type UserAboutMeSchemaType = z.infer<typeof UserAboutMeSchema>;

export const CreatePhoneNumberSchema = z.object({
  id: z.optional(z.string()),
  phone: z.string().min(10, "10 digits requires ex. 7189892356"),
  state: z.string().min(1, "Please select a State"),
  agentId: z.string(),
  sid: z.string(),
  app: z.string(),
});
export type CreatePhoneNumberSchemaType = z.infer<
  typeof CreatePhoneNumberSchema
>;

export const UserLicenseSchema = z.object({
  id: z.optional(z.string()),
  image: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
  state: z.string().min(2, "*"),
  type: z.string().min(2, "*"),
  licenseNumber: z.string().min(3, "*"),
  dateExpires: z.date(),
  // comments: z.string().nullish(),
  comments: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
});
export type UserLicenseSchemaType = z.infer<typeof UserLicenseSchema>;

export const UserCarrierSchema = z.object({
  id: z.optional(z.string()),
  agentId: z.string().min(2, "*"),
  carrierId: z.string().min(2, "*"),
  rate: z.coerce.number(),
  comments: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
});
export type UserCarrierSchemaType = z.infer<typeof UserCarrierSchema>;

export const UserTemplateSchema = z.object({
  id: z.optional(z.string()),
  name: z.string(),
  description: z.optional(z.string()),
  attachment: z.optional(z.string()),
  message: z.optional(z.string()),
});
export type UserTemplateSchemaType = z.infer<typeof UserTemplateSchema>;

export const TodoSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string().optional(),
    categoryId: z.string(),
    title: z.string(),
    description: z.string(),
    comments: z.string(),
    reminder: z.boolean(),
    reminderMethod: z.string(),
    nextReminder: z.date().optional(),
    startAt: z
      .date()
      .optional()
      .refine((value) => {
        if (!value) return true;
        if (value < new Date()) return false;
      },{message:"Invalid date",path:["startAt"]}),
    // endAt:z.date().optional(),
    endAt: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (!data.endAt || !data.startAt) return false;
      if (data.endAt < data.startAt) return true;
    },
    {
      message: "End date cannot be earlier than start date.",
      path: ["endAt"],
    }
  );
export type TodoSchemaType = z.infer<typeof TodoSchema>;
