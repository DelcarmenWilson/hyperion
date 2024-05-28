import * as z from "zod";
import {
  Preset,
  UserRole,
} from "@prisma/client";

export const SettingsSchema = z
  .object({
    userName: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([
      UserRole.MASTER,
      UserRole.ADMIN,
      UserRole.USER,
      UserRole.ASSISTANT,
      UserRole.STUDENT,
    ]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    { message: "New password is requiered", path: ["new Password"] }
  );
export type SettingsSchemaType = z.infer<typeof SettingsSchema>;

export const NotificationSettingsSchema = z.object({
  userId: z.string(),
  phoneNumber: z.string(),
  calls: z.boolean(),
  appointments: z.boolean(),
  messages: z.boolean(),
  voicemails: z.boolean(),
});
export type NotificationSettingsSchemaType = z.infer<
  typeof NotificationSettingsSchema
>;



export const ScheduleSchema = z.object({
  // type: z.enum(["half", "hourly"], {
  //   required_error: "You need to select a notification type.",
  // }),
  userId: z.string(),
  type: z.string(),
  title: z.string(),
  subTitle: z.string(),
  sunday: z.string(),
  monday: z.string(),
  tuesday: z.string(),
  wednesday: z.string(),
  thursday: z.string(),
  friday: z.string(),
  saturday: z.string(),
});
export type ScheduleSchemaType = z.infer<
  typeof ScheduleSchema
>;

export const PresetSchema = z.object({
  type: z.enum([
    Preset.Birthday,
    Preset.FollowUp,
    Preset.Reminder,
    Preset.Text,
    Preset.Away,
  ]),
  content: z.string(),
});
export type PresetSchemaType = z.infer<
  typeof PresetSchema
>;