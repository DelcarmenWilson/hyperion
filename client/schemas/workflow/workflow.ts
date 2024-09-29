import * as z from "zod";

export const WorkFlowSchema = z.object({
  id: z.optional(z.string()),
  title: z.string(),
  description: z.string(),
});
export type WorkFlowSchemaType = z.infer<typeof WorkFlowSchema>;

export const FullWorkFlowSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
      data: z.object({
      }),
    })
  ),
  edges: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    animated: z.boolean(),
  })),
  published:z.boolean()
});
export type FullWorkFlowSchemaType = z.infer<typeof FullWorkFlowSchema>;

const WorkflowNodeDataSchema=z.object({
  icon:z.string(),
  name:z.string(),
  text:z.string(),
})

export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.optional(z.string()),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: WorkflowNodeDataSchema,
 
  workflowId:z.string(),
  source:z.string(),
  target:z.string(),
  animated:z.boolean(),
});
export type WorkflowNodeSchemaType = z.infer<typeof WorkflowNodeSchema>;

export const WorkflowEdgeSchema = z.object({
  id: z.optional(z.string()),
  workflowId:z.string(),
  source:z.string(),
  target:z.string(),
  animated:z.boolean(),
  type: z.optional(z.string()),
});
export type WorkflowEdgeSchemaType = z.infer<typeof WorkflowEdgeSchema>;
//TODO - need to find a way to get rid of this
export const FullNodeSchema = z.object({
  id: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({}),
  type: z.optional(z.string()),
});
export type FullNodeSchemaType = z.infer<typeof FullNodeSchema>;