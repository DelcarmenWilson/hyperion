import * as z from "zod";
import { MessageRole } from "@prisma/client";

export const ChatbotMessageSchema = z.object({
  conversationId: z.string(),
  role: z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
  content: z.string(),
});
export type ChatbotMessageSchemaType = z.infer<typeof ChatbotMessageSchema>;


export const ChatbotSettingsSchema = z.object({
  id:(z.optional(z.string())),
  prompt: z.string(),
  leadInfo:  z.string(),
});

export type ChatbotSettingsSchemaType = z.infer<typeof ChatbotSettingsSchema>;

