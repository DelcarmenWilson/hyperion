import React from "react";
import { cn } from "@/lib/utils";
import { useEditorChanges, useEditorStore } from "@/hooks/workflow/use-editor";
import { WorkflowActionSchemaType } from "@/schemas/workflow/action";
//TODO - need to get the action icons
import { getTriggerIcon } from "@/constants/react-flow/workflow";

export const ActionCard = ({
  action,
}: {
  action: WorkflowActionSchemaType;
}) => {
  const { onNodeInsert } = useEditorChanges();
  const { selectedNode } = useEditorStore();

  const { id, data, type } = action;
  const { icon, name } = data;

  const Icon = getTriggerIcon(icon);

  return (
    <div
      className={cn(
        "flex gap-2 items-center border w-full px-2 cursor-pointer hover:border-blue-500 hover:bg-secondary",
        selectedNode?.id == id && "border-red-500"
      )}
      onClick={() => onNodeInsert(id as string, type)}
    >
      <div className="bg-blue-500/25 h-full text-sm text-blue-500">
        <Icon />
      </div>
      <p className="py-2 text-sm">{name}</p>
    </div>
  );
};
