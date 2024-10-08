import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";
import { useModal } from "@/providers/modal";
import { usePipelineStore } from "./use-pipeline-store";
import { toast } from "sonner";
import {  FullPipeline, PipelineAndLeads } from "@/types";
import { Pipeline } from "@prisma/client";
import { PipelineSchemaType } from "@/schemas/pipeline";

import {
  pipelineAndLeadsGetAll,
  pipelineDeleteById,
  pipelineGetAll,
  pipelineGetById,
  pipelineInsert,
  pipelineUpdateById,
  pipelineUpdateByIdIndex,
  pipelineUpdateOrder,
} from "@/actions/user/pipeline";


export const usePipelineData = () => {
  const { pipelineId,initialSetUp,loaded } = usePipelineStore();

  const { data: pipeline, isFetching: isFetchingPipeline } =
    useQuery<Pipeline | null>({
      queryFn: () => pipelineGetById(pipelineId),
      queryKey: [`pipeline-${pipelineId}`],
    });

  const { data: pipelines, isFetching: isFetchingPipelines } = useQuery<
    FullPipeline[]
  >({
    queryFn: () => pipelineGetAll(),
    queryKey: ["pipelines"],
  });

  const { data: pipelineAndLeads, isFetching: isFetchingPipelineAndLeads } =
    useQuery<PipelineAndLeads>({
      queryFn: () => pipelineAndLeadsGetAll(),
      queryKey: ["pipeline-and-leads"],
    });

    useEffect(() => {
      if (loaded) return;
      if (!pipelineAndLeads) return;
      initialSetUp(pipelineAndLeads.pipelines, pipelineAndLeads.leads);
    }, [loaded, pipelineAndLeads]);

  return {
    pipeline,
    isFetchingPipeline,
    pipelines,
    isFetchingPipelines,
    pipelineAndLeads,
    isFetchingPipelineAndLeads,
  };
};

export const usePipelineActions = () => {
  const { onFormClose, onAlertClose, deletePipeline, addPipeline,updateLeadStatus } =
    usePipelineStore();
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
      onSuccess: (results) => {
        if (results.success) {
          deletePipeline(results.data);
          toast.success("Pipeline Deleted", { id: "delete-pipeline" });
          onAlertClose();
          invalidate(["pipelines"]);
        } else toast.error(results.error);
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

  //INSERT PIPELINE
  const { mutate: onPipelineInsert, isPending: isPendingPipelineInsert } =
    useMutation({
      mutationFn: pipelineInsert,
      onSuccess: (results) => {
        if (results.success) {
          toast.success("Pipeline Created!", { id: "insert-pipiline" });
          addPipeline(results.data);
          onFormClose();
          invalidate(["pipelines"]);
        } else toast.error(results.error);
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
  useEffect(() => {
    userEmitter.on("leadStatusChanged",updateLeadStatus);
  }, []);

  return {
    invalidate,
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
