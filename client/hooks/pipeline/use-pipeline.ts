import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { useModal } from "@/providers/modal";
import { usePipelineStore } from "@/stores/pipeline-store";
import { useInvalidate } from "../use-invalidate";
import { toast } from "sonner";

import { FullPipeline, PipelineAndLeads } from "@/types";
import { Pipeline } from "@prisma/client";
import {
  CreatePipelineSchemaType,
  UpdatePipelineSchemaType,
} from "@/schemas/pipeline";

import {
  createPipeline,
  getPipeline,
  getPipelines,
  getPipelinesAndLeads,
  deletedPipeline,
  updatePipeline,
  updatePipelineIndex,
  updatePipelineOrder,
} from "@/actions/user/pipeline";

export const usePipelineData = () => {
  const { pipelineId } = usePipelineStore();

  const onGetPipeline = () => {
    const {
      data: pipeline,
      isFetching: pipelineFetching,
      isLoading: pieplineLoading,
    } = useQuery<Pipeline | null>({
      queryFn: () => getPipeline(pipelineId as string),
      queryKey: [`pipeline-${pipelineId}`],
      enabled: !!pipelineId,
    });
    return { pipeline, pipelineFetching, pieplineLoading };
  };
  const onGetPipelines = () => {
    const {
      data: pipelines,
      isFetching: pipelinesFetching,
      isLoading: pieplinesLoading,
    } = useQuery<FullPipeline[]>({
      queryFn: () => getPipelines(),
      queryKey: ["pipelines"],
    });
    return { pipelines, pipelinesFetching, pieplinesLoading };
  };

  const onGetPipelinesAndLeads = () => {
    const {
      data: pipelinesAndLeads,
      isFetching: pipelinesAndLeadsFetching,
      isLoading: pipelinesAndLeadsLoading,
    } = useQuery<PipelineAndLeads>({
      queryFn: () => getPipelinesAndLeads(),
      queryKey: ["pipelines-and-leads"],
    });
    return {
      pipelinesAndLeads,
      pipelinesAndLeadsFetching,
      pipelinesAndLeadsLoading,
    };
  };

  return {
    onGetPipeline,
    onGetPipelines,
    onGetPipelinesAndLeads,
  };
};

export const usePipelineActions = (cb?: () => void) => {
  const {
    deletePipeline,
    addPipeline,
    updateLeadStatus,
  } = usePipelineStore();
  const { invalidate } = useInvalidate();

  //DELETE PIPELINE
  const { mutate: onDeletePipelineMutate, isPending: pipelineDeleting } =
    useMutation({
      mutationFn: deletedPipeline,
      onSuccess: (results) => {
        deletePipeline(results);
        toast.success("Pipeline Deleted", { id: "delete-pipeline" });
        invalidate("pipelines");
      },
      onError: (error) => toast.error(error.message, { id: "delete-pipeline" }),
    });

  const onDeletePipeline = useCallback(
    (pipelineId: string) => {
      toast.loading("Deleting pipeline...", { id: "delete-pipeline" });
      console.log(pipelineId);
      onDeletePipelineMutate(pipelineId);
    },
    [onDeletePipelineMutate]
  );

  //INSERT PIPELINE
  const { mutate: onCreatePipelineMutate, isPending: pipelineCreating } =
    useMutation({
      mutationFn: createPipeline,
      onSuccess: (results) => {
        toast.success("Pipeline Created!", { id: "insert-pipiline" });
        addPipeline(results);
        if (cb) cb();
        invalidate("pipelines");
      },
      onError: (error) => toast.error(error.message, { id: "insert-pipeline" }),
    });

  const onCreatePipeline = useCallback(
    (values: CreatePipelineSchemaType) => {
      toast.loading("Creating pipeline...", { id: "insert-pipeline" });
      onCreatePipelineMutate(values);
    },
    [onCreatePipelineMutate]
  );
  //UPDATE PIPELINE
  const { mutate: onUpdatePipelineMutate, isPending: pipelineUpdating } =
    useMutation({
      mutationFn: updatePipeline,
      onSuccess: () => {
        toast.success("Pipeline Updated", {
          id: "update-pipiline",
        });
        if (cb) cb();
        invalidate("pipelines");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "update-pipiline",
        }),
    });

  const onUpdatePipeline = useCallback(
    (values: UpdatePipelineSchemaType) => {
      toast.loading("Updating pipeline...", { id: "update-pipeline" });
      onUpdatePipelineMutate(values);
    },
    [onUpdatePipelineMutate]
  );

  //UPDATE PIPELINE INDEX
  const { mutate: onUpdatePipelineIndexMutate } = useMutation({
    mutationFn: updatePipelineIndex,
    onSuccess: (result) => {},
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onUpdatePipelineUpdateIndex = useCallback(
    (id: string, index: number) => {
      onUpdatePipelineIndexMutate({ id, index });
    },
    [onUpdatePipelineIndexMutate]
  );
  useEffect(() => {
    userEmitter.on("leadStatusChanged", updateLeadStatus);
  }, []);

  return {
    invalidate,
    onDeletePipeline,
    pipelineDeleting,
    pipelineCreating,
    onCreatePipeline,
    pipelineUpdating,
    onUpdatePipeline,
    onUpdatePipelineUpdateIndex,
  };
};

export const usePipelineStageActions = (pipelines: FullPipeline[]) => {
  const [stages, setStages] = useState(pipelines);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const { setClose } = useModal();
  const {invalidate} = useInvalidate();

  const onStageUpdate = async () => {
    const list: { id: string; order: number }[] = stages.map(
      (stage, index) => ({
        id: stage.id,
        order: index,
      })
    );
    onUpdatePipelineOrder(list);
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
    mutate: onUpdatePipelineOrderMutate,
    isPending: pipelineOrderUpdating,
  } = useMutation({
    mutationFn: updatePipelineOrder,
    onSuccess: () => {
      setClose();
      invalidate("pipelines");
      toast.success("Pipelines reordered", { id: "ordering-pipelines" });
    },
    onError: (error) =>
      toast.error(error.message, { id: "ordering-pipelines" }),
  });

  const onUpdatePipelineOrder = useCallback(
    (list: { id: string; order: number }[]) => {
      toast.loading("Ordering pipelines...", { id: "ordering-pipelines" });
      onUpdatePipelineOrderMutate(list);
    },
    [onUpdatePipelineOrderMutate]
  );

  return {
    buttonEnabled,
    stages,
    onStageUpdate,
    onReorder,
    onReset,
    onUpdatePipelineOrder,
    pipelineOrderUpdating,
  };
};
