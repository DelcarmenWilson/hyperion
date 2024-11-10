"use client";
import React from "react";
import { CheckIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { updateWorkflow } from "@/actions/workflow/update-workflow";
import { toast } from "sonner";

const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();
  const saveMutation = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () =>
      toast.success("Flow save succesfully", { id: "save-workflow" }),
    onError: () => toast.error("Something went worng", { id: "save-workflow" }),
  });
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={saveMutation.isPending}
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving workflow...", { id: "save-workflow" });
        saveMutation.mutate({
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
