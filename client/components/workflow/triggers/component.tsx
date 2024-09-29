import React from "react";
import { Clapperboard, X } from "lucide-react";
import { useWorkflowStore } from "@/hooks/workflow/use-workflow";
import { useEditorChanges } from "@/hooks/workflow/use-editor";

import { NodeProps, Position, useStore } from "reactflow";
import { Button } from "@/components/ui/button";
import { CustomCircle } from "../handle/custom";
import { WorkflowTriggerSchemaType } from "@/schemas/workflow/trigger";

const TriggerComponent = ({
  data: { name },
  id,
  type,
}: NodeProps<{ name: string }>) => {
  const { onNodeDelete } = useEditorChanges();
  const { onNodeDrawerOpen } = useWorkflowStore();

  const selected = useStore((s) => {
    const node = s.nodeInternals.get(id);
    return node;
  });
  const onSelectNode = () => {
    // console.log(selected);
    // onNodeDrawerOpen(selected as unknown as WorkflowTriggerSchemaType);
  };
  return (
    <div
      className="flex items-center gap-2 bg-white border border-gray-400 rounded-sm p-2 group"
      onClick={onSelectNode}
    >
      <div className="bg-emerald-200 p-1 text-emerald-600">
        <Clapperboard />
      </div>
      <div>
        <p className="text-sm">
          <span className="text-emerald-600 block ">Trigger</span>
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
      <CustomCircle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TriggerComponent;
