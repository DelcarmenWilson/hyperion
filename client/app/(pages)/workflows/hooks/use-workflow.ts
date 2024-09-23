import { workFlowGetById, workFlowUpdateById } from "@/actions/workflow";
import { WorkFlowSchemaType } from "@/schemas/workflow/workflow";
import { Workflow } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { create } from "zustand";

type WorkflowStore = {
  isFormOpen: boolean;
  setFormOpen: () => void;
  setFormClose: () => void;
};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  isFormOpen: false,
  setFormOpen: () => set({ isFormOpen: true }),
  setFormClose: () => set({ isFormOpen: false }),
}));

export const useWorkflowData = () => {
  // const data=useQuery<>({
  //     queryFn:,
  //     queryKey:[]
  // })

  const { workflowId } = useWorkflowId();
  const { data: workflowData } = useQuery<Workflow | null>({
    queryFn: () => workFlowGetById(workflowId),
    queryKey: [`workflow-${workflowId}`],
  });

  return { workflowData };
};

export const useWorkflowActions = () => {
    const {workflowId}=useWorkflowId()
  const queryClient=useQueryClient()
    const mutate = useMutation({
    mutationFn: workFlowUpdateById,
    onSuccess: (results) => {
      if (results.success) {
        queryClient.invalidateQueries({queryKey:[`workflow-${workflowId}`]})
        toast.success("Workflow Updated!", { id: "update-workflow" });
      } else {
        toast.error(results.error);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onWorkflowSubmit = useCallback(
    (values: WorkFlowSchemaType) => {
      toast.loading("Updated Workflow..", { id: "update-workflow" });
      mutate.mutate(values);
    },
    [mutate.mutate]
  );
  return {
    onWorkflowSubmit,
  };
};

export const useWorkflowId = () => {
  const params = useParams();

  const workflowId = useMemo(() => {
    if (!params.id) return "";

    return params.id as string;
  }, [params.id]);

  return useMemo(() => ({ workflowId }), [workflowId]);
};
