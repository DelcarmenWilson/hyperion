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
    userName: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.MASTER, UserRole.ADMIN, UserRole.USER,UserRole.ASSISTANT,UserRole.STUDENT]),
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
  export const NotificationSettingsSchema = z
  .object({
    userId:z.string(),
  phoneNumber:z.string(),
  calls:z.boolean(),
  appointments:z.boolean(),
  messages:z.boolean(),
  voicemails:z.boolean(),
  })

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

export const RegisterSchema = z.object({
  id:z.string().optional(),
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

export const LeadSchema = z.object({
  id: z.optional(z.string()),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  homePhone: z.optional(z.string()),
  cellPhone: z.string().min(10, "required"),
  gender: z.enum([Gender.NA,Gender.Male, Gender.Female]),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  email: z.string().email(),
  dateOfBirth: z.optional(z.string()),
  weight: z.optional(z.string()),
  height: z.optional(z.string()),
  income: z.optional(z.string()),
  policyAmount: z.optional(z.string()),
  smoker: z.optional(z.boolean()),
  currentlyInsured: z.optional(z.boolean()),
  currentInsuranse: z.optional(z.string()),
  type:z.optional(z.string()),
  vendor: z.optional(z.string()),
  conversationId: z.optional(z.string()),
  recievedAt: z.optional(z.string()),
});
export const LeadMainSchema = z.object({
  id: z.optional(z.string()),
  firstName:z.string(),
  lastName:z.string(),
  cellPhone:z.string(),
  email: z.optional(z.string()),
  address:z.string(),
  city: z.optional(z.string()),
  state:z.string(),
  zipCode: z.optional(z.string()),
});
export const LeadGeneralSchema = z.object({
  id: z.optional(z.string()),
  gender: z.enum([Gender.NA,Gender.Male, Gender.Female]),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  dateOfBirth: z.optional(z.string()),
  weight: z.optional(z.string()),
  height: z.optional(z.string()),
  income: z.optional(z.string()),
  smoker: z.boolean(),
});
export const LeadSaleSchema = z.object({
  id: z.optional(z.string()),
  vendor:z.string(),
  saleAmount: z.coerce.number(),
  commision: z.coerce.number(),
  costOfLead: z.coerce.number()
});
export const LeadBeneficiarySchema = z.object({
  id: z.optional(z.string()),
  leadId:z.string(),  
  type:z.optional(z.string()),
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.optional(z.string()),  
  city: z.optional(z.string()),  
  state: z.optional(z.string()),  
  zipCode: z.optional(z.string()),  
  cellPhone: z.optional(z.string()),
  gender: z.enum([Gender.NA,Gender.Male, Gender.Female]),
  email: z.optional(z.string().email()),
  dateOfBirth: z.optional(z.string()),  
  notes: z.optional(z.string()),
});
export const LeadConditionSchema = z.object({
  id: z.optional(z.string()),
  leadId: z.string(),
  conditionId:z.string(),
  diagnosed: z.string(),
  medications:z.string(),
  notes:z.optional(z.string()),
});

export const LeadExpenseSchema = z.object({
  leadId: z.string(),
  type: z.string(),
  name:z.string(),
  value: z.coerce.number(),
  notes:z.optional(z.string()),
});
export const TwilioSchema = z.object({
  phone: z.string(),
  message: z.string(),
});

export const ChatSchema = z.object({
  prompt: z.string(),
  message: z.string(),
});

export const ChatUserSchema = z.object({
  userId: z.string(),
  defaultPrompt: z.optional(z.string()),
  defaultFunction: z.optional(z.string()),
  autoChat: z.boolean(),
  record: z.boolean(),
  coach: z.boolean(),
  leadInfo: z.boolean(),
});

export const TeamSchema = z.object({ name: z.string().min(1) });

export const MessageSchema = z.object({
  role: z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
  content: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  hasSeen: z.boolean(),
  sid: z.optional(z.string()),
});

export const SmsMessageSchema = z.object({
  leadId: z.optional(z.string()),
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
  gender: z.enum([Gender.NA,Gender.Male, Gender.Female]),
  maritalStatus: z.enum([
    MaritalStatus.Single,
    MaritalStatus.Married,
    MaritalStatus.Widowed,
    MaritalStatus.Divorced,
  ]),
  email: z.string().email(),
});

export const FeedbackSchema = z.object({
  id:z.optional(z.string()),
  userId:z.optional(z.string()),
  headLine: z.string().min(3),
  page: z.string(),
  feedback: z.string().min(5),
});

export const DevFeedbackSchema = z.object({
  id:z.optional(z.string()),
  status: z.string(),
  comments: z.optional(z.string()),
});


export const LeadStatusSchema = z.object({
  status: z.string().min(2,"*"),
  description : z.optional(z.string()),
});

export const UserLicenseSchema = z.object({
  state: z.string().min(2,"*"),
  type : z.string().min(2,"*"),
  licenseNumber: z.string().min(3,"*"),
  dateExpires:z.string().min(3,"*"),
  comments: z.optional(z.string()),
});
export const UserCarrierSchema = z.object({
  agentId: z.string().min(2,"*"),
  carrierId : z.string().min(2,"*"),
  comments: z.optional(z.string()),
});
// AMIN
export const CarrierSchema = z.object({
  id:z.optional(z.string()),
  image:z.optional(z.string()),
  name : z.string().min(2,"*"),
  description: z.optional(z.string()),
  website:z.optional(z.string()),
  portal:z.optional(z.string()),
});

export const ScriptSchema = z.object({
  id:z.optional(z.string()),
  title:z.string().min(2,"*"),
  script : z.string().min(2,"*"),
});
export const MedicalConditionSchema = z.object({
  name : z.string().min(2,"*"),
  description: z.optional(z.string()),
});

export const QuoteSchema = z.object({
  quote : z.string().min(2,"*"),
  author: z.string(),
});

export const TaskSchema = z.object({
  id:z.string(),
  headLine : z.string().min(2,"*"),
  description: z.string().min(2,"*"),  
  status:z.string(),
  comments:z.optional(z.string().default("")),
  published:z.boolean(),
  startAt:z.date(),
  endAt:z.date(),
});