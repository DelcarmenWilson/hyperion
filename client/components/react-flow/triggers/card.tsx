import { nodeInsert2 } from "@/actions/workflow";
import { TRIGGER_ICONS, TriggerType } from "@/constants/react-flow/trigger";
import { useWorkFlow } from "@/hooks/use-workflow";
import { TriggerDataSchemaType, TriggerSchemaType } from "@/schemas/trigger";
import React from "react";
import { useReactFlow } from "reactflow";
import { toast } from "sonner";

export const TriggerCard = ({ trigger }: { trigger: TriggerSchemaType }) => {
  const { workflowId, onTriggerClose } = useWorkFlow();
  const { setNodes } = useReactFlow();

  const { id, data, type, name } = trigger;
  const { icon, name: Name, text: Type } = data as TriggerDataSchemaType;
  const Icon = TRIGGER_ICONS[icon.toString().toLowerCase()];

  const OnTriggerClick = async () => {
    if (!workflowId) return;
    console.log(id, workflowId);
    const insertedNode = await nodeInsert2(workflowId, id as string);
    if (insertedNode.success) {
      setNodes((prevNodes) => [...prevNodes, insertedNode.success]);
      onTriggerClose();
    } else {
      toast.error("There was an error creating the Node!");
    }
  };
  return (
    <div
      className="flex gap-2 items-center border w-full px-2 cursor-pointer hover:border-primary hover:bg-secondary"
      onClick={OnTriggerClick}
    >
      <div className="bg-primary/25 h-full text-sm text-primary">
        <Icon />
      </div>
      <p className="py-2 text-sm">{name}</p>
    </div>
  );
};
