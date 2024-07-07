import React from "react";
import { X } from "lucide-react";
import { useWorkFlowChanges } from "@/hooks/use-workflow";
import { EdgeLabelRenderer } from "reactflow";
import { Button } from "@/components/ui/button";

type EdgeCloseButtonProps = {
  id: string;
  x: number;
  y: number;
};
export const EdgeCloseButton = ({ id, x, y }: EdgeCloseButtonProps) => {
  const { onDeleteEdge } = useWorkFlowChanges();
  return (
    <EdgeLabelRenderer>
      <Button
        style={{
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${x}px,${y}px)`,
          pointerEvents: "all",
        }}
        // className={`absolute translate-x-1/2  translate-y-1/2  translate-x-[${labelX}px] translate-y-[${labelY}px]`}
        variant="normal"
        size="xxs"
        aria-label="Delete Edge"
        onClick={() => onDeleteEdge(id)}
      >
        <X size={10} />
      </Button>
    </EdgeLabelRenderer>
  );
};
