import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Edge, useNodes, useReactFlow } from "reactflow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { create } from "zustand";

import { FullWorkflow } from "@/types/workflow/workflow";
import {
  FullWorkFlowSchemaType,
  WorkflowEdgeSchemaType,
  WorkflowNodeSchemaType,
  WorkFlowSchemaType,
} from "@/schemas/workflow/workflow";
import {
  WorkflowBirthdayTriggerSchemaType,
  WorkflowTriggerSchemaType,
} from "@/schemas/workflow/trigger";

import {
  edgeDeleteById,
  edgeUpdateById,
  nodeDeleteById,
  nodeInsert,
  nodeUpdateById,
  workFlowDeleteById,
  workFlowGetById,
  workFlowInsert,
  workFlowsGetAll,
  workFlowUpdateById,
  workFlowUpdateByIdPublish,
} from "@/actions/workflow";

import { Workflow, WorkflowDefaultNode } from "@prisma/client";
import {
  workflowDefaultNodesGetAllByType,
  workflowDefaultNodeDeleteById as workflowDefaultNodeDeleteById,
  workflowDefaultNodeInsert,
  workflowDefaultNodeUpdateById,
} from "@/actions/workflow/default";
import { WorkflowActionSchemaType } from "@/schemas/workflow/action";

type WorkflowStore = {
  isFormOpen: boolean;
  onFormOpen: () => void;
  onFormClose: () => void;

  disabled: boolean;
  setDisabled: (e: boolean) => void;

  //LIVE NODES
  node?: WorkflowTriggerSchemaType;
  isNodeDrawerOpen: boolean;
  onNodeDrawerOpen: (n: WorkflowTriggerSchemaType) => void;
  onNodeDrawerClose: () => void;
};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  isFormOpen: false,
  onFormOpen: () => set({ isFormOpen: true }),
  onFormClose: () => set({ isFormOpen: false }),
  //DIABLED
  disabled: true,
  setDisabled: (e) => set({ disabled: e }),
  //LIVE NODES
  isNodeDrawerOpen: false,
  onNodeDrawerOpen: (w) => set({ node: w, isNodeDrawerOpen: true }),
  onNodeDrawerClose: () => set({ isNodeDrawerOpen: false }),
}));

export const useWorkflowDefaultData = (onClose?: () => void) => {
  const queryClient = useQueryClient();
  const invalidate = (key: string) => {
    queryClient.invalidateQueries({
      queryKey: [`admin${key}`],
    });
  };
  //DEFAULT NODES
  const onGetWorkflowDefaultNodesByType = (type: "trigger" | "action") => {
    const { data, isFetching } = useQuery<WorkflowDefaultNode[] | []>({
      queryKey: [`admin${type}`],
      queryFn: () => workflowDefaultNodesGetAllByType(type),
    });

    return { data, isFetching };
  };
  const onDeleteWorkflowDefaultById = async (id?: string, type?: string) => {
    if (!id || !type) return;
    const deletedAction = await workflowDefaultNodeDeleteById(id);

    if (deletedAction.success) {
      invalidate(type);
      toast.success(deletedAction.success);
    } else toast.error(deletedAction.error);
  };
  const onInsertWorkflowDefaultNode = async (
    values: WorkflowActionSchemaType | WorkflowTriggerSchemaType
  ) => {
    const insertedNode = await workflowDefaultNodeInsert(values);
    if (insertedNode.success) {
      invalidate(values.type);
      toast.success(`${values.type} created!`);
      if (onClose) onClose();
    } else toast.error(insertedNode.error);
  };
  const onUpdateWorkflowDefaultNode = async (
    values: WorkflowActionSchemaType | WorkflowTriggerSchemaType
  ) => {
    const updatedNode = await workflowDefaultNodeUpdateById(values);
    if (updatedNode.success) {
      invalidate(values.type);
      toast.success(`${values.type} updated!`);
      if (onClose) onClose();
    } else toast.error(updatedNode.error);
  };

  return {
    onGetWorkflowDefaultNodesByType,
    onDeleteWorkflowDefaultById,
    onInsertWorkflowDefaultNode,
    onUpdateWorkflowDefaultNode,
  };
};

