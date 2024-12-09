import { create } from "zustand";
import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  CreateFeedbackSchemaType,
  UpdateDevFeedbackSchemaType,
  UpdateFeedbackSchemaType,
} from "@/schemas/feedback";

import { createFeedback } from "@/actions/feedback/create-feedback";
import { deleteFeedback } from "@/actions/feedback/delete-feedback";
import { updateFeedback } from "@/actions/feedback/update-feedback";
import { updateFeedbackDev } from "@/actions/feedback/update-feedback-dev";
import { FeedbackStatus } from "@/types/feedback";
import { useParams } from "next/navigation";

type State = {
  status: FeedbackStatus | string;
  agent: string;
  page: string;
  sorted: boolean;
};
type Actions = {
  setStatus: (s: string) => void;
  setAgent: (a: string) => void;
  setPage: (a: string) => void;
  toggleSorted: () => void;
};

export const useFeedbackStore = create<State & Actions>((set, get) => ({
  status: FeedbackStatus.PENDING,
  agent: "All",
  page: "All",
  sorted: false,
  setStatus: (s) => set({ status: s }),
  setAgent: (a) => set({ agent: a }),
  setPage: (p) => set({ page: p }),
  toggleSorted: () => set({ sorted: !get().sorted }),
}));

export const useFeedbackActions = (callback?: () => void) => {
  //DELETE FEEDBACK
  const { mutate: deleteFeedbackMutate, isPending: deletingFeedback } =
    useMutation({
      mutationFn: deleteFeedback,
      onSuccess: () =>
        toast.success("Feedback deleted!!!", { id: "delete-feedback" }),
      onError: () =>
        toast.error("Failed to delete feedback", { id: "delete-feedback" }),
    });

  const onDeleteFeedback = useCallback(
    (id: string) => {
      toast.loading("Deleting ferdback...", { id: "delete-feedback" });
      deleteFeedbackMutate(id);
    },
    [deleteFeedbackMutate]
  );

  //CREATE FEEDBACK
  const { mutate: createFeedbackMutate, isPending: creatingFeedback } =
    useMutation({
      mutationFn: createFeedback,
      onSuccess: () => {
        toast.success("Feedback created", { id: "create-feedback" });
        if (callback) callback();
      },
      onError: () =>
        toast.error("Failed to create feedback", { id: "create-feedback" }),
    });

  const onCreateFeedback = useCallback(
    (values: CreateFeedbackSchemaType) => {
      toast.loading("Creating feedback...", {
        id: "create-feedback",
      });
      createFeedbackMutate(values);
    },
    [createFeedbackMutate]
  );

  //FEEDBACK UPDATE
  const { mutate: updateFeedbackMutate, isPending: updatingFeedback } =
    useMutation({
      mutationFn: updateFeedback,
      onSuccess: () => {
        toast.success("Feedback updated!!!", { id: "update-feedback" });
        if (callback) callback();
      },
      onError: (error) => toast.error(error.message, { id: "update-feedback" }),
    });

  const onUpdateFeedback = useCallback(
    (values: UpdateFeedbackSchemaType) => {
      toast.loading("Updating feedback...", { id: "update-feedback" });
      updateFeedbackMutate(values);
    },
    [updateFeedbackMutate]
  );

  //FEEDBACK UPDATE DEV
  const { mutate: updateFeedbackDevMutate, isPending: updatingFeedbackDev } =
    useMutation({
      mutationFn: updateFeedbackDev,
      onSuccess: () =>
        toast.success("Feedback updated!!!", { id: "update-feedback" }),
      onError: (error) => toast.error(error.message, { id: "update-feedback" }),
    });

  const onUpdateFeedbackDev = useCallback(
    (values: UpdateDevFeedbackSchemaType) => {
      toast.loading("Updating feedback...", { id: "update-feedback" });
      updateFeedbackDevMutate(values);
    },
    [updateFeedbackDevMutate]
  );

  return {
    onDeleteFeedback,
    deletingFeedback,
    onCreateFeedback,
    creatingFeedback,
    onUpdateFeedback,
    updatingFeedback,
    onUpdateFeedbackDev,
    updatingFeedbackDev,
  };
};


export const useFeedbackId = () => {
  const params = useParams();
  const feedbackId = useMemo(() => {
    if (!params?.feedbackId) {
      return "";
    }

    return params?.feedbackId as string;
  }, [params?.feedbackId]);

  return useMemo(
    () => ({
      feedbackId,
    }),
    [feedbackId]
  );
};
