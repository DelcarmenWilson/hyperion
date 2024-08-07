import React from "react";
import { useWorkFlow, useWorkFlowChanges } from "@/hooks/use-workflow";
import { WorkflowTriggerSchemaType } from "@/schemas/workflow/trigger";
import { getTriggerIcon } from "@/constants/react-flow/workflow";

export const TriggerCard = ({
  trigger,
}: {
  trigger: WorkflowTriggerSchemaType;
}) => {
  const { workflowId, onDrawerClose } = useWorkFlow();
  const { onNodeInsert } = useWorkFlowChanges();

  const { id, data, type } = trigger;
  const { icon, name } = data;

  const Icon = getTriggerIcon(icon);

  const OnTriggerClick = async () => {
    if (!workflowId) return;
    const insertedNode = await onNodeInsert(workflowId, id as string, type);
    if (insertedNode) onDrawerClose();
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
