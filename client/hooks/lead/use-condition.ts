import { useCallback, useState } from "react";
import { create } from "zustand";
import { toast } from "sonner";
import { useLeadStore } from "./use-lead";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { MedicalCondition } from "@prisma/client";
import { FullLeadMedicalCondition } from "@/types";
import { LeadConditionSchemaType } from "@/schemas/lead";
import {
  deleteLeadCondition,
  getLeadCondition,
  createLeadCondition,
  getLeadConditions,
  updateLeadCondition,
} from "@/actions/lead/condition";
import { adminMedicalConditionsGetAll } from "@/actions/admin/medical";
import { useInvalidate } from "../use-invalidate";

type State = {
  conditionId?: string;
};

type Actions = {
  setConditionId: (c: string) => void;
  isConditionFormOpen: boolean;
  onConditionFormOpen: (c?: string) => void;
  onConditionFormClose: () => void;
};

export const useLeadConditionStore = create<State & Actions>((set) => ({
  setConditionId: (c) => set({ conditionId: c }),
  isConditionFormOpen: false,
  onConditionFormOpen: (c) =>
    set({ conditionId: c, isConditionFormOpen: true }),
  onConditionFormClose: () => set({ isConditionFormOpen: false }),
}));

export const useLeadConditionData = (leadId: string) => {  
  const {
    conditionId,
  } = useLeadConditionStore();

  //  CONDITIONS
  const onGetLeadConditions = () => {
    const {
      data: conditions,
      isFetching: conditionsFetching,
      isLoading: conditionsLoading,
    } = useQuery<FullLeadMedicalCondition[]>({
      queryFn: () => getLeadConditions(leadId),
      queryKey: [`leadConditions-${leadId}`],
      enabled: !!leadId,
    });
    return {
      conditions,
      conditionsFetching,
      conditionsLoading,
    };
  };
  // CONDITION
  const onGetLeadCondition = () => {
    const {
      data: condition,
      isFetching: conditionFetching,
      isLoading: conditionLoading,
    } = useQuery<FullLeadMedicalCondition | null>({
      queryFn: () => getLeadCondition(conditionId as string),
      queryKey: [`leadCondition-${conditionId}`],
    });
    return {
      condition,
      conditionFetching,
      conditionLoading,
    };
  };
  //TODO this does not belong here. please find it a home
  const onGetAdminConditions = () => {
    const {
      data: conditions,
      isFetching: conditionsFetching,
      isLoading: conditionsLoading,
    } = useQuery<MedicalCondition[]>({
      queryFn: () => adminMedicalConditionsGetAll(),
      queryKey: ["admin-conditions"],
    });
    return {
      conditions,
      conditionsFetching,
      conditionsLoading,
    };
  };

  return {
    onGetLeadConditions,
    onGetLeadCondition,
    onGetAdminConditions,
  };
};

//TODO - need to add a delete dialog and remove the alert open state
export const useLeadConditionActions = () => {
  const { leadId } = useLeadStore();
  const {
    conditionId,
    onConditionFormClose,
  } = useLeadConditionStore();
  const { invalidate } = useInvalidate();

  const { mutate, isPending: conditionUpserting } = useMutation({
    mutationFn: conditionId ? updateLeadCondition : createLeadCondition,
    onSuccess: () => {
      const toastString = conditionId
        ? "Condition updated successfully"
        : "Condition created successfully";

      toast.success(toastString, {
        id: "insert-update-condition",
      });

      ["leadConditions", `lead-${leadId}`].forEach((key) => invalidate(key));

      onConditionFormClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onConditionUpsert = useCallback(
    (values: LeadConditionSchemaType) => {
      const toastString = conditionId
        ? "Updating Condition..."
        : "Creating Condition...";
      toast.loading(toastString, { id: "insert-update-condition" });

      mutate(values);
    },
    [mutate]
  );

  const { mutate: onDeleteCondition, isPending: conditionDeleting } =
    useMutation({
      mutationFn: deleteLeadCondition,
      onSuccess: () => {
        toast.success("Condition Deleted", {
          id: "condtion-beneficiary",
        });
        invalidate(`leadCondition-${conditionId}`);
      },
    });

  return {
    onConditionUpsert,
    conditionUpserting,
    onDeleteCondition,
    conditionDeleting,
  };
};
