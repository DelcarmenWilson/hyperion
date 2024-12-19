import * as z from "zod";
import { MessageRole } from "@prisma/client";

export const MessageSchema = z.object({
  id:z.string(),
  conversationId: z.string(),
  from:z.string(),
  direction:z.string(),
  role: z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
  content: z.string(),
  attachment: z.optional(z.string()),
  hasSeen: z.boolean(),
});
export type MessageSchemaType = z.infer<typeof MessageSchema>;

export const SmsMessageSchema = z.object({
  conversationId: z.optional(z.string()),
  leadId: z.optional(z.string()),
  content: z.string(),
  images: z.optional(z.string()),
  type: z.string(),
});
export type SmsMessageSchemaType = z.infer<typeof SmsMessageSchema>;
