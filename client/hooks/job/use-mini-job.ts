import { useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  CreateMiniJobSchemaType,
  UpdateMiniJobSchemaType,
} from "@/schemas/job";

import { createMiniJob } from "@/actions/developer/mini-job/create-mini-job";
import { deleteMiniJob } from "@/actions/developer/mini-job/delete-mini-job";
import { updateMiniJob } from "@/actions/developer/mini-job/update-mini-job";
import { completeMiniJob } from "@/actions/developer/mini-job/complete-mini-job";
import { startMiniJob } from "@/actions/developer/mini-job/start-mini-job";

export const useMiniJobActions = (callback?: () => void) => {
  //DELETE MINI JOB
  const { mutate: deleteMiniJobMutate, isPending: deletingMiniJob } =
    useMutation({
      mutationFn: deleteMiniJob,
      onSuccess: () =>
        toast.success("Mini Job deleted!!!", { id: "delete-mini-job" }),
      onError: () =>
        toast.error("failed to delete miniJob", { id: "delete-mini-job" }),
    });

  const onDeleteMiniJob = useCallback(
    (id: string) => {
      toast.loading("Deleting Mini Job...", { id: "delete-mini-job" });
      deleteMiniJobMutate(id);
    },
    [deleteMiniJobMutate]
  );

  //CREATE MINI JOB
  const { mutate: createMiniJobMutate, isPending: creatingMiniJob } =
    useMutation({
      mutationFn: createMiniJob,
      onSuccess: () => {
        toast.success("Mini job created", { id: "create-mini-job" });
        if (callback) callback();
      },
      onError: () =>
        toast.error("Failed to create mini job", { id: "create-mini-job" }),
    });

  const onCreateMiniJob = useCallback(
    (values: CreateMiniJobSchemaType) => {
      toast.loading("Creating new mini Job...", {
        id: "create-mini-job",
      });
      createMiniJobMutate(values);
    },
    [createMiniJobMutate]
  );

  //UPDATE MINI JOB
  const { mutate: updateMiniJobMutate, isPending: updatingMiniJob } =
    useMutation({
      mutationFn: updateMiniJob,
      onSuccess: () => {
        toast.success("Mini job Updated!!!", { id: "update-mini-job" });
        if (callback) callback();
      },
      onError: () => {
        toast.error("Failed to update mini job", { id: "update-mini-job" });
      },
    });

  const onUpdateMiniJob = useCallback(
    (values: UpdateMiniJobSchemaType) => {
      toast.loading("Updating mini Job...", { id: "update-mini-job" });
      updateMiniJobMutate(values);
    },
    [updateMiniJobMutate]
  );

  //START MINI JOB
  const { mutate: startMiniJobMutate, isPending: startingMiniJob } =
    useMutation({
      mutationFn: startMiniJob,
      onSuccess: () => {
        toast.success("Mini job started!!!", { id: "start-mini-job" });
        if (callback) callback();
      },
      onError: () => {
        toast.error("Failed to start mini job", { id: "start-mini-job" });
      },
    });

  const onStartMiniJob = useCallback(
    (id: string) => {
      toast.loading("Starting mini Job...", { id: "start-mini-job" });
      startMiniJobMutate(id);
    },
    [startMiniJobMutate]
  );

  //COMPLETE MINI JOB
  const { mutate: completeMiniJobMutate, isPending: completingMiniJob } =
    useMutation({
      mutationFn: completeMiniJob,
      onSuccess: () => {
        toast.success("Mini job completed!!!", { id: "complete-mini-job" });
        if (callback) callback();
      },
      onError: () => {
        toast.error("Failed to complete mini job", { id: "complete-mini-job" });
      },
    });

  const onCompleteMiniJob = useCallback(
    (id: string) => {
      toast.loading("Completing mini Job...", { id: "complete-mini-job" });
      completeMiniJobMutate(id);
    },
    [completeMiniJobMutate]
  );

  return {
    onDeleteMiniJob,
    deletingMiniJob,
    onCreateMiniJob,
    creatingMiniJob,
    onUpdateMiniJob,
    updatingMiniJob,
    onStartMiniJob,
    startingMiniJob,
    onCompleteMiniJob,
    completingMiniJob,
  };
};

export const useMiniJobId = () => {
  const params = useParams();
  const miniJobId = useMemo(() => {
    if (!params?.miniJobId) return "";

    return params?.miniJobId as string;
  }, [params?.miniJobId]);

  return useMemo(() => ({ miniJobId }), [miniJobId]);
};