//Get data for the workflow based on the workflow id
export const useWorkflowData = () => {
  const { workflowId } = useWorkflowId();
  // Get the intial data for the current workflow
  const { data: workflow, isFetching: isFetchingWorkflow } =
    useQuery<FullWorkFlowSchemaType | null>({
      queryFn: () => workFlowGetById(workflowId),
      queryKey: [`workflow-${workflowId}`],
    });

  //Get all the workflows for the current user
  const { data: workflows, isFetching: isFetchingWorkflows } = useQuery<
    Workflow[]
  >({
    queryKey: ["workflows"],
    queryFn: () => workFlowsGetAll(),
  });

  return {
    workflow,
    isFetchingWorkflow,
    workflows,
    isFetchingWorkflows,
  };
};

export const useWorkflowActions = () => {
  const queryClient = useQueryClient();
  const { workflowId } = useWorkflowId();
  const [alertOpen, setAlertOpen] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["workflows"],
    });
  };

  //DELETE
  const { mutate: workflowDelete, isPending: workflowDeleteIsPending } =
    useMutation({
      mutationFn: workFlowDeleteById,
      onSuccess: (results) => {
        if (results.success) {
          toast.success(results.success, { id: "delete-workflow" });
          invalidate();
        } else {
          toast.error(results.error, { id: "delete-workflow" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onWorkflowDelete = useCallback(
    (id: string) => {
      toast.loading("Deleteing workflow...", {
        id: "delete-workflow",
      });

      workflowDelete(id);
    },
    [workflowDelete]
  );
  //INSERT
  const { mutate: workflowInsert, isPending: workflowInsertIsPending } =
    useMutation({
      mutationFn: workFlowInsert,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Workflow Created!", { id: "insert-workflow" });
          invalidate();
        } else {
          toast.error(results.error, { id: "insert-workflow" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onWorkflowInsert = useCallback(
    (values: WorkFlowSchemaType) => {
      toast.loading("Creating New Workflow...", { id: "insert-workflow" });
      workflowInsert(values);
    },
    [workflowInsert]
  );

  //UPDATE
  const { mutate: workflowUpdate, isPending: workflowUpdateIsPending } =
    useMutation({
      mutationFn: workFlowUpdateById,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Workflow Updated!", { id: "update-workflow" });
          invalidate();
        } else {
          toast.error(results.error, { id: "update-workflow" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onWorkflowUpdate = useCallback(
    (values: WorkFlowSchemaType) => {
      toast.loading("Updating Workflow...", { id: "update-workflow" });
      workflowUpdate(values);
    },
    [workflowUpdate]
  );

  //UPDATE
  const { mutate: workflowPublish, isPending: workflowPublishIsPending } =
    useMutation({
      mutationFn: workFlowUpdateByIdPublish,
      onSuccess: (results) => {
        if (results.success) {
          toast.success(results.success, { id: "publish-workflow" });
          invalidate();
        } else 
          toast.error(results.error, { id: "publish-workflow" });        
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onWorkflowPublish = useCallback(
    (published: boolean) => {
      toast.loading("Publishing Workflow...", { id: "publish-workflow" });
      workflowPublish({ id: workflowId, published });
    },
    [workflowPublish, workflowId]
  );

  return {
    alertOpen,
    setAlertOpen,
    onWorkflowDelete,
    workflowDeleteIsPending,
    onWorkflowInsert,
    workflowInsertIsPending,
    onWorkflowUpdate,
    workflowUpdateIsPending,
    onWorkflowPublish,
    workflowPublishIsPending,
  };
};

export const useWorkflowFormActions = () => {
  const { onFormClose } = useWorkflowStore();
  const { workflowId } = useWorkflowId();
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [`workflow-${workflowId}`],
    });
  };

  const { mutate: workflowUpdate, isPending: workflowUpdateIsPending } =
    useMutation({
      mutationFn: workFlowUpdateById,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Workflow Updated!", { id: "update-workflow" });
          onFormClose();
          invalidate();
        } else {
          toast.error(results.error, { id: "update-workflow" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onWorkflowUpdate = useCallback(
    (values: WorkFlowSchemaType) => {
      toast.loading("Updating Policy Information...", {
        id: "update-workflow",
      });

      workflowUpdate(values);
    },
    [workflowUpdate]
  );

  return { onWorkflowUpdate, workflowUpdateIsPending, onFormClose };
};
//Get the workflow id from the window address bar
export const useWorkflowId = () => {
  const params = useParams();

  const workflowId = useMemo(() => {
    if (!params.workflowid) {
      return "";
    }

    return params.workflowid as string;
  }, [params.workflowid]);

  return useMemo(() => ({ workflowId }), [workflowId]);
};
