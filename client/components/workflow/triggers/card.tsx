import React from "react";
import { useEditorChanges } from "@/hooks/workflow/use-editor";
import { WorkflowTriggerSchemaType } from "@/schemas/workflow/trigger";

import { getTriggerIcon } from "@/constants/react-flow/workflow";

export const TriggerCard = ({
  trigger,
}: {
  trigger: WorkflowTriggerSchemaType;
}) => {
  const { onNodeInsert } = useEditorChanges();

  const { id, data, type } = trigger;
  const { icon, name } = data;

  const Icon = getTriggerIcon(icon);
  return (
    <div
      className="flex gap-2 items-center border w-full px-2 cursor-pointer hover:border-primary hover:bg-secondary"
      onClick={() => onNodeInsert(id as string, type)}
    >
      <div className="bg-primary/25 h-full text-sm text-primary">
        <Icon />
      </div>
      <p className="py-2 text-sm">{name}</p>
    </div>
  );
};
