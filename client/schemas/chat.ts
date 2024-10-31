import * as z from "zod";

export const ChatSchema = z.object({
  prompt: z.string(),
  message: z.string(),
});
export type ChatSchemaType = z.infer<typeof ChatSchema>;


export const ChatMessageSchema = z.object({
  id: z.optional(z.string()),
  chatId: z.optional(z.string()),
  body: z.optional(z.string()),
  image: z.optional(z.string()),
  senderId: z.string(),  
  userId: z.optional(z.string()),
});
export type ChatMessageSchemaType = z.infer<typeof ChatMessageSchema>;
