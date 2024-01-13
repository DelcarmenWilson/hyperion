import { UserRole } from "@prisma/client";
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
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.optional(z.string()),
  city: z.optional(z.string()),
  state: z.string(),
  zipCode: z.string(),
  county: z.optional(z.string()),
  homePhone: z.optional(z.string()),
  cellPhone: z.string(),
  gender: z.optional(z.string()),
  maritalStatus: z.optional(z.string()),
  email: z.string().email(),
  dateOfBirth: z.optional(z.date()),
  createdBy: z.optional(z.string()),
  updatedBy: z.optional(z.string()),
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

export const MessageSchema = z.object({
  toCountry: z.string(),
  toState: z.string(),
  smsMessageSid: z.string(),
  numMedia: z.string(),
  toCity: z.string(),
  fromZip: z.string(),
  smsSid: z.string(),
  fromState: z.string(),
  smsStatus: z.string(),
  fromCity: z.string(),
  body: z.string(),
  fromCountry: z.string(),
  to: z.string(),
  messagingServiceSid: z.string(),
  toZip: z.string(),
  numSegments: z.string(),
  messageSid: z.string(),
  accountSid: z.string(),
  from: z.string(),
  apiVersion: z.string(),
});
