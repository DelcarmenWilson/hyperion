

import * as z from "zod";
  export const MasterRegisterSchema = z.object({
    organization: z.string().min(1),
    team: z.string().min(1),
    userName: z.string().min(1, {
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
  export type MasterRegisterSchemaType = z.infer<typeof MasterRegisterSchema>;
  
  export const RegisterSchema = z.object({
    id: z.string().optional(),
    team: z.string().min(5, { message: "*" }),
    npn: z.string().min(4, { message: "*" }),
    userName: z.string().min(1, {
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
  export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

  export const LoginSchema = z.object({
    email: z.string().email({
      message: "* Email is required",
    }),
    password: z.string().min(1, {
      message: "* Password is required",
    }),
    code: z.optional(z.string()),
  });
  export type LoginSchemaType = z.infer<typeof LoginSchema>;

  export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
  });  
  export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;

  export const ResetSchema = z.object({
    email: z.string().email({
      message: "* Email is required",
    }),
  });
  export type ResetSchemaType = z.infer<typeof ResetSchema>;

  export const TeamSchema = z.object({ name: z.string().min(1) });
  export type TeamSchemaType = z.infer<typeof TeamSchema>;