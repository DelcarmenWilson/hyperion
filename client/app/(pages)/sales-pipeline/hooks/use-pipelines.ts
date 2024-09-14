import { useCallback, useState } from "react";
import { create } from "zustand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLeadsData } from "../../leads/hooks/use-leads";

import { toast } from "sonner";
import { FullPipeline } from "@/types";
import {
  pipelineDeleteById,
  pipelineGetAllByAgentId,
  pipelineGetById,
  pipelineInsert,
  pipelineUpdateById,
  pipelineUpdateByIdIndex,
  pipelineUpdateOrder,
} from "@/actions/pipeline";
import { PipeLine } from "@prisma/client";
import { PipelineSchemaType } from "@/schemas/pipeline";
import { useModal } from "@/providers/modal";

type PipelineStore = {
  type: "edit" | "insert";
  pipelineId?: string;
  setPipeline: (e: string) => void;
  isFormOpen: boolean;
  onFormOpen: (t: "edit" | "insert", e?: string) => void;
  onFormClose: () => void;

  isAlertOpen: boolean;
  onAlertOpen: (e: string) => void;
  onAlertClose: () => void;
};

export const usePipelineStore = create<PipelineStore>((set) => ({
  type: "insert",
  setPipeline: (e) => set({ pipelineId: e }),
  isFormOpen: false,
  onFormOpen: (t, e) => set({ pipelineId: e, type: t, isFormOpen: true }),
  onFormClose: () => set({ isFormOpen: false, pipelineId: undefined }),
  isAlertOpen: false,
  onAlertOpen: (e) => set({ pipelineId: e, isAlertOpen: true }),
  onAlertClose: () => set({ pipelineId: undefined, isAlertOpen: false }),
}));

export const usePipelineData = () => {
  const { initLeads: leads } = useLeadsData();
  const { pipelineId } = usePipelineStore();

  const { data: pipeline, isFetching: isFetchingPipeline } =
    useQuery<PipeLine | null>({
      queryFn: () => pipelineGetById(pipelineId),
      queryKey: [`pipeline-${pipelineId}`],
    });

  const { data: pipelines, isFetching: isFetchingPipelines } = useQuery<
    FullPipeline[]
  >({
    queryFn: () => pipelineGetAllByAgentId(),
    queryKey: ["pipelines"],
  });

  return {
    pipeline,
    isFetchingPipeline,
    pipelines,
    isFetchingPipelines,
    leads,
  };
};

export const usePipelineActions = (initPipelines: FullPipeline[] | []) => {
  const [pipelines, setPipelines] = useState(initPipelines);
  const { onFormClose, onAlertClose } = usePipelineStore();
  const queryClient = useQueryClient();
  const invalidate = (queries: string[]) => {
    queries.forEach((query) => {
      queryClient.invalidateQueries({ queryKey: [query] });
    });
  };

  //DELETE PIPELINE
  const { mutate: onPipelineDelete, isPending: isPendingPipelineDelete } =
    useMutation({
      mutationFn: pipelineDeleteById,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Pipeline Deleted", {
            id: "delete-pipiline",
          });
          onAlertClose();
          invalidate(["pipelines"]);
        } else toast.error(result.error);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onPipelineDeleteSubmit = useCallback(
    (pipelineId: string) => {
      toast.loading("Deleting pipeline...", { id: "delete-pipeline" });
      console.log(pipelineId);
      onPipelineDelete(pipelineId);
    },
    [onPipelineDelete]
  );

  //UPDATE PIPELINE
  const { mutate: onPipelineUpdate, isPending: isPendingPipelineUpdate } =
    useMutation({
      mutationFn: pipelineUpdateById,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Pipeline Updated", {
            id: "update-pipiline",
          });
          onFormClose();
          invalidate(["pipelines"]);
        } else toast.error(result.error);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onPipelineUpdateSubmit = useCallback(
    (values: PipelineSchemaType) => {
      toast.loading("Updating pipeline...", { id: "update-pipeline" });
      onPipelineUpdate(values);
    },
    [onPipelineUpdate]
  );

  //INSERT PIPELINE
  const { mutate: onPipelineInsert, isPending: isPendingPipelineInsert } =
    useMutation({
      mutationFn: pipelineInsert,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Pipeline Created!", {
            id: "insert-pipiline",
          });
          onFormClose();
          invalidate(["pipelines"]);
        } else toast.error(result.error);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onPipelineInsertSubmit = useCallback(
    (values: PipelineSchemaType) => {
      toast.loading("Creating pipeline...", { id: "insert-pipeline" });
      onPipelineInsert(values);
    },
    [onPipelineInsert]
  );

  //UPDATE PIPELINE INDEX
  const { mutate: onPipelineUpdateIndex } = useMutation({
    mutationFn: pipelineUpdateByIdIndex,
    onSuccess: (result) => {
      if (result.error) toast.error(result.error);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onPipelineUpdateIndexSubmit = useCallback(
    (id: string, index: number) => {
      onPipelineUpdateIndex({ id, index });
    },
    [onPipelineUpdateIndex]
  );

  return {
    invalidate,
    pipelines,
    setPipelines,
    onPipelineDeleteSubmit,
    isPendingPipelineDelete,
    isPendingPipelineInsert,
    onPipelineInsertSubmit,
    isPendingPipelineUpdate,
    onPipelineUpdateSubmit,
    onPipelineUpdateIndexSubmit,
  };
};

export const usePipelineStageActions = (pipelines: FullPipeline[]) => {
  const [stages, setStages] = useState(pipelines);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const { setClose } = useModal();
  const queryClient = useQueryClient();
  const invalidate = (queries: string[]) => {
    queries.forEach((query) => {
      queryClient.invalidateQueries({ queryKey: [query] });
    });
  };

  const onStageUpdate = async () => {
    const list: { id: string; order: number }[] = stages.map(
      (stage, index) => ({
        id: stage.id,
        order: index,
      })
    );
    onPipelineUpdateOrderSubmit(list);
  };

  const onReorder = (e: FullPipeline[]) => {
    setStages(e);
    setButtonEnabled(true);
  };

  const onReset = () => {
    setButtonEnabled(false);
    setStages(pipelines);
  };

  //UPDATE PIPELINE ORDER
  const {
    mutate: onPipelineUpdateOrder,
    isPending: isPendingPipelineUpdateOrder,
  } = useMutation({
    mutationFn: pipelineUpdateOrder,
    onSuccess: (result) => {
      if (result.success) {
        setClose();
        invalidate(["pipelines"]);
        toast.success("Pipelines reordered", { id: "ordering-pipelines" });
      } else toast.error(result.error);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onPipelineUpdateOrderSubmit = useCallback(
    (list: { id: string; order: number }[]) => {
      toast.loading("Ordering pipelines...", { id: "ordering-pipelines" });
      onPipelineUpdateOrder(list);
    },
    [onPipelineUpdateOrder]
  );

  return {
    buttonEnabled,
    stages,
    onStageUpdate,
    onReorder,
    onReset,
    isPendingPipelineUpdateOrder,
  };
};
