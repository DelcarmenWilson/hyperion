import { Workflow, WorkflowNode, WorkflowNodeEdge, WorkflowNodePosition } from "@prisma/client";

export type FullWorkflowNode=WorkflowNode &{
position:WorkflowNodePosition | null
}
export type FullWorkflow = Workflow & {
  nodes: FullWorkflowNode[];
  edges: WorkflowNodeEdge[];
};
