import * as z from "zod";
export const ScriptSchema = z.object({
  id: z.optional(z.string()),
title: z.string().min(1),
content: z.string().min(1),

});
export type ScriptSchemaType = z.infer<typeof ScriptSchema>;
