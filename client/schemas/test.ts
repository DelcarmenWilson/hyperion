import * as z from "zod";
import { MessageRole } from "@prisma/client";

export const GptMessageSchema = z.object({
  conversationId: z.string(),
  role: z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
  content: z.string(),
});
export type GptMessageSchemaType = z.infer<typeof GptMessageSchema>;

export const GptSettingsSchema = z.object({
  id:z.optional(z.string()),
  prompt: z.string(),
  leadInfo: z.string(),
});
export type GptSettingsSchemaType = z.infer<typeof GptSettingsSchema>;


export const GptSettingsSchema = z.object({
  id:(z.optional(z.string())),
  prompt: z.string(),
  leadInfo:  z.string(),
});

export type GptSettingsSchemaType = z.infer<typeof GptSettingsSchema>;

