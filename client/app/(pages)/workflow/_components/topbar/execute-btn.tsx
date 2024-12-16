"use client";
import React from "react";
import { PlayIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import useExecutionPlan from "@/components/hooks/use-execution-plan";
import { useWorkflowActions } from "@/hooks/use-workflow";

import { Button } from "@/components/ui/button";

const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const { onExecuteWorkflow, workflowExecuting } = useWorkflowActions();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={workflowExecuting}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          //Client side validation
          return;
        }

        onExecuteWorkflow({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
};

export default ExecuteBtn;
