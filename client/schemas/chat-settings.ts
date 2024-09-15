import * as z from "zod";


export const ChatSettingsSchema = z.object({
  userId: z.string(),
  defaultPrompt: z.optional(z.string()),
  defaultFunction: z.optional(z.string()),
  titan: z.boolean(),
  coach: z.boolean(),
});
export type ChatSettingsSchemaType = z.infer<typeof ChatSettingsSchema>;


