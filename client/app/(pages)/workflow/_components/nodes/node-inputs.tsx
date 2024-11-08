import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import useFlowValidation from "@/components/hooks/use-flow-validation";
import { Handle, Position, useEdges } from "@xyflow/react";

import { TaskParam } from "@/types/workflow/task";

import NodeParamField from "./node-param-field";
import { colorForHandle } from "./common";

export const NodeInputs = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col divide-y gap-1">{children}</div>;
};

export const NodeInput = ({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) => {
  const { invalidInputs } = useFlowValidation();
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );
  const hasErrors = invalidInputs
    .find((node) => node.nodeId == nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);
  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        hasErrors && "bg-destructive/30"
      )}
    >
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            colorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
};
