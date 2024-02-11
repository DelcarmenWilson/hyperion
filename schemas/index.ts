import {
  Gender,
  MaritalStatus,
  MessageRole,
  Preset,
  UserRole,
} from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.MASTER,UserRole.ADMIN, UserRole.USER]),
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

export const MasterRegisterSchema = z.object({
  organization: z.string().min(1),
  team: z.string().min(1),
  username: z.string().min(1, {
    message: "Username required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

export const RegisterSchema = z.object({
  team: z.string().min(5,{message:"*"}),
  npn: z.string().min(4,{message:"*"}),
  username: z.string().min(1, {
    message: "Username required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

export const ScheduleSchema = z.object({
  // type: z.enum(["half", "hourly"], {
  //   required_error: "You need to select a notification type.",
  // }),
  userId:z.string(),
  type: z.string(),
  title: z.string(),
  subTitle: z.string(),
  sunday:z.string(),
  monday:z.string(),
  tuesday:z.string(),
  wednesday:z.string(),
  thursday:z.string(),
  friday:z.string(),
  saturday:z.string()
});

export const LeadSchema = z.object({
  id: z.optional(z.string()),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  homePhone: z.optional(z.string()),
  cellPhone: z.string().min(10,"required"),
  gender: z.enum([Gender.Male, Gender.Female]),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  email: z.string().email(),
  dateOfBirth: z.optional(z.string()),
  weight:z.optional(z.number()),
  height:z.optional(z.string()),
  income:z.optional(z.number()),
  policyAmount:z.optional(z.number()),
  smoker:z.optional(z.boolean()),
  currentlyInsured:z.optional(z.boolean()),
  currentInsuranse:z.optional(z.string()),
  vendor:z.optional(z.string()),
  conversationId: z.optional(z.string()),
  recievedAt:z.optional(z.string())
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
  role: z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
  content: z.string(),
  conversationId:z.string(),
  senderId:z.string(),
  hasSeen:z.boolean(),
  sid:z.optional(z.string()),
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
  agentId: z.string(),
  leadId: z.string(),
  comments: z.string(),
});

export const AppointmentLeadSchema = z.object({
  id: z.string(),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  state: z.string(),
  cellPhone: z.string(),
  gender: z.enum([Gender.Male, Gender.Female]),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  email: z.string().email(),
});
