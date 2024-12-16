import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import useFlowValidation from "@/components/hooks/use-flow-validation";
import { useWorkflowStore } from "@/stores/workflow-store";

const NodeCard = ({
  children,
  nodeId,
  isSelected,
}: {
  children: ReactNode;
  nodeId: string;
  isSelected: boolean;
}) => {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId == nodeId);
  const { onSidebarOpen, selectedNodeId } = useWorkflowStore();
  return (
    <div
      className={cn(
        "flex flex-col rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
      )}
      onClick={() => {
        if (selectedNodeId == nodeId) return;
        onSidebarOpen(nodeId);
      }}
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
        if (x === undefined || y === undefined) return;
        setCenter(x, y, { zoom: 1, duration: 500 });
      }}
    >
      {children}
    </div>
  );
};

export default NodeCard;
