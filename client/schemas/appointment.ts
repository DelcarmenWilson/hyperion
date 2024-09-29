import * as z from "zod";
import { Gender, MaritalStatus } from "@prisma/client";

export const AppointmentSchema = z.object({
  date:z.date(),
  localDate:z.optional(z.date()),
  startDate: z.optional(z.date()),
  agentId: z.string(),
  leadId: z.string(),
  labelId: z.string(),
  comments: z.string(),
  smsReminder:z.boolean(),
  emailReminder:z.boolean()

});
export type AppointmentSchemaType = z.infer<typeof AppointmentSchema>;

export const AppointmentRescheduleSchema = z.object({
  id: z.optional(z.string()),
  date:z.date(),
  localDate:z.optional(z.date()),
  startDate: z.optional(z.date()),  
});
export type AppointmentRescheduleSchemaType = z.infer<typeof AppointmentRescheduleSchema>;

export const AppointmentLeadSchema = z.object({
  id: z.optional(z.string()),
  date:z.date(),
  localDate:z.optional(z.date()),
  startDate: z.optional(z.date()),
  agentId: z.string(),
  //LEAD INFO
  leadId: z.optional(z.string()),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  state: z.string(),
  cellPhone: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum([Gender.NA, Gender.Male, Gender.Female]),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  email: z.string().email(),
});
export type AppointmentLeadSchemaType = z.infer<typeof AppointmentLeadSchema>;

export const AppointmentLabelSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "name name must be at least 3 characters"),
  color: z.string(),
  description: z.optional(z.string()),
  checked: z.boolean(),
});
export type AppointmentLabelSchemaType = z.infer<typeof AppointmentLabelSchema>;
