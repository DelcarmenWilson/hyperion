import * as z from "zod";

export const WorkflowTriggerDataSchema = z.object({
  icon: z.string(),
  name: z.string(),
  text: z.string(),
});
export type WorkflowTriggerDataSchemaType = z.infer<typeof WorkflowTriggerDataSchema>;

export const WorkflowTriggerSchema = z.object({
  id: z.optional(z.string()),
  category:z.string(),
  type: z.string(),
  name: z.string(),
  data: WorkflowTriggerDataSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type WorkflowTriggerSchemaType = z.infer<typeof WorkflowTriggerSchema>;
