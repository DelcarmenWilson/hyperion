import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { useWorkflowStore } from "@/stores/workflow-store";

import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode, AppNodeData } from "@/types/workflow/app-node";

import { Button } from "@/components/ui/button";
import NodeHeader from "../nodes/node-header";
import { NodeInput, NodeInputs } from "../nodes/node-inputs";
import { NodeOutput, NodeOutputs } from "../nodes/node-outputs";
import { EmptyCard } from "@/components/reusable/empty-card";

const NodeSidebar = () => {
  const {
    isSidebarOpen,
    onSidebarClose,
    selectedNodeId,
    reload,
    onSetReaload,
  } = useWorkflowStore();
  const { getNode } = useReactFlow();

  const node = getNode(selectedNodeId as string) as AppNode;
  const nodeData = node && (node.data as AppNodeData);

  const task = nodeData && TaskRegistry[nodeData.type];
  useEffect(() => {
    if (!reload) return;
    onSetReaload(false);
  }, [reload]);

  return (
    <div
      className={cn(
        "flex flex-col absolute top-0 bg-background border focus-within:border-primary w-full h-full transition-[left] -left-full ease-in-out",
        isSidebarOpen && "left-0"
      )}
    >
      <div className="flex justify-between items-center p-2">
        <span>Node details</span>
        <Button variant="simple" size="sm" onClick={onSidebarClose}>
          <X size={15} />
        </Button>
      </div>
      {!nodeData && (
        <EmptyCard
          title="This node no longer exist"
          subTitle="Please select another node to view details"
        />
      )}
      {nodeData && (
        <div className="flex flex-col flex-1  overflow-hidden">
          <NodeHeader taskType={nodeData.type} nodeId={node.id} />
          <NodeInputs>
            {task.inputs.map((input) => (
              <NodeInput key={input.name} input={input} nodeId={node.id} />
            ))}
          </NodeInputs>
          <NodeOutputs>
            {task.outputs.map((output) => (
              <NodeOutput key={output.name} output={output} />
            ))}
          </NodeOutputs>
        </div>
      )}
    </div>
  );
};

export default NodeSidebar;
