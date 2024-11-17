import * as z from "zod";

export const ChatSchema = z.object({
  prompt: z.string(),
  message: z.string(),
});
export type ChatSchemaType = z.infer<typeof ChatSchema>;



export const CreateChatMessageSchema = z.object({
  id: z.optional(z.string()),
  chatId: z.string(),
  body: z.optional(z.string()),
  image: z.optional(z.string()),
  senderId: z.string(),  
  userId: z.optional(z.string()),
});
export type CreateChatMessageSchemaType = z.infer<typeof CreateChatMessageSchema>;


export const UpdateChatMessageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  body: z.optional(z.string()),
  image: z.optional(z.string()),
  senderId: z.string(),  
  userId: z.string(),
});
export type UpdateChatMessageSchemaType = z.infer<typeof UpdateChatMessageSchema>;
