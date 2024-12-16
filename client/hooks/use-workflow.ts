import { useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {  Workflow } from "@prisma/client";
import {
  createWorkflowSchemaType,
  updateWorkflowSchemaType,
} from "@/schemas/workflow";

import {
  createWorkflow,
  deleteWorkflow,
  getWorkflow,
  getWorkflows,
  executeWorkflow,
  saveWorkflow,
  updateWorkflow,
} from "@/actions/workflow";


export const useWorkflowData = () => {
  const { workflowId } = useWorkflowId();
  //GET WORKFLOWS
  const onGetWorkflows = () => {
    const {
      data: workflows,
      isFetching: workflowsFetching,
      isLoading: workflowsLoading,
    } = useQuery<Workflow[] | []>({
      queryFn: () => getWorkflows(),
      queryKey: ["workflows"],
    });
    return {
      workflows,
      workflowsFetching,
      workflowsLoading,
    };
  };
  //GET WORKFLOW
  const onGetWorkflow = () => {
    const {
      data: workflow,
      isFetching: workflowFetching,
      isLoading: workflowLoading,
    } = useQuery<Workflow | null>({
      queryFn: () => getWorkflow(workflowId),
      queryKey: [`workflow-${workflowId}`],
      enabled: !!workflowId,
    });
    return {
      workflow,
      workflowFetching,
      workflowLoading,
    };
  };

  return {
    onGetWorkflows,
    onGetWorkflow,
  };
};

export const useWorkflowActions = (cb?: () => void) => {
  //CREATE WORKFLOW
  const { mutate: createWorkflowMutate, isPending: workflowCreating } =
    useMutation({
      mutationFn: createWorkflow,
      onSuccess: () => {
        toast.success("Workflow created", { id: "create-workflow" });
        if(cb)cb();
      },
      onError: (error) => toast.error(error.message, { id: "create-workflow" }),
    });

  const onCreateWorkflow = useCallback(
    (values: createWorkflowSchemaType) => {
      toast.loading("Creating workflow...", { id: "create-workflow" });
      createWorkflowMutate(values);
    },
    [createWorkflowMutate]
  );

  //CREATE WORKFLOW
  const { mutate: deleteWorkflowMutate, isPending: workflowDeleting } =
    useMutation({
      mutationFn: deleteWorkflow,
      onSuccess: () => {
        toast.success("Workflow deleted successfully", {
          id: "delete-workflow",
        });
        if(cb)cb();
      },
      onError: (error) => toast.error(error.message, { id: "delete-workflow" }),
    });

  const onDeleteWorkflow = useCallback(
    (id: string) => {
      toast.loading("Deleting workflow...", { id: "delete-workflow" });
      deleteWorkflowMutate(id);
    },
    [deleteWorkflowMutate]
  );
  //UPDATE WORKFLOW
  const { mutate: updateWorkflowMutate, isPending: workflowUpdating } =
    useMutation({
      mutationFn: updateWorkflow,
      onSuccess: () => {
        toast.success("Workflow updated", { id: "update-workflow" });
        if(cb)cb();
      },
      onError: (error) => toast.error(error.message, { id: "update-workflow" }),
    });

  const onUpdateWorkflow = useCallback(
    (values: updateWorkflowSchemaType) => {
      toast.loading("Updating workflow...", { id: "update-workflow" });
      updateWorkflowMutate(values);
    },
    [updateWorkflowMutate]
  );


    //UPDATE WORKFLOW
    const { mutate: onExecuteWorkflow, isPending: workflowExecuting } =
    useMutation({
      mutationFn: executeWorkflow,
      onSuccess: () =>  toast.success("Execution started", { id: "execute-workflow" }),
      onError: (error) => toast.error(error.message, { id: "execute-workflow" }),
    });

    //SAVE WORKFLOW
    const { mutate: saveWorkflowMutate, isPending: workflowSaving } =
    useMutation({
      mutationFn: saveWorkflow,
      onSuccess: () => {
        toast.success("Workflow saved", { id: "save-workflow" });
      },
      onError: (error) => toast.error(error.message, { id: "save-workflow" }),
    });

  const onSaveWorkflow = useCallback(
    (values: {id:string,definition:string}) => {
      toast.loading("Saving workflow...", { id: "save-workflow" });
      saveWorkflowMutate(values);
    },
    [saveWorkflowMutate]
  );

  return {
    onCreateWorkflow,
    workflowCreating,
    onDeleteWorkflow,
    workflowDeleting,
    onUpdateWorkflow,
    workflowUpdating,
    onExecuteWorkflow,
    workflowExecuting,
    onSaveWorkflow,
    workflowSaving,
  };
};

export const useWorkflowId = () => {
  const params = useParams();
  const workflowId = useMemo(() => {
    if (!params?.workflowId) return "";
    return params?.workflowId as string;
  }, [params?.workflowId]);
  return useMemo(() => ({ workflowId }), [workflowId]);
};
