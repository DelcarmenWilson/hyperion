import * as z from "zod";


export const createScriptSchema = z.object({
name: z.string().min(3).max(50),
description: z.string().max(80).optional(),
type: z.string().max(30),
});

export type createScriptSchemaType = z.infer<typeof createScriptSchema>;

// export const ScriptSchema = z.object({
//   id: z.optional(z.string()),
// name: z.string().min(1),
// description: z.string().min(1),
// type: z.string().min(1),
// content: z.string().min(1),


//     // type        String @default("User Generated")
 

// });

