import React from "react";
import { X } from "lucide-react";
import {
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "reactflow";
import { Button } from "@/components/ui/button";

export const CustomEdge = (props: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const { id } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    ...props,
  });

  return (
    <>
      <BezierEdge {...props} />

      <EdgeLabelRenderer>
        <Button
          // className={`absolute  translate-x-[${labelX}] translate-x-[${labelY}]`}
          className={`absolute translate-x-1/2  translate-y-1/2  translate-x-[${labelX}px] translate-y-[${labelY}px]`}
          variant="outlinedestructive"
          size="xs"
          aria-label="Delete Edge"
          onClick={() => {
            setEdges((preveNodes) => preveNodes.filter((e) => e.id != id));
          }}
        >
          <X size={10} />
        </Button>
      </EdgeLabelRenderer>
    </>
  );
};
