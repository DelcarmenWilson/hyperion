import { Gender, MaritalStatus, MessageRole, Preset, UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
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

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name required",
  }),
});

export const LeadSchema = z.object({
  id:z.optional(z.string()),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  homePhone: z.optional(z.string()),
  cellPhone: z.string(),
  gender: z.enum([Gender.Male, Gender.Female]),
  maritalStatus: z.enum([MaritalStatus.Single,MaritalStatus.Married,MaritalStatus.Widowed,MaritalStatus.Divorced]),
  email: z.string().email(),
  dateOfBirth: z.optional(z.string()),
  conversationId:z.optional(z.string()),
  // age               :     z.optional(z.number()),
  // faceValue         :     z.optional(z.number()),
  // placeOfBirth      :     z.optional(z.string()),
  // stateOfBirth      :     z.optional(z.string()),
  // ssn               :     z.optional(z.string()),
  // driversLicense    :     z.optional(z.string()),
  // driversState      :     z.optional(z.string()),
  // driversExpiration :     z.optional(z.date()),
  // greenCard         :     z.optional(z.string()),
  // citizenship       :     z.optional(z.string()),
  // yearInUsa         :     z.optional(z.number()),
  // parentsLiving     :     z.optional(z.boolean  ()),
  // fatherAge         :     z.optional(z.number()),
  // motherAge         :     z.optional(z.number()),
  // cuaseOfDeath      :     z.optional(z.string()),
});

export const TwilioSchema = z.object({
  phone: z.string(),
  message: z.string(),
});

export const ChatSchema = z.object({
  prompt: z.string(),
  message: z.string(),
});

export const TeamSchema = z.object({ name: z.string().min(1) });

export const MessageSchema = z.object({
  role:  z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
  content: z.string(),
});

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

export const AppointmentSchema = z.object({
  date: z.date(),
  time:z.string(),
  agentId: z.string(),
  leadId: z.string(),
  comments: z.string(),
});
