import * as z from "zod";
  export const UpdatePipelineSchema = z.object({
    id: z.string(),
    statusId: z.string().min(1),
    name: z.string().min(1),
   
  });
  export type UpdatePipelineSchemaType = z.infer<typeof UpdatePipelineSchema>;

  export const CreatePipelineSchema = z.object({
    statusId: z.string().min(1),
    name: z.string().min(1),
   
  });
  export type CreatePipelineSchemaType = z.infer<typeof CreatePipelineSchema>;