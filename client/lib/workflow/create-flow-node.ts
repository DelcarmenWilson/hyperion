import { AppNode } from "@/types/workflow/app-node";
import { TaskType } from "@/types/workflow/task";

export const createFlowNode = (
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode => {
  return {
    id: crypto.randomUUID(),
    type:"FlowScrapeNode",
    dragHandle:".drag-handle",
    data: { type: nodeType, inputs: {} },
    position: position ?? { x: 0, y: 0 },
  };
};