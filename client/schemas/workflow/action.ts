import * as z from "zod";


export const WorkflowActionDataSchema = z.object({
  icon: z.string(),
  name: z.string(),
  text: z.string(),
});
export type WorkflowActionDataSchemaType = z.infer<typeof WorkflowActionDataSchema>;

export const WorkflowActionSchema = z.object({
  id: z.optional(z.string()),
  category:z.string(),
  name: z.string(),
  data: WorkflowActionDataSchema,
  type: z.string(),
  createdAt:z.date(),
  updatedAt:z.date()
});
export type WorkflowActionSchemaType = z.infer<typeof WorkflowActionSchema>;
