import * as z from "zod";
import { MessageRole } from "@prisma/client";

export const GptMessageSchema = z.object({
  conversationId: z.string(),
  role: z.enum([MessageRole.user, MessageRole.assistant, MessageRole.system]),
  content: z.string(),
});
export type GptMessageSchemaType = z.infer<typeof GptMessageSchema>;


