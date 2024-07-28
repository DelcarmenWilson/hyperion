import * as z from "zod";
  export const PipelineSchema = z.object({
    id: z.optional(z.string()),
    statusId: z.string().min(1),
    name: z.string().min(1),
   
  });
  export type PipelineSchemaType = z.infer<typeof PipelineSchema>;