import React from "react";
import { WorkflowActionSchemaType } from "@/schemas/workflow/action";
import { useWorkFlow, useWorkFlowChanges } from "@/hooks/use-workflow";
//TODO - need to get the action icons
import { getTriggerIcon } from "@/constants/react-flow/workflow";

export const ActionCard = ({
  action,
}: {
  action: WorkflowActionSchemaType;
}) => {
  const { workflowId, onDrawerClose } = useWorkFlow();
  const { onNodeInsert } = useWorkFlowChanges();

  const { id, data, type } = action;
  const { icon, name } = data;

  const Icon = getTriggerIcon(icon);

  const OnActionClick = async () => {
    if (!workflowId) return;
    const insertedNode = await onNodeInsert(workflowId, id as string, type);
    if (insertedNode) onDrawerClose();
  };
  return (
    <div
      className="flex gap-2 items-center border w-full px-2 cursor-pointer hover:border-blue-500 hover:bg-secondary"
      onClick={OnActionClick}
    >
      <div className="bg-blue-500/25 h-full text-sm text-blue-500">
        <Icon />
      </div>
      <p className="py-2 text-sm">{name}</p>
    </div>
  );
};
