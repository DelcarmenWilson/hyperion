"use client";
import React from "react";
import { CheckIcon, PlayIcon } from "lucide-react";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import useExecutionPlan from "@/components/hooks/use-execution-plan";

import { Button } from "@/components/ui/button";
import { runWorkflow } from "@/actions/workflow/run-workflow";

const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () =>
      toast.success("Execution started", { id: "flow-execution" }),
    onError: () =>
      toast.error("Something went worng", { id: "flow-execution" }),
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          //Client side validation
          return;
        }

        mutation.mutate({
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
