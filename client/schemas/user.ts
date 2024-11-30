import * as z from "zod";

export const UserAboutMeSchema = z.object({
  id: z.string(),
  aboutMe: z.optional(z.string()),
  title: z.optional(z.string()),
});
export type UserAboutMeSchemaType = z.infer<typeof UserAboutMeSchema>;

export const UserPhoneNumberSchema = z.object({
  id: z.optional(z.string()),
  phone: z.string().min(10, "10 digits requires ex. 7189892356"),
  state: z.string().min(1, "Please select a State"),
});
export type UserPhoneNumberSchemaType = z.infer<typeof UserPhoneNumberSchema>;

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

export const TodoSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  categoryId:z.string().optional(),
  title: z.string(),
  description: z.string(),
  comments: z.string(),
  reminder:z.boolean(),
  reminderMethod:z.string(),
  nextReminder:z.date().optional(),
  startAt:z.date().optional(),
  endAt:z.date().optional(),
});
export type TodoSchemaType = z.infer<typeof TodoSchema>;
