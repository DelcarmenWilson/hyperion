import * as z from "zod";
import { MessageRole } from "@prisma/client";

export const PublicChatbotMessageSchema = z.object({
  conversationId: z.string(),
  role: z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
  content: z.string(),
});
export type PublicChatbotMessageSchemaType = z.infer<typeof PublicChatbotMessageSchema>;


