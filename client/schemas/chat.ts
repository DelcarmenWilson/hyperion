import * as z from "zod";

export const ChatSchema = z.object({
  prompt: z.string(),
  message: z.string(),
});
export type ChatSchemaType = z.infer<typeof ChatSchema>;

export const ChatUserSchema = z.object({
  userId: z.string(),
  defaultPrompt: z.optional(z.string()),
  defaultFunction: z.optional(z.string()),
  autoChat: z.boolean(),
  messageNotification: z.string(),
  messageInternalNotification: z.string(),
  coach: z.boolean(),
});
export type ChatUserSchemaType = z.infer<typeof ChatUserSchema>;

export const ChatMessageSchema = z.object({
  id: z.optional(z.string()),
  chatId: z.optional(z.string()),
  content: z.optional(z.string()),
  attachment: z.optional(z.string()),
  senderId: z.string(),  
  userId: z.optional(z.string()),
});
export type ChatMessageSchemaType = z.infer<typeof ChatMessageSchema>;
