"use client";
import React from "react";
import { CheckIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useWorkflowActions } from "@/hooks/use-workflow";

import { Button } from "@/components/ui/button";

const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();
  const { onSaveWorkflow, workflowSaving } = useWorkflowActions();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={workflowSaving}
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        onSaveWorkflow({
          id: workflowId,
          definition: workflowDefinition,
        });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
};

export default SaveBtn;
