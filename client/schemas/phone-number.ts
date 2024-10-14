import * as z from "zod";

export const PhoneNumberSchema = z.object({  
id: z.string(),
phone: z.string(),
state: z.string(),
agentId: z.optional(z.string()),
sid: z.string(),
app: z.string(),
renewAt: z.date(),
status: z.string(),
registered: z.boolean()
});
export type PhoneNumberSchemaType = z.infer<typeof PhoneNumberSchema>;
