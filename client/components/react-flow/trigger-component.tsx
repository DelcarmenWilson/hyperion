import React from "react";
import { NodeProps, Position, useReactFlow } from "reactflow";
import { CustomHandle } from "./custom-handle";
import { Clapperboard, X } from "lucide-react";
import { nodeDeleteById } from "@/actions/workflow";
import { toast } from "sonner";

const TriggerComponent = ({
  data: { name },
  id,
}: NodeProps<{ name: string }>) => {
  const { setNodes } = useReactFlow();
  const onDeleteNode = async () => {
    const deletedNode = await nodeDeleteById(id);
    if (deletedNode.success)
      setNodes((prevNodes) => prevNodes.filter((e) => e.id != id));
    else toast.error(deletedNode.error);
  };
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-400 rounded-sm p-2 group">
      <div className="bg-emerald-200 p-1 text-emerald-600">
        <Clapperboard />
      </div>
      <div>
        <p className="text-sm">
          <span className="text-emerald-600 block ">Trigger</span>
          <span className="text-gray-400">{name}</span>
        </p>
      </div>
      <button
        className="absolute top-0 right-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-black p-2"
        aria-label="Delete Trigger"
        onClick={onDeleteNode}
      >
        <X size={10} />
      </button>
      <CustomHandle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TriggerComponent;
