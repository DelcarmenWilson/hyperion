import React from "react";
import { NodeProps, Position } from "reactflow";
import { X, Zap } from "lucide-react";
import { useEditorChanges } from "@/hooks/workflow/use-editor";
import { Button } from "@/components/ui/button";
import { CustomCircle, CustomRectangle } from "../handle/custom";

const ActionComponent = ({
  data: { name },
  id,
  type,
}: NodeProps<{ name: string }>) => {
  const { onNodeDelete } = useEditorChanges();
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-400 border-dotted rounded-sm p-2 group">
      <div className="bg-blue-200 p-1 text-blue-600">
        <Zap />
      </div>
      <div>
        <p className="text-sm">
          <span className="text-blue-600 block ">Action</span>
          <span className="text-gray-400">{name}</span>
        </p>
      </div>
      <Button
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
        variant="simple"
        size="xxs"
        aria-label="Delete Trigger"
        onClick={() => onNodeDelete(id, type)}
      >
        <X size={10} />
      </Button>
      <CustomCircle type="target" position={Position.Top} />
      <CustomRectangle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ActionComponent;
