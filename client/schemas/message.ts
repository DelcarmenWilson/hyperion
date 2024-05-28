import * as z from "zod";
import { MessageRole } from "@prisma/client";

export const MessageSchema = z.object({
  role: z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
  content: z.string(),
  conversationId: z.string(),
  attachment: z.optional(z.string()),
  senderId: z.string(),
  hasSeen: z.boolean(),
  sid: z.optional(z.string()),
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
